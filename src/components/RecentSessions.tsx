"use client";
import CompanionsList from "./CompanionList";
import { useState } from "react";

interface RecentSessionsProps {
    sessions: Companion[];
}
export default function RecentSessions({ sessions }: RecentSessionsProps) {
    const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
    return (
        <>
            <CompanionsList title="Recent Sessions" companions={sessions} onViewSummary={(c) => setSelectedSummary(c.summary?.join("\n") || "No summary yet")} />
            {selectedSummary && (
                <div className="modal">
                    <pre>{selectedSummary}</pre>
                    <button onClick={() => setSelectedSummary(null)}>Close</button>
                </div>
            )}
        </>
    );
}