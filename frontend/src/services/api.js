// Mock realistic Promise delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockUser = {
  id: 'u123',
  name: 'Alex Sterling',
  email: 'rider@shuttleit.com',
  role: 'rider',
  avatar: 'AS'
};

const mockDriver = {
  id: 'd456',
  name: 'Sarah Chen',
  email: 'driver@shuttleit.com',
  role: 'driver',
  avatar: 'SC'
};

let rideCounter = 1;

export const loginUser = async (email, password) => {
  await delay(800);
  if (email === 'driver@shuttleit.com' && password === 'demo') {
    return mockDriver;
  }
  if (email === 'rider@shuttleit.com' && password === 'demo') {
    return mockUser;
  }
  throw new Error('Invalid credentials');
};

let pastRides = [
  { id: 'r1', pickup: 'Cyber City, Gurugram', dropoff: 'Connaught Place, Delhi', date: 'Oct 10, 2:30 PM', fare: 850, status: 'completed', driverName: 'Rahul K', driverAvatar: 'RK', distance: '6.5 km', duration: '25 min' },
  { id: 'r2', pickup: 'T3 IGI Airport', dropoff: 'Cyber City, Gurugram', date: 'Oct 8, 11:15 AM', fare: 1400, status: 'completed', driverName: 'Arjun S', driverAvatar: 'AS', distance: '18 km', duration: '40 min' },
  { id: 'r3', pickup: 'Gateway of India', dropoff: 'Marine Drive, Mumbai', date: 'Oct 1, 4:00 PM', fare: 500, status: 'completed', driverName: 'Vikram D', driverAvatar: 'VD', distance: '3.5 km', duration: '15 min' }
];

export const getRides = async () => {
  await delay(600);
  return [...pastRides];
};

const ongoingRides = {};

export const requestRide = async (pickup, dropoff, fareAmount = 850) => {
  await delay(1200);
  const rideId = `ride_${rideCounter++}`;
  
  ongoingRides[rideId] = {
    id: rideId,
    pickup,
    dropoff,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    fare: fareAmount,
    distance: '12 km',
    duration: '35 min',
    stepIndex: 0,
    status: 'searching'
  };
  
  return { 
    rideId, 
    eta: '8 min', 
    fare: fareAmount, 
    driver: null 
  };
};

export const getRideStatus = async (rideId) => {
  await delay(400);
  
  const ride = ongoingRides[rideId];
  if (!ride) return { status: 'en_route', driverLocation: {lat:0, lng:0}, eta: '0 min', driver: null };
  
  const statuses = ['searching', 'confirmed', 'en_route', 'arrived', 'completed'];
  
  if (ride.stepIndex < statuses.length - 1) {
    ride.stepIndex++;
    ride.status = statuses[ride.stepIndex];
    if (ride.status === 'completed' && !pastRides.find(r => r.id === rideId)) {
       pastRides = [{
         id: ride.id,
         pickup: ride.pickup,
         dropoff: ride.dropoff,
         date: ride.date,
         fare: ride.fare,
         status: 'completed',
         driverName: 'Priya Sharma',
         driverAvatar: 'PS',
         distance: ride.distance,
         duration: ride.duration
       }, ...pastRides];
    }
  }

  const driver = (ride.status !== 'searching') ? { name: 'Priya Sharma', rating: '4.87', car: 'White Innova Crysta', plate: 'MH 01 AB 1234', avatar: 'PS' } : null;
  const eta = ride.status === 'arrived' ? '0 min' : ride.status === 'completed' ? '-' : '4 min';

  return { 
    status: ride.status, 
    driverLocation: { lat: 37.7749, lng: -122.4194 }, 
    eta,
    driver
  };
};

export const getDriverTrips = async () => {
  await delay(700);
  return [
    { id: 't1', pickup: 'Cyber City, Gurugram', dropoff: 'Connaught Place, Delhi', date: 'Oct 10, 2:30 PM', fare: 850, status: 'completed', role: 'driver', driverName: 'Rajeev Nair', driverAvatar: 'RN' },
    { id: 't2', pickup: 'UB City, Bengaluru', dropoff: 'Koramangala, Bengaluru', date: 'Oct 10, 1:00 PM', fare: 450, status: 'completed', role: 'driver', driverName: 'Aisha K', driverAvatar: 'AK' }
  ];
};

export const acceptTrip = async (tripId) => {
  await delay(800);
  return { id: tripId, status: 'en_route' };
};
