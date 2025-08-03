"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name: string,
  emial: string,
  credits: number
}
function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>()

  const createNewUser = async () => {
    try {
      const res = await axios.post("/api/users");
      console.log("User result:", res.data);
      setUserDetail(res.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  return <div>
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
    {children}
    </UserDetailContext.Provider>
    </div>;
}

export default Provider;
