import alertReducer from '../reducer/alert';
import betReducer from '../reducer/bet';
import eventReducer from '../reducer/event';
import popupReducer from '../reducer/popup';
import transactionReducer from '../reducer/transaction';
import userReducer from '../reducer/user';
import chatReducer from '../reducer/chat';
import notificationReducer from '../reducer/notification';
import authenticationReducer from '../reducer/authentication';
import websocketsReducer from './websockets';
import leaderboardReducer from './leaderboard';
import generalReducer from './general';
import rosiGameReducer from './rosi-game';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export default history =>
  combineReducers({
    alert: alertReducer,
    authentication: authenticationReducer,
    bet: betReducer,
    event: eventReducer,
    popup: popupReducer,
    transaction: transactionReducer,
    user: userReducer,
    chat: chatReducer,
    notification: notificationReducer,
    websockets: websocketsReducer,
    leaderboard: leaderboardReducer,
    router: connectRouter(history),
    general: generalReducer,
    rosiGame: rosiGameReducer,
  });
