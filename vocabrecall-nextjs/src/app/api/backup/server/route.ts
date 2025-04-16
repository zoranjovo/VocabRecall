import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/app/util/session';

export async function GET() {
  const session = await getSession();
  if(!session){ return new NextResponse('Unauthorized', { status: 401 }); }

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'data.sqlite');
    const backupDir = path.join(process.cwd(), 'prisma', 'backups');

    // create backup dir if doesnt exist
    if(!fs.existsSync(backupDir)){ fs.mkdirSync(backupDir, { recursive: true }); }

    // generate timestamp as YYYYMMDD-HH-MM
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;

    const filename = `backup-${timestamp}.sqlite`;
    const backupPath = path.join(backupDir, filename);

    // check if file exists
    if(fs.existsSync(backupPath)){ return new NextResponse('Backup already created recently. Please wait before creating another.', { status: 429 }); }


    fs.copyFileSync(dbPath, backupPath);
    return NextResponse.json({ message: 'Backup created', filename });
  } catch (err) {
    console.error('[BACKUP ERROR]:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
