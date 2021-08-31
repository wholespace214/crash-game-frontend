import * as ApiUrls from '../constants/Api';
import axios from 'axios';
import ContentTypes from '../constants/ContentTypes';

const createInstance = (host, apiPath) => {
  return axios.create({
    baseURL: `${host}${apiPath}`,
    timeout: 30000,
    headers: {
      'content-type': ContentTypes.applicationJSON,
      accept: ContentTypes.applicationJSON,
    },
  });
};

const Api = createInstance(ApiUrls.CRASH_GAME_BACKEND_URL, '/');

const setToken = token => {
  const authentication = 'Bearer ' + token;

  Api.defaults.headers.common['Authorization'] = authentication;
};

const createTrade = (payload) => {
  return Api.post(ApiUrls.API_TRADE_CREATE, payload).catch(error => {
    console.log('[API Error] called: createTrade', error);
  });
};

const getCurrentGameInfo = () => {
  return Api.get(ApiUrls.API_CURRENT).catch(error => {
    console.log('[API Error] called: getCurrentGameInfo', error);
  });
}

export {
  Api,
  setToken,
  createTrade,
  getCurrentGameInfo
};
