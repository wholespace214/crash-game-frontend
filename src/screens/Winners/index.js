import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';

import styles from './styles.module.scss';

import { useHistory, useLocation } from 'react-router-dom';
import useOAuthCallback from 'hooks/useOAuthCallback';
import { LOGGED_IN } from 'constants/AuthState';
import classNames from 'classnames';
import { PopupActions } from 'store/actions/popup';
import { OnboardingActions } from 'store/actions/onboarding';
import { connect, useDispatch, useSelector } from 'react-redux';
import Routes from 'constants/Routes';

import BackgroundThird from 'data/images/carousel/bg-third.png';

import { selectUser } from 'store/selectors/authentication';
import PopupTheme from 'components/Popup/PopupTheme';
import { dataLayerPush } from 'config/gtm';
import GainBanner from 'components/GainBanner';
import Button from 'components/Button';

const Winners = (
  authState,
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector(selectUser);

  useOAuthCallback();

  const isLoggedIn = useMemo(() => {
    return authState?.authState === LOGGED_IN;
  }, [authState]);

  useEffect(() => {
    if (isLoggedIn && !userState.phoneConfirmed) {
      dispatch(OnboardingActions.addPhoneNumber());
    }
  }, [isLoggedIn, userState.phoneConfirmed]);

  const handleClickSignUp = useCallback(() => {
    if (!isLoggedIn) {
      dispatch(OnboardingActions.start());
      dataLayerPush({
        event:'gtm.click',
        'gtm.elementId': 'home-banner--signup',
      });
    }
  }, [isLoggedIn]);

  const handleClickCreateEvent = useCallback(() => {
    if (isLoggedIn) {
      if (userState.phoneConfirmed) {
        history.push(Routes.getRouteWithParameters(Routes.events, {category: 'all'}));
        dispatch(PopupActions.show({popupType: PopupTheme.eventForms}));
      } else {
        dispatch(OnboardingActions.addPhoneNumber());
      }

    } else {
      dispatch(OnboardingActions.start());
      dataLayerPush({
        event:'gtm.click',
        'gtm.elementId': 'home-banner--create-events',
      });
    }
  }, [isLoggedIn, userState.phoneConfirmed, dispatch]);

  const WinnerItem = ({number, title}) => {
    return (
      <div className={styles.winnerItem}>
        <span className={styles.rankNumber}>#{number}</span>
        <span>{title}</span>
      </div>
    )
  }
  const renderWinners = () => {
    return (
      <div className={styles.winnerContainer}>
        <span className={styles.title}>The 3 Winners</span>
        <WinnerItem number={1} title={'Highest multiplier cashed out in an Event'} />
        <WinnerItem number={2} title={'Highest cashout value from Elon Game and Pump & Dump'} />
        <WinnerItem number={3} title={'Creator of the event with highest volume'} />

        <div className={classNames(styles.buttonWrapper, styles.desktop)}>
          <Button className={styles.button} onClick={handleClickCreateEvent}>Create Event now</Button>
        </div>
      </div>
    )
  }

  const renderWinner = () => {
    return (
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <img
            className={styles.backgroundImg}
            alt=""
            src={BackgroundThird}
          />
          <div className={styles.firstContainer}>
            <div className={styles.contentWrapper}>
              <span className={styles.title}>MARCH COMPETITION</span>
              <h2>
                WE WILL DRAW 3 WINNERS<br/>
                AT THE END OF MARCH.<br/>
                THE TOTAL PRIZE POOL IS<br/>
                WORTH <span className={styles.secondTitle}>5,000 EURO IN ETH.</span></h2>
            <div className={classNames(styles.buttonWrapper, styles.mobile)}>
              <Button className={styles.button} onClick={handleClickCreateEvent}>Create Event now</Button>
            </div>
            </div>
          </div>
          <div className={styles.secondContainer}>
            {renderWinners()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <BaseContainerWithNavbar withPaddingTop={true} carouselType='landingpage'>
      {renderWinner()}
      
      <div className={styles.gainContainer}>
        <GainBanner
          isLoggedIn={isLoggedIn}
          handleClickSignUp={handleClickSignUp}
          handleClickCreateEvent={handleClickCreateEvent}
        />
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    authState: state.authentication.authState,
    tags: state.event.tags,
    events: state.event.events,
    userId: state.authentication.userId,
    phoneConfirmed: state.phoneConfirmed,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startOnboardingFlow: () => {
      dispatch(OnboardingActions.start());
    },
  };
};

const Connected = connect(mapStateToProps, mapDispatchToProps)(Winners);
export default memo(Connected);
