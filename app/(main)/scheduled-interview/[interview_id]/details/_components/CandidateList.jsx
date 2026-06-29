"use client";
import moment from "moment/moment";
import React from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";
import { SearchX, Trophy, Download, UserCheck, FileSpreadsheet, Users, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CandidateList({ candidate }) {
  const getAverageScore = (feedbackData) => {

    if (feedbackData?.requestID === null || feedbackData === null) {
      return 0;

    } else {
      const r = feedbackData?.feedback?.rating;
      const avg = (r.technicalSkills || 0) + (r.communication || 0) + (r.problemSolving || 0) + (r.experience || 0);
      return avg / 4;
    }
  };
  const rankedCandidates = candidate ? [...candidate].sort((a, b) =>
    getAverageScore(b.feedback) - getAverageScore(a.feedback)
  ) : [];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Candidate Ranking Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${moment().format("LL")}`, 14, 30);

    const tableRows = rankedCandidates.map((c, index) => {
      // Find whichever field contains the valid date timestamp
      const rawDate = c.created_at || c.createdAt;

      // If no date exists at all, show "N/A" instead of breaking or defaulting to today's date
      const formattedDate = rawDate ? moment(rawDate).format("DD MMM, YYYY") : "N/A";

      return [
        index + 1,
        c.userName ? c.userName.toUpperCase() : "UNKNOWN",
        c.userEmail || "N/A",
        getAverageScore(c.feedback).toFixed(1) + "/10",
        formattedDate
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Rank', 'Full Name', 'Email Address', 'AI Score', 'Interview Date']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }, // Blue-600
      styles: { fontSize: 10 },
    });

    doc.save("Ranking_Report.pdf");
  };

  if (!candidate) return <CandidateListSkeleton />;

  if (candidate.length === 0) {
    return (
      <div className="p-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white mt-5">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <SearchX className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Candidate Records</h3>
        <p className="text-sm">Candidates who complete the interview will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
              Candidate Pool
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Total <span className="text-blue-600">{candidate?.length}</span> participants screened by AI
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-6 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95">
              <Trophy className="h-5 w-5" /> Generate Ranking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col p-0 border-none">
            <DialogHeader className="p-8 bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 opacity-80" />
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">Performance Ranking</DialogTitle>
                  <DialogDescription className="text-blue-100">
                    Candidates sorted by AI evaluation score.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto p-8">
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-[100px] font-bold text-slate-800">Rank</TableHead>
                      <TableHead className="font-bold text-slate-800">Candidate</TableHead>
                      <TableHead className="font-bold text-slate-800 hidden md:table-cell">Email</TableHead>
                      <TableHead className="text-right font-bold text-slate-800">AI Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedCandidates.map((c, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/30 transition-colors border-slate-50">
                        <TableCell className="py-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${index === 0 ? "bg-amber-100 text-amber-700" :
                            index === 1 ? "bg-slate-100 text-slate-700" :
                              index === 2 ? "bg-orange-50 text-orange-700" : "text-slate-400"
                            }`}>
                            {index === 0 ? "1" : index === 1 ? "2" : index === 2 ? "3" : index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">{c.userName.toUpperCase()}</TableCell>
                        <TableCell className="text-slate-400 hidden md:table-cell text-sm">{c.userEmail}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {getAverageScore(c.feedback).toFixed(1)}/10
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t">
              <Button onClick={downloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 px-6">
                <Download className="h-4 w-4" /> Export Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main List Grid */}
      <div className="grid gap-3">
        {candidate.map((c, ind) => (
          <div
            key={ind}
            className="group p-5 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 gap-4"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="h-12 w-12 flex items-center justify-center bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transform group-hover:scale-110 transition-transform">
                {c.userName[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-slate-800 uppercase tracking-tight text-base">{c?.userName}</h2>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs font-medium">{moment(c?.createdAt).format("DD MMM, YYYY")}</span>                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-8 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                {c?.completionStatus === "Success" ? (<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {c?.completionStatus}
                </span>) : (<span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md mt-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {c?.completionStatus}
                </span>)}
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exit Reason</span>
                {c?.exitReason === "Completed" ? (<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {c?.exitReason}
                </span>) : (<span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md mt-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {c?.exitReason}
                </span>)}
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tab Switches</span>
                {c?.tabSwitches > 0 ? (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md mt-1 flex items-center gap-1">
                    ⚠️ {c?.tabSwitches} switches
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                    0 switches
                  </span>
                )}
              </div>
              <CandidateFeedbackDialog candidate={c} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateListSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-3xl" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
      </div>
    </div>
  );
}

export default CandidateList;