import cn from 'classnames';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import { ROSI_GAME_AFTER_CRASH_DELAY } from 'constants/RosiGame';
import {
  selectHasStarted,
  selectTimeStarted,
  selectLastCrash,
  selectCashedOut,
  selectNextGameAt,
} from 'store/selectors/rosi-game';
import Timer from './Timer';
import Counter from './Counter';
import styles from './styles.module.scss';
import RosiGameAnimationController from './canvas/RosiGameAnimationController';
import { RosiGameActions } from '../../store/actions/rosi-game';

const PreparingRound = ({ nextGameAt }) => (
  <div className={styles.preparingRound}>
    <div>
      <h2 className={styles.title}>Preparing Round</h2>
      <div className={styles.description}>
        <span>
          Starting in <Counter className={styles.counter} from={nextGameAt} />
        </span>
      </div>
    </div>
  </div>
);

const GameOffline = () => (
  <div className={styles.preparingRound}>
    <div>
      <h2 className={styles.title}>Connecting to the game engine</h2>
      <div className={styles.description}>
        If this takes too long, try reloading the page
      </div>
    </div>
  </div>
);

const RosiGameAnimation = ({
  connected,
  muteButtonClick,
  isMute,
  isSynced,
  isLosing,
  volumeLevel,
  musicIndex,
  animationIndex,
  onInit,
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const lastCrashValue = useSelector(selectLastCrash);
  const gameStarted = useSelector(selectHasStarted);
  const cashedOut = useSelector(selectCashedOut);
  const nextGameAtTimeStamp = useSelector(selectNextGameAt);
  const gameStartedTimeStamp = useSelector(selectTimeStarted);
  const gameStartedTime = new Date(gameStartedTimeStamp).getTime();

  const [isPreparingRound, setIsPreparingRound] = useState(!gameStarted);
  const [isAnimationReady, setAnimationReady] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    let audioInstance = null;
    if (canvasRef.current) {
      const { audio } = RosiGameAnimationController.init(canvasRef.current, {
        animationIndex,
        volumeLevel,
        musicIndex,
      });
      setAudio(audio);
      audioInstance = audio;
      onInit(audio);
      RosiGameAnimationController.load(() => {
        setAnimationReady(true);
        if (isPreparingRound) {
          RosiGameAnimationController.preparingRound.show();
        }
      });
    }
    return () => audioInstance.stopBgm();
  }, []);

  useEffect(() => {
    if (!isAnimationReady) {
      return;
    }

    if (gameStarted) {
      setIsPreparingRound(false);
      RosiGameAnimationController.start(gameStartedTime, musicIndex);

      if (cashedOut.length > 0) {
        for (const cashOut of cashedOut) {
          RosiGameAnimationController.doCashedOutAnimation(cashOut);
        }
      }

      return;
    }

    if (!gameStarted && !isPreparingRound) {
      RosiGameAnimationController.end(isLosing);
      // leave some time for player to see crash value
      setTimeout(() => {
        RosiGameAnimationController.preparingRound.show(animationIndex);
        setIsPreparingRound(true);
      }, ROSI_GAME_AFTER_CRASH_DELAY);
    }
  }, [gameStarted, isAnimationReady]); // eslint-disable-line

  useEffect(() => {
    if (!isAnimationReady || !gameStarted) {
      return;
    }

    const freshCashOuts = cashedOut.filter(({ isFresh }) => isFresh === true);
    for (const cashOut of freshCashOuts) {
      RosiGameAnimationController.doCashedOutAnimation(cashOut);
    }
  }, [isAnimationReady, gameStarted, cashedOut]); // eslint-disable-line

  function render() {
    if (!connected) return <GameOffline />;

    if (isPreparingRound) {
      return <PreparingRound nextGameAt={nextGameAtTimeStamp} />;
    }

    return (
      <div
        className={cn(styles.timer, { [styles.flashAnimation]: !gameStarted })}
      >
        {gameStarted && (
          <>
            <Timer pause={!gameStarted} startTimeMs={gameStartedTime} />
            <span>x</span>
          </>
        )}
        {!gameStarted && !!lastCrashValue && (
          <>
            <span>{lastCrashValue.toFixed(2)}</span>
            <span>x</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.animation}>
      <div
        className={classNames({
          [styles.muteButton]: true,
          [styles.mute]: !(audio?.volume > 0),
        })}
        onClick={() => {
          muteButtonClick();
          audio.volume === 0.0 ? audio.setVolume(1.0) : audio.mute();
        }}
      />
      <canvas
        className={classNames(
          styles.canvas,
          !connected || !isSynced ? styles.gameOffline : null
        )}
        id="rosi-game-animation"
        ref={canvasRef}
      />
      {isAnimationReady && isSynced ? render() : <GameOffline />}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
    isMute: state.rosiGame.volumeLevel == 0,
    volumeLevel: state.rosiGame.volumeLevel,
    musicIndex: state.rosiGame.musicIndex,
    isSynced: state.rosiGame.timeStarted || state.rosiGame.nextGameAt,
    animationIndex: state.rosiGame.animationIndex,
    isLosing: state.rosiGame.userBet && !state.rosiGame.isCashedOut,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    muteButtonClick: () => {
      dispatch(RosiGameActions.muteButtonClick());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RosiGameAnimation);
