import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

const CARD_LIMIT = 30;

export async function GET() {
  const session = await getSession();
  if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

  const cards = await prisma.card.findMany({
    orderBy: { updatedAt: 'desc' },
    take: CARD_LIMIT,
  });

  return NextResponse.json(cards);
}
