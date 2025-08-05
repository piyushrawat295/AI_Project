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
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}. Based on these, suggest a list of doctors. Return a JSON object only.`,
        },
      ],
    });

    
    const rawResp = completion.choices[0].message;
    //@ts-ignore
    const Resp = rawResp.content.trim().replace('```json','').replace('```','')
    const JSONResp=JSON.parse(Resp)
    return NextResponse.json(JSONResp);
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
