import fs from 'fs';
import path from 'path';
import { getSession } from '@/app/util/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

    const dbPath = path.join(process.cwd(), 'prisma', 'data.sqlite');
    const file = fs.readFileSync(dbPath);

    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="backup.sqlite"',
      },
    });
  } catch(error){
    console.error("[BACKUP ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
  
}
