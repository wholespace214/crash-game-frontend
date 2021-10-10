import { useEffect, useState } from 'react';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import EventsContent from 'components/Events/EventsContent';
import { EVENT_CATEGORIES } from 'constants/EventCategories';
import LiveEventsScreenshot from 'data/images/live-events-screenshot.png';
import LiveEventsScreenshotMobile from 'data/images/live-events-screenshot-mobile.png';
import styles from './styles.module.scss';
import { trackPageView } from 'config/gtm';

const LiveEvents = () => {
  const [categories, setCategories] = useState(EVENT_CATEGORIES);

  useEffect(() => {
    trackPageView({
      pageTitle: 'Live Events',
    });
  }, []);

  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.placeholderLiveEventsScreenshot}>
        <div className={styles.inactivePlaceholder}>Coming soon</div>
        <img
          src={LiveEventsScreenshot}
          alt="live events screenshot"
          className={styles.desktop}
        />
        <img
          src={LiveEventsScreenshotMobile}
          alt="live events screenshot mobile"
          className={styles.mobile}
        />
      </div>

      {/* <EventsContent
        eventType="streamed"
        categories={categories}
        setCategories={setCategories}
      /> */}
    </BaseContainerWithNavbar>
  );
};

export default LiveEvents;
