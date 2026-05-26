import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDriverTrips, acceptTrip } from '../services/api';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import { Power, TrendingUp, Navigation2, Star, Clock, LogOut } from 'lucide-react';
import styles from './DriverPanel.module.css';

const DriverPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({ trips: 0, earnings: 0, rating: 4.9, hours: 0 });
  const [incomingReq, setIncomingReq] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Fake stats count up
  useEffect(() => {
    if (isOnline) {
      let trips = 0;
      let earnings = 0;
      const interval = setInterval(() => {
        if (trips < 12) trips++;
        if (earnings < 4500) earnings += 350;
        setStats(prev => ({ ...prev, trips, earnings, hours: 5.2 }));
      }, 50);
      setTimeout(() => clearInterval(interval), 1000);
    } else {
      setStats({ trips: 0, earnings: 0, rating: 4.9, hours: 0 });
    }
  }, [isOnline]);

  // Load history
  useEffect(() => {
    getDriverTrips().then(setHistory);
  }, []);

  // Simulate incoming request when online
  useEffect(() => {
    let timeout;
    if (isOnline && !activeTrip) {
      timeout = setTimeout(() => {
        setIncomingReq({
          id: 't_new1',
          pickup: 'Bandra Kurla Complex',
          dropoff: 'Chhatrapati Shivaji Airport',
          fare: 1450,
          distance: '4.5 km away',
          passengerName: 'Ananya Gupta',
          passengerAvatar: 'AG'
        });
      }, 4000);
    } else {
      setIncomingReq(null);
    }
    return () => clearTimeout(timeout);
  }, [isOnline, activeTrip]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAccept = async () => {
    const accepted = await acceptTrip(incomingReq.id);
    setActiveTrip({ ...incomingReq, ...accepted, status: 'en_route' });
    setIncomingReq(null);
  };

  const handleDecline = () => {
    setIncomingReq(null);
    setIsOnline(false); // Simulate offline to avoid infinite loop demo
  };

  const advanceTripState = () => {
    if (activeTrip.status === 'en_route') {
      setActiveTrip({ ...activeTrip, status: 'arrived' });
    } else if (activeTrip.status === 'arrived') {
      setActiveTrip({ ...activeTrip, status: 'in_progress' });
    } else {
      // Completed
      setHistory([{...activeTrip, status: 'completed'}, ...history]);
      setActiveTrip(null);
    }
  };

  const getButtonLabel = () => {
    if (activeTrip?.status === 'en_route') return 'Arrived at Pickup';
    if (activeTrip?.status === 'arrived') return 'Start Trip';
    return 'Complete Trip';
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>ShuttleIT Driver</div>
        <div className={styles.userMenu}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {/* Toggle Panel */}
        <div className={`${styles.togglePanel} ${isOnline ? styles.onlineGlow : ''}`}>
          <div className={styles.toggleText}>
            <h2>{isOnline ? "You're Online" : "You're Offline"}</h2>
            <p>{isOnline ? "Waiting for requests..." : "Go online to start earning"}</p>
          </div>
          <button 
            className={`${styles.goOnlineBtn} ${isOnline ? styles.btnOnline : styles.btnOffline}`}
            onClick={() => setIsOnline(!isOnline)}
          >
            <Power size={28} />
          </button>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <TrendingUp size={20} className={styles.statIcon} />
            <span className={styles.statLabel}>Earnings</span>
            <span className={styles.statValue}>Rs. {stats.earnings.toFixed(0)}</span>
          </div>
          <div className={styles.statCard}>
            <Navigation2 size={20} className={styles.statIcon} />
            <span className={styles.statLabel}>Trips</span>
            <span className={styles.statValue}>{stats.trips}</span>
          </div>
          <div className={styles.statCard}>
            <Star size={20} className={styles.statIcon} />
            <span className={styles.statLabel}>Rating</span>
            <span className={styles.statValue}>{stats.rating}</span>
          </div>
          <div className={styles.statCard}>
            <Clock size={20} className={styles.statIcon} />
            <span className={styles.statLabel}>Hours</span>
            <span className={styles.statValue}>{stats.hours}</span>
          </div>
        </div>

        {/* Incoming Request Overlay */}
        {incomingReq && (
          <div className={styles.requestOverlay}>
            <div className={`${styles.requestCard} animate-slide-up`}>
              <div className={styles.pingAnimation} />
              <h3 className={styles.reqTitle}>New Request</h3>
              <div className={styles.reqFare}>Rs. {incomingReq.fare.toFixed(0)}</div>
              <div className={styles.reqDist}>{incomingReq.distance}</div>
              
              <div className={styles.reqRoute}>
                <div className={styles.reqLoc}>{incomingReq.pickup}</div>
                <div className={styles.reqLoc}>{incomingReq.dropoff}</div>
              </div>
              
              <div className={styles.reqActions}>
                <Button label="Decline" variant="ghost" onClick={handleDecline} />
                <Button label="Accept" className={styles.acceptBtn} onClick={handleAccept} />
              </div>
            </div>
          </div>
        )}

        {/* Active Trip Panel */}
        {activeTrip && (
          <div className={`${styles.activeTripPanel} animate-fade-in-up`}>
            <div className={styles.activeHeader}>
              <div className={styles.activePassenger}>
                <div className={styles.passAvatar}>{activeTrip.passengerAvatar}</div>
                <div>
                  <div className={styles.passName}>{activeTrip.passengerName}</div>
                  <div className={styles.passRole}>Passenger</div>
                </div>
              </div>
              <div className={styles.activeStatus}>{activeTrip.status.replace('_', ' ').toUpperCase()}</div>
            </div>
            
            <div className={styles.reqRoute}>
                <div className={styles.reqLoc}>{activeTrip.pickup}</div>
                <div className={styles.reqLoc}>{activeTrip.dropoff}</div>
            </div>
            
            <Button 
              label={getButtonLabel()} 
              fullWidth 
              size="lg" 
              onClick={advanceTripState} 
            />
          </div>
        )}

        {/* History */}
        {!activeTrip && history.length > 0 && (
          <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>Trip History</h3>
            <div className={styles.historyList}>
              {history.map(trip => <RideCard key={trip.id} ride={trip} role="driver" />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverPanel;
