const pool = require('../db');

const bookingModel = {
  getUserBookings: async (userId) => {
    const query = `
      SELECT b.*, s.row_number, s.seat_number 
      FROM bookings b 
      JOIN seats s ON b.seat_id = s.id 
      WHERE b.user_id = $1 
      ORDER BY b.booking_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  create: async (client, userId, seatId) => {
    const query = `
      INSERT INTO bookings (user_id, seat_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await client.query(query, [userId, seatId]);
    return result.rows[0];
  }
};

module.exports = bookingModel;