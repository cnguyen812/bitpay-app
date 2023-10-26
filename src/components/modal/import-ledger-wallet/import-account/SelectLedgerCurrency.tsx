import {getCryptoCurrencyById} from '@ledgerhq/cryptoassets';
import {StatusCodes} from '@ledgerhq/errors';
import AppBtc from '@ledgerhq/hw-app-btc';
import Transport from '@ledgerhq/hw-transport';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import BtcLogoSvg from '../../../../../assets/img/currencies/btc.svg';
import Checkbox from '../../../checkbox/Checkbox';
import {AdvancedOptionsContainer} from '../../../styled/Containers';
import {Network} from '../../../../constants';
import {startImportFromHardwareWallet} from '../../../../store/wallet/effects';
import {Wallet} from '../../../../store/wallet/wallet.models';
import {LinkBlue, SlateDark} from '../../../../styles/colors';
import {sleep} from '../../../../utils/helper-methods';
import {useAppDispatch} from '../../../../utils/hooks';
import Button, {ButtonState} from '../../../button/Button';
import {BaseText, H3, H6, Paragraph} from '../../../styled/Text';
import {
  ActionsRow,
  DescriptionRow,
  Header,
  Wrapper,
} from '../import-ledger-wallet.styled';
import {
  SupportedLedgerAppNames,
  getCurrentLedgerAppInfo,
  getLedgerErrorMessage,
} from '../utils';

interface Props {
  transport: Transport;

  /**
   * Ask the parent app to quit any running Ledger app and resolve once any reconnects are handled.
   *
   * @param transport
   * @returns
   */
  onRequestQuitApp: (transport: Transport) => Promise<any>;

  /**
   * Ask the parent component to open the specified Ledger app and resolve once any reconnects are handled.
   *
   * @param transport
   * @param name
   * @returns
   */
  onRequestOpenApp: (
    transport: Transport,
    name: SupportedLedgerAppNames,
  ) => Promise<any>;
  onImported: (wallet: Wallet) => void;
  onCurrencySelected?: (args: {
    currency: string;
    network: Network;
    accountIndex: string;
  }) => void;
}

const List = styled.View``;

