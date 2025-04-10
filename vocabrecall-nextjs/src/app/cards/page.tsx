'use client'

import { useEffect, useState } from 'react';
import styles from './cardspage.module.css';
import { FilePlus } from 'lucide-react';
import AddCardPopup from './AddCardPopup/AddCardPopup';
import CardsView from './CardsView/CardsView';
import axios from 'axios';
import { notify } from '@/app/util/notify';
import Loading from '@/app/util/loading';
import Dropdown from '@/app/util/dropdown/Dropdown';

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

const sortMap: Record<string, string> = {
  'New → Old': 'newold',
  'Old → New': 'oldnew',
  'Best → Worst': 'bestworst',
  'Worst → Best': 'worstbest',
  'A → Z': 'az',
  'Z → A': 'za',
};

export default function CardsPage(){

  const [addCardPopupOpen, setAddCardPopupOpen] = useState<boolean>(false);
  const [cardsLoading, setCardsLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<CardProps[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownSelected, setDropdownSelected] = useState<string>('New → Old');

  // fetch cards
  useEffect(() => {
    const fetch = async () => {
      const filter = sortMap[dropdownSelected] || 'newold';
      setCardsLoading(true);
      try {
        const res = await axios.get(`/api/cards/get?search=${searchQuery.toLowerCase().trim()}&sort=${filter}`);
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
  }, [searchQuery, dropdownSelected]);

  return(
    <>
      <div className={styles.page}>
        <div className={styles.top}>
          <div className={styles.searchBarContainer}>
            <input
              className={styles.search}
              value={ searchQuery }
              onChange={ (e) => setSearchQuery(e.target.value) }
              placeholder='Search...'
            />
          </div>
          <div className={styles.dropdownContainer}>
            <Dropdown
              options={ ['New → Old', 'Old → New', 'Best → Worst', 'Worst → Best', 'A → Z', 'Z → A'] }
              selected={ dropdownSelected }
              onSelect={ setDropdownSelected }
            />
          </div>
          <div className={styles.addBtnContainer}>
            <button className={styles.addBtn} onClick={ () => setAddCardPopupOpen(true) }>
              <div className='flex gap-2'>
                <FilePlus/>
                Add Card
              </div>
            </button>
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