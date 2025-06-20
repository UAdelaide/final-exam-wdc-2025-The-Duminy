const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

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

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time,
             WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username
      FROM WalkRequests
      JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
      JOIN Users ON Dogs.owner_id = Users.user_id
      WHERE WalkRequests.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Users.username AS walker_username,
             COUNT(WalkRatings.rating_id) AS total_ratings,
             ROUND(AVG(WalkRatings.rating), 1) AS average_rating,
             (
               SELECT COUNT(*)
               FROM WalkApplications
               JOIN WalkRequests ON WalkApplications.request_id = WalkRequests.request_id
               WHERE WalkApplications.walker_id = Users.user_id AND WalkRequests.status = 'completed'
             ) AS completed_walks
      FROM Users
      LEFT JOIN WalkRatings ON Users.user_id = WalkRatings.walker_id
      WHERE Users.role = 'walker'
      GROUP BY Users.user_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await insertTestData();
});