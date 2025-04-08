'use client'

import { useState } from 'react';
import styles from './cardspage.module.css';
import { FilePlus } from 'lucide-react';
import AddCardPopup from './AddCardPopup';

export default function CardsPage(){

  const [addCardPopupOpen, setAddCardPopupOpen] = useState<boolean>(false);


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
      </div>

      <AddCardPopup
        open={ addCardPopupOpen }
        handleClose={ () => setAddCardPopupOpen(false) }
      />
    </>
    
  )
}