export const dynamic = 'force-dynamic';

import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import React from "react";
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import RecentSessions from "@/components/RecentSessions";
import WelcomeBox from "@/components/WelcomeBox";
import QuizBox from "@/components/QuizBox";
// import { Companion } from "@/types";

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 }); 
    const recentSessionsCompanions = await getRecentSessions(10)

  
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <WelcomeBox />

      {/* <section className="home-section mt-8 flex justify-between items-stretch gap-6">
       */}<section className="home-section mt-6 mb-10">
        <QuizBox />
      </section>


      <section className="space-y-4 mt-10">

      <h1 className="text-2xl underline">Popular Study Buddy</h1>
      <section className="home-section">
        {companions.map((companion) => (  
                    <CompanionCard  
                        key={companion.id}  
                        {...companion}  
                        color={getSubjectColor(companion.subject)}  
                    />  
                ))}  
        {/* <CompanionCard
          id="123"
          name="Neura the Brainy Explorer"
          topic="Neural Network of the Brain"
          subject="Science"
          duration={45}
          color="#ffda6e"
        />
        <CompanionCard
          id="456"
          name="Countsy the Number Wizard"
          topic="Derivatives & Integrals"
          subject="Science"
          duration={30}
          color="#e5d0ff"
        />
        <CompanionCard
          id="789"
          name="Verba the Vocabulary Builder"
          topic="Language"
          subject="English Literature"
          duration={30}
          color="#BDE7FF"
        /> */}
      </section>
      </section>

        <section className="home-section mt-8 flex justify-between items-stretch gap-6">
        {/* <CompanionList
          title="Recently completed sessions"
          companions={recentSessionsCompanions as Companion[]}
          classNames="w-2/3 max-lg:w-full"
        /> */}
         <RecentSessions sessions={recentSessionsCompanions as Companion[]} 
        //  classNames="w-2/3 max-lg:w-full"
           /> 
        <CTA />
      </section>
    </div>
  );
};

export default Page;
