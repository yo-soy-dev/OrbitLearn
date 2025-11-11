"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

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
      tagline: "Perfect for testing the waters",
      price: "$0",
      subtext: "Always free",
      features: [
        "10 Conversations/month",
        "3 Active Companions",
        "Basic Session Recaps",
      ],
      button: "Switch to this plan",
      active: false,
      upcoming: false,
      plan: "free",
    },
    {
      name: "Core Learner",
      tagline: "More Companions. More growth.",
      price: "$19",
      subtext: "/month",
      billed: "Billed annually",
      features: [
        "Everything in free",
        "Unlimited Conversations",
        "10 Active Companions",
        "Save Conversation History",
        "Inline Quizzes & Recaps",
        "Monthly Progress Report",
      ],
      button: "Switch to this plan",
      active: false,
      upcoming: true,
      plan: "core",
    },
    {
      name: "Pro Companion",
      tagline: "Your personal AI Powered academy.",
      price: "$39",
      subtext: "/month",
      billed: "Billed annually",
      features: [
        "Everything in core",
        "Unlimited Companions",
        "Full Performance Dashboard",
        "Daily Learning Reminders",
        "Early Access to new features",
        "Priority Supports",
      ],
      button: "Resubscribe",
      active: true,
      upcoming: false,
      plan: "pro",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Choose Your Plan</h1>
      <p className="text-gray-500 mb-10 text-center max-w-xl">
        Select the plan that best fits your learning journey. Upgrade or
        downgrade anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            {plan.active && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Active
              </span>
            )}
            {plan.upcoming && (
              <span className="absolute top-3 right-3 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                Upcoming
              </span>
            )}

            <div className="p-6 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-gray-500 mt-1">{plan.tagline}</p>

              <div className="flex items-end mt-6 mb-3">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 ml-1">{plan.subtext}</span>
              </div>

              {plan.billed && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  {plan.billed}
                </div>
              )}

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {plan.upcoming && (
              <div className="px-6 pb-4 text-sm text-gray-500">
                Starts Nov 4, 2026
              </div>
            )}

            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => handleCheckout(plan.plan)}
                disabled={plan.active || loading === plan.plan}
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  plan.active
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:primary/90"
                }`}
              >
                {loading === plan.plan ? "Redirecting..." : plan.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
