import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

const CARD_LIMIT = 30;

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const sort = searchParams.get('sort') || 'newold';

    const sortMap: Record<string, any> = {
      newold: { createdAt: 'desc' },
      oldnew: { createdAt: 'asc' },
      bestworst: { easeFactor: 'desc' },
      worstbest: { easeFactor: 'asc' },
      az: { partA: 'asc' },
      za: { partA: 'desc' },
    };

    const orderBy = sortMap[sort] || { updatedAt: 'desc' };

    let cards;
    if(!search){
      cards = await prisma.card.findMany({
        orderBy,
        take: CARD_LIMIT,
      });
    } else {
      cards = await prisma.card.findMany({
        where: {
          partA: {
            contains: search
          },
        },
        orderBy,
        take: CARD_LIMIT,
      })
    }

    return NextResponse.json(cards);
  } catch(error){
    console.error("[GET CARD ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
  
}
