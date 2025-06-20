const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const session = require('express-session'); //Q13 Edit

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
//Q13 Edits Begin here
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
//Q13 Edits End here

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;