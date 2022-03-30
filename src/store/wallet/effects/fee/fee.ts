import {Network} from '../../../../constants';
import {Wallet} from '../../wallet.models';
import {GetEstimatedTxSize} from '../../utils/wallet';
import {IsERCToken} from '../../utils/currency';

export enum FeeLevels {
  URGENT = 'urgent',
  PRIORITY = 'priority',
  NORMAL = 'normal',
  ECONOMY = 'economy',
  SUPER_ECONOMY = 'superEconomy',
}

export interface Fee {
  feePerKb: number;
  level: string;
  nbBlocks: number;
}

export const GetFeeOptions: any = (currencyAbbreviation: string) => {
  const isEthOrToken =
    currencyAbbreviation === 'eth' || IsERCToken(currencyAbbreviation);
  return {
    urgent: isEthOrToken ? 'High' : 'Urgent',
    priority: isEthOrToken ? 'Average' : 'Priority',
    normal: isEthOrToken ? 'Low' : 'Normal',
    economy: 'Economy',
    superEconomy: 'Super Economy',
    custom: 'Custom',
  };
};

const removeLowFeeLevels = (feeLevels: Fee[]) => {
  const removeLevels = ['economy', 'superEconomy'];
  return feeLevels.filter(({level}) => !removeLevels.includes(level));
};

export const getFeeRatePerKb = ({
  wallet,
  feeLevel,
}: {
  wallet: Wallet;
  feeLevel: string;
}): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const {credentials} = wallet;
    try {
      // get fee levels
      const feeLevels = await getFeeLevels({
        wallet,
        network: credentials.network,
      });

      // find fee level based on setting
      const fee = feeLevels.find(_feeLevel => _feeLevel.level === feeLevel);

      if (!fee) {
        return reject();
      }

      resolve(fee.feePerKb);
    } catch (err) {
      reject(err);
    }
  });
};

export const getFeeLevels = ({
  wallet,
  network,
}: {
  wallet: Wallet;
  network: Network;
}): Promise<Fee[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      wallet.getFeeLevels(
        wallet.currencyAbbreviation.toUpperCase(),
        network,
        (err: Error, feeLevels: Fee[]) => {
          if (err) {
            return reject(err);
          }

          if (wallet.currencyAbbreviation === 'eth') {
            feeLevels = removeLowFeeLevels(feeLevels);
          }

          resolve(feeLevels);
        },
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const GetMinFee = (wallet: Wallet, nbOutputs?: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const feePerKb = await getFeeRatePerKb({wallet, feeLevel: 'normal'});
      const lowLevelRate: string = (feePerKb / 1000).toFixed(0);
      const size = GetEstimatedTxSize(wallet, nbOutputs);
      return resolve(size * parseInt(lowLevelRate, 10));
    } catch (e) {
      return reject(e);
    }
  });
};

export const GetUtxos = (wallet: Wallet): Promise<any> => {
  return new Promise((resolve, reject) => {
    wallet.getUtxos(
      {
        coin: wallet.credentials.coin,
      },
      (err: any, resp: any) => {
        if (err || !resp || !resp.length) {
          return reject(err ? err : 'No UTXOs');
        }
        return resolve(resp);
      },
    );
  });
};

export const GetInput = async (wallet: Wallet, txid: string) => {
  try {
    const utxos = await GetUtxos(wallet);
    let biggestUtxo = 0;
    let input;
    utxos.forEach((u: any, i: any) => {
      if (u.txid === txid) {
        if (u.amount > biggestUtxo) {
          biggestUtxo = u.amount;
          input = utxos[i];
        }
      }
    });
    return input;
  } catch (err) {
    return;
  }
};

export const GetBitcoinSpeedUpTxFee = async (
  wallet: Wallet,
  txSize: number,
): Promise<number> => {
  const urgentFee = await getFeeRatePerKb({wallet, feeLevel: 'urgent'});
  // 250 bytes approx. is the minimum size of a tx with 1 input and 1 output
  const averageTxSize = 250;
  const fee = (urgentFee / 1000) * (txSize + averageTxSize);
  return Number(fee.toFixed());
};
