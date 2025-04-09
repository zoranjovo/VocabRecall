import { useState } from 'react';
import Checkbox from '@/app/util/checkbox/Checkbox';
import Popup from '@/app/util/popup/Popup';
import { Check, X } from 'lucide-react';
import styles from './AddCardPopup.module.css';
import { notify } from '@/app/util/notify';
import Loading from '@/app/util/loading';
import axios from 'axios';
import type { Dispatch, SetStateAction } from 'react';
import type { CardProps } from '@/app/cards/page';

export default function AddCardPopup({
  open,
  handleClose,
  setCards,
}: {
  open: boolean;
  handleClose: () => void;
  setCards: Dispatch<SetStateAction<CardProps[]>>;
}){


  const [question, setQuestion] = useState<string>('');
  const [questionAliases, setQuestionAliases] = useState<string[]>(['']);
  const [answer, setAnswer] = useState<string>('');
  const [answerAliases, setAnswerAliases] = useState<string[]>(['']);
  const [note, setNote] = useState<string>('');
  const [reversible, setReversible] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(false);


  const handleAliasChange = (value: string, index: number, type: 'question' | 'answer') => {
    const aliases = type === 'question' ? [...questionAliases] : [...answerAliases];
    aliases[index] = value;
    const filtered = aliases.filter((alias, i) => alias.trim() !== '' || i === aliases.length - 1);
    if(value.trim() !== '' && index === filtered.length - 1){ filtered.push(''); }
    if(type === 'question'){
      setQuestionAliases(filtered);
    } else {
      setAnswerAliases(filtered);
    }
  };


  const handleSubmit = async () => {
    if(!question){ return notify('warn', 'Please enter a question.'); }
    if(!answer){ return notify('warn', 'Please enter an answer.'); }

    setLoading(true);

    try {
      const res = await axios.post('/api/cards/add', {
        partA: question.trim(),
        partB: answer.trim(),
        aliasesA: questionAliases.filter(a => a.trim() !== ''),
        aliasesB: answerAliases.filter(a => a.trim() !== ''),
        note: note.trim(),
        reversible,
      });
      if(res.status === 200){
        notify('success', 'Card added successfully!');
        addToCardsArray(res.data);
        handleClose();
        setQuestion('');
        setQuestionAliases(['']);
        setAnswer('');
        setAnswerAliases(['']);
        setNote('');
        setReversible(true);
      } else {
        console.error(res.data);
        notify('error', 'Failed to add card.');
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to add card.');
    } finally {
      setLoading(false);
    }
  }

  const addToCardsArray = (newCard: CardProps) => {
    setCards((prev) => [...prev, newCard])
  }

  return (
    <Popup
      isOpen={ open }
      onClose={ handleClose }
    >
      <p className={styles.addCardTitle}>Add Card</p>
      <div className={styles.addPopupInfoContainer}>

        <div className={styles.addPopupInputGroup}>
          <div className={styles.addPopupInputBox}>
            <p className={styles.addPopupInputLabel}>Question</p>
            <input
              className={styles.addPopupInput}
              placeholder='Question...'
              value={ question }
              onChange={ (e) => setQuestion(e.target.value) }
            />
          </div>

          <div className={styles.addPopupInputBox}>
            <p className={styles.addPopupInputLabel}>Question Aliases <span className={styles.addPopupSpan}>(optional)</span></p>
            {questionAliases.map((alias, i) => (
              <input
                key={`q-alias-${i}`}
                className={styles.addPopupInput}
                value={alias}
                onChange={ (e) => handleAliasChange(e.target.value, i, 'question') }
                placeholder='Add Alias...'
              />
            ))}
          </div>
        </div>

        <div className={styles.addPopupInputGroup}>
          <div className={styles.addPopupInputBox}>
            <p className={styles.addPopupInputLabel}>Answer</p>
            <input
              className={styles.addPopupInput}
              placeholder='Answer...'
              value={ answer }
              onChange={ (e) => setAnswer(e.target.value) }
            />
          </div>

          <div className={styles.addPopupInputBox}>
            <p className={styles.addPopupInputLabel}>Answer Aliases <span className={styles.addPopupSpan}>(optional)</span></p>
            {answerAliases.map((alias, i) => (
              <input
                key={`a-alias-${i}`}
                className={styles.addPopupInput}
                value={alias}
                onChange={(e) => handleAliasChange(e.target.value, i, 'answer')}
                placeholder='Add Alias...'
              />
            ))}
          </div>
        </div>

        <div className={styles.addPopupInputGroup}>
          <div className={styles.addPopupInputBox}>
            <p className={styles.addPopupInputLabel}>Note <span className={styles.addPopupSpan}>(optional)</span></p>
            <input
              className={styles.addPopupInput}
              placeholder='Note...'
              value={ note }
              onChange={ (e) => setNote(e.target.value) }
            />
          </div>
        </div>

        
        
        <div className='flex justify-center m-5'>
          <Checkbox
            label="Reversible"
            value={ reversible }
            setValue={ setReversible }
          />
        </div>
        
        <div className={styles.buttons}>
          <div className={styles.addPopupAddBtnContainer}>
            <button className='flex gap-2' onClick={ handleClose }>
              <X/>
              Cancel
            </button>
          </div>
          <div className={styles.addPopupAddBtnContainer}>
            { loading ? (
              <Loading/>
            ) : (
              <button className='flex gap-2' onClick={ handleSubmit }>
                <Check/>
                Add Card
              </button>
            )}
          </div>
        </div>
        
        
      </div>
    </Popup>
  )
}