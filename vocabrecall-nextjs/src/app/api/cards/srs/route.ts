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

    if (correct) {
      // increase ease factor for correct answer
      easeFactor = Math.min(20.0, easeFactor * 1.3);
      
      // base interval calculation based only on ease factor, could also use correctInterval if needed
      const intervalHours = Math.pow(1.25 * easeFactor, 2.6) + 10; // desmos y\ =\left(1.25\cdot x\right)^{2.6}+10\left\{1.1<x<20\right\}
      
      // calculate next review date
      const nextReviewMs = currentDate.getTime() + (intervalHours * 60 * 60 * 1000);
      nextReview = new Date(nextReviewMs);
      
      // log info
      const daysUntilNextReview = intervalHours / 24;
      console.log(`Word correctly answered! New ease factor: ${easeFactor.toFixed(2)}`);
      
      if (daysUntilNextReview < 1) {
        console.log(`Next review: in ${intervalHours.toFixed(1)} hours`);
      } else {
        console.log(`Next review: in ${daysUntilNextReview.toFixed(1)} days (${intervalHours.toFixed(1)} hours)`);
      }
      
      console.log(`Next review date: ${nextReview.toISOString()}`);
    } else {
      // decrease ease factor for incorrect answers
      easeFactor = Math.max(1.1, easeFactor * 0.8);
      console.log(`Word incorrectly answered. New ease factor: ${easeFactor.toFixed(2)}`);
    }

    // update the card in db
    const updatedCard = await prisma.card.update({ where: { id }, data: { easeFactor, nextReview } });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("[UPDATE SRS ERROR]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}