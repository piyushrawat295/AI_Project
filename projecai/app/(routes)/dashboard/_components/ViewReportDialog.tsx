import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";

type Props = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: Props) {
  const report: any = record?.report || {};
  const formatDate = moment(record?.createdOn).format("MMM Do YYYY, h:mm a");

  // Utility function to render list data or fallback
  const renderList = (items?: string[], emptyMsg?: string) =>
    items?.length ? (
      <ul className="list-disc pl-5 text-sm">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">{emptyMsg || "No data available"}</p>
    );

  // Utility function to render key-value pairs
  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <p>
      <span className="font-semibold">{label}: </span>
      {value || "N/A"}
    </p>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">View Report</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-2xl font-bold text-blue-600">
              Medical AI Voice Assistant Report
            </h2>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="mt-6 space-y-6">
              {/* Session Info */}
              <section>
                <h2 className="font-bold text-lg text-blue-500 mb-2">
                  Session Info
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <InfoRow label="Session ID" value={record.sessionId} />
                  <InfoRow
                    label="Doctor Specialization"
                    value={record.selectedDoctor?.specialist}
                  />
                  <InfoRow label="User" value={report.user} />
                  <InfoRow label="Consult Date" value={formatDate} />
                </div>
              </section>

              {/* Medical Details */}
              <section>
                <h2 className="font-bold text-lg text-blue-500 mb-2">
                  Medical Details
                </h2>
                <div className="space-y-2 text-sm">
                  <InfoRow
                    label="Chief Complaint"
                    value={report.chiefComplaint}
                  />
                  <InfoRow label="Summary" value={report.summary} />
                  <InfoRow
                    label="Symptoms"
                    value={
                      report.symptoms?.length
                        ? report.symptoms.join(", ")
                        : "N/A"
                    }
                  />
                  <InfoRow label="Duration" value={report.duration} />
                  <InfoRow label="Severity" value={report.severity} />
                </div>
              </section>

              {/* Medications */}
              <section>
                <h2 className="font-bold text-lg text-blue-500 mb-2">
                  Medications Mentioned
                </h2>
                {renderList(report.medicationsMentioned, "No medications mentioned")}
              </section>

              {/* Recommendations */}
              <section>
                <h2 className="font-bold text-lg text-blue-500 mb-2">
                  Recommendations
                </h2>
                {renderList(report.recommendations, "No recommendations available")}
              </section>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
