import * as Api from '../../api';
import _ from 'lodash';
import { AuthenticationActions } from '../actions/authentication';
import { call } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import { UserActions } from '../actions/user';
import { LOGGED_IN } from 'constants/AuthState';

const fetch = function* (action) {
  const forceFetch = action.forceFetch;
  let fetchUser = true;
  let userId = action.userId;

  if (!userId) {
    userId = yield select(state => state.authentication.userId);
  }

  if (!forceFetch) {
    const existingUsers = yield select(state => state.user.userId);
    const userExists = _.has(existingUsers);
    fetchUser = !userExists;
  }

  if (fetchUser) {
    const authState = yield select(state => state.authentication.authState);
    if (authState !== LOGGED_IN) return;

    const response = yield call(Api.getUser, userId);

    if (response) {
      const user = response.data;

      yield put(
        UserActions.fetchSucceeded({
          user,
        })
      );
    } else {
      yield put(
        UserActions.fetchFailed({
          userId,
        })
      );
    }
  }
};

const fetchSucceeded = function* (action) {
  const selfUserId = yield select(state => state.authentication.userId);
  const user = action.user;
  const userId = user.userId;

  if (userId === selfUserId) {
    const profilePicture = user.profilePicture;
    const balance = user.balance;
    const username = user.username;
    const admin = user.admin;
    const totalWin = user.totalWin;
    const rank = user.rank;
    const amountWon = user.amountWon;
    const toNextRank = user.toNextRank;

    yield put(
      AuthenticationActions.updateData({
        profilePicture,
        balance,
        username,
        admin,
        totalWin,
        rank,
        amountWon,
        toNextRank,
      })
    );
  }
};

export default {
  fetch,
  fetchSucceeded,
};
