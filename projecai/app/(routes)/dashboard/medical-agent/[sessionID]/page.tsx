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

type Msg = { role: string; text: string };

function MedicalVoiceAgent() {
  const { sessionId } = useParams() as { sessionId: string };

  const [sessiondetails, setSessionDetails] = useState<SessionDetail>();
  const [callstarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);

  // fetch session details
  useEffect(() => {
    if (sessionId) GetSessionDetails();

    return () => {
      if (vapiInstance) {
        try {
          vapiInstance.stop();
          vapiInstance.removeAllListeners();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
      setSessionDetails(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const StartCall = () => {
    if (vapiInstance) {
      console.warn("Vapi already running; ignoring StartCall");
      return;
    }

    const vapi = new Vapi("aa881f92-b01a-4555-8003-480a8a931dcf");
    setVapiInstance(vapi);

    // safe fallbacks
    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I am your Medical Assistant. I am here to help you.",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: sessiondetails?.selectedDoctor?.voiceid || "Kylie", // fallback
      },
      model: {
        provider: "google",
        model: "gemini-2.5-flash", // must be valid model name
        messages: [
          {
            role: "system",
            content:
              sessiondetails?.selectedDoctor?.agentPrompt ||
              "You are a helpful medical assistant.",
          },
        ],
      },
    };

    // --- event handlers ---
    vapi.on("call-start", () => {
      console.log("Vapi call started");
      setCallStarted(true);
      setCurrentRole("assistant");
    });

    vapi.on("call-end", () => {
      console.log("Vapi call ended");
      setCallStarted(false);
      setCurrentRole(null);
      setLiveTranscript("");
    });

    vapi.on("error", (err: any) => {
      console.error("Vapi error:", err?.message || err);
      setCallStarted(false);
      setCurrentRole(null);
    });

    vapi.on("message", (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript || "");
          setCurrentRole(role || null);
        } else if (transcriptType === "final") {
          if (transcript) {
            setMessages((prev) => [...prev, { role, text: transcript }]);
          }
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }

      if (message.type === "response" && message.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: message.text },
        ]);
      }
    });

    vapi.on("speech-start", () => setCurrentRole("assistant"));
    vapi.on("speech-end", () => setCurrentRole("user"));

    try {
      //@ts-ignore
      vapi.start(VapiAgentConfig);
    } catch (e) {
      console.error("Failed to start Vapi:", e);
    }
  };

  const EndCall = () => {
    if (!vapiInstance) return;
    try {
      vapiInstance.stop();
      vapiInstance.removeAllListeners();
    } catch (err) {
      console.error("Vapi stop error:", err);
    } finally {
      setCallStarted(false);
      setCurrentRole(null);
      setLiveTranscript("");
      setVapiInstance(null);
    }
  };

  const getDoctorImageSrc = () => {
    const img = sessiondetails?.selectedDoctor.image;
    if (!img) return "/default-doctor.png";
    if (img.startsWith("http")) return img;
    return img.startsWith("/") ? img : `/${img}`;
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
            className="h-[100px] w-[100px] object-cover rounded-full"
            priority
          />
          <h2 className="mt-2 text-lg">
            {sessiondetails?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-10 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages.slice(-5).map((msg, index) => (
              <h2 className="text-gray-400" key={index}>
                {msg.role}: {msg.text}
              </h2>
            ))}
            {liveTranscript && (
              <h2 className="text-lg">
                {currentRole} : {liveTranscript}
              </h2>
            )}
          </div>

          {!callstarted ? (
            <Button className="mt-10" onClick={StartCall}>
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="mt-10"
              onClick={EndCall}
            >
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
