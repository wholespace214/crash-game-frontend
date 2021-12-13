import {call, put} from 'redux-saga/effects'
import { select } from 'redux-saga/effects';
import { push } from 'connected-react-router'
import { OnboardingSteps } from 'store/actions/onboarding';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from '../../components/Popup/PopupTheme';
import {getRandomUsername} from '../../api'
import {OnboardingActions} from '../actions/onboarding'

const loadOnboardingStep = function* (action) {
  const step = yield select(state => state.onboarding.currentStep);
  switch(step){
    case OnboardingSteps.buildAvatar:
      return yield put(
        PopupActions.show({
          popupType: PopupTheme.alpacaBuilder,
          options: {
            ...action?.options,
            saveLabel:"Next",
            cancelLabel: "Skip",
            popUpTitle: "Alpacavatar",
            small: false
          },
        })
      );
    case OnboardingSteps.registerEmail:
      return yield put(
        PopupActions.show({
          popupType: PopupTheme.auth,
          options: {
            ...action?.options,
            small: false,
          },
        })
      );
    case OnboardingSteps.setUsername:
      return yield put(
        PopupActions.show({
          popupType: PopupTheme.username,
          options: {
            ...action?.options,
            small: false,
          },
        })
      );
    case OnboardingSteps.welcomeScreen:
      //just do nothing for now
      return yield put(
        PopupActions.hide()
      )
      // return yield put(
      //   PopupActions.show({
      //     popupType: PopupTheme.welcome,
      //     options: {
      //       ...action?.options,
      //       small: false,
      //     },
      //   })
      // );
    case OnboardingSteps.wallet:
      yield put(push('/wallet'))
  }
};

const getUsernameSuggestion = function* (){
  const result = yield call(getRandomUsername);
  return yield put(OnboardingActions.addUsernameSuggestion({username: result.data.username}))
}


export default {
  loadOnboardingStep,
  getUsernameSuggestion
};
