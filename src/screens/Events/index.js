import { useState, memo } from 'react';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import NonStreamedEventsContent from 'components/Events/NonStreamedEventsContent';
import { EVENT_CATEGORIES_SECOND } from '../../constants/EventCategories';
import styles from './styles.module.scss';
import ActivitiesTracker from 'components/ActivitiesTracker';

const Events = () => {
  const [categories, setCategories] = useState(EVENT_CATEGORIES_SECOND);

  return (
    <BaseContainerWithNavbar withPaddingTop={true} backgroundVideo={false}>
      <NonStreamedEventsContent
        eventType="non-streamed"
        categories={categories}
        setCategories={setCategories}
      />
    </BaseContainerWithNavbar>
  );
};

export default memo(Events);
