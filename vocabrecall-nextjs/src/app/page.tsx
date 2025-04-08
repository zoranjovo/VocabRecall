import { getSession } from '@/app/util/session';
import { redirect } from 'next/navigation';

export default async function MainPage() {
  const session = await getSession();
  if(!session){ redirect('/login'); }
  
  return (
    <div>
      <h1>VocabRecall</h1>
    </div>
  );
}