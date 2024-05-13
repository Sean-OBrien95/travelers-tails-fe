import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../../styles/Notification.module.css';
import Profile from '../profiles/Profile';


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('notifications/');
      const userNotifications = response.data.results;
      setNotifications(prevNotifications => [...userNotifications.reverse(), ...prevNotifications]);
      setLoading(false);
      console.log(response)
      console.log(response.data.results)
      console.log(userNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = async (notification) => {
    try {
      if (notification.notification_type === 'like' || notification.notification_type === 'comment') {
        history.push(`/posts/${notification.post}`);
      }
    } catch (error) {
      console.error('Error navigating to post:', error);
    }
    console.log(notification)
  };

  return (
    <div>
      <h2 className={styles.notificationTitle}>Notifications</h2>
      <ul className={styles.notificationList}>
        {notifications.map(notification => (
          <li key={notification.id} className={styles.notificationItem} onClick={() => handleClick(notification)}>
            <Profile profile={{ image: notification.profile_image }} mobile />
            <div className={styles.notificationContent}>
              <h3>{notification.username} {notification.notification_type} your {notification.post ? 'post' : 'profile'}.</h3>
            </div>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Notification;
