"use client"

import styles from './CardsView.module.css';
import { type CardProps } from '../page';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import EditCardPopup from './EditCardPopup/EditCardPopup';

export default function CardsView({
  cards,
  setCards,
}: {
  cards: CardProps[];
  setCards: Dispatch<SetStateAction<CardProps[]>>;
}){

  const [editPopupOpen, setEditPopupOpen] = useState<boolean>(false);
  const [editPopupInitialCard, setEditPopupInitialCard] = useState<CardProps>();

  const handleOpenEditPopup = (card: CardProps) => {
    setEditPopupInitialCard(card);
    setEditPopupOpen(true);
  }

  const handleEditPopupClose = () => { setEditPopupOpen(false); }

  const handleDeleteFromArray = (id: string) => { setCards(prev => prev.filter(card => card.id !== id)); }

  const handleUpdateFromArray = (updatedCard: CardProps) => { setCards((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))); }


  return (
    <>
      <div className={styles.cardsContainer}>
        {cards.map((card, index) => (
          <div className={styles.card} key={index} onClick={ () => handleOpenEditPopup(card) }>
            <div className={styles.cardTop}>
              <div className={styles.questionTxtContainer}>
                <p className={styles.questionTxt}>{card.partA}</p>
              </div>
              <div className={styles.answerTxtContainer}>
                <p className={styles.answerTxt}>{card.partB}</p>
              </div>
            </div>
            <div className={styles.cardMid}>
              { card.aliasesA && card.aliasesA.length > 0 && (
                <div className={styles.questionAliasesContainer}>
                  { card.aliasesA.map((alias: string, index: number) => (
                    <p key={index}>{alias}</p>
                  )) }
                </div>
              )}
              { card.aliasesB && card.aliasesB.length > 0 && (
                <div className={styles.answerAliasesContainer}>
                  { card.aliasesB.map((alias: string, index: number) => (
                    <p key={index}>{alias}</p>
                  )) }
                </div>
              )}
              { card.note && (
                <div className={styles.noteContainer}>
                  <p className={styles.noteTitle}>Note</p>
                  <p>{card.note}</p>
                </div>
              )}
              <div className={styles.srsInfoContainer}>
                <p>Ease Factor: {Math.round(card.easeFactor * 100) / 100}</p>
                <p>Next Review: {timeUntil(new Date(card.nextReview))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditCardPopup
        open={ editPopupOpen }
        handleClose={ handleEditPopupClose }
        initialCard={ editPopupInitialCard }
        handleDeleteFromArray={ handleDeleteFromArray }
        handleUpdateFromArray={ handleUpdateFromArray }
      />
    </>
  )
}



function timeUntil(date: Date): string {
  const now: Date = new Date();
  const diff: number = date.valueOf() - now.valueOf();
  if (diff <= 0) return "Now";

  const seconds: number = Math.round(diff / 1000);
  const minutes: number = Math.round(seconds / 60);
  const hours: number = Math.round(minutes / 60);
  const days: number = Math.round(hours / 24);

  if (seconds < 60) return `in ${seconds} secs`;
  if (minutes < 60) return `in ${minutes} mins`;
  if (hours < 24) return `in ${hours} hrs`;
  return `in ${days} days`;
}