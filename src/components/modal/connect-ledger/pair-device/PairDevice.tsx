import Transport from '@ledgerhq/hw-transport';
import TransportHID from '@ledgerhq/react-native-hid';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import React from 'react';
import {useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {IS_ANDROID} from '../../../../constants';
import {useAppDispatch} from '../../../../utils/hooks';
import {BleError} from 'react-native-ble-plx';
import {LedgerIntro} from './LedgerIntro';
import {LogActions} from '../../../../store/log';
import {SearchingForDevices} from './SearchingForDevices';
import {DeviceFound} from './DeviceFound';
import {LearnHow} from './LearnHow';
import {PairingError} from './PairingError';

interface Props {
  onPaired: (transport: Transport) => void;
}

const REQUIRED_PERMISSIONS_BLE_ANDROID = [
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
];

const isBleError = (e: any): e is BleError => {
  return e instanceof BleError;
};

const isError = (e: any): e is Error => {
  return e instanceof Error;
};

/**
 * How long to wait to connect to a discovered device.
 */
const OPEN_TIMEOUT = 3000;

/**
 * How long to wait to find a device.
 */
const LISTEN_TIMEOUT = 5000;

export const PairDevice: React.FC<Props> = props => {
  const dispatch = useAppDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const [transportType, setTransportType] = useState<'ble' | 'hid' | null>(
    null,
  );
  const [isLearnHowVisible, setLearnHowVisible] = useState(false);
  const [error, setError] = useState('');
  const [transport, setTransport] = useState<Transport | null>(null);

  /**
   * Check bluetooth permissions
   */
  const checkPermissionsBLE = async () => {
    console.log('PERMS check start');
    let permissionResult = true;

    if (IS_ANDROID) {
      console.log('PERMS request');
      const permissions = await PermissionsAndroid.requestMultiple(
        REQUIRED_PERMISSIONS_BLE_ANDROID,
      );

      permissionResult = REQUIRED_PERMISSIONS_BLE_ANDROID.every(
        p => permissions[p] === 'granted',
      );

      if (permissionResult) {
        console.log('PERMS granted');
      } else {
        const missingPerms = REQUIRED_PERMISSIONS_BLE_ANDROID.filter(
          p => permissions[p] !== 'granted',
        ).join(', ');
        console.log('PERMS missing:', missingPerms);
      }
    }

    return permissionResult;
  };

  const onConnectBle = async () => {
    setTransportType('ble');
    setIsSearching(true);
    setError('');

    let openedTransport: Transport | null = null;
    let errorMsg = '';

    try {
      openedTransport = await TransportBLE.create(OPEN_TIMEOUT, LISTEN_TIMEOUT);
    } catch (err) {
      console.log('Error occurred creating transport');

      if (isBleError(err)) {
        errorMsg = `Code (Android): ${err.androidErrorCode}, Code (iOS): ${err.iosErrorCode}, message: ${err.message}, reason: ${err.reason}`;
      } else if (isError(err)) {
        errorMsg = err.message;
      } else {
        errorMsg = JSON.stringify(err);
      }

      dispatch(
        LogActions.error('An error occurred creating BLE transport:', errorMsg),
      );
    }

    if (openedTransport) {
      setTransport(openedTransport);
    } else {
      console.log('Unable to create BLE transport');
      setError(`Unable to connect via Bluetooth: ${errorMsg}`);
    }

    setIsSearching(false);
  };

  const onConnectHid = async () => {
    setTransportType('hid');
    setIsSearching(true);
    setError('');

    let openedTransport: Transport | null = null;
    let errorMsg = '';

    try {
      openedTransport = await TransportHID.create(OPEN_TIMEOUT, LISTEN_TIMEOUT);
    } catch (err) {
      console.log('Error occurred creating transport');

      if (isBleError(err)) {
        errorMsg = `Code (Android): ${err.androidErrorCode}, Code (iOS): ${err.iosErrorCode}, message: ${err.message}, reason: ${err.reason}`;
      } else if (isError(err)) {
        errorMsg = err.message;
      } else {
        errorMsg = JSON.stringify(err);
      }

      dispatch(
        LogActions.error('An error occurred creating HID transport:', errorMsg),
      );
    }

    if (openedTransport) {
      setTransport(openedTransport);
    } else {
      console.log('Unable to create HID transport');
      setError(`Unable to connect via USB: ${errorMsg}`);
    }

    setIsSearching(false);
  };

  const onContinue = () => {
    if (transport) {
      props.onPaired(transport);
    }
  };

  const onLearnHow = () => {
    setLearnHowVisible(true);
  };

  return (
    <>
      {transport ? (
        <>
          {isLearnHowVisible ? (
            <LearnHow onContinue={onContinue} />
          ) : (
            <DeviceFound onLearnHow={onLearnHow} />
          )}
        </>
      ) : error ? (
        <PairingError
          error={error}
          onConnectBle={onConnectBle}
          onConnectHid={onConnectHid}
        />
      ) : isSearching ? (
        <SearchingForDevices transportType={transportType} />
      ) : (
        <LedgerIntro onConnectBle={onConnectBle} onConnectHid={onConnectHid} />
      )}
    </>
  );
};
