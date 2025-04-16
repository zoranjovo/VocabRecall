import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

    const cards = await prisma.card.findMany();
    const data = { cards };

    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="vocabrecall-backup.json"',
      },
    });
  } catch(error){
    console.error("[BACKUP ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}