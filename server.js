// Import modules
const express = require('express'); // Web framework for handling HTTP requests (login/register)
const bcrypt = require('bcryptjs'); // Library for securely handling passwords
const jwt = require('jsonwebtoken'); // Library for creating JSON Web Tokens to authenticate users
const { Pool } = require('pg'); // Loads PostgreSQL connection pool for database queries
require('dotenv').config(); // Loads environment variables

const app = express(); // Creates new express application
app.use(express.json()); // Makes sure app can read JSON data in HTTP requests

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Helper function to generate JWT tokens
// JWT is a small, secure token that proves a user is logged in
const generateToken = (userId) => {
  // Generates a token using userId, secret key from .env, and expires in 1 hour
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register Route
// Handles POST requests sent to /register when user signs up
app.post('/register', async (req, res) => {

  // Reads username and password from request body
  const { username, password } = req.body;

  // If either missing, return 400 Bad Request error
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Hash password
  try {
    const salt = await bcrypt.genSalt(10); // Generates random data (salt) to strengthen hash
    const hashedPassword = await bcrypt.hash(password, salt); // Encrypts password before storing it.

    // Runs SQL query to insert new user into users table
    // $1 and $2 are placeholders to prevent SQL injection
    // RETURNING id makes PostgreSQL return new user's ID
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    // Creates a JWT token for the new user
    const token = generateToken(result.rows[0].id);

    // Sends a 201 Created response with token
    res.status(201).json({ token, message: 'User registered successfully' });

  } catch (err) { // Error handling
    console.error('Error during registration:', err);  // Logs error to console
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
// Handles POST requests sent to /login when user tries to sign in
app.post('/login', async (req, res) => {

  // Reads username and password from request
  const { username, password } = req.body;

  // If either missing, return 400 Bad Request error
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    // Check if user exists by running SQL query
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    // If no user found, returns 400 Bad Request.
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Uses bcrypt.compare() to compare if the entered password matches hashed password.
    const isMatch = await bcrypt.compare(password, result.rows[0].password_hash);

    // If it doesn’t match, returns 400 Bad Request.
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(result.rows[0].id);

    // Returns it with 200 OK response.
    res.status(200).json({ token, message: 'Logged in successfully' });

  } catch (err) { // Error handling
    console.error('Error during login:', err); // Logs error to console
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
// Reads PORT from .env or defaults to 5090
const PORT = process.env.PORT || 5090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
