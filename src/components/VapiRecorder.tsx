"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VapiRecorder({ companionId }: { companionId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleEndSession(transcript: string) {
        try {
            setLoading(true);
            await fetch("/api/vapi/record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companionId, transcript }),
            });

            
            await new Promise(r => setTimeout(r, 1500));

            router.refresh();

        } catch (err) {
            console.error("Error saving session:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button>

        </button>
    );
}
