import React           from 'react';
import style           from './styles.module.scss';
import TimeLeftCounter from '../TimeLeftCounter';

const EventBetPill = ({ user, marketQuestion, hotBet, eventEnd, outcomes }) => {
    const getProfileStyle = () => {
        return {
            backgroundImage: 'url("' + user.profilePicture + '")',
        };
    };
    const renderHotBetTag = () => {
        return (
            <div className={style.hotBetTag}>
                🔥 Hot Bet
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className={style.pillFooter}>
                <div className={style.timeLeftCounterContainer}>
                    <span>Event ends in:</span>
                    <TimeLeftCounter endDate={eventEnd} />
                </div>
            </div>
        );
    };

    return (
        <div className={style.pill}>
            <div className={style.pillContent}>
                <div className={style.justify}>
                    <div
                        className={style.profile}
                        style={getProfileStyle()}
                    >
                    </div>
                    <div className={style.desc}>
                        <span>
                            {user.name}
                        </span>
                        <p>
                            {marketQuestion}
                        </p>
                    </div>
                    {hotBet && renderHotBetTag()}
                </div>
                <div className={style.justify}>
                    <div className={style.input}>
                        <label for="amount">Your bet:</label>
                        <div>
                            <input
                                id="amount"
                                type="number"
                                name="amount"
                            />
                            <span>EVNT</span>
                        </div>
                    </div>
                    <button
                        onClick={() => console.log('bet placed')}
                        className={style.btnBetLeft}
                    >
                        <span>Paul</span>
                        6.000 EVNT
                    </button>
                    <button
                        onClick={() => console.log('bet placed')}
                        className={style.btnBetRight}
                    >
                        <span>John</span>
                        8.000 EVNT
                    </button>
                    <a
                        href="/"
                        className={style.goToEvent}
                    >
                        Go to event
                    </a>
                </div>
            </div>
            {renderFooter()}
        </div>
    );
};

export default EventBetPill;