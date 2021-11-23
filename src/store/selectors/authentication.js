import { TOKEN_NAME } from 'constants/Token';
import { convert } from '../../helper/Currency';

export const selectCurrency = ({ authentication }) => {
  const currency = authentication.preferences?.currency;
  //return currency || TOKEN_NAME;
  return TOKEN_NAME;
};

export const selectUserId = state => state.authentication.userId;
export const selectUserLoggedIn = state => state.authentication.userId;
export const selectTokensRequestedAt = state => {
  const id = selectUserId(state);
  return state.user.users[id] && state.user.users[id].tokensRequestedAt
    ? state.user.users[id].tokensRequestedAt
    : new Date(Date.now() - (3600 * 1010)).toISOString();
};

export const selectUser = state => {
  const user = state.authentication;
  const currency = selectCurrency(state);
  const tokensRequestedAt = selectTokensRequestedAt(state);

  return {
    ...user,
    isLoggedIn: state.authentication.authState === 'LOGGED_IN',
    balance: convert(state.authentication.balance, currency),
    amountWon: convert(state.authentication.amountWon, currency),
    toNextRank: convert(state.authentication.toNextRank, currency),
    totalInvestmentAmount: convert(
      state.authentication.totalInvestmentAmount,
      currency
    ),
    totalOpenTradesAmount: convert(
      state.authentication.totalOpenTradesAmount,
      currency
    ),
    currency,
    tokensRequestedAt,
  };
};
