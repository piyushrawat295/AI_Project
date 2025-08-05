"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorsCard from "./SuggestedDoctorsCard";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<
    doctorAgent[] | null
  >(null);

  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

  const OnClickNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      console.log(result.data);
      setSuggestedDoctors(result.data);
      // Do not close the dialog here
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log(result.data);
    if (result.data?.sessionId) {
      console.log(result.data.sessionId);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button className="mt-3">Start a Consultation</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
        </DialogHeader>

        {!suggestedDoctors ? (
          <div className="space-y-2">
            <h2 className="text-sm text-muted-foreground">
              Add symptoms or any other details
            </h2>
            <Textarea
              placeholder="Add detail here..."
              className="h-[150px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <h2>Select the Doctor</h2>
            <div className="grid-grid-cols-3 gap-5">
              {suggestedDoctors.map((doctor, index) => (
                <SuggestedDoctorsCard
                  doctorAgent={doctor}
                  key={index}
                  setSelectedDoctor={() => setSelectedDoctor(doctor)}
                  //@ts-ignore
                  selectedDoctor={selectedDoctor}
                />
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={OnClickNext}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Next <ArrowRight className="ml-1" size={16} />
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={!selectedDoctor || loading}
              onClick={() => onStartConsultation()}
            >
              {loading ? "Loading..." : "Start Consultation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
