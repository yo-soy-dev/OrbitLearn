"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Cta = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleBuildClick = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/check-subscription");
      const data = await res.json();

      if (data.active) {
        router.push("/companions/new"); 
      } else {
        router.push("/pricing"); 
      }
    } catch (err) {
      console.error("Subscription check failed:", err);
      router.push("/pricing"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning your way.</div>
      <h2 className="text-3xl font-bold">
        Build and Personalize Your Study Buddy
      </h2>
      <p>
        Pick a name, subject, voice, & personality — and start learning
        through voice conversations that feel natural and fun.
      </p>
      <Image src="images/cta.svg" alt="cta" width={362} height={232} />
      <button className="btn-primary">
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <Link href="/companions/new">
          <p>Build a New Study Buddy</p>
        </Link>
      </button>
      {/* <button
        onClick={handleBuildClick}
        className="btn-primary mt-6 flex items-center gap-2 justify-center"
        disabled={loading}
      >
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <p>{loading ? "Checking..." : "Build a New Study Buddy"}</p>
      </button> */}
    </section> 
  );
};

export default Cta;