"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const { user } = useUser();

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch("/api/user/plan");
      const data = await res.json();
      setUserPlan(data.plan || "free");
    };
    fetchPlan();
  }, []);

  const handleCheckout = async (plan: string) => {
    try {
      setLoading(plan);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Basic Plan",
      plan: "free",
      tagline: "Perfect for testing the waters",
      price: "$0",
      features: ["10 Conversations/month", "3 Active Companions", "Basic Recaps"],
    },
    {
      name: "Core Learner",
      plan: "core",
      tagline: "More Companions. More growth.",
      price: "$19",
      features: [
        "Everything in free",
        "Unlimited Conversations",
        "10 Active Companions",
        "Save Conversation History",
      ],
    },
    {
      name: "Pro Companion",
      plan: "pro",
      tagline: "Your personal AI academy.",
      price: "$39",
      features: [
        "Everything in core",
        "Unlimited Companions",
        "Performance Dashboard",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Choose Your Plan</h1>
      <p className="text-gray-500 mb-10 text-center max-w-xl">
        Upgrade or downgrade anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div key={plan.name} className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all">
            {userPlan === plan.plan && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Active
              </span>
            )}

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-gray-500 mt-1">{plan.tagline}</p>
              <p className="text-4xl font-bold mt-4">{plan.price}</p>

              <ul className="space-y-2 mt-6 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.plan)}
                disabled={userPlan === plan.plan || loading === plan.plan}
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  userPlan === plan.plan
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {loading === plan.plan
                  ? "Redirecting..."
                  : userPlan === plan.plan
                  ? "Current Plan"
                  : "Choose Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
