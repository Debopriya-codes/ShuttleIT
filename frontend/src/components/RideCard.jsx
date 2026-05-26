import React from 'react';
import styles from './RideCard.module.css';

const RideCard = ({ ride, loading = false, role = "rider" }) => {
  if (loading || !ride) {
    return (
      <div className={`${styles.card} skeleton`} style={{ height: '180px' }}>
      </div>
    );
  }

  const { pickup, dropoff, date, fare, status, driverName, driverAvatar, passengerName, distance, duration } = ride;
  
  const statusLabels = {
    searching: 'Searching',
    confirmed: 'Confirmed',
    en_route: 'En Route',
    arrived: 'Arrived',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const getStatusClass = () => {
    switch(status) {
      case 'searching': return styles.status_searching;
      case 'en_route': case 'confirmed': case 'arrived': return styles.status_en_route;
      case 'completed': return styles.status_completed;
      case 'cancelled': return styles.status_cancelled;
      default: return '';
    }
  };

  const personName = role === 'driver' ? passengerName : driverName;
  const personAvatar = role === 'driver' ? (passengerName?.substring(0, 2).toUpperCase() || 'P') : (driverAvatar || 'D');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.date}>{date || 'Just now'}</span>
        <span className={`${styles.statusPill} ${getStatusClass()}`}>
          {statusLabels[status] || status}
        </span>
      </div>

      <div className={styles.route}>
        <div className={styles.line}>
          <div className={`${styles.dot} ${styles.dotPickup}`} />
          <div className={styles.dotLine} />
          <div className={`${styles.dot} ${styles.dotDropoff}`} />
        </div>
        <div className={styles.locations}>
          <div className={styles.locText}>{pickup}</div>
          <div className={styles.locText}>{dropoff}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.driverInfo}>
          {personName && (
            <>
              <div className={styles.avatar}>{personAvatar}</div>
              <span className={styles.driverName}>{personName}</span>
            </>
          )}
        </div>
        <div className={styles.stats}>
          {fare !== undefined && <span className={styles.fare}>Rs. {parseFloat(fare).toFixed(0)}</span>}
          {(distance || duration) && (
            <span className={styles.meta}>{(distance && duration) ? `${distance} • ${duration}` : (distance || duration)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
