import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../styles/Notification.module.css';
import Asset from '../../components/Asset';
import PopularProfiles from '../profiles/PopularProfiles';
import appStyles from "../../App.module.css";
import NoResultsImage from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from '../../components/Avatar';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const history = useHistory();

  // Function to fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch notifications from the server
      const response = await axios.get(`notifications/?page=${page}`);
      // Reverse the order of notifications and add to the existing list
      const userNotifications = response.data.results.reverse(); 
      setNotifications([...notifications, ...userNotifications]);
      // Update loading state and page number
      setLoading(false);
      setPage(page + 1);
      // Check if there are more notifications to load
      if (!response.data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle click on a notification item
  const handleClick = async (notification) => {
    try {
      // If notification type is like or comment, navigate to the corresponding post
      if (notification.notification_type === 'like' || notification.notification_type === 'comment') {
        history.push(`/posts/${notification.post}`);
      }
    } catch (error) {
      console.error('Error navigating to post:', error);
    }
  };

  // JSX for rendering the component
  return (
    <Container>
      <Row className="h-100">
        <Col Col className="py-2 p-0 p-lg-2" lg={8}>
          <PopularProfiles mobile />
          {/* Infinite scroll for notifications */}
          <InfiniteScroll
            dataLength={notifications.length}
            next={fetchNotifications} 
            hasMore={hasMore}
          >
            <div className={styles.notificationList}>
              {/* Map through notifications and render each item */}
              {notifications.map(notification => (
                <div key={notification.id} className={styles.notificationItem} onClick={() => handleClick(notification)}>
                  <Avatar src={notification.profile_image} />
                  <div className={styles.notificationContent}>
                    <h3>{notification.username} {notification.notification_type} your {notification.post ? 'post' : 'profile'}.</h3>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
          {loading && (
            <div className={`${appStyles.Content} d-flex flex-column justify-content-center align-items-center`}>
              <Asset spinner />
            </div>
          )}
          {/* Message for no notifications */}
          {!loading && notifications.length === 0 && (
            <div className={`${appStyles.Content} d-flex flex-column justify-content-center align-items-center`}>
              <Asset src={NoResultsImage} />
              <p>Here is where your notifications will appear.</p>
            </div>
          )}
        </Col>
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          <PopularProfiles />
        </Col>
      </Row>
    </Container>
  );
};

export default Notification;
