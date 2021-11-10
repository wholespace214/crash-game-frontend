import { WebsocketsTypes } from '../actions/websockets';

const initialState = {
  init: false,
  connected: false,
  room: null,
  rooms: [],
};

const initSucceeded = (action, state) => {
  return { ...state, init: true, connected: false };
};
const close = (action, state) => {
  return { ...state, init: false, connected: false };
};
const connected = (action, state) => {
  return { ...state, connected: true };
};
const disconnected = (action, state) => {
  return { ...state, connected: false };
};
const joinRoom = (action, state) => ({
  ...state,
  room: action.roomId,
  rooms: state.rooms.includes(action.roomId)
    ? [...state.rooms]
    : [...state.rooms, action.roomId],
});

const leaveRoom = (action, state) => ({
  ...state,
  room: null,
  rooms: state.rooms.filter(r => r !== action.roomId),
});

export default function (state = initialState, action) {
  switch (action.type) {
    // @formatter:off
    case WebsocketsTypes.INIT_SUCCEEDED:
      return initSucceeded(action, state);

    case WebsocketsTypes.CLOSE:
      return close(action, state);

    case WebsocketsTypes.CONNECTED:
      return connected(action, state);

    case WebsocketsTypes.DISCONNECTED:
      return disconnected(action, state);

    case WebsocketsTypes.JOIN_ROOM:
      return joinRoom(action, state);

    case WebsocketsTypes.LEAVE_ROOM:
      return leaveRoom(action, state);

    default:
      return state;
    // @formatter:on
  }
}
