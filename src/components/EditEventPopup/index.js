import { useSelector } from 'react-redux';
import AdminEventForm from 'components/AdminEventForm';
import styles from './styles.module.scss';

const EditEventPopup = () => {
  const event = useSelector(state => state.popup.options);

  return (
    <div className={styles.layout}>
      <h2>Event Settings</h2>
      <br />
      <AdminEventForm event={event} />
    </div>
  );
};

export default EditEventPopup;
