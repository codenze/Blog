import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../slices/notificationSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import '../../css/Notification.css';

const Notification = ({ message, isSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        dispatch(setNotification({ notification: false, message: '', isSuccess: false }));
      }, 1000);
    }
  }, [message]);

  const getColor = () => {
    return isSuccess ? 'notification success_n' : 'notification error_n';
  };

  const getIcon = () => {
    return isSuccess ? <CheckCircleIcon color="inherit" /> : <ErrorIcon color="inherit" />;
  };

  return isVisible ? (
    <div className={`notification ${getColor()}`}>
      <div className={`notification__message`}>
        {getIcon()}
        <p className="notification__text">{message}</p>
      </div>
    </div>
  ) : null;
};

export default Notification;
