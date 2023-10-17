import {
  LockedDeviceError,
  TransportStatusError,
  StatusCodes,
} from '@ledgerhq/errors';
import Transport from '@ledgerhq/hw-transport';

type TransportStatusError = Error & {
  statusCode: string;
  statusText: string;
};

type DisconnectedDeviceError = Error & {};

export type SupportedLedgerAppNames =
  | 'Bitcoin'
  | 'Bitcoin Test'
  | 'Bitcoin Legacy'
  | 'Bitcoin Test Legacy';

/**
 * Gets info on the currently running Ledger app. The OS info is returned if no app is running.
 *
 * @returns App name, version, and flags.
 */
export const getCurrentLedgerAppInfo = async (transport: Transport) => {
  const r = await transport.send(0xb0, 0x01, 0x00, 0x00);
  let i = 0;
  const format = r[i++];

  if (format !== 1) {
    throw new Error('getAppAndVersion: format not supported');
  }

  const nameLength = r[i++];
  const name = r.slice(i, (i += nameLength)).toString('ascii');
  const versionLength = r[i++];
  const version = r.slice(i, (i += versionLength)).toString('ascii');
  const flagLength = r[i++];
  const flags = r.slice(i, (i += flagLength));
  return {
    name,
    version,
    flags,
  };
};

/**
 * Opens the requested app on the Ledger.
 *
 * @returns Status code
 *
 * 0x670A: Length of app name is 0 when app name is required.
 *
 * 0x6807: The requested application is not present.
 *
 * 0x9000: Success
 *
 * Other : An application is already launched on the product.
 */
export const openLedgerApp = (
  transport: Transport,
  name: SupportedLedgerAppNames,
) => {
  const statusList = [StatusCodes.OK, 0x670a, 0x6807];
  return transport.send(
    0xe0,
    0xd8,
    0x00,
    0x00,
    Buffer.from(name, 'ascii'),
    statusList,
  );
};

/**
 * Silently quits the currently running Ledger app or no-op if no app is running.
 *
 * @returns Status code OK
 */
export const quitLedgerApp = (transport: Transport) => {
  return transport.send(0xb0, 0xa7, 0x00, 0x00);
};

export const isLockedDeviceError = (
  e: any,
): e is typeof LockedDeviceError & Error => {
  return e?.name === 'LockedDeviceError';
};

export const isTransportStatusError = (e: any): e is TransportStatusError => {
  return e?.name === 'TransportStatusError';
};

export const isDisconnectedDeviceError = (
  e: any,
): e is DisconnectedDeviceError => {
  return e?.name === 'DisconnectedDevice';
};

export const handleLedgerError = (err: any) => {
  if (isLockedDeviceError(err)) {
    console.log('CATCH LockedDeviceError', err.message);
  } else if (isTransportStatusError(err)) {
    console.log(
      'CATCH TransportStatusError',
      err.message,
      err.statusCode,
      err.statusText,
    );

    if (Number(err.statusCode) === 0x650f) {
      console.log('maybe app not open');
    } else if (Number(err.statusCode) === 0x6e00) {
      console.log(
        'command not supported by app, make sure the correct app is open and app is up to date and ledger firmware is up to date',
      );
    }
  } else if (isDisconnectedDeviceError(err)) {
    console.log('CATCH DisconnectedDeviceError', err.message);
  } else if (err instanceof Error) {
    console.log('CATCH ERROR', err.name, '|', err.message);
  } else {
    console.log('CATCH unknown', JSON.stringify(err));
  }
};
