import { TOKEN_NAME } from 'constants/Token';
import _ from 'lodash';
import { CONVERSION_RATES } from '../constants/Currency';
import {roundToTwo} from "./FormatNumbers";

export const convert = (amount, currency, fromCurrency) => {
  const tokenCurrency = TOKEN_NAME === currency;

  if (tokenCurrency && !fromCurrency) return amount;

  const rate = fromCurrency
    ? CONVERSION_RATES[fromCurrency]
    : CONVERSION_RATES[currency];

  return tokenCurrency ? _.toNumber(amount) / rate : _.toNumber(amount) * rate;
};

export const convertAmount = (amount, price, reverseConversion = false) => {
  let calculattion;
  if(reverseConversion) {
    calculattion = _.toNumber(amount) / price
  } else {
    calculattion = _.toNumber(amount) * price
  }

  return roundToTwo(calculattion, 2) || '-';
};

export const toFixedNoRound = (num, fixed, outNumber = true) => {
  const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  const stringOutput = num.toString().match(re)[0];
  return outNumber ? parseFloat(stringOutput, 10) : stringOutput;
}

export const getUserGamesCurrency = (user) => {
  return user?.preferences?.gamesCurrency || 'USD';
}
