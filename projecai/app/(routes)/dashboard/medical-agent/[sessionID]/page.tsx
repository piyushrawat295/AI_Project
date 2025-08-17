"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};
type messages = {
  role: string;
  text: string;
};
function MedicalVoiceAgent() {
  const [sessiondetails, setSessionDetails] = useState<SessionDetail>();
  const { sessionId } = useParams() as { sessionId: string };
  console.log("sessionId:", sessionId);
  const [callstarted, setcallstarted] = useState(false);
  const [vapiInstance, setVapiinstance] = useState<any>();
  const [currentRole, setcurrentRole] = useState<string | null>();

  const [livetranscript, setLivetranscript] = useState<string>();
  const [messages, setmessages] = useState<messages[]>([]);
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

  // const StartCall = () => {
  //   const vapi = new Vapi("aa881f92-b01a-4555-8003-480a8a931dcf");
  //   setVapiinstance(vapi);

  //   vapi.start("621ff765-691b-4386-b018-ad5774576a62");

  //   vapi.on("call-start", () => {
  //     console.log("Call started");
  //     setcallstarted(true);
  //   });

  //   vapi.on("call-end", () => {
  //     console.log("Call ended");
  //     setcallstarted(false);
  //   });

  //   vapi.on("message", (message) => {
  //     if (message.type === "transcript") {
  //       const { role, transcriptType, transcript } = message;

  //       if (transcriptType === "partial") {
  //         setLivetranscript(transcript);
  //         setcurrentRole(role);
  //       } else if (transcriptType === "final") {
  //         setmessages((prev) => [...prev, { role, text: transcript }]);
  //         setLivetranscript("");
  //         setcurrentRole(null);
  //       }
  //     }
  //   });

  //   vapi.on("speech-start", () => {
  //     console.log("Assistant started speaking");
  //     setcurrentRole("assistant");
  //   });

  //   vapi.on("speech-end", () => {
  //     console.log("Assistant stopped speaking");
  //     setcurrentRole("user");
  //   });
  // };

  const StartCall = () => {
    const vapi = new Vapi("aa881f92-b01a-4555-8003-480a8a931dcf");
    setVapiinstance(vapi);

    vapi.start("621ff765-691b-4386-b018-ad5774576a62");

    vapi.on("call-start", () => {
      console.log("Call started");
      setcallstarted(true);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setcallstarted(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;

        if (transcriptType === "partial") {
          setLivetranscript(transcript);
          setcurrentRole(role);
        } else if (transcriptType === "final") {
          setmessages((prev) => [...prev, { role, text: transcript }]);
          setLivetranscript("");
          setcurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setcurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setcurrentRole("user");
    });
  };

  const EndCall = () => {
  if (!vapiInstance) return;
  try {
    console.log("Ending Call..");
    vapiInstance.stop();
    vapiInstance.removeAllListeners(); // cleaner way
    setcallstarted(false);
    setVapiinstance(null);
  } catch (err) {
    console.error("Vapi stop error:", err);
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
    <div className="p-4 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 ${
              callstarted ? "text-green-500" : "text-red-500"
            }`}
          />

          {callstarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessiondetails && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={getDoctorImageSrc()}
            alt={sessiondetails?.selectedDoctor.specialist || "Doctor"}
            width={120}
            height={120}
            className="h-[100px] w-[100px]  object-cover rounded-full"
            priority // speeds up loading if visible immediately
          />
          <h2 className="mt-2 text-lg">
            {sessiondetails?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-35">
            {messages?.map((msg, index) => (
              <h2 className="text-gray-400" key={index}>
                {msg.role}:{msg.text}
              </h2>
            ))}
            <h2 className="text-gray-400">Assistant Msg</h2>
            {livetranscript && livetranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole} :{livetranscript}
              </h2>
            )}
          </div>

          {!callstarted ? (
            <Button className="mt-20" onClick={StartCall}>
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button variant="destructive" className="mt-20" onClick={EndCall}>
              <PhoneOff />
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
