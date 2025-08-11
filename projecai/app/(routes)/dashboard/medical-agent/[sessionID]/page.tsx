"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle } from "lucide-react";
import Image from "next/image";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

function MedicalVoiceAgent() {
  const [sessiondetails, setSessionDetails] = useState<SessionDetail>();
  const { sessionId } = useParams();

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`
      );
      console.log("Fetched session details:", result.data);
      setSessionDetails(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
        <h2 className="font-bold text-xl text-gray-450">00:00</h2>
      </div>

      {sessiondetails?.selectedDoctor?.image && (
        <Image
          src={sessiondetails.selectedDoctor.image}
          alt={sessiondetails.selectedDoctor.specialist || "Doctor"}
          width={200}
          height={200}
        />
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
