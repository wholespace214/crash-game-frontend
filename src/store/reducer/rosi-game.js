import { RosiGameTypes } from '../actions/rosi-game';
import { round } from 'lodash';
import {
  playCrashSound,
  playFailSound,
  playWinSound,
  playFlyingSound,
  stopFlyingSound,
  silenceAllSounds,
  resetAllSounds,
} from '../../helper/Audio';
import { calcCrashFactorFromElapsedTime } from '../../components/RosiGameAnimation/canvas/utils';
const TIME_TO_FACTOR_RATIO = 0.1; // 1s = 0.1x
const START_FACTOR = 1;
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
};

const initializeState = (action, state) => {
  const hasStarted = action.payload.state === 'STARTED';
  return {
    ...state,
    hasStarted,
    nextGameAt: hasStarted ? null : action.payload.nextGameAt,
    timeStarted: action.payload.timeStarted,
    lastCrashes: action.payload.lastCrashes,
  };
};

const setHasStarted = (action, state) => {
  return {
    ...state,
    hasStarted: true,
    timeStarted: action.payload.timeStarted,
    placedBetInQueue: false,
    betQueue: [],
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
  if (action.payload.crashFactor <= 1) {
    playFailSound(state.volumeLevel);
  } else {
    playCrashSound(state.volumeLevel);
  }

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
    lastCrashes: [action.payload.crashFactor, ...state.lastCrashes],
    isCashedOut: false,
  };
};

const addInGameBet = (action, state) => {
  if (state.hasStarted) {
    return {
      ...state,
      betQueue: [
        {
          ...action.payload,
          isFresh: true,
        },
        ...state.betQueue,
      ],
    };
  }
  return {
    ...state,
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
    inGameBets: state.inGameBets.filter(bet => bet.userId !== 'Guest'),
  };
};

const addReward = (action, state) => {
  const correspondingBet = state.inGameBets.find(
    bet => action.payload.userId.toString() === bet.userId
  );
  const bet = {
    ...action.payload,
    crashFactor: round(action.payload.crashFactor, 2),
    amount: action.payload.reward,
    username: correspondingBet?.username,
    isFresh: true,
  };
  return {
    ...state,
    cashedOut: [bet, ...state.cashedOut],
    inGameBets: state.inGameBets.filter(
      bet => bet.userId !== correspondingBet.userId
    ),
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
  if (state.volumeLevel) {
    silenceAllSounds();
  } else {
    resetAllSounds();
  }
  return {
    ...state,
    volumeLevel: state.volumeLevel ? 0.0 : 0.5,
  };
};

const onPlayWinSound = (action, state) => {
  playWinSound(state.volumeLevel);
  return state;
};

const onPlayFlyingSound = (action, state) => {
  const diff = (Date.now() - new Date(state.timeStarted).getTime()) / 1000;
  playFlyingSound(state.volumeLevel, diff);
  return state;
};

const onStopFlyingSound = (action, state) => {
  stopFlyingSound();
  return state;
};

const onStartEndgamePeriod = (action, state) => {
  return {
    ...state,
    isEndgame: true,
  };
};

const onEndEndgamePeriod = (action, state) => {
  return {
    ...state,
    isEndgame: false,
  };
};

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
    case RosiGameTypes.PLAY_WIN_SOUND:
      return onPlayWinSound(action, state);
    case RosiGameTypes.PLAY_FLYING_SOUND:
      return onPlayFlyingSound(action, state);
    case RosiGameTypes.STOP_FLYING_SOUND:
      return onStopFlyingSound(action, state);
    case RosiGameTypes.START_ENDGAME_PERIOD:
      return onStartEndgamePeriod(action, state);
    case RosiGameTypes.END_ENDGAME_PERIOD:
      return onEndEndgamePeriod(action, state);
    default:
      return state;
  }
}
