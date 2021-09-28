import BaseContainerWithNavbar from '../../components/BaseContainerWithNavbar';
import Header from './Header';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
import SectionFive from './SectionFive';
import SignUp from './SignUp';
import styles from './styles.module.scss';

const classes = {
  section: styles.section,
  sectionNumber: styles.sectionNumber,
  sectionHeading: styles.sectionHeading,
  textParagraph: styles.textParagraph,
  textContainer: styles.textContainer,
};

const LandingPage = () => {
  return (
    <BaseContainerWithNavbar withPaddingTop>
      <div className={styles.layout}>
        <Header />
        <SectionOne classes={classes} />
        <SectionTwo classes={classes} />
        <SectionThree classes={classes} />
        <SectionFour classes={classes} />
        <SectionFive classes={classes} />
      </div>
      <SignUp />
    </BaseContainerWithNavbar>
  );
};

export default LandingPage;
