"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

function Provider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<UsersDetail | null>(null);

  const getOrCreateUser = async () => {
    try {
      const res = await axios.get("/api/users");
      if (res.data) {
        setUserDetail(res.data);
      } else {
        const createRes = await axios.post("/api/users");
        setUserDetail(createRes.data);
      }
    } catch (error) {
      console.error("Error fetching/creating user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getOrCreateUser();
    }
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;
