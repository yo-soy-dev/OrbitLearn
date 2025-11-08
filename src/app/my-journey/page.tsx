
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionList";
// import SessionHistoryList from "@/components/SessionHistoryList";  
import ProgressCharts from "@/components/ProgressCharts";
import LearningStreak from "@/components/LearningStreak";
import RecentSessions from "@/components/RecentSessions";

const Profile = async () => {
    const user = await currentUser()
    if (!user) redirect('/sign-in');
    const companions = await getUserCompanions(user.id);
    // const sessionHistory = await getUserSessions(user.id);
    const rawSessions = (await getUserSessions(user.id)).flat();

    const sessionHistory = rawSessions.map(s => ({
        ...s,
        createdAt: s.created_at,
    }));

//     const rawSessions = (await getUserSessions(user.id)).flat();

// const sessionHistory = rawSessions.map(s => ({
//   id: s.id,
//   companion_id: s.companion_id,
//   name: s.name || s.companions?.name,
//   subject: s.subject || s.companions?.subject,
//   topic: s.topic || s.companions?.topic,
//   duration: s.duration || s.companions?.duration || 0,
//   summary: s.summary, // keep summary
//   takeaways: s.takeaways,
//   next_steps: s.next_steps,
//   confidence_score: s.confidence_score,
//   createdAt: s.created_at,
// }));





    return (
        <main className="min-lg:w-3/4">
            <section className="flex justify-between gap-4 max-sm:flex-col items-center">
                <div className="flex gap-4 items-center">
                    <Image
                        src={user.imageUrl}
                        alt={user.firstName!}
                        width={110}
                        height={110}
                    />
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-2xl">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {user.emailAddresses[0].emailAddress}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
                        <div className="flex gap-2 items-center">
                            <Image
                                src="/icons/check.svg"
                                alt="checkmark"
                                width={22}
                                height={22}
                            />
                            <p className="text-2xl font-bold">{sessionHistory.length}</p>
                        </div>
                        <div>Lessons completed</div>
                    </div>
                    <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
                        <div className="flex gap-2 items-center">
                            <Image
                                src="/icons/cap.svg"
                                alt="cap"
                                width={22}
                                height={22}
                            />
                            <p className="text-2xl font-bold">{companions.length}</p>
                        </div>
                        <div>Companions created</div>
                    </div>
                </div>
            </section>

            <LearningStreak companionList={sessionHistory} />

            <ProgressCharts sessionHistory={sessionHistory} />


            <Accordion type="multiple">
                <AccordionItem value="recent">
                    <AccordionTrigger className="text-2xl font-bold">
                        Recent Sessions
                    </AccordionTrigger>
                    <AccordionContent>
                        {/* <CompanionsList
                            title="Recent Sessions"
                            companions={sessionHistory as Companion[]}
                        /> */}
                        <RecentSessions sessions={sessionHistory as Companion[]} />

                        {/* <SessionHistoryList sessions={sessionHistory} /> */}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="companions">
                    <AccordionTrigger className="text-2xl font-bold">
                        My Companions ({companions.length})
                    </AccordionTrigger>
                    <AccordionContent>
                        <CompanionsList
                            title="My Companions"
                            companions={companions}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    )
}

export default Profile;
