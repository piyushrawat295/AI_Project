import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import moment from 'moment';
type Props = {
  historylist: SessionDetail[];
};
function HistoryTable({ historylist }: Props) {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Report</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historylist.map((record: SessionDetail, index: number) => (
  <TableRow key={record.id ?? index}>
    <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
    <TableCell>{record.notes}</TableCell>
    <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
    <TableCell className="text-right">
      <Button variant="link">View Report</Button>
    </TableCell>
  </TableRow>
))}

        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
