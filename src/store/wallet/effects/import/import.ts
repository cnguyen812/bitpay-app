import {KeyMethods, KeyOptions, Wallet} from '../../wallet.models';
import {Effect} from '../../../index';
import {startOnGoingProcessModal} from '../../../app/app.effects';
import {OnGoingProcessMessages} from '../../../../components/modal/ongoing-process/OngoingProcess';
import {BwcProvider} from '../../../../lib/bwc';
import merge from 'lodash.merge';
import {buildWalletObj} from '../../utils/wallet';
import {failedImport, successImport} from '../../wallet.actions';
import {dismissOnGoingProcessModal} from '../../../app/app.actions';
import {TokenOpts} from '../../../../constants/currencies';

export const startImportMnemonic =
  (words: string, opts: Partial<KeyOptions>): Effect =>
  async dispatch => {
    await dispatch(startOnGoingProcessModal(OnGoingProcessMessages.IMPORTING));
    try {
      words = normalizeMnemonic(words);
      opts.words = words;

      const {key, wallets} = await serverAssistedImport(opts);

      dispatch(
        successImport({
          key: {
            id: key.id,
            wallets: wallets.map(wallet =>
              merge(wallet, buildWalletObj(wallet.credentials)),
            ),
            properties: key.toObj(),
            methods: key,
            totalBalance: 0,
            show: true,
            isPrivKeyEncrypted: key.isPrivKeyEncrypted(),
          },
        }),
      );
    } catch (e) {
      // TODO: Handle me
      dispatch(failedImport());
      console.error(e);
    }
    dispatch(dismissOnGoingProcessModal());
  };

export const normalizeMnemonic = (words: string): string => {
  if (!words || !words.indexOf) {
    return words;
  }

  // \u3000: A space of non-variable width: used in Chinese, Japanese, Korean
  const isJA = words.indexOf('\u3000') > -1;
  const wordList = words
    .trim()
    .toLowerCase()
    .split(/[\u3000\s]+/);

  return wordList.join(isJA ? '\u3000' : ' ');
};

export const serverAssistedImport = async (
  opts: Partial<KeyOptions>,
): Promise<{key: KeyMethods; wallets: Wallet[]}> => {
  return new Promise(resolve => {
    try {
      BwcProvider.API.serverAssistedImport(
        opts,
        {baseUrl: 'https://bws.bitpay.com/bws/api'},
        // @ts-ignore
        async (err, key, wallets) => {
          console.log('server assisted import starting');
          if (err) {
            //  TODO: Handle this
          }
          if (wallets.length === 0) {
            //  TODO: Handle this - WALLET_DOES_NOT_EXIST
          } else {
            console.log(wallets);
            const tokens: Wallet[] = wallets.filter(
              (wallet: Wallet) => !!wallet.credentials.token,
            );

            if (tokens && !!tokens.length) {
              wallets = linkTokenToWallet(tokens, wallets);
            }

            return resolve({key, wallets});
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  });
};

const linkTokenToWallet = (tokens: Wallet[], wallets: Wallet[]) => {
  tokens.forEach(token => {
    const associatedWalletId = token.credentials.walletId.split('-0x')[0];
    wallets = wallets.map((wallet: Wallet) => {
      if (wallet.credentials.walletId === associatedWalletId) {
        wallet.tokens = wallet.tokens || [];
        const tokenOpt = TokenOpts[token.credentials.coin];
        tokenOpt && wallet.tokens.push(tokenOpt);
      }
      return wallet;
    });
  });

  return wallets;
};
