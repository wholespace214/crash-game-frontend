import { NotificationTypes } from '../actions/notification';
import _ from 'lodash';
const initialState = {
  notifications: [],
  activities: [],
};

const sortNotifications = notifications =>
  notifications.sort((a = {}, b = {}) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate < bDate ? 1 : aDate === bDate ? 0 : -1;
  });

const addNotification = (action, state) => {
  const { notification, eventId } = action;

  const notifications = _.uniqWith(
    (state.notifications || [])
      .concat([notification])
      .map(m => _.omit(m, ['_id', '__v']))
      .map(m => {
        m.date = new Date(m.date);
        m.date.setMilliseconds(0);
        return m;
      }),
    _.isEqual
  );

  return {
    ...state,
    notifications: sortNotifications(notifications),
  };
};

const cleanUpActivities = (action, state) => {
  return {
    ...state,
    activities: [],
  };
};

const addActivity = (action, state) => {
  const { activity, eventName } = action;

  const activityObj = {
    data: activity,
    type: eventName,
  };

  const newActivities = [...state.activities, activityObj];

  if (newActivities.length > 20) {
    newActivities.shift();
  }

  return {
    ...state,
    activities: newActivities,
  };
};

const setUnread = (action, state) => {
  const { notification } = action;

  return {
    ...state,
    notifications: _.map(
      state.notifications.map(n => {
        return _.isEqual(notification, n) ? { ...n, read: true } : n;
      })
    ),
  };
};

export default function (state = initialState, action) {
  switch (action.type) {
    // @formatter:off
    case NotificationTypes.ADD_ACTIVITY:
      return addActivity(action, state);
    case NotificationTypes.CLEANUP_ACTIVITIES:
      return cleanUpActivities(action, state);
    case NotificationTypes.ADD_NOTIFICATION:
      return addNotification(action, state);
    case NotificationTypes.SET_UNREAD:
      return setUnread(action, state);
    default:
      return state;
    // @formatter:on
  }
}
