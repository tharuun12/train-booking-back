"use client";

import { useEffect, useState } from "react";
import { seats } from "@/app/lib/api";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Clock, Ban, CreditCard } from "lucide-react";

interface Booking {
  id: number;
  seat_id: number;
  row_number: number;
  seat_number: number;
  booking_time: string;
  cancelled_at: string | null;
}

export default function UserDetailsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState({
    totalBooked: 0,
    totalCancelled: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await seats.getUserBookings();
      setBookings(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  };

  const calculateSummary = (bookingData: Booking[]) => {
    const totalBooked = bookingData.length;
    const totalCancelled = bookingData.filter(b => b.cancelled_at).length;
    // Assuming each ticket costs $10
    const totalAmount = (totalBooked - totalCancelled) * 10;

    setSummary({
      totalBooked,
      totalCancelled,
      totalAmount,
    });
  };

  const handleCancel = async (seatId: number) => {
    try {
      await seats.cancel([seatId]);
      toast.success("Booking cancelled successfully");
      await fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const activeBookings = bookings.filter((b) => !b.cancelled_at);
  const cancelledBookings = bookings.filter((b) => b.cancelled_at);

  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        </div>
        
        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Total Bookings</h3>
            </div>
            <p className="text-2xl font-bold">{summary.totalBooked}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <Ban className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">Cancelled Bookings</h3>
            </div>
            <p className="text-2xl font-bold">{summary.totalCancelled}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Total Amount</h3>
            </div>
            <p className="text-2xl font-bold">Rs {summary.totalAmount}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Active Bookings */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Active Bookings</h2>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        Row {booking.row_number}, Seat {booking.seat_number}
                      </p>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <p className="text-sm">
                          Booked on: {formatDate(booking.booking_time)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-green-600">
                        Amount: rs10
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(booking.seat_id)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              ))}
              {activeBookings.length === 0 && (
                <p className="text-gray-500">No active bookings</p>
              )}
            </div>
          </section>

          {/* Booking History */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
            <div className="space-y-4">
              {cancelledBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      Row {booking.row_number}, Seat {booking.seat_number}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <p className="text-sm">
                        Booked on: {formatDate(booking.booking_time)}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Ban className="h-4 w-4 mr-2" />
                      <p className="text-sm">
                        Cancelled on: {formatDate(booking.cancelled_at!)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {cancelledBookings.length === 0 && (
                <p className="text-gray-500">No cancelled bookings</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}