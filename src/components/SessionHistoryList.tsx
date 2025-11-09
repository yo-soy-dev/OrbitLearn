// interface Props {
//   sessions: {
//     id: string;
//     summary: string;
//     created_at: string;
//   }[];
// }

// export default function SessionHistoryList({ sessions }: Props) {
//   return (
//     <div className="p-5 rounded-xl border shadow-sm bg-white">
//       <h2 className="text-xl font-bold mb-4">🕘 Session Timeline</h2>

//       <ul className="space-y-3">
//         {sessions.map((s) => (
//           <li key={s.id} className="border rounded-lg p-3">
//             <p className="font-medium">{s.summary || "AI Session"}</p>
//             <p className="text-gray-500 text-sm">
//               {new Date(s.created_at).toLocaleString()}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
