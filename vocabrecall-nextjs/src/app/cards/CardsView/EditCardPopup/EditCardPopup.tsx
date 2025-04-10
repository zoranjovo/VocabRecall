import { useEffect, useState } from 'react';
import Checkbox from '@/app/util/checkbox/Checkbox';
import Popup from '@/app/util/popup/Popup';
import { Check, X, FileMinus } from 'lucide-react';
import styles from './EditCardPopup.module.css';
import { notify } from '@/app/util/notify';
import Loading from '@/app/util/loading';
import axios from 'axios';
import { type CardProps } from '@/app/cards/page';
import { timeSince, timeUntil } from '@/app/util/dates';

export default function EditCardPopup({
  open,
  handleClose,
  initialCard,
  handleDeleteFromArray,
  handleUpdateFromArray,
}: {
  open: boolean;
  handleClose: () => void;
  initialCard: CardProps | undefined;
  handleDeleteFromArray: (id: string) => void;
  handleUpdateFromArray: (updatedCard: CardProps) => void;
}){

  useEffect(() => {
    if(open){
      if(initialCard?.partA){ setQuestion(initialCard.partA); }
      if(initialCard?.partB){ setAnswer(initialCard.partB); }
      if(initialCard?.aliasesA){ setQuestionAliases([...initialCard.aliasesA, '']); }
      if(initialCard?.aliasesB){ setAnswerAliases([...initialCard.aliasesB, '']); }
      if(initialCard?.note){ setNote(initialCard.note); }
      if(initialCard?.reversible !== undefined){ setReversible(initialCard.reversible); }
      if(initialCard?.easeFactor !== undefined){ setEaseFactor(initialCard.easeFactor); }
      if(initialCard?.correctInterval !== undefined){ setCorrectInterval(initialCard.correctInterval); }
    }
  }, [initialCard])

  const [question, setQuestion] = useState<string>('');
  const [questionAliases, setQuestionAliases] = useState<string[]>(['']);
  const [answer, setAnswer] = useState<string>('');
  const [answerAliases, setAnswerAliases] = useState<string[]>(['']);
  const [note, setNote] = useState<string>('');
  const [reversible, setReversible] = useState<boolean>(true);
  const [easeFactor, setEaseFactor] = useState<number>(0);
  const [correctInterval, setCorrectInterval] = useState<number>(0);

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);

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


  const handleSave = async () => {
    if(!question){ return notify('warn', 'Please enter a question.'); }
    if(!answer){ return notify('warn', 'Please enter an answer.'); }

    const filteredQuestionAliases = questionAliases.filter((alias) => alias.trim() !== "");
    const filteredAnswerAliases = answerAliases.filter((alias) => alias.trim() !== "");

    // check for changes to card
    const hasChanges =
      initialCard?.partA !== question ||
      initialCard?.partB !== answer ||
      JSON.stringify(initialCard?.aliasesA) !== JSON.stringify(filteredQuestionAliases) ||
      JSON.stringify(initialCard?.aliasesB) !== JSON.stringify(filteredAnswerAliases) ||
      initialCard?.reversible !== reversible ||
      initialCard?.note !== note ||
      initialCard?.easeFactor !== easeFactor ||
      initialCard?.correctInterval !== correctInterval;
    if(!hasChanges){ return notify("warn", "The card has not been edited.") }

    setSaveLoading(true);
    if(!initialCard?.id){ return notify('error', 'Failed to update card.'); }
    try {
      const res = await axios.post("/api/cards/update", {
        id: initialCard.id,
        partA: question,
        partB: answer,
        aliasesA: questionAliases.filter((alias) => alias.trim() !== ""),
        aliasesB: answerAliases.filter((alias) => alias.trim() !== ""),
        reversible,
        note,
        easeFactor,
        correctInterval
      })
      if(res.status === 200){
        notify('success', 'Card updated successfully!');
        handleUpdateFromArray(res.data);
        handleClose();
      } else {
        console.error(res.data);
        notify('error', 'Failed to update card.');
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to update card.');
    } finally {
      setSaveLoading(false);
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    if(!initialCard?.id){ return notify('error', 'Failed to delete card.'); }
    try {
      const res = await axios.delete(`/api/cards/delete?id=${initialCard.id}`);
      if(res.status === 200){
        notify('success', 'Card deleted successfully!');
        handleDeleteFromArray(initialCard.id)
        handleClose();
      } else {
        console.error(res.data);
        notify('error', 'Failed to delete card.');
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete card.');
    } finally {
      setDeleteLoading(false);
    }
  }

  // auto turn off delete confirmation after 2 seconds
  const handleDeleteConfirmion = () => {
    setDeleteConfirmationOpen(true);
    setTimeout(() => {
      setDeleteConfirmationOpen(false);
    }, 2000);
  }


  // close popup and turn off delete confirmation
  const closePopup = () => {
    handleClose();
    setTimeout(() => {
      setDeleteConfirmationOpen(false);
    }, 300);
  }

  return (
    <Popup
      isOpen={ open }
      onClose={ closePopup }
    >
      <p className={styles.addCardTitle}>Edit Card</p>
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

        <div className={styles.addPopupInputGroup}>
          <div className={styles.srsValuesContainer}>
            <div>
              <p className={styles.addPopupInputLabel}>Ease Factor</p>
              <input
                className={styles.addPopupInput}
                placeholder='Note...'
                value={ easeFactor }
                type='number'
                onChange={ (e) => setEaseFactor(Number(e.target.value)) }
              />
            </div>
            <div>
              <p className={styles.addPopupInputLabel}>Correct Interval</p>
              <input
                className={styles.addPopupInput}
                placeholder='Note...'
                value={ correctInterval }
                type='number'
                onChange={ (e) => setCorrectInterval(Number(e.target.value)) }
              />
            </div>
          </div>
        </div>

        <div className={styles.addPopupInputGroup}>
          <div className={styles.extraInfoContainer}>
            <div className={styles.extraInfoBox}>
              <p className={styles.addPopupSpan}>Created: {timeSince(initialCard?.createdAt)}</p>
            </div>
            <p className={styles.addPopupSpan}>|</p>
            <div className={styles.extraInfoBox}>
              <p className={styles.addPopupSpan}>Next Review: {timeUntil(initialCard?.nextReview)}</p>
            </div>
            
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
          <div className={styles.btnContainer}>
            <button className='flex gap-2' onClick={ closePopup }>
              <X/>
              Cancel
            </button>
          </div>
          <div className={styles.deleteBtnContainer}>
            { deleteLoading ? (
              <Loading/>
            ) : (
              deleteConfirmationOpen ? (
                <button className={`flex gap-2 ${styles.deleteConfirm}`} onClick={ handleDelete }>
                  <FileMinus/>
                  Confirm?
                </button>
              ) : (
                <button className='flex gap-2' onClick={ handleDeleteConfirmion }>
                  <FileMinus/>
                  Delete
                </button>
              )
              
            )}
          </div>
          <div className={styles.saveBtnContainer}>
            { saveLoading ? (
              <Loading/>
            ) : (
              <button className='flex gap-2' onClick={ handleSave }>
                <Check/>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  )
}