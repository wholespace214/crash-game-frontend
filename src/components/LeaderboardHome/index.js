import style from './styles.module.scss';
import { useState, useEffect } from 'react';
import { formatToFixed } from 'helper/FormatNumbers';
import classNames from 'classnames';
import { getLeaderboard } from 'api';
import Link from 'components/Link';
import medalGold from '../../data/images/leaderboard/medal-1.svg';
import medalSilver from '../../data/images/leaderboard/medal-2.svg';
import medalBronze from '../../data/images/leaderboard/medal-3.svg';
import { ReactComponent as WfairIcon } from '../../data/icons/wfair-symbol.svg';

const LeaderboardHome = ({
  fetch = false,
  headingClass,
  className,
  leaderboardType,
  pushJackpotUser,
}) => {
  const LIMIT = 5;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (fetch) {
      getLeaderboard(leaderboardType, 0, LIMIT)
        .then(res => {
          setUsers(res.data.users);
          if (res.data.users[0]) {
            pushJackpotUser(res.data.users[0]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [fetch]);

  const getUsername = username => {
    let formattedUsername = username;

    if (formattedUsername && formattedUsername.length > 20) {
      formattedUsername = formattedUsername.substring(0, 17) + '...';
    }

    return formattedUsername;
  };

  const renderItem = (user, index) => {
    return (
      <>
        <div className={classNames(style.tableFirst)}>
          <p className={style.firstRank}>
            #{index + 1}
            {index < 3 && (
              <img
                src={
                  index === 0
                    ? medalGold
                    : index === 1
                    ? medalSilver
                    : index === 2
                    ? medalBronze
                    : null
                }
                alt="medal"
              />
            )}
          </p>
          <p className={style.firstName}>
            <Link to={`/user/${user._id}`}>{getUsername(user.username)}</Link>
          </p>
          <p className={style.firstBalance}>
            {formatToFixed(user.amountWon, 0, true)} WFAIR
            <WfairIcon className={style.wfairLogo} />
          </p>
        </div>
      </>
    );
  };

  const renderItems = () => {
    return users.map((user, index) => {
      return renderItem(user, index);
    });
  };

  return (
    <div className={classNames(style.leaderboardTable, className)}>
      <div className={classNames(style.tableHeadings, headingClass)}>
        <p className={style.rankingHeading}>RANK</p>
        <p className={style.userHeading}>USER</p>
        <p className={style.tokenHeading}>TOKENS</p>
      </div>
      <div className={style.leaderboardRanking}>
        {users &&
          (users.length ? (
            renderItems()
          ) : (
            <span className={style.emptyRanks}>Nothing here.</span>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardHome;
