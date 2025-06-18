const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const serviceAccount = require('./tour.json'); // Change this to your service account JSON file

const app = express();
const port = 3000;

// Enable CORS for all requests
app.use(cors());

// Initialize Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tourguide-3e3ac-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Enable CORS for all requests
app.use(cors());

// Parse request body as JSON
// Increase the payload limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Define a route for handling login requests
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match the expected values
  if (email === 'user@example.com' && password === 'password123') {
    // Generate a token and send it back to the client
    const token = jwt.sign({ email }, 'secret');
    res.status(200).json({ token });
  } else {
    // Return an error message if the login fails
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

/// Define a route for adding a new place
app.post('/places', (req, res) => {
  const placeData = req.body;

  // Get a reference to the Firebase Realtime Database
  const db = admin.database();
  const placesRef = db.ref('places'); // 'places' is the name of the collection in the database

  // Push the place data to the database
  placesRef.push(placeData)
    .then(() => {
      console.log('Place added successfully');
      res.status(200).json({ message: 'Place added successfully' });
    })
    .catch(error => {
      console.error('Error adding place:', error);
      res.status(500).json({ error: 'An error occurred while adding the place' });
    });
});

// Route to fetch all places
app.get('/place', (req, res) => {
  
  res.status(200).json(places);
});

// Route to fetch detailed information about a place based on its ID
app.get('/place-details', (req, res) => {
  const placeId = req.query.id;

  // Fetch the detailed information about the place using its ID
  const db = admin.database();
  const placesRef = db.ref('place');
  
  placesRef.child(placeId).once('value', snapshot => {
    const place = snapshot.val();
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  })
  .catch(error => {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'An error occurred while fetching place details' });
  });
});

// Route to fetch all hotels with their city
app.get('/hotels', (req, res) => {
  const db = admin.database();
  const hotelsRef = db.ref('hotels');

  hotelsRef.once('value', snapshot => {
    const hotels = [];
    snapshot.forEach(hotelSnapshot => {
      const hotel = hotelSnapshot.val();
      hotels.push({ name: hotel.name, city: hotel.city });
    });

    res.status(200).json(hotels);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
