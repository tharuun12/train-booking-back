"use client";

import { useEffect, useState } from 'react';

export default function UserInfo() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <div className="flex items-center px-2 text-xl font-semibold">
      Welcome, {userName}
    </div>
  );
}