function findConsecutiveSeats(availableSeats, count) {
  let selectedSeats = [];
  let currentRow = availableSeats[0]?.row_number;
  let consecutive = [];

  for (let i = 0; i < availableSeats.length; i++) {
    const seat = availableSeats[i];
    
    if (seat.row_number === currentRow) {
      consecutive.push(seat);
      if (consecutive.length === count) {
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
    selectedSeats = availableSeats.slice(0, count);
  }

  return selectedSeats;
}

module.exports = {
  findConsecutiveSeats
};