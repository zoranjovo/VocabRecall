import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const {
    partA,
    partB,
    aliasesA,
    aliasesB,
    reversible,
    note
  } = body;

  if (!partA || !partB) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const newCard = await prisma.card.create({
    data: {
      partA,
      partB,
      aliasesA,
      aliasesB,
      reversible,
      note
    }
  });

  return NextResponse.json(newCard);
}
