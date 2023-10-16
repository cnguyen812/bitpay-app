import React, {useEffect, useState} from 'react';
import Transport from '@ledgerhq/hw-transport';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import {BaseText} from '../../../components/styled/Text';
import {AppActions} from '../../../store/app';
import {useAppDispatch, useAppSelector} from '../../../utils/hooks';
import {SheetContainer} from '../../styled/Containers';
import SheetModal from '../base/sheet/SheetModal';
import {PairDevice} from './pair-device/PairDevice';

export const ConnectLedgerNanoXModal = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(({APP}) => APP.isImportLedgerModalVisible);
  const [transport, setTransport] = useState<Transport | null>(null);

  const onPressClose = () => {
    dispatch(AppActions.importLedgerModalToggled(false));
  };

  const onPaired = async (openedTransport: Transport) => {
    /**
     * Ledger transport can disconnect when:
     * - power off
     * - screensaver
     * - switching ledger apps
     * - unplugged (connecting via USB) or bluetooth turned off
     *
     * Whatever the reason, connection is no good so we clear the state so user is prompted to connect again.
     */
    openedTransport.on('disconnect', () => setTransport(null));

    setTransport(openedTransport);
  };

  useEffect(() => {
    if (!isVisible) {
      if (transport) {
        // if BLE transport is not yet disconnected, keep it open so we can pair more wallets without closing/reopening the connection
        // else if it's disconnected we clear the state
        if (
          transport instanceof TransportBLE &&
          !transport.notYetDisconnected
        ) {
          setTransport(null);
        } else {
          // any other transports we clear the state on close
          setTransport(null);
        }
      }
    }
  }, [isVisible]);

  return (
    <SheetModal isVisible={isVisible} onBackdropPress={onPressClose}>
      <SheetContainer>
        {transport ? (
          <BaseText>Device Found</BaseText>
        ) : (
          <PairDevice onPaired={onPaired} />
        )}
      </SheetContainer>
    </SheetModal>
  );
};
