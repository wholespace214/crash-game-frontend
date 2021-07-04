import _                        from 'lodash';
import classNames               from 'classnames';
import darkModeLogo             from '../../data/images/logo-darkmode.svg';
import medalGold                from "../../data/icons/medal-gold.png";
import cross                    from "../../data/icons/cross.svg";
import React                    from 'react';
import style                    from './styles.module.scss';
import { getProfilePictureUrl } from '../../helper/ProfilePicture';
import Link                     from '../Link';
import Routes                   from '../../constants/Routes';
import { useState }             from 'react';
import LeaderboardItem          from '../LeaderboardItem';
import { connect }              from 'react-redux';
// import { LeaderboardActions }   from 'store/actions/leaderboard';
// Just as long as I don't get Redux 
import axios                    from 'axios';
import { useEffect }            from 'react';


const Navbar = ({ user }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState([])
    const [rank, setRank] = useState(0);

    // Just as long as I don't get Redux 
    const token = user.token;

    useEffect(() => {
        axios.get('http://localhost:8000/api/user/getUsers')
        .then((response) => {
            setLeaderboard(response.data.users)
        })
        .catch((error) => {
            console.log(error)
        })

        axios.get(`http://localhost:8000/api/user/${user.userId}`,
        {
            headers: {
              Authorization: 'Bearer ' + token 
            }
        })
        .then((response) => {
            setRank(response.data.rank)
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error);
        })
    }, [token, rank, user.userId]);
    // End of temporary solution

    const onChangeLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard)
    }

    const getProfileStyle = () => {
        const profilePicture = getProfilePictureUrl(_.get(user, 'profilePicture'));

        return {
            backgroundImage: 'url("' + profilePicture + '")',
        };
    };

    const getBalance = () => {
        const userBalance = user.balance;

        if (!_.isNull(userBalance)) {
            return userBalance;
        }

        return '-';
    };

    return (
        <div className={style.navbar}>
            <div
                className={classNames(
                    style.navbarItems,
                    style.hideOnMobile,
                )}
            >
                <img
                    src={darkModeLogo}
                    alt="Wallfair"
                />
                <Link
                    to={Routes.home}
                    className={style.active}
                >
                    Home
                </Link>
                <Link to={Routes.betOverview}>
                    My Trades
                </Link>
                <Link to={Routes.wallet}>
                    My Wallet
                </Link>
            </div>
            <div className={style.navbarItems}>
                <div className={style.ranking} onClick={onChangeLeaderboard}>
                    <img src={medalGold} alt="medal" className={style.medal} />
                    <p className={style.rankingText}>Rank # {rank}</p>
                </div>
                <Link
                    to={Routes.wallet}
                    className={style.balanceOverview}
                >
                    <span className={style.actualBalanceText}>
                        Your current Balance
                    </span>
                    {getBalance()} EVNT
                </Link>
                <div
                    className={style.profile}
                    style={getProfileStyle()}
                >
                </div>
            </div>
            {
            showLeaderboard &&  
                <div className={style.leaderboard}>
                    <img src={cross} alt="close" className={style.closeLeaderboard} onClick={onChangeLeaderboard}/>
                    <p className={style.leaderboardHeading}>
                        Community
                        <br/>
                        Leaderboard
                    </p>
                    <div className={style.leaderboardTable}>
                        <div className={style.tableHeadings}>
                            <p className={style.rankingHeading}>RANKING</p>
                            <p className={style.userHeading}>USER</p>        
                            <p className={style.tokenHeading}>TOKENBALANCE</p>                
                        </div>
                        <div className={style.leaderboardRanking}>
                        {
                            leaderboard && leaderboard.map((user) => {
                                return (
                                    <LeaderboardItem user={user} />
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

// const mapStateToProps = (state) => {
//     return {
//         leaderboard: state 
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {};
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(Navbar);

export default Navbar;