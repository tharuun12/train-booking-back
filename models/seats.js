const pool = require('../db');

const seatModel = {
  getAll: async () => {
    const query = `
      SELECT * FROM seats 
      ORDER BY row_number, seat_number
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  findAvailableSeats: async (client, count) => {
    const query = `
      SELECT id, row_number, seat_number 
      FROM seats 
      WHERE is_reserved = false 
      ORDER BY row_number, seat_number
    `;
    const result = await client.query(query);
    return result.rows;
  },

  reserveSeats: async (client, seatId, userId) => {
    const updateQuery = `
      UPDATE seats 
      SET is_reserved = true, reserved_by = $1 
      WHERE id = $2
    `;
    await client.query(updateQuery, [userId, seatId]);

    const bookingQuery = `
      INSERT INTO bookings (user_id, seat_id)
      VALUES ($1, $2)
    `;
    await client.query(bookingQuery, [userId, seatId]);
  },

  cancelReservation: async (client, seatIds, userId) => {
    const updateQuery = `
      UPDATE seats 
      SET is_reserved = false, reserved_by = NULL 
      WHERE id = ANY($1)
    `;
    await client.query(updateQuery, [seatIds]);

    const bookingQuery = `
      UPDATE bookings 
      SET cancelled_at = NOW() 
      WHERE seat_id = ANY($1) AND user_id = $2
    `;
    await client.query(bookingQuery, [seatIds, userId]);
  }
};

module.exports = seatModel;