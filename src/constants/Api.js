// Env vars
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  'https://staging-zeaec.ondigitalocean.app/';
export const BACKEND_SOCKET_URL = BACKEND_URL;
export const CRASH_GAME_BACKEND_URL =
  process.env.REACT_APP_CRASH_GAME_BACKEND_URL || 'http://localhost:8001/';
export const NEWS_API_URL = 'http://api.mediastack.com/v1/news';
export const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
export const NEWS_API_SSL_MODE =
  process.env.REACT_APP_NEWS_API_SSL_MODE === 'true';

// Services
export const API_AUTHENTICATION_REQUEST_SMS_URL = 'api/user/login';
export const API_AUTHENTICATION_SAVE_ADD_INFO_URL =
  'api/user/saveAdditionalInformation';
export const API_AUTHENTICATION_VERIFY_SMS_URL = 'api/user/verifyLogin';
export const API_AUTHENTICATION_VERIFY_EMAIL =
  'api/user/confirm-email/?userId=:userId&code=:code';
export const API_AUTHENTICATION_RESEND_EMAIL_VERIFICATION =
  'api/user/resend-confirm';
export const API_BET_CREATE = 'api/event/bet/create';
export const API_BET_OUTCOMES = 'api/event/bet/:id/outcomes/buy';
export const API_BET_PLACE = 'api/event/bet/:id/place';
export const API_BET_PULL_OUT = 'api/event/bet/:id/pullout';
export const API_BET_SELL_OUTCOMES = 'api/event/bet/:id/outcomes/sell';
export const API_EVENT_CREATE = 'api/event/create';
export const API_EVENT_LIST = 'api/event/list';
export const API_EVENT_LIST_FILTERED =
  'api/event/list/:type/:category/:count/:page/:sortBy/:searchQuery';
export const API_EVENT_CHAT_MESSAGES = 'api/event/chat-messages/:id';
export const API_EVENT_EVALUATE_SEND = 'api/event/evaluate';
export const API_USER = 'api/user/:id';
export const API_LEADERBOARD = 'api/user/getLeaderboard/:skip/:limit';
export const API_USER_HISTORY = 'api/user/history';
export const API_USER_OPEN_BETS = 'api/user/open-bets';
export const API_USER_REFERRAL_LIST = 'api/user/refList';
export const API_TAGS_LIST = 'api/event/tags';
export const API_CURRENT = 'api/current';
export const API_TRADE_CREATE = 'api/trade';
export const API_CHART_DATA = 'api/event/bet/:betId/history';
