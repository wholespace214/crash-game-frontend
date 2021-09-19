import { useState } from 'react';
import Button from 'components/Button';
import ImportFromTwitch from 'components/ImportFromTwitch';
import ImportFromYoutube from 'components/ImportFromYoutube';
import AdminEventForm from 'components/AdminEventForm';
import styles from './styles.module.scss';

const NewLiveEvents = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const openTwitchMenu = () => {
    setSelectedMenu('twitch');
  };
  const openYoutubeMenu = () => {
    setSelectedMenu('youtube');
  };
  const openManualMenu = () => {
    setSelectedMenu('manual');
  };

  return (
    <div className={styles.layout}>
      <h2>Event Settings</h2>
      <br />
      {selectedMenu === '' && (
        <>
          <Button className={styles.addOutcomeButton} onClick={openTwitchMenu}>
            Import From Twitch
          </Button>
          <br />
          <Button className={styles.addOutcomeButton} onClick={openYoutubeMenu}>
            Import From Youtube
          </Button>
          <br />
          <Button className={styles.addOutcomeButton} onClick={openManualMenu}>
            Import Manually
          </Button>
        </>
      )}
      {selectedMenu === 'twitch' && <ImportFromTwitch />}
      {selectedMenu === 'youtube' && <ImportFromYoutube />}
      {selectedMenu === 'manual' && <AdminEventForm />}
    </div>
  );
};

export default NewLiveEvents;
