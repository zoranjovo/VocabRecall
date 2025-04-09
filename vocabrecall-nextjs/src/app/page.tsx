import { getSession } from '@/app/util/session';
import { redirect } from 'next/navigation';
import HomePage from './homepage/HomePage';

export default async function MainPage() {
  const session = await getSession();
  if(!session){ redirect('/login'); }
  
  return (
    <HomePage/>
  );
}