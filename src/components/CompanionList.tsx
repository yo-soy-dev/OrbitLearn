"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, getSubjectColor } from "@/lib/utils";
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
const CompanionsList = ({ title, companions, classNames, onViewSummary }: CompanionsListProps) => {
  const router = useRouter();

  return (
    <article className={cn("companion-list", classNames)}>
      <h2 className="font-bold text-3xl mb-4">{title ?? "Recent Sessions"}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg">Topic</TableHead>
            <TableHead className="text-right text-lg">Duration</TableHead>
            <TableHead className="text-left text-lg">Summary</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {companions.length > 0 ? (
            companions.map((c, index) => (
              <TableRow key={`${c.id}-${index}`}>
                {/* Lessons */}
                <TableCell>
                  <Link href={`/companions/${c.id}`}>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                        style={{ backgroundColor: getSubjectColor(c.subject) }}
                      >
                        <Image
                          src={`/icons/${c.subject}.svg`}
                          alt={c.subject}
                          width={35}
                          height={35}
                        />
                      </div>
                      <p className="font-bold text-2xl">{c.name}</p>
                    </div>
                  </Link>
                </TableCell>

                {/* Subject */}
                <TableCell>
                  <div className="subject-badge w-fit">{c.subject}</div>
                  <div
                    className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden"
                    style={{ backgroundColor: getSubjectColor(c.subject) }}
                  >
                    <Image
                      src={`/icons/${c.subject}.svg`}
                      alt={c.subject}
                      width={18}
                      height={18}
                    />
                  </div>
                </TableCell>

                {/* Topic */}
                <TableCell>
                  <p className="text-lg">{c.topic}</p>
                </TableCell>

                {/* Duration */}
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-2xl">
                      {c.duration} <span className="max-md:hidden">mins</span>
                    </p>
                    <Image
                      src="/icons/clock.svg"
                      alt="minutes"
                      width={14}
                      height={14}
                      className="md:hidden"
                    />
                  </div>
                </TableCell>

                {/* Summary / Confidence */}
                <TableCell>
                  {c.summary && c.summary.length > 0 
                  && onViewSummary
                   && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/viewsummary?id=${c.id}`)}
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                    </div>
                  )}
                </TableCell>
                {/* <TableCell>
                  {c.summary && c.summary.length > 0
                    ? c.summary.join(", ") // renders all points
                    : "No summary yet"}
                </TableCell> */}

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

export default CompanionsList;
