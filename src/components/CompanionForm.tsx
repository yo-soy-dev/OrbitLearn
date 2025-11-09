"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";
import { createCompanion } from "@/lib/actions/companion.actions";

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.string().min(1, { message: "Duration is required." }),
  goal: z.string().optional(),
});

const CompanionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: "",
      goal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion({
      ...values,
      duration: Number(values.duration),
    });

    if (companion) {
      redirect(`/companions/${companion.id}`);
    } else {
      console.log('Failed to create a companion');
      redirect('/');
    }
  };


  const subjects = ["maths", "language", "science", "history", "coding", "geography", "economics", "finance", "business"];


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Buddy Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the companion name"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="Select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        value={subject}
                        key={subject}
                        className="capitalize"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should the study buddy help with?</FormLabel>
              <FormControl>
                <Input placeholder="Ex. Derivates & Integrals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select the voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select the style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem> */}
        {/* )}
        /> */}

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Buddy Personality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutor">🎓 Tutor - Formal and structured</SelectItem>
                    <SelectItem value="coach">🏋️ Coach - Friendly and motivating</SelectItem>
                    <SelectItem value="storyteller">📖 Storyteller - Uses examples and stories</SelectItem>
                    <SelectItem value="socratic">💭 Socratic Mentor - Guides with questions</SelectItem>
                    <SelectItem value="motivator">🔥 Motivator - Energetic and positive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("style") && (
          <div className="mt-3 p-3 rounded-lg border bg-gray-50 text-sm italic transition-all duration-300">
            {form.watch("style") === "tutor" && (
              <>🧑‍🏫 I'll explain things step-by-step, like your favorite teacher.</>
            )}
            {form.watch("style") === "coach" && (
              <>💪 Let's crush this topic together — I'll keep you motivated!</>
            )}
            {form.watch("style") === "storyteller" && (
              <>📖 Let's explore through fun stories and examples!</>
            )}
            {form.watch("style") === "socratic" && (
              <>🤔 I'll guide you with questions to help you think deeply.</>
            )}
            {form.watch("style") === "motivator" && (
              <>🔥 You've got this! I'll keep you inspired while you learn.</>
            )}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="mt-2 text-sm"
          onClick={() => {
            const voiceType = form.watch("voice") || "female";
            const styleType = form.watch("style") || "tutor";
            const utterance = new SpeechSynthesisUtterance(
              `Hi, I'm your ${styleType} ${voiceType} companion!`
            );
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
          }}
        >
          🔊 Preview Voice
        </Button>




        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goal (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Understand the basics of algebra"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("goal") && (
          <div className="mt-3 text-sm text-gray-600">
            🎯 <span className="font-semibold">Learning Goal:</span> {form.watch("goal")}
          </div>
        )}



        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault(); // stop form submission
              try {
                localStorage.setItem("companionPreset", JSON.stringify(form.getValues()));
                // alert("✅ Preset saved successfully!");
              } catch (err) {
                console.error("Error saving preset:", err);
                // alert("❌ Failed to save preset");
              }
            }}
          >
            💾 Save Preset
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              try {
                const preset = localStorage.getItem("companionPreset");
                if (preset) {
                  form.reset(JSON.parse(preset));
                  // alert("♻️ Preset loaded!");
                } else {
                  // alert("⚠️ No preset found!");
                }
              } catch (err) {
                console.error("Error loading preset:", err);
                // alert("❌ Failed to load preset");
              }
            }}
          >
            ♻️ Load Preset
          </Button>
        </div>

        <Button type="submit" className="w-full cursor-pointer mt-4">
          🚀 Build Your Study Buddy
        </Button>
      </form>
    </Form>
  );
};

export default CompanionForm;
