import { useState } from 'react';
import Checkbox from '@/app/util/checkbox/Checkbox';
import Popup from '@/app/util/popup/Popup';
import { Check } from 'lucide-react';
import styles from './cardspage.module.css';

export default function AddCardPopup({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}){
  const [reversible, setReversible] = useState<boolean>(true);

  return (
    <Popup
      isOpen={ open }
      onClose={ handleClose }
    >
      <p>Add Card</p>
      <div className={styles.addPopupInfoContainer}>

        <div className={styles.addPopupInputBox}>
          <p className={styles.addPopupInputLabel}>Question</p>
          <input
            className={styles.addPopupInput}
            placeholder='Question...'
          />
        </div>

        <div className={styles.addPopupInputBox}>
          <p className={styles.addPopupInputLabel}>Question Aliases</p>
          <input
            className={styles.addPopupInput}
            placeholder='Add Alias...'
          />
        </div>

        <div className={styles.addPopupInputBox}>
          <p className={styles.addPopupInputLabel}>Answer</p>
          <input
            className={styles.addPopupInput}
            placeholder='Answer...'
          />
        </div>

        <div className={styles.addPopupInputBox}>
          <p className={styles.addPopupInputLabel}>Answer Aliases</p>
          <input
            className={styles.addPopupInput}
            placeholder='Add Alias...'
          />
        </div>

        <Checkbox
          label="Reversible"
          value={ reversible }
          setValue={ setReversible }
        />

        <div className={styles.addPopupAddBtnContainer}>
          <button className='flex gap-2'>
            <Check/>
            Add Card
          </button>
        </div>
        
      </div>
    </Popup>
  )
}