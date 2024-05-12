import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useHistory } from "react-router-dom";

const Notification = () => {
  const currentUser = useCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('notifications/');
        console.log('response', response);
        const userNotifications = response.data.results.filter(notification => notification.recipient.id === currentUser.id);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  console.log(notifications)

  const handleClick = (notification) => {
    if (notification.notification_type === 'like' || notification.notification_type === 'comment') {
      history.push(`/posts/${notification.post.id}`);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} onClick={() => handleClick(notification)}>
            {notification.username} {notification.notification_type} your {notification.post ? 'post' : 'profile'}.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;