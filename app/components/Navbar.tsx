"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import UserInfo from "@/app/components/UserInfo";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center px-2 text-xl font-semibold">
              Ticket Booking
            </Link>
          
          </div>
          <UserInfo />
          <div className="flex items-center space-x-4">
            <Link href="/user-details">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                My Bookings
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
          </div>
        </div>
      </div>
    </nav>
  );
}