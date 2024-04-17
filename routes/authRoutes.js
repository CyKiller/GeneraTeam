const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // User model will automatically hash the password using bcrypt
    await User.create({ username, password });
    console.log('User registered successfully:', username);
    res.redirect('/'); // Redirect to the main page after successful registration
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login attempt failed: User not found', username);
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log('User logged in successfully:', username);
      return res.redirect('/'); // Redirect to the main page after successful login
    } else {
      console.log('Login attempt failed: Password is incorrect for user', username);
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err.message, err.stack);
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully');
    res.redirect('/auth/login'); // Redirect to the login page after successful logout
  });
});

module.exports = router;