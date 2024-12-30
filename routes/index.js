const express = require('express');
const authRoutes = require('./auth');
const seatRoutes = require('./seats');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/seats', seatRoutes);

module.exports = router;