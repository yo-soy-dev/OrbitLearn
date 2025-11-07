// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"
// import { subjectsColors, voices, /* voices */ } from "@/constants";
// import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
// // import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }


// export const getSubjectColor = (subject: string) => {
//   return subjectsColors[subject as keyof typeof subjectsColors];
// };

// export const configureAssistant = (voice: string, style: string) => {
//   const voiceId =
//     voices[voice as keyof typeof voices][
//       style as keyof (typeof voices)[keyof typeof voices]
//     ] || "sarah";

//   const vapiAssistant: CreateAssistantDTO = {
//     name: "Companion",
//     firstMessage:
//       "Hello, let's start the session. Today we'll be talking about {{topic}}.",
//     transcriber: {
//       provider: "deepgram",
//       model: "nova-3",
//       language: "en",
//     },
//     voice: {
//       provider: "11labs",
//       voiceId: voiceId,
//       stability: 0.4,
//       similarityBoost: 0.8,
//       speed: 1,
//       style: 0.5,
//       useSpeakerBoost: true,
//     },
//     model: {
//       provider: "openai",
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.
  
//                     Tutor Guidelines:
//                     Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
//                     Keep the conversation flowing smoothly while maintaining control.
//                     From time to time make sure that the student is following you and understands you.
//                     Break down the topic into smaller parts and teach the student one part at a time.
//                     Keep your style of conversation {{ style }}.
//                     Keep your responses short, like in a real voice conversation.
//                     Do not include any special characters in your responses - this is a voice conversation.
//               `,
//         },
//       ],
//     },

// };

//   return vapiAssistant;
// };


// // export const getAssistantOverrides = (subject: string, topic: string, style: string) => ({
// //   variableValues: {
// //     subject,
// //     topic,
// //     style,
// //   },
// //   clientMessages: ['transcript'] as const,
// //   serverMessages: [],
// // });

// export const getPersonalityPrompt = (style: string) => {
//   switch (style) {
//     case "tutor":
//       return "You are a calm and knowledgeable tutor. Explain concepts in a clear, step-by-step manner with examples when needed.";
//     case "coach":
//       return "You are an encouraging learning coach. Use a friendly tone, emojis, and positive reinforcement to keep the learner motivated.";
//     case "storyteller":
//       return "You are a creative storyteller who teaches using analogies, short stories, and fun comparisons.";
//     case "socratic":
//       return "You are a Socratic mentor. Instead of giving direct answers, guide the learner by asking thoughtful, open-ended questions.";
//     case "motivator":
//       return "You are an enthusiastic motivator. Keep the learner’s confidence high with short, positive, inspiring messages.";
//     default:
//       return "You are a helpful and engaging AI learning companion.";
//   }
// };





// export const formUrlQuery = ({
//   params,
//   key,
//   value,
// }: {
//   params: string;
//   key: string;
//   value: string;
// }) => {
//   const searchParams = new URLSearchParams(params);

//   if (value === "all" || value === "") {
//     searchParams.delete(key);
//   } else {
//     searchParams.set(key, value);
//   }

//   return `?${searchParams.toString()}`;
// };

// export const removeKeysFromUrlQuery = ({
//   params,
//   keysToRemove,
// }: {
//   params: string;
//   keysToRemove: string[];
// }) => {
//   const searchParams = new URLSearchParams(params);
//   keysToRemove.forEach((key) => searchParams.delete(key));
//   return `?${searchParams.toString()}`;
// };


import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

// Merge Tailwind + clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Subject color helper
export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

// Personality prompt generator
export const getPersonalityPrompt = (style: string) => {
  switch (style) {
    case "tutor":
      return "You are a calm and knowledgeable tutor. Explain concepts in a clear, step-by-step manner with examples when needed.";
    case "coach":
      return "You are an encouraging learning coach. Use a friendly tone, emojis, and positive reinforcement to keep the learner motivated.";
    case "storyteller":
      return "You are a creative storyteller who teaches using analogies, short stories, and fun comparisons.";
    case "socratic":
      return "You are a Socratic mentor. Instead of giving direct answers, guide the learner by asking thoughtful, open-ended questions.";
    case "motivator":
      return "You are an enthusiastic motivator. Keep the learner’s confidence high with short, positive, inspiring messages.";
    default:
      return "You are a helpful and engaging AI learning companion.";
  }
};

// Main assistant configuration for Vapi
export const configureAssistant = (voice: string, style: string): CreateAssistantDTO => {
  const voiceId =
    voices[voice as keyof typeof voices]?.[
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

  // Inject the personality
  const personalityPrompt = getPersonalityPrompt(style);

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
            ${personalityPrompt}

            You are teaching a real-time voice learning session.
            
            Context:
            - Subject: {{subject}}
            - Topic: {{topic}}
            - Learning Goal: {{goal}} (if provided)
            - Personality Style: ${style}

            Guidelines:
            - Stay focused on the learner's topic.
            - Keep responses concise and voice-friendly.
            - Break down complex ideas into smaller chunks.
            - Check in with the learner occasionally.
            - Avoid special characters or markdown (for clear TTS).
          `,
        },
      ],
    },
  };

  return vapiAssistant;
};

// Optional helpers
export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) => {
  const searchParams = new URLSearchParams(params);

  if (value === "all" || value === "") {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  return `?${searchParams.toString()}`;
};

export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: {
  params: string;
  keysToRemove: string[];
}) => {
  const searchParams = new URLSearchParams(params);
  keysToRemove.forEach((key) => searchParams.delete(key));
  return `?${searchParams.toString()}`;
};
