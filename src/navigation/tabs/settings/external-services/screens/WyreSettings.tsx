import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {Link} from '../../../../../components/styled/Text';
import {RootState} from '../../../../../store';
import {useAppDispatch, useLogger} from '../../../../../utils/hooks';
import {openUrlWithInAppBrowser} from '../../../../../store/app/app.effects';
import {Settings, SettingsContainer} from '../../SettingsRoot';
import haptic from '../../../../../components/haptic-feedback/haptic';
import {wyrePaymentData} from '../../../../../store/buy-crypto/buy-crypto.models';
import {
  NoPrMsg,
  PrTitle,
  PrRow,
  PrRowLeft,
  PrRowRight,
  PrTxtCryptoAmount,
  PrTxtDate,
  PrTxtFiatAmount,
  PrTxtStatus,
  FooterSupport,
  SupportTxt,
} from '../styled/ExternalServicesSettings';
import {
  dismissBottomNotificationModal,
  showBottomNotificationModal,
} from '../../../../../store/app/app.actions';
import {sleep} from '../../../../../utils/helper-methods';

export interface WyreSettingsProps {
  incomingPaymentRequest?: wyrePaymentData;
  paymentRequestError?: boolean;
}

const WyreSettings: React.FC = () => {
  const wyreHistory = useSelector(({BUY_CRYPTO}: RootState) => BUY_CRYPTO.wyre);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const logger = useLogger();
  const [paymentRequests, setTransactions] = useState([] as wyrePaymentData[]);

  const route = useRoute<RouteProp<{params: WyreSettingsProps}>>();
  const {incomingPaymentRequest, paymentRequestError} = route.params || {};

  useEffect(() => {
    const handlePaymentError = async () => {
      await sleep(600);
      dispatch(
        showBottomNotificationModal({
          type: 'error',
          title: 'Payment Error',
          message: 'There was an error with the payment process through Wyre.',
          enableBackdropDismiss: true,
          actions: [
            {
              text: 'Visit Help Center',
              action: async () => {
                await sleep(600);
                dispatch(
                  openUrlWithInAppBrowser(
                    'https://wyre-support.zendesk.com/hc/en-us/requests/new',
                  ),
                );
              },
              primary: true,
            },
            {
              text: 'GOT IT',
              action: () => {
                dispatch(dismissBottomNotificationModal());
              },
              primary: false,
            },
          ],
        }),
      );
    };
    if (incomingPaymentRequest) {
      logger.debug(`Coming from order: ${incomingPaymentRequest.orderId}`);
    }
    if (paymentRequestError) {
      handlePaymentError();
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      const wyrePaymentRequests = Object.values(wyreHistory).filter(
        pr => pr.env === (__DEV__ ? 'dev' : 'prod'),
      );
      setTransactions(wyrePaymentRequests);
    }
  }, [isFocused]);

  return (
    <>
      <SettingsContainer>
        <Settings style={{paddingBottom: 500}}>
          {paymentRequests && paymentRequests.length > 0 && (
            <PrTitle>Payment Requests</PrTitle>
          )}
          {paymentRequests &&
            paymentRequests.length > 0 &&
            paymentRequests
              .sort((a, b) => b.created_on - a.created_on)
              .map(pr => {
                return (
                  <PrRow
                    key={pr.orderId}
                    onPress={() => {
                      haptic('impactLight');
                      navigation.navigate('ExternalServicesSettings', {
                        screen: 'WyreDetails',
                        params: {
                          paymentRequest: pr,
                        },
                      });
                    }}>
                    <PrRowLeft>
                      <PrTxtFiatAmount>
                        {pr.sourceAmount} {pr.sourceCurrency}
                      </PrTxtFiatAmount>
                      {pr.status === 'failed' && (
                        <PrTxtStatus style={{color: '#df5264'}}>
                          Payment request rejected
                        </PrTxtStatus>
                      )}
                      {pr.status === 'success' && (
                        <PrTxtStatus style={{color: '#01d1a2'}}>
                          Payment request approved
                        </PrTxtStatus>
                      )}
                      {pr.status === 'paymentRequestSent' && (
                        <PrTxtStatus>Processing payment request</PrTxtStatus>
                      )}
                    </PrRowLeft>
                    <PrRowRight>
                      <PrTxtCryptoAmount>
                        {pr.destAmount} {pr.destCurrency}
                      </PrTxtCryptoAmount>
                      <PrTxtDate>{moment(pr.created_on).fromNow()}</PrTxtDate>
                    </PrRowRight>
                  </PrRow>
                );
              })}
          {(!paymentRequests || paymentRequests.length == 0) && (
            <NoPrMsg>There are currently no transactions with Wyre</NoPrMsg>
          )}
        </Settings>
      </SettingsContainer>
      <FooterSupport>
        <SupportTxt>Having problems with Wyre?</SupportTxt>
        <TouchableOpacity
          onPress={() => {
            haptic('impactLight');
            dispatch(
              openUrlWithInAppBrowser(
                'https://support.sendwyre.com/hc/en-us/requests/new',
              ),
            );
          }}>
          <Link>Contact the Wyre support team.</Link>
        </TouchableOpacity>
      </FooterSupport>
    </>
  );
};

export default WyreSettings;
