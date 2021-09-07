import _ from 'lodash';
import update from 'immutability-helper';
import { BetTypes } from '../actions/bet';
import { PopupTypes } from '../actions/popup';
import { formatToFixed } from '../../helper/FormatNumbers';

const initialState = {
  selectedChoice: null,
  selectedCommitment: null,
  actionIsInProgress: false,
  outcomes: {},
  sellOutcomes: {},
  openBets: [],
  wfairValue: 0.2,
};

const reset = (action, state) => {
  return update(state, {
    selectedChoice: {
      $set: initialState.selectedChoice,
    },
  });
};

const selectChoice = (action, state) => {
  return update(state, {
    selectedChoice: {
      $set: action.choice,
    },
  });
};

const setActionIsInProgress = (action, state) => {
  let isInProgress = false;

  switch (action.type) {
    case BetTypes.PLACE:
    case BetTypes.PULL_OUT_BET:
      isInProgress = true;

      break;
  }

  return update(state, {
    actionIsInProgress: {
      $set: isInProgress,
    },
  });
};

const setCommitment = (action, state) => {
  const commitment = formatToFixed(action.commitment);

  if (
    _.isEmpty(commitment) ||
    ((commitment >= 0.001 || commitment === 0) && commitment <= 20000000)
  ) {
    return update(state, {
      selectedCommitment: {
        $set: action.commitment,
      },
    });
  }

  return state;
};

const setOutcomes = (action, state) => {
  return updateOutcomes('outcomes', action, state);
};

const setSellOutcomes = (action, state) => {
  return updateOutcomes('sellOutcomes', action, state);
};

const updateOutcomes = (outcomeType, action, state) => {
  return {
    ...state,
    [outcomeType]: {
      [action.betId]: {
        ...state[outcomeType][action.betId],
        ...action.outcomes,
      },
    },
  };
};

const fetchOpenBetsSucceeded = (action, state) => {
  const openBets = _.get(action, 'openBets', []);

  return update(state, {
    openBets: {
      $set: openBets,
    },
  });
};

// @TODO: this is not used atm, do we need it or can we remove that code?
// const resetOutcomes = (action, state) => {
//     return update(state, {
//         outcomes: {
//             $set: [],
//         },
//     });
// };

export default function (state = initialState, action) {
  switch (action.type) {
    // @formatter:off
    case PopupTypes.HIDE:
      return reset(action, state);
    case BetTypes.SELECT_CHOICE:
      return selectChoice(action, state);
    case BetTypes.SET_COMMITMENT:
      return setCommitment(action, state);
    case BetTypes.SET_OUTCOMES:
      return setOutcomes(action, state);
    case BetTypes.SET_SELL_OUTCOMES:
      return setSellOutcomes(action, state);
    case BetTypes.FETCH_OPEN_BETS_SUCCEEDED:
      return fetchOpenBetsSucceeded(action, state);
    case BetTypes.PLACE:
    case BetTypes.PULL_OUT_BET:
    case BetTypes.PLACE_SUCCEEDED:
    case BetTypes.PLACE_FAILED:
    case BetTypes.PULL_OUT_BET_SUCCEEDED:
    case BetTypes.PULL_OUT_BET_FAILED:
      return setActionIsInProgress(action, state);
    // case REHYDRATE:                          return resetOutcomes(action, state);
    default:
      return state;
    // @formatter:on
  }
}
