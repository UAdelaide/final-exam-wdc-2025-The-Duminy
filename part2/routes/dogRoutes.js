const express = require('express');
const router = express.Router();
const db = require('../models/db');

app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

module.exports = router;
