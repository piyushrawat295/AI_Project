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
  const { sessionId } = useParams() as { sessionId: string };
  console.log("sessionId:", sessionId);


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

  // Helper to normalize image path
  const getDoctorImageSrc = () => {
    const img = sessiondetails?.selectedDoctor.image;
    if (!img) return "/default-doctor.png"; // fallback image in /public
    if (img.startsWith("http")) return img; // remote URL
    return img.startsWith("/") ? img : `/${img}`; // local path
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
        <h2 className="font-bold text-xl text-gray-450">00:00</h2>
      </div>

      {sessiondetails && (
        <div>
          <Image
            src={getDoctorImageSrc()}
            alt={sessiondetails?.selectedDoctor.specialist || "Doctor"}
            width={80}
            height={80}
            className="h-auto"
            priority // speeds up loading if visible immediately
          />
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