const CurrencyRow = styled.View<{selected?: boolean; first?: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid ${({selected}) => (selected ? LinkBlue : SlateDark)};
  border-radius: 12px;
  padding: 24px;
  margin-top: ${({first}) => (first ? 0 : 16)}px;
`;

const ShrinkColumn = styled.View`
  flex-grow: 0;
  flex-shrink: 1;
`;

const StretchColumn = styled.View`
  flex: 1 1 100%;
`;

const OptionRow = styled.View<{first?: boolean}>`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: ${({first}) => (first ? 0 : 12)}px;
  padding: 12px 24px;
`;

const CURRENCIES = [
  {
    coin: 'btc',
    label: 'Bitcoin',
    icon: <BtcLogoSvg height={35} width={35} />,
    isTestnetSupported: true,
  },
];

const TESTNET_SUPPORT_MAP = CURRENCIES.reduce<Record<string, boolean>>(
  (acc, c) => {
    acc[c.coin] = c.isTestnetSupported;
    return acc;
  },
  {},
);

export const SelectLedgerCurrency: React.FC<Props> = props => {
  const dispatch = useAppDispatch();
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [useTestnet, setUseTestnet] = useState(false);
  const [accountIndex, setAccountIndex] = useState('0');
  const [continueButtonState, setContinueButtonState] =
    useState<ButtonState>(null);
  const [error, setError] = useState('');
  const [isPromptOpenApp, setPromptOpenApp] = useState(false);

  const isLoading = continueButtonState === 'loading';
  const isTestnetEnabled = TESTNET_SUPPORT_MAP[selectedCurrency] || false;

  // use the ref when doing any work that could cause disconnects and cause a new transport to be passed in mid-function
  const transportRef = useRef(props.transport);
  transportRef.current = props.transport;

  /**
   * Closes the current Ledger app and prompts the user to open the correct app
   * if needed.
   *
   * Closing and opening apps causes disconnects, so if the requested app is
   * not open there may be some wait time involved while trying to reconnect.
   *
   * @param appName
   */
  const prepareLedgerApp = async (appName: SupportedLedgerAppNames) => {
    const info = await getCurrentLedgerAppInfo(transportRef.current);
    const anAppIsOpen = info.name !== 'BOLOS'; // BOLOS is the Ledger OS
    const isCorrectAppOpen = info.name === appName;

    // either another app is open or no apps are open
    if (!isCorrectAppOpen) {
      // different app must be running, close it
      if (anAppIsOpen) {
        await props.onRequestQuitApp(transportRef.current);
      }

      // prompt the user to open the corresponding app on the Ledger
      try {
        // display a prompt on the Ledger to open the correct app
        setPromptOpenApp(true);
        const openAppResult = await props.onRequestOpenApp(
          transportRef.current,
          appName,
        );
        const statusCode = openAppResult.readUInt16BE(openAppResult.length - 2);

        if (statusCode === StatusCodes.OK) {
          // app opened successfully!
        } else if (statusCode === 0x6807) {
          throw new Error(
            `The ${appName} app is required on your Ledger to continue`,
          );
        } else {
          throw new Error(
            `An unknown status code was returned: 0x${statusCode.toString(16)}`,
          );
        }
      } catch (err) {
        // Something went wrong, did the user reject?
        throw err;
      } finally {
        setPromptOpenApp(false);
      }
    } else {
      // correct app is installed and open on the device
    }
  };

  const importBtcAccount = async ({
    network,
    accountIndex = '0',
  }: {
    network: Network;
    accountIndex: string;
  }) => {
    const isMainnet = network === Network.mainnet;

    // this is the ID to lookup the xpubversion
    const currencyId = isMainnet ? 'bitcoin' : 'bitcoin_testnet';

    // this is the name to pass to initialize the app API
    // there is also 'bitcoin_legacy' and 'bitcoin_testnet_legacy' if we want to support the Ledger legacy apps
    const currency = isMainnet ? 'bitcoin' : 'bitcoin_testnet';

    // this is the name of the Ledger app that needs to be open
    const appName = isMainnet ? 'Bitcoin' : 'Bitcoin Test';

    try {
      const c = getCryptoCurrencyById(currencyId);

      if (c.bitcoinLikeInfo?.XPUBVersion) {
        await prepareLedgerApp(appName);

        // create API instance
        const btc = new AppBtc({
          transport: transportRef.current,
          currency,
        });

        const purpose = "44'";
        const coin = isMainnet ? "0'" : "1'";
        const account = `${accountIndex}'`;

        const path = `m/${purpose}/${coin}/${account}`;
        const xpubVersion = c.bitcoinLikeInfo.XPUBVersion;

        const xPubKey = await btc.getWalletXpub({
          path,
          xpubVersion,
        });

        const newWallet = await dispatch(
          startImportFromHardwareWallet({
            hardwareSource: 'ledger',
            xPubKey,
            accountPath: path,
            coin: 'btc',
          }),
        );

        props.onImported(newWallet);
      }
    } catch (err) {
      const errMsg = getLedgerErrorMessage(err);

      setError(errMsg);
    } finally {
      await sleep(1000);
    }
  };

  const importLedgerAccount = async (
    currency: string,
    network: Network,
    account: string,
  ) => {
    if (currency === 'btc') {
      return importBtcAccount({
        network,
        accountIndex: account,
      });
    }

    setError(`Unsupported currency: ${currency}`);
  };

  const onContinue = async () => {
    setError('');
    setContinueButtonState('loading');

    let validAccountIndex = false;

    try {
      Number.parseInt(accountIndex);
      validAccountIndex = true;
    } catch (err) {
      validAccountIndex = false;
    }

    if (validAccountIndex) {
      const network = useTestnet ? Network.testnet : Network.mainnet;

      await importLedgerAccount(selectedCurrency, network, accountIndex);
    } else {
      setError('Invalid account value');
    }

    setContinueButtonState(null);
  };

  useEffect(() => {
    if (!isTestnetEnabled) {
      setUseTestnet(false);
    }
  }, [isTestnetEnabled]);

  return (
    <Wrapper>
      <Header>
        <H3>Choose Currency to Import</H3>
      </Header>

      {error && !isLoading ? (
        <DescriptionRow>
          <Paragraph>Error: {error}</Paragraph>
        </DescriptionRow>
      ) : null}

      {isLoading ? (
        <DescriptionRow>
          {isPromptOpenApp ? (
            <Paragraph>Approve the app on your Ledger</Paragraph>
          ) : (
            <Paragraph>Waiting for Ledger...</Paragraph>
          )}
        </DescriptionRow>
      ) : (
        <>
          <List>
            {CURRENCIES.map(c => (
              <CurrencyRow key={c.coin}>
                <ShrinkColumn>{c.icon}</ShrinkColumn>
                <StretchColumn
                  style={{
                    marginLeft: 16,
                  }}>
                  <H6>{c.label}</H6>
                </StretchColumn>
                <ShrinkColumn>
                  <Checkbox
                    disabled={isLoading}
                    radio={true}
                    onPress={() => setSelectedCurrency(c.coin)}
                    checked={selectedCurrency === c.coin}
                  />
                </ShrinkColumn>
              </CurrencyRow>
            ))}
          </List>

          <AdvancedOptionsContainer
            style={{
              borderColor: SlateDark,
              borderWidth: 2,
              borderStyle: 'solid',
              marginTop: 24,
            }}>
            <OptionRow first>
              <StretchColumn>
                <BaseText>Testnet</BaseText>
              </StretchColumn>
              <ShrinkColumn>
                <Checkbox
                  disabled={isLoading || !isTestnetEnabled}
                  checked={useTestnet}
                  onPress={() => setUseTestnet(x => !x)}
                />
              </ShrinkColumn>
            </OptionRow>
          </AdvancedOptionsContainer>
        </>
      )}
      <ActionsRow>
        <Button state={continueButtonState} onPress={onContinue}>
          Continue
        </Button>
      </ActionsRow>
    </Wrapper>
  );
};
