# Ticket Booking System

A full-stack ticket booking application built with Next.js, Express.js, and PostgreSQL.

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Database Setup
1. Create a PostgreSQL database named 'ticket'
2. Update database credentials in `server/db.js`
3. Run the SQL migrations:
```sql
-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    row_number INT NOT NULL,
    seat_number INT NOT NULL,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_by INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    seat_id INT REFERENCES seats(id),
    booking_time TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP
);

-- Seed seats
DO $$
BEGIN
   FOR i IN 1..11 LOOP
       FOR j IN 1..7 LOOP
           INSERT INTO seats (row_number, seat_number) VALUES (i, j);
       END LOOP;
   END LOOP;
   FOR k IN 1..3 LOOP
       INSERT INTO seats (row_number, seat_number) VALUES (12, k);
   END LOOP;
END $$;
```

### Backend Setup
1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file:
```env
JWT_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6InRoYXJ1dW4gIiwiZXhwIjoxNzM1MzY0OTk5LCJpYXQiOjE3MzUzNjQ5OTl9.KMWUGJmnj4CTBBcGJg5qB4JKZpBO7wn2SBXuGLlGFU
PORT=5000
```

3. Start the server:
```bash
npm run server
```

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features
- User authentication (signup/login)
- Automatic seat allocation
- Real-time seat updates
- Booking management
- Responsive design

## Architecture
- Frontend: Next.js 13+ with App Router
- Backend: Express.js
- Database: PostgreSQL
- Real-time updates: WebSocket