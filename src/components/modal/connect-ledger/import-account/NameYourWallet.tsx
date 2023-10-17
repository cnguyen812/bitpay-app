import React from 'react';
import Button from '../../../button/Button';
import BoxInput from '../../../form/BoxInput';
import {useState} from 'react';
import {H3, Paragraph} from '../../../styled/Text';
import {
  ActionsRow,
  DescriptionRow,
  Header,
  Wrapper,
} from '../connect-ledger.styled';
import {Wallet} from '../../../../store/wallet/wallet.models';

interface Props {
  wallet: Wallet;
  onSubmitName: (name: string) => void;
}

export const NameYourWallet: React.FC<Props> = props => {
  const [walletName, setWalletName] = useState<string>(
    props.wallet.walletName || '',
  );

  const onPressCompleteSetup = () => {
    props.onSubmitName(walletName);
  };

  return (
    <Wrapper>
      <Header>
        <H3>Name Your Wallet</H3>
      </Header>

      <DescriptionRow
        style={{
          alignItems: 'center',
          flexGrow: 0,
        }}>
        <Paragraph>Give your wallet a name.</Paragraph>
      </DescriptionRow>

      <DescriptionRow>
        <BoxInput
          label={'Wallet Name'}
          value={walletName}
          onChangeText={setWalletName}
          defaultValue={walletName}
        />
      </DescriptionRow>

      <ActionsRow>
        <Button onPress={onPressCompleteSetup}>Complete Setup</Button>
      </ActionsRow>
    </Wrapper>
  );
};
