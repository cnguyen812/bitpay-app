import Modal from 'react-native-modal';
import React from 'react';
import {BaseText} from '../../styled/Text';
import styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';
import {LightBlack, SlateDark, White} from '../../../styles/colors';
import {useAppSelector} from '../../../utils/hooks';
import Blur from '../../blur/Blur';

export enum OnGoingProcessMessages {
  GENERAL_AWAITING = "Just a second, we're setting a few things up",
  CREATING_KEY = 'Creating Key',
  LOGGING_IN = 'Logging In',
  CREATING_ACCOUNT = 'Creating Account',
  IMPORTING = 'Importing',
  DELETING_KEY = 'Deleting Key',
  ADDING_WALLET = 'Adding Wallet',
  LOADING = 'Loading',
  FETCHING_PAYMENT_OPTIONS = 'Fetching payment options...',
  FETCHING_PAYMENT_INFO = 'Fetching payment information...',
  JOIN_WALLET = 'Joining Wallet',
  SENDING_PAYMENT = 'Sending Payment',
  GENERATING_ADDRESS = 'Generating Address',
  GENERATING_GIFT_CARD = 'Generating Gift Card',
  SYNCING_WALLETS = 'Syncing Wallets...',
  REJECTING_CALL_REQUEST = 'Rejecting Call Request',
  SAVING_LAYOUT = 'Saving Layout',
  EXCHANGE_GETTING_DATA = 'Getting data from the exchange...',
  CALCULATING_FEE = 'Calculating Fee',
  CONNECTING_COINBASE = 'Connecting with Coinbase...',
  FETCHING_COINBASE_DATA = 'Fetching data from Coinbase...',
  UPDATING_TXP = 'Updating Transaction',
}

const OnGoingProcessContainer = styled.View`
  max-width: 60%;
  justify-content: center;
  align-items: center;
`;

const Row = styled.View`
  background-color: ${({theme}) => (theme.dark ? LightBlack : White)};
  border-radius: 10px;
  flex-direction: row;
  padding: 20px;
`;

const ActivityIndicatorContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  transform: scale(1.1);
`;

const Message = styled(BaseText)`
  font-weight: 700;
  flex-wrap: wrap;
`;

const OnGoingProcessModal: React.FC = () => {
  const message = useAppSelector(({APP}) => APP.onGoingProcessModalMessage);
  const isVisible = useAppSelector(({APP}) => APP.showOnGoingProcessModal);
  const showBlur = useAppSelector(({APP}) => APP.showBlur);
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
      animationIn={'fadeInRight'}
      animationOut={'fadeOutLeft'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      style={{
        alignItems: 'center',
      }}>
      <OnGoingProcessContainer>
        <Row>
          <ActivityIndicatorContainer>
            <ActivityIndicator color={SlateDark} />
          </ActivityIndicatorContainer>
          <Message>{message}</Message>
          {showBlur && <Blur />}
        </Row>
      </OnGoingProcessContainer>
    </Modal>
  );
};

export default OnGoingProcessModal;
