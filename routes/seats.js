const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Get all seats
router.get('/', async (req, res) => {
  try {
    const seats = await pool.query(
      'SELECT * FROM seats ORDER BY row_number, seat_number'
    );
    res.json(seats.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book seats
router.post('/book', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { seatCount } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Find available seats in the same row
    const availableSeats = await client.query(
      `SELECT id, row_number, seat_number 
       FROM seats 
       WHERE is_reserved = false 
       ORDER BY row_number, seat_number`
    );

    if (availableSeats.rows.length < seatCount) {
      throw new Error('Not enough seats available');
    }

    // Find consecutive seats in the same row
    let selectedSeats = [];
    let currentRow = availableSeats.rows[0].row_number;
    let consecutive = [];

    for (let i = 0; i < availableSeats.rows.length; i++) {
      const seat = availableSeats.rows[i];
      
      if (seat.row_number === currentRow) {
        consecutive.push(seat);
        if (consecutive.length === seatCount) {
          selectedSeats = consecutive;
          break;
        }
      } else {
        consecutive = [seat];
        currentRow = seat.row_number;
      }
    }

    // If no consecutive seats found in same row, take any available seats
    if (selectedSeats.length === 0) {
      selectedSeats = availableSeats.rows.slice(0, seatCount);
    }

    // Book the selected seats
    for (const seat of selectedSeats) {
      await client.query(
        'UPDATE seats SET is_reserved = true, reserved_by = $1 WHERE id = $2',
        [userId, seat.id]
      );

      await client.query(
        'INSERT INTO bookings (user_id, seat_id) VALUES ($1, $2)',
        [userId, seat.id]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Seats booked successfully',
      seats: selectedSeats
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Cancel booking
router.post('/cancel', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { seatIds } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Verify seat ownership
    const seats = await client.query(
      'SELECT * FROM seats WHERE id = ANY($1) AND reserved_by = $2',
      [seatIds, userId]
    );

    if (seats.rows.length !== seatIds.length) {
      throw new Error('Invalid seat selection or unauthorized');
    }

    // Cancel bookings
    await client.query(
      'UPDATE seats SET is_reserved = false, reserved_by = NULL WHERE id = ANY($1)',
      [seatIds]
    );

    await client.query(
      'UPDATE bookings SET cancelled_at = NOW() WHERE seat_id = ANY($1) AND user_id = $2',
      [seatIds, userId]
    );

    await client.query('COMMIT');

    res.json({ message: 'Bookings cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Get user bookings
router.get('/user-bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await pool.query(
      `SELECT b.*, s.row_number, s.seat_number 
       FROM bookings b 
       JOIN seats s ON b.seat_id = s.id 
       WHERE b.user_id = $1 
       ORDER BY b.booking_time DESC`,
      [userId]
    );
    res.json(bookings.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;