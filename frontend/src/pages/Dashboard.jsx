import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestRide, getRides } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import RideCard from '../components/RideCard';
import { MapPin, Navigation, Car, Sparkles, LogOut, Check } from 'lucide-react';
import styles from './Dashboard.module.css';

const rideOptions = [
  { id: 'go', name: 'ShuttleGo', time: '~4 min', fare: 450, icon: <Car size={24} /> },
  { id: 'x', name: 'ShuttleX', time: '~3 min', fare: 650, icon: <Car size={28} /> },
  { id: 'black', name: 'ShuttleBlack', time: '~6 min', fare: 1200, icon: <Sparkles size={24} /> },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('Current Location');
  const [dropoff, setDropoff] = useState('');
  const [selectedRide, setSelectedRide] = useState(rideOptions[1]);
  const [isBooking, setIsBooking] = useState(false);
  
  const [recentRides, setRecentRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);

  useEffect(() => {
    getRides().then(data => {
      setRecentRides(data);
      setLoadingRides(false);
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBook = async () => {
    if (!pickup || !dropoff) return;
    setIsBooking(true);
    try {
      const { rideId } = await requestRide(pickup, dropoff, selectedRide.fare);
      navigate(`/tracking?rideId=${rideId}`);
    } finally {
      setIsBooking(false);
    }
  };

  const totalSpent = recentRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>ShuttleIT</div>
        <div className={styles.userMenu}>
          <div className={styles.avatar}>{user?.avatar || 'R'}</div>
          <span className={styles.userName}>{user?.name}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.leftCol}>
          <div className={`${styles.bookingPanel} glass`}>
            <h2 className={styles.panelTitle}>Where to?</h2>
            
            <div className={styles.inputs}>
              <Input 
                label="Pickup location"
                value={pickup} 
                onChange={e => setPickup(e.target.value)}
                icon={<Navigation size={18} />} 
              />
              <Input 
                label="Dropoff destination"
                value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                icon={<MapPin size={18} />}
              />
            </div>

            <div className={styles.rideOptions}>
              {rideOptions.map(option => (
                <div 
                  key={option.id}
                  className={`${styles.rideOptionCard} ${selectedRide.id === option.id ? styles.selected : ''}`}
                  onClick={() => setSelectedRide(option)}
                >
                  {selectedRide.id === option.id && <div className={styles.checkIcon}><Check size={14} /></div>}
                  <div className={styles.rideIcon}>{option.icon}</div>
                  <div className={styles.rideDetails}>
                    <div className={styles.rideName}>{option.name}</div>
                    <div className={styles.rideTime}>{option.time}</div>
                  </div>
                  <div className={styles.rideFare}>Rs. {option.fare.toFixed(0)}</div>
                </div>
              ))}
            </div>

            <Button 
              label={`Book ${selectedRide.name}`}
              fullWidth
              size="lg"
              onClick={handleBook}
              loading={isBooking}
              disabled={!pickup || !dropoff}
            />
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={`${styles.statsBar} glass`}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Rides</span>
              <span className={styles.statValue}>{loadingRides ? '-' : recentRides.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Spent</span>
              <span className={styles.statValue}>Rs. {loadingRides ? '-' : totalSpent.toFixed(0)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Member</span>
              <span className={styles.statValue}>2023</span>
            </div>
          </div>

          <div className={styles.recentActivity}>
            <h3 className={styles.sectionTitle}>Recent Rides</h3>
            <div className={styles.ridesList}>
              {loadingRides 
                ? [1, 2, 3].map(i => <RideCard key={i} loading />)
                : recentRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
