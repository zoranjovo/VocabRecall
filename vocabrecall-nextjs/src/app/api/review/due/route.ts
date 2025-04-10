import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

    const currentDate = new Date();

    // respond with all cards that are due (nextReview < currentDate)
    const dueWords = await prisma.card.findMany({ where: { nextReview: { lte: currentDate }}});
    return NextResponse.json(dueWords, { status: 200 });

  } catch (error) {
    console.error("[FETCH DUE WORDS]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
