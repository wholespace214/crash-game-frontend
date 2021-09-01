import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import styles from './styles.module.scss';
import {
  CASINO_GAMES,
  SLOTS_GAMES,
  SPORTS_BETTING_GAMES,
} from '../../constants/Games';
import GameCards from '../../components/GameCards';
import ContentFooter from 'components/ContentFooter';

const Games = () => {
  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        <GameCards games={CASINO_GAMES} category="Casino" />
        <GameCards games={SLOTS_GAMES} category="Slots" />
        <GameCards games={SPORTS_BETTING_GAMES} category="Sports Betting" />
        <ContentFooter />
      </div>
    </BaseContainerWithNavbar>
  );
};

export default Games;
