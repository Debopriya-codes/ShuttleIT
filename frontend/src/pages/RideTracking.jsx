import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRideStatus } from '../services/api';
import Button from '../components/Button';
import { ArrowLeft, Phone, MessageSquare, XCircle, Star } from 'lucide-react';
import styles from './RideTracking.module.css';

const RideTracking = () => {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get('rideId');
  const navigate = useNavigate();
  
  const [statusObj, setStatusObj] = useState({ status: 'searching', eta: '', driver: null });
  const [rating, setRating] = useState(0);
  
  useEffect(() => {
    // Polling simulation
    const fetchStatus = async () => {
      const data = await getRideStatus(rideId);
      if (data) setStatusObj(data);
    };
    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [rideId]);

  const { status, eta, driver } = statusObj;

  const steps = [
    { key: 'searching', label: 'Searching' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'en_route', label: 'En Route' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'completed', label: 'Completed' }
  ];

  let currentStepIndex = steps.findIndex(s => s.key === status);
  if (currentStepIndex === -1) currentStepIndex = 0;

  if (status === 'completed') {
    return (
      <div className={styles.completeOverlay}>
        <div className={`${styles.completeCard} animate-slide-up`}>
          <div className={styles.successIcon}>✨</div>
          <h2>Ride Complete</h2>
          <p className={styles.fareSummary}>Rs. 850</p>
          <div className={styles.ratingSection}>
            <p>Rate your ride with {driver?.name || 'Driver'}</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={rating >= star ? styles.starFilled : styles.starEmpty} 
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <Button label="Back to Dashboard" onClick={() => navigate('/dashboard')} fullWidth size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}><ArrowLeft size={24} /></button>
        <span className={styles.title}>Your ride</span>
        <span className={styles.rideId}>#{rideId?.substring(0,6) || 'TRIP'}</span>
      </header>

      {/* Map Placeholder Area */}
      <div className={styles.mapArea}>
        <div className={styles.mapGrid} />
        <div className={styles.mapContent}>
           <div className={styles.mapStartPoint} />
           <div className={styles.mapDashedLine} />
           <div className={styles.mapEndPoint} />
           {currentStepIndex > 0 && <div className={`${styles.driverCar} ${styles['step' + currentStepIndex]}`} />}
        </div>
      </div>

      <div className={styles.bottomSection}>
        {/* Status Timeline */}
        <div className={styles.timeline}>
          {steps.map((step, idx) => (
            <div key={idx} className={`${styles.timelineStep} ${idx < currentStepIndex ? styles.completed : idx === currentStepIndex ? styles.active : ''}`}>
              <div className={styles.node} />
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
          ))}
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Driver Sheet */}
        {driver ? (
          <div className={`${styles.driverInfoCard} animate-slide-up`}>
            <div className={styles.driverMeta}>
              <div className={styles.driverAvatar}>{driver.avatar}</div>
              <div className={styles.driverText}>
                <h4>{driver.name}</h4>
                <span>⭐ {driver.rating}</span>
              </div>
              <div className={styles.carInfo}>
                <span className={styles.carPlate}>{driver.plate}</span>
                <span className={styles.carModel}>{driver.car}</span>
              </div>
            </div>
            
            <div className={styles.etaBox}>
              <span className={styles.etaText}>Arriving in</span>
              <span className={styles.etaTime}>{eta}</span>
            </div>

            <div className={styles.actionRow}>
              <Button icon={<Phone size={18} />} variant="outline" label="Call" />
              <Button icon={<MessageSquare size={18} />} variant="outline" label="Message" />
              <Button icon={<XCircle size={18} />} variant="danger" label="Cancel" />
            </div>
          </div>
        ) : (
          <div className={styles.searchingBox}>
            <div className={styles.scanPulse} />
            <p>Matching you with the nearest driver...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideTracking;
