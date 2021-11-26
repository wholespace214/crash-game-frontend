import styles from './styles.module.scss';
import AuthenticationType from './AuthenticationType';
import Register from './Register';
import Login from './Login';
import EmailSignUp from './Register/EmailSignUp';
import SocialLogin from './SocialLogin';

const Authentication = ({
  authenticationType,
  preloadEmailSignUp
}) => {

  const showNewFeatures =
    process.env.REACT_APP_SHOW_UPCOMING_FEATURES === 'true';

  return {
    [AuthenticationType.register]: 
      <>
        <EmailSignUp styles={styles} />
          
        {showNewFeatures &&
          <div className={styles.dontHaveAnAccount}>
            <p>or use your social login</p>
            <SocialLogin styles={styles} authenticationType={AuthenticationType.register} />
          </div>
        }
      </>
      ,
    [AuthenticationType.login]: 
      <Login styles={styles} />
  }[authenticationType] || ''
};

export default Authentication;
