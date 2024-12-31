"use client";

import { useEffect, useState } from "react";
import { seats } from "@/app/lib/api";
import { WebSocketService } from "@/app/lib/websocket";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Seat {
  id: number;
  row_number: number;
  seat_number: number;
  is_reserved: boolean;
}

export default function SeatMap() {
  const [seatData, setSeatData] = useState<Seat[]>([]);
  const [seatCount, setSeatCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocketService("wss:https://mohantrain-928y.vercel.app/", (data) => {
      if (data.type === "SEAT_UPDATE") {
        fetchSeats();
      }
    });

    ws.connect();
    fetchSeats();

    return () => ws.disconnect();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await seats.getAll();
      setSeatData(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
      toast.error("Failed to fetch seats");
    }
  };

  const handleBooking = async () => {
    if (seatCount < 1 || seatCount > 7) {
      toast.error("Please select between 1 and 7 seats");
      return;
    }

    try {
      setLoading(true);
      const response = await seats.book(seatCount);
      await fetchSeats();
      
      const bookedSeats = response.data.seats;
      const seatInfo = bookedSeats.map(
        (seat: Seat) => `Row ${seat.row_number}, Seat ${seat.seat_number}`
      ).join(", ");
      
      setBookingStatus(`Successfully booked: ${seatInfo}`);
      toast.success("Seats booked successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book seats");
      setBookingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Book Your Seats</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Seats (1-7)
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={seatCount}
              onChange={(e) => setSeatCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <Button 
            onClick={handleBooking} 
            disabled={loading || seatCount < 1 || seatCount > 7}
            className="mt-6"
          >
            {loading ? "Booking..." : "Book Seats"}
          </Button>
        </div>

        {bookingStatus && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <p className="text-green-700">{bookingStatus}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Seat Map</h2>
        <div className="grid grid-cols-7 gap-2">
          {seatData.map((seat) => (
            <div
              key={seat.id}
              className={`p-4 rounded-lg text-center ${
                seat.is_reserved 
                  ? "bg-gray-200 text-gray-500" 
                  : "bg-green-100 text-green-800"
              }`}
            >
              {seat.row_number}-{seat.seat_number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}