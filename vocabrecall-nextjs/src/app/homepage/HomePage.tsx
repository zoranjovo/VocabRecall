import { prisma } from '@/app/util/prisma';
import styles from './HomePage.module.css';
import Link from 'next/link';

export default async function HomePage(){

  // get reviews due - SSR not exposed to client
  const currentDate = new Date();
  const reviewsDue = await prisma.card.count({ where: { nextReview: { lte: currentDate }}});


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>VocabRecall</h1>
      <div className={styles.contentContainer}>
        <div className={styles.contentBox}>
          <p className={styles.boxTitle}>Practice Due Cards</p>
          <p>{reviewsDue} {reviewsDue === 1 ? 'review' : 'reviews'} due</p>
          <div className={styles.btnContainer}>
            <Link href='/reviews'>
              <button className={styles.btn}>Practice Reviews</button>
            </Link>
          </div>
        </div>
        
        <div className={styles.contentBox}>
          <p className={styles.boxTitle}>Practice worst cards</p>
          <p>(Won't affect SRS values)</p>
          <div className={styles.btnContainer}>
            <Link href='/worst'>
              <button className={styles.btn}>Practice Worst</button>
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  )
}