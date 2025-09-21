import CompanionForm from '@/components/CompanionForm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const NewCompanion = async () => {
  const { userId } = await auth();

  if (!userId) redirect('/sign-in'); 

  return (
    <main>
      <article>
        <h1>Companion Builder</h1>
        <CompanionForm />
      </article>
    </main>
  );
};

export default NewCompanion;
