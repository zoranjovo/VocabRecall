import { prisma } from "@/app/util/prisma";
import { getSession } from "@/app/util/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if(!session){ return new NextResponse("Unauthorized", { status: 401 }); }

    const body = await req.json();
    const { id, correct } = body as { id: string; correct: boolean };

    if(!id){ return new NextResponse("Missing card ID", { status: 400 }); }
    if(typeof correct !== "boolean"){ return new NextResponse("Missing correct field", { status: 400 }); }
    
    // verify card exists
    const card = await prisma.card.findUnique({ where: { id: id } });
    if(!card){ return new NextResponse("Invalid card ID", { status: 404 }); }

    // ensure card is due (react safe mode sends double request sometimes, or if the production client does for whatever reason)
    const currentDate = new Date();
    if(currentDate < card.nextReview){ return new NextResponse("Card is not due yet", { status: 400 }); }

    // SRS calculation
    
    let easeFactor = card.easeFactor;
    let nextReview = card.nextReview;
    let correctInterval = card.correctInterval;

    if (correct) {
      // increase ease factor for correct answer
      easeFactor = Math.min(20.0, easeFactor * 1.3);

      // increment correctInterval
      correctInterval++;
      
      // base interval calculation based only on ease factor, could also use correctInterval if needed (logging now for future use)
      const intervalHours = Math.pow(1.05 * easeFactor, 2.8) + 6; // desmos y\ =\left(1.05\cdot x\right)^{2.8}+5\left\{1.1<x<20\right\}
      
      // calculate next review date
      const nextReviewMs = currentDate.getTime() + (intervalHours * 60 * 60 * 1000);
      nextReview = new Date(nextReviewMs);

    } else {
      // decrease ease factor for incorrect answers
      easeFactor = Math.max(1.1, easeFactor * 0.8);

      // set correct interval to 0
      correctInterval = 0;
    }

    // update the card in db
    const updatedCard = await prisma.card.update({ 
      where: { id },
      data: { easeFactor, nextReview, correctInterval }
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("[UPDATE SRS ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}