import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

    const url = new URL(req.url);
    const amtParam = url.searchParams.get('amt');
    const amt = amtParam ? parseInt(amtParam) : 10; // default 10

    // respond with amt of the worst cards
    const worstCards = await prisma.card.findMany({ orderBy: { easeFactor: 'asc' }, take: amt });
    return NextResponse.json(worstCards, { status: 200 });

  } catch (error) {
    console.error("[FETCH WORST WORDS]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
