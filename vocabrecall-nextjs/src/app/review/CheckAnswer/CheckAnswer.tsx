"use client"

import { useState, useEffect } from 'react';
import styles from './checkanswer.module.css';
import { Question } from '@/app/review/page';

export default function CheckAnswer({
  open,
  currentItem,
}: {
  open: boolean;
  currentItem: Question;
}){

  const [displayItem, setDisplayItem] = useState<Question>();

  useEffect(() => { setTimeout(() => { setDisplayItem(currentItem); }, 500); }, [ currentItem ]);

  return (
    <div className={`${styles.container}  ${open ? styles.open : ''}`}>
      <div className={styles.wordsContainer}>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionBox}>
            <p className={styles.lang}>Question</p>
            { displayItem?.question && ( <p className={styles.word}>{displayItem.question}</p> )} 
          </div>
        </div>
        
        <div className={styles.sectionContainer}>
          <div className={styles.sectionBox}>
            { displayItem?.answers.length === 1 ? (
              <>
                <p className={styles.type}>Answer</p>
                <div className={styles.answersContainer}>
                  <p className={styles.word}>{displayItem?.answers[0]}</p>
                </div>
              </>
            ) : (
              <>
                <p className={styles.type}>Answers</p>
                <div className={styles.answersContainer}>
                  { displayItem?.answers.map((answer, index) => (
                    <li key={index} className={styles.word}>{answer}</li>
                  ))}
                </div>
              </>
            )}
            
          </div>
        </div>
        
        { displayItem?.note && (
          <div className={styles.sectionContainer}>
            <div className={styles.sectionBox}>
              <p className={styles.lang}>Note</p>
              { displayItem?.question && ( <p className={styles.word}>{displayItem.note}</p> )} 
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}