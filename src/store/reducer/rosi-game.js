import { RosiGameTypes } from '../actions/rosi-game';
import { round } from 'lodash';
import { calcCrashFactorFromElapsedTime } from '../../components/RosiGameAnimation/canvas/utils';

const initialState = {
  hasStarted: false,
  lastCrashes: [],
  inGameBets: [],
  betQueue: [],
  cashedOut: [],
  userBet: null,
  timeStarted: null,
  isCashedOut: false,
  placedBetInQueue: false,
  nextGameAt: null,
  volumeLevel: 0.5,
  isEndgame: false,
  animationIndex: 0,
  musicIndex: 0,
  bgIndex: 0,
  highData: [],
  luckyData: [],
};

const initializeState = (action, state) => {
  const hasStarted = action.payload.state === 'STARTED';
  let volumeLevel = '1.0';
  try {
    volumeLevel = localStorage.getItem('gameVolume');
  } catch (e) {
    console.error(e);
  }
  let {
    currentBets,
    upcomingBets,
    cashedOutBets,
    userId,
    animationIndex,
    musicIndex,
    bgIndex,
  } = action.payload;

  currentBets = currentBets.filter(ib => {
    return !cashedOutBets.find(cb => cb.userId === ib.userId);
  });

  const userBet = currentBets.find(b => {
    return b.userId === userId;
  });

  return {
    ...state,
    hasStarted,
    nextGameAt: hasStarted ? null : action.payload.nextGameAt,
    timeStarted: action.payload.timeStarted,
    lastCrashes: action.payload.lastCrashes,
    inGameBets: currentBets,
    betQueue: upcomingBets,
    cashedOut: cashedOutBets,
    userBet,
    animationIndex,
    musicIndex,
    bgIndex,
    placedBetInQueue: !!upcomingBets.find(b => b?.userId === userId),
    isCashedOut: !!cashedOutBets.find(b => b?.userId === userId),
    volumeLevel: parseInt(volumeLevel),
  };
};

const setHasStarted = (action, state) => {
  return {
    ...state,
    hasStarted: true,
    timeStarted: action.payload.timeStarted,
    placedBetInQueue: false,
    betQueue: [],
    animationIndex: action.payload.animationIndex,
    musicIndex: action.payload.musicIndex,
    bgIndex: action.payload.bgIndex,
  };
};

const setUserBet = (action, state) => {
  if (state.hasStarted) {
    return {
      ...state,
      placedBetInQueue: true,
    };
  }
  return {
    ...state,
    userBet: action.payload,
    placedBetInQueue: false,
  };
};

const addLastCrash = (action, state) => {
  const lastCrash = {
    crashFactor: action.payload.crashFactor,
    gameHash: action.payload.gameHash,
  };

  return {
    ...state,
    hasStarted: false,
    nextGameAt: action.payload.nextGameAt,
    userBet: state.betQueue.find(bet => {
      if (!action.payload.userId) {
        return bet.userId === 'Guest';
      }
      return bet.userId === action.payload.userId;
    }),
    lastCrashes: [lastCrash, ...state.lastCrashes],
    isCashedOut: false,
  };
};

const addInGameBet = (action, state) => {
  const { clientUserId, userId } = action.payload;
  if (state.hasStarted || state.isEndgame) {
    return {
      ...state,
      placedBetInQueue: state.placedBetInQueue || clientUserId === userId,
      betQueue: [
        {
          ...action.payload,
          isFresh: true,
        },
        ...state.betQueue,
      ],
    };
  }
  let userBet = null;
  if (state.userBet) {
    userBet = state.userBet;
  } else if (clientUserId === userId) {
    userBet = action.payload;
  }

  return {
    ...state,
    userBet: userBet,
    inGameBets: [
      {
        ...action.payload,
        isFresh: true,
      },
      ...state.inGameBets,
    ],
  };
};

const resetInGameBets = (action, state) => {
  return {
    ...state,
    inGameBets: state.betQueue,
    betQueue: [],
    placedBetInQueue: false,
  };
};

const resetCashedOut = (action, state) => {
  return {
    ...state,
    cashedOut: [],
  };
};

const cashedOut = (action, state) => {
  return {
    ...state,
    userBet: null,
    isCashedOut: true,
  };
};

const cashedOutGuest = (action, state) => {
  const startTime = new Date(state.timeStarted);
  const now = Date.now();
  let factor = calcCrashFactorFromElapsedTime(now - startTime.getTime());

  const bet = {
    ...action.payload,
    amount: round(state.userBet.amount * factor, 0),
    username: 'Guest',
    userId: 'Guest',
    crashFactor: factor,
    isFresh: true,
  };
  return {
    ...state,
    userBet: null,
    isCashedOut: true,
    cashedOut: [bet, ...state.cashedOut],
    inGameBets: state.inGameBets.filter(bet => bet?.userId !== 'Guest'),
  };
};

const addReward = (action, state) => {
  const { clientUserId, userId } = action.payload;
  const correspondingBet = state.inGameBets.find(
    bet => action.payload.userId.toString() === bet.userId
  );
  const bet = {
    ...action.payload,
    crashFactor: round(action.payload.crashFactor, 2),
    amount: action.payload.reward,
    isFresh: true,
  };
  return {
    ...state,
    cashedOut: [bet, ...state.cashedOut],
    isCashedOut: state.isCashedOut || clientUserId === userId,
    userBet: clientUserId === userId ? null : state.userBet,
    inGameBets: correspondingBet
      ? state.inGameBets.filter(bet => bet.userId !== correspondingBet.userId)
      : state.inGameBets,
  };
};

