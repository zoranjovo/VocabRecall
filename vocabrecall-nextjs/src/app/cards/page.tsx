'use client'

import { useEffect, useState } from 'react';
import styles from './cardspage.module.css';
import { FilePlus } from 'lucide-react';
import AddCardPopup from './AddCardPopup/AddCardPopup';
import CardsView from './CardsView/CardsView';
import axios from 'axios';
import { notify } from '@/app/util/notify';
import Loading from '@/app/util/loading';

export interface CardProps {
  id: string;
  partA: string;
  partB: string;
  aliasesA?: string[];
  aliasesB?: string[];
  easeFactor: number;
  note?: string;
  reversible: boolean;
  correctInterval: number;
  nextReview: string;
  createdAt: string;
  updatedAt: string;
}

export default function CardsPage(){

  const [addCardPopupOpen, setAddCardPopupOpen] = useState<boolean>(false);
  const [cardsLoading, setCardsLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<CardProps[]>([]);

  // fetch cards
  useEffect(() => {
    const fetch = async () => {
      setCardsLoading(true);
      try {
        const res = await axios.get('/api/cards/get');
        if(res.status === 200){
          setCards(res.data);
        } else {
          console.error(res.data);
          notify('error', 'Failed to fetch cards.');
        }
      } catch (err) {
        console.error(err);
        notify('error', 'Failed to fetch cards.');
      } finally {
        setCardsLoading(false);
      }
    }
    fetch();
  }, []);

  return(
    <>
      <div className={styles.page}>
        <div className={styles.top}>
          <div className={styles.addBtnContainer}>
            <button className={styles.addBtn} onClick={ () => setAddCardPopupOpen(true) }>
              <div className='flex gap-2'>
                <FilePlus/>
                Add Card
              </div>
            </button>
          </div>

          <div className={styles.searchContainer}>

          </div>
        </div>
        { cardsLoading ? (
          <div className='flex justify-center mt-10'>
            <Loading/>
          </div>
        ) : (
          cards.length < 1 ? (
            <p className='text-[var(--text)] text-center mt-10 text-xl'>No cards found.</p>
          ) : (
            <CardsView
              cards={ cards }
              setCards= { setCards }
            />
          )
        )}
        
      </div>

      <AddCardPopup
        open={ addCardPopupOpen }
        handleClose={ () => setAddCardPopupOpen(false) }
        setCards={ setCards }
      />
    </>
    
  )
}