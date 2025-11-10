"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

interface Companion {
  id: string;
  subject: string;
  name: string;
  topic: string;
  duration: number;
  summary?: string[];
  takeaways?: string[];
  next_steps?: string[];
  confidence_score?: number;
  exists?: boolean;
}

interface CompanionsListProps {
  title?: string;
  companions: Companion[];
  classNames?: string;
  onViewSummary?: (companion: Companion) => void;
}

const Summary = ({ title, companions, classNames, onViewSummary }: CompanionsListProps) => {
  const router = useRouter();

  return (
    <article className={cn("companion-list", classNames)}>
      <h2 className="font-bold text-3xl mb-4">{title ?? "Summary"}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lesson</TableHead>
            <TableHead className="text-left text-lg">Summary</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {companions.length > 0 ? (
            companions.map((c, index) => (
              <TableRow key={`${c.id}-${index}`}>
                {/* ===== Lesson Box ===== */}
                <TableCell>
                  <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                    <Link href={`/companions/${c.id}`} className="block">
                      <p className="text-lg font-semibold text-gray-800">{c.topic}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Subject: {c.subject} • Duration: {c.duration} mins
                      </p>
                    </Link>
                  </div>
                </TableCell>

                {/* ===== Summary Box ===== */}
                <TableCell>
                  <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center justify-between">
                    {c.summary && c.summary.length > 0 ? (
                      <>
                        <button
                          onClick={() => router.push(`/viewsummary?id=${c.id}`)}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-all duration-200"
                        >
                          🧾 View Summary
                        </button>

                        {c.confidence_score !== undefined && (
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              c.confidence_score > 80
                                ? "bg-green-100 text-green-800"
                                : c.confidence_score > 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {c.confidence_score}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm italic">No summary available</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-lg text-muted-foreground"
              >
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </article>
  );
};

export default Summary;