const removeCanceledBet = (action, state) => {
  const { clientUserId, userId } = action.payload;
  let betQueue = state.betQueue;
  let inGameBets = state.inGameBets;

  if (!state.hasStarted && !state.isEndgame) {
    inGameBets = (action, state) =>
      state.betQueue.filter(bet => bet?.userId !== action.payload.userId);
  } else {
    betQueue = state.betQueue.filter(
      bet => bet?.userId !== action.payload.userId
    );
  }

  let userBet = inGameBets.find(b => b.userId === clientUserId);

  return {
    ...state,
    placedBetInQueue: !!betQueue.find(b => b.userId === clientUserId),
    userBet: userBet ? userBet : null,
    betQueue: betQueue,
    inGameBets: inGameBets,
  };
};

const onTick = (action, state) => {
  return {
    ...state,
    cashedOut: state.cashedOut.map(bet => ({ ...bet, isFresh: false })),
    inGameBets: state.inGameBets.map(bet => ({ ...bet, isFresh: false })),
  };
};

const onMuteButtonClick = (action, state) => {
  try {
    localStorage.setItem(
      'gameVolume',
      `${state.volumeLevel === 0.0 ? 1.0 : 0.0}`
    );
  } catch (e) {
    console.error(e);
  }
  return {
    ...state,
    volumeLevel: state.volumeLevel === 0.0 ? 1.0 : 0.0,
  };
};

const onEndEndgamePeriod = (action, state) => {
  return {
    ...state,
    isEndgame: false,
  };
};

const onStartEndgamePeriod = (action, state) => {
  return {
    ...state,
    isEndgame: true,
  };
};

function clearGuestData(action, state) {
  return {
    ...state,
    placedBetInQueue: false,
    isCashedOut: false,
    userBet: null,
    betQueue: state.betQueue.filter(bet => bet?.userId !== 'Guest'),
    inGameBets: state.inGameBets.filter(bet => bet?.userId !== 'Guest'),
  };
}

function cancelBet(action, state) {
  let inGameBets = state.inGameBets;
  let betQueue = state.betQueue;

  if (!state.hasStarted && !state.isEndgame) {
    inGameBets = state.inGameBets.filter(
      bet => bet?.userId !== action.payload.userId
    );
    return {
      ...state,
      placedBetInQueue: false,
      isCashedOut: false,
      userBet: null,
      inGameBets: inGameBets,
    };
  } else {
    betQueue = state.betQueue.filter(
      bet => bet?.userId !== action.payload.userId
    );
    return {
      ...state,
      placedBetInQueue: false,
      isCashedOut: false,
      userBet: null,
      betQueue: betQueue,
    };
  }
}

const fetchHighData = ({ data }, state) => {
  return {
    ...state,
    highData: data,
  };
};

const fetchLuckyData = ({ data }, state) => ({
  ...state,
  luckyData: data,
});

export default function (state = initialState, action) {
  switch (action.type) {
    case RosiGameTypes.INITIALIZE_STATE:
      return initializeState(action, state);
    case RosiGameTypes.SET_HAS_STARTED:
      return setHasStarted(action, state);
    case RosiGameTypes.SET_USER_BET:
      return setUserBet(action, state);
    case RosiGameTypes.ADD_LAST_CRASH:
      return addLastCrash(action, state);
    case RosiGameTypes.ADD_IN_GAME_BET:
      return addInGameBet(action, state);
    case RosiGameTypes.RESET_IN_GAME_BETS:
      return resetInGameBets(action, state);
    case RosiGameTypes.ADD_CASHED_OUT:
      return state;
    case RosiGameTypes.RESET_CASHED_OUT:
      return resetCashedOut(action, state);
    case RosiGameTypes.CASH_OUT:
      return cashedOut(action, state);
    case RosiGameTypes.CASH_OUT_GUEST:
      return cashedOutGuest(action, state);
    case RosiGameTypes.ADD_REWARD:
      return addReward(action, state);
    case RosiGameTypes.TICK:
      return onTick(action, state);
    case RosiGameTypes.MUTE_BUTTON_CLICK:
      return onMuteButtonClick(action, state);
    case RosiGameTypes.END_ENDGAME_PERIOD:
      return onEndEndgamePeriod(action, state);
    case RosiGameTypes.START_ENDGAME_PERIOD:
      return onStartEndgamePeriod(action, state);
    case RosiGameTypes.CLEAR_GUEST_DATA:
      return clearGuestData(action, state);
    case RosiGameTypes.CANCEL_BET:
      return cancelBet(action, state);
    case RosiGameTypes.HANDLE_CANCEL_BET:
      return removeCanceledBet(action, state);
    case RosiGameTypes.FETCH_HIGH_DATA_COMPLETE:
      return fetchHighData(action, state);
    case RosiGameTypes.FETCH_LUCKY_DATA_COMPLETE:
      return fetchLuckyData(action, state);
    default:
      return state;
  }
}
