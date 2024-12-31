"use client";
import { useAuth } from "@/app/lib/hooks/useAuth";
import SeatMap from "@/app/components/SeatMap";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function DashboardPage() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Book Your Seats</h1>
      </div>
      <SeatMap />
    </>
  );
}