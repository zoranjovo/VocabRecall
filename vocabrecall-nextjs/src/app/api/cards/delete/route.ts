import { prisma } from '@/app/util/prisma';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) { return new NextResponse('Unauthorized', { status: 401 }); }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) { return new NextResponse('Card ID is required', { status: 400 }); }
  
    await prisma.card.delete({ where: { id } });
    return new NextResponse('Card deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[DELETE CARD ERROR]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
