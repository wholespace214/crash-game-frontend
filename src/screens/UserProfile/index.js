import styles from './styles.module.scss';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import TabOptions from '../../components/TabOptions';
import { getUserPublicInfo } from '../../api';
import { getProfilePictureUrl } from '../../helper/ProfilePicture';

import ProfileActivityTemplate1 from '../../data/backgrounds/profile/userprofile_activity1.png';
import ProfileActivityTemplate2 from '../../data/backgrounds/profile/userprofile_activity2.png';
import ProfileActivityTemplate3 from '../../data/backgrounds/profile/userprofile_activity3.png';

import ProfileActivityMobileTemplate1 from '../../data/backgrounds/profile/userprofile_mobile_activity1.png';
import ProfileActivityMobileTemplate2 from '../../data/backgrounds/profile/userprofile_mobile_activity2.png';
import ProfileActivityMobileTemplate3 from '../../data/backgrounds/profile/userprofile_mobile_activity3.png';
import ActivitiesTracker from '../../components/ActivitiesTracker';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticationActions } from 'store/actions/authentication';

const UserProfile = () => {
  let matchMediaMobile = window.matchMedia(`(max-width: ${768}px)`).matches;

  const { userId } = useParams();
  const [user, setUser] = useState();
  const [suspendButtonVisible, setSuspendButtonVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const tabOptions = [
    { name: 'TRANSACTION HISTORY', index: 0 },
    { name: 'ACTIVITIES', index: 1 },
    { name: 'LEADERBOARD', index: 2 },
  ];
  const tabOption = _.get(tabOptions, `${tabIndex}.name`);
  const currentUser = useSelector(state => state.authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async userId => {
    const userResponse = await getUserPublicInfo(userId).catch(err => {
      console.error("Can't get user by id:", err);
    });
    const user = _.get(userResponse, 'data', null);
    setUser(user);
    setLocked(user?.status === 'locked');
    setSuspendButtonVisible(currentUser.admin && currentUser.userId !== userId);
  };

  const handleSwitchTab = option => {
    setTabIndex(option.index);
  };

  const onSuspendButtonClick = status => {
    dispatch(AuthenticationActions.updateStatus({ userId, status }));
    setLocked(status === 'locked');
  };

  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          <div className={styles.containerHeader}></div>
          <div className={styles.headerBody}>
            <div className={styles.avatarBox}>
              <img
                className={styles.profileImage}
                src={getProfilePictureUrl(user?.profilePic)}
                alt="Profile"
              />
            </div>

            <div className={styles.userInfo}>
              <div>
                <div className={styles.profileTitle}>
                  <h2>{user?.userName}</h2>
                </div>
                <div className={styles.aboutSection}>
                  <h3>About</h3>
                  <p>
                    {' '}
                    {user?.aboutMe ||
                      'This user has not provided an about info yet. How boring!'}{' '}
                  </p>
                </div>
              </div>
              {suspendButtonVisible && (
                <Button
                  className={styles.suspendButton}
                  onClick={() =>
                    onSuspendButtonClick(locked ? 'active' : 'locked')
                  }
                >
                  <span>{locked ? 'Reactivate' : 'Suspend'}</span>
                </Button>
              )}
            </div>

            <TabOptions options={tabOptions} className={styles.tabLayout}>
              {option => (
                <div
                  className={
                    option.index === tabIndex
                      ? styles.tabItemSelected
                      : styles.tabItem
                  }
                  onClick={() => handleSwitchTab(option)}
                >
                  {option.name}
                </div>
              )}
            </TabOptions>
          </div>
          <div className={styles.userActivities}>
            {tabOption === 'ACTIVITIES' ? (
              <ActivitiesTracker
                showCategories={false}
                activitiesLimit={50}
                userId={userId}
                className={styles.activitiesTrackerUserPage}
              />
            ) : (
              <>
                {matchMediaMobile ? (
                  <img
                    src={
                      tabIndex === 0
                        ? ProfileActivityMobileTemplate1
                        : tabIndex === 1
                        ? ProfileActivityMobileTemplate2
                        : ProfileActivityMobileTemplate3
                    }
                    className={styles.templateImage}
                    alt=""
                  />
                ) : (
                  <img
                    src={
                      tabIndex === 0
                        ? ProfileActivityTemplate1
                        : tabIndex === 1
                        ? ProfileActivityTemplate2
                        : ProfileActivityTemplate3
                    }
                    className={styles.templateImage}
                    alt=""
                  />
                )}
                <div className={styles.inactivePlaceholder}>Coming soon</div>
              </>
            )}
          </div>
        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

export default UserProfile;
