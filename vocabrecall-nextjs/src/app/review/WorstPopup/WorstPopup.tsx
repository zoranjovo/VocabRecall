import { useState } from "react";
import Popup from "@/app/util/popup/Popup";
import Link from "next/link";
import { notify } from "@/app/util/notify";
import styles from './worstpopup.module.css';

export default function WorstPopup({
  open,
  setOpen,
  fetch,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  fetch: (amt: number) => void;
}){

  const [amt, setAmt] = useState<string>("10");

  const handleClose = () => { setOpen(false); }

  const handleProceed = () => {
    const n = Number(amt);
    if(!n || n < 1 || n > 1000){ return notify('warn', 'Amount is invalid.'); }
    fetch(n);
  }

  return (
    <Popup
      isOpen={ open }
      onClose={ handleClose }
      noCloseOnBG
    >
      <h1 className={styles.title}>Practice Worst Cards</h1>
      <div className={styles.inputContainer}>
        <label htmlFor='amt' className={styles.label}>Amount: </label>
        <input
          value={ amt }
          onChange={ (e) => setAmt(e.target.value) }
          type='number'
          className={styles.input}
          id='amt'
        />
      </div>
      <div className={styles.btns}>
        <Link href='/'>
          <button>Cancel</button>
        </Link>
        <button onClick={ handleProceed }>Proceed</button>
      </div>
    </Popup>
  )
}