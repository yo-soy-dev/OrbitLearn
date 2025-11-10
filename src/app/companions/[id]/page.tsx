import CompanionComponent from "@/components/CompanionComponent";
import { getCompanion } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import VapiRecorder from "@/components/VapiRecorder";
// import { getSessionHistory } from "@/lib/actions/companion.actions";
import TestMeButton from "@/components/TestMeButton";




interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}


const CompanionSession = async ({ params }: CompanionSessionPageProps) => {

  console.log('=== COMPANION SESSION DEBUG ===');

  const { id } = await params;
  const companion = await getCompanion(id);
   console.log('📌 Companion ID from URL:', id);
  console.log('📌 ID Type:', typeof id);
  console.log('📌 ID Length:', id?.length);
  console.log('🎯 Companion fetched:', companion);

  const user = await currentUser();
  console.log('👤 User:', user ? `Logged in as ${user.firstName}` : 'No user');

  if (!user) redirect('/sign-in');
  // if (!companion) redirect('/companions');
  if (!companion) {
  console.error("⚠️ No companion found for ID:", id);
  return (
    <div className="p-10 text-center text-red-500">
      ❌ No session found for this companion. It might have been deleted or you don’t have access.
    </div>
  );
}


  const { name, subject, title, topic, duration } = companion;

  return (
    <main className="min-h-screen pb-32">
      <TestMeButton />
      <article className="flex items-center rounded-border justify-between p-6 max-md:flex-col gap-4">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">
                {name}
              </p>
              <div className="subject-badge max-sm:hidden">
                {subject}
              </div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
          <div className="items-start text-2xl max-md:hidden">
            {duration} minutes
          </div>
        </div>
      </article>
        
      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />

      <div className="p-6 flex justify-center">
        <VapiRecorder companionId={id} />
      </div>
    </main>
  );
}

export default CompanionSession;