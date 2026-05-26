import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Mail, Lock, Zap, Shield, CreditCard } from 'lucide-react';
import styles from './Login.module.css';

const Login = () => {
  const [role, setRole] = useState('rider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      // Validate correct role for demo hints
      if (role === 'rider' && user.role !== 'rider') {
        throw new Error('Please login with rider account');
      }
      if (role === 'driver' && user.role !== 'driver') {
        throw new Error('Please login with driver account');
      }
      
      if (user.role === 'rider') navigate('/dashboard');
      else navigate('/driver');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setEmail(newRole === 'rider' ? 'rider@shuttleit.com' : 'driver@shuttleit.com');
    setPassword('demo');
    setError('');
  };

  return (
    <div className={styles.container}>
      {/* Left Hero Panel */}
      <div className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <h1 className={styles.brand}>ShuttleIT</h1>
          <p className={styles.tagline}>Move Smarter.</p>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.iconBox}><Zap size={20} /></div>
              <span>Instant booking</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconBox}><Shield size={20} /></div>
              <span>Safe rides</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconBox}><CreditCard size={20} /></div>
              <span>Easy payments</span>
            </div>
          </div>
        </div>
        <div className={styles.abstractShape}></div>
      </div>

      {/* Right Login Form */}
      <div className={styles.formPanel}>
        <div className={`${styles.formWrapper} animate-slide-up`}>
          <div className={styles.roleToggle}>
            <button 
              type="button"
              className={`${styles.toggleBtn} ${role === 'rider' ? styles.active : ''}`}
              onClick={() => handleRoleSwitch('rider')}
            >
              I'm a Rider
            </button>
            <button 
              type="button"
              className={`${styles.toggleBtn} ${role === 'driver' ? styles.active : ''}`}
              onClick={() => handleRoleSwitch('driver')}
            >
              I'm a Driver
            </button>
            <div className={styles.togglePill} style={{ transform: `translateX(${role === 'rider' ? '0' : '100%'})` }} />
          </div>

          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Please enter your details to sign in.</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <Input 
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
            />
            
            <Input 
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              error={error}
            />

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink} onClick={e => e.preventDefault()}>Forgot password?</a>
            </div>

            <Button 
              label="Sign In" 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={loading}
              disabled={!email || !password}
            />
          </form>

          <div className={styles.hint}>
            <p><strong>Demo Hint:</strong></p>
            <p>Rider: rider@shuttleit.com / demo</p>
            <p>Driver: driver@shuttleit.com / demo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
