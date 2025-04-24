import { prisma } from "@/app/util/prisma"
import { getSession } from "@/app/util/session"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if(!session){ return new NextResponse("Unauthorized", { status: 401 }); }

    const body = await req.json()
    const { id, partA, partB, aliasesA, aliasesB, reversible, note, easeFactor, correctInterval } = body;

    if(!id){ return new NextResponse("Missing card ID", { status: 400 }); }
    if(!partA || !partB){ return new NextResponse("Missing required fields", { status: 400 }); }
  
    const existingCard = await prisma.card.findUnique({ where: { id } });
    if(!existingCard){ return new NextResponse("Card not found", { status: 404 }); }

    // update the card in db
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        partA,
        partB,
        aliasesA,
        aliasesB,
        reversible: reversible ?? true,
        note: note ?? "",
        easeFactor,
        correctInterval,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("[UPDATE CARD ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
