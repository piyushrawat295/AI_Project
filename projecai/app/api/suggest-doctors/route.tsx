import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notes } = body;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You are a medical assistant. Based on symptoms, suggest the best matching doctor specialists from the provided list: " +
            AIDoctorAgents.map(d => d.specialist).join(", "),
        },
        {
          role: "user",
          content: `User symptoms: ${notes}. Return an array of specialists (e.g. ["General Physician","Dermatologist"]).`,
        },
      ],
    });

    const rawResp = completion.choices[0].message?.content || "[]";
    const suggestedSpecialists = JSON.parse(rawResp);

    // Map back to original list so images/desc stay intact
    const finalDoctors = AIDoctorAgents.filter(d =>
      suggestedSpecialists.includes(d.specialist)
    );

    return NextResponse.json(finalDoctors);
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
