"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { notify } from '@/app/util/notify';
import type { CardProps } from '@/app/cards/page';
import styles from './reviewpage.module.css';
import { NotebookText, Check } from 'lucide-react';
import Loading from '@/app/util/loading';
import { useRouter } from 'next/navigation';
import CheckAnswer from './CheckAnswer/CheckAnswer';
import WorstPopup from './WorstPopup/WorstPopup';

export interface Question {
  id: string;
  question: string;
  answers: string[];
  note?: string;
}

export default function ReviewPage(){
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrackingMap] = useState<Record<string, number>>({});
  const [questionStack, setQuestionStack] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [currentQuestionTxt, setCurrentQuestionTxt] = useState<string>('');
  const [inputHelpTxt, setInputHelpTxt] = useState<string>('');
  const [showInputHelpTxt, setShowInputHelpTxt] = useState<boolean>(false);
  const [checkingAnswer, setCheckingAnswer] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [checkAnswerShown, setCheckAnswerShown] = useState<boolean>(false);
  const [worstPopupShown, setWorstPopupShown] = useState<boolean>(false);
  const [mode, setMode] = useState<'normal' | 'worst'>('normal');

  // page load function
  useEffect(() => {

    // fetches all due cards
    const fetchDue = async () => {
      try {
        const res = await axios.get(`/api/review/due`);
        if(res.status === 200){
          console.log(res.data);
          if(!res.data || res.data.length === 0){
            return notify('error', 'No Reviews Available');
          }
          fillQuestions(res.data);
        } else {
          console.error(res.data);
          notify('error', 'Failed to fetch cards.');
        }
      } catch (err) {
        console.error(err);
        notify('error', 'Failed to fetch cards.');
      }
    }
    

    // check review type
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || '';
    if(type === 'worst'){
      // display popup
      setWorstPopupShown(true);
      setMode('worst');
    } else {
      // fetch due cards
      fetchDue();
      setMode('normal');
    }

  }, []);


  // fetch worst cards
  const fetchWorst = async (num: number) => {
    try {
      const res = await axios.get(`/api/review/worst?amt=${num}`);
      if(res.status === 200){
        console.log(res.data);
        if(!res.data || res.data.length === 0){ return notify('error', 'No Cards Available'); }
        fillQuestions(res.data);
        if(res.data.length < num){ notify('warn', `Only ${res.data.length} cards available.`);}
      } else {
        console.error(res.data);
        notify('error', 'Failed to fetch worst cards.');
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to fetch worst cards.');
    } finally {
      setWorstPopupShown(false);
      setLoading(false);
    }
  };
  


  // generate question stack
  const fillQuestions = (questions: CardProps[]): void => {
    const allQuestions: Question[] = [];
    const trackingMap: Record<string, number> = {};

    // create question objects in both directions
    questions.forEach((item: CardProps) => {
      const { id, partA, partB, aliasesA = [], aliasesB = [], note, reversible } = item; // extract and default alias arrays

      if(reversible){
        // insert 2 questions both ways
        allQuestions.push({ id: id, question: partA, answers: [partB, ...aliasesB], note: note });
        allQuestions.push({ id: id, question: partB, answers: [partA, ...aliasesA], note: note });
        trackingMap[id] = 0;
      } else {
        // insert only one way question
        allQuestions.push({ id: id, question: partA, answers: [partB, ...aliasesB] });
        trackingMap[id] = 1;
      }
    });

    // shuffle
    for(let i = allQuestions.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // initalise quiz
    setTrackingMap(trackingMap);
    setQuestionStack(allQuestions);
    setTotalQuestions(allQuestions.length);
    setCurrentQuestionTxt(allQuestions[0].question);
    setLoading(false);
  };


  const handleSubmit = () => {
    // display error msg if no input entered
    if(!input){
      setInputHelpTxt('Enter an answer');
      setShowInputHelpTxt(true);
      return;
    };
    setShowInputHelpTxt(false);

    if(questionStack.length === 0) return

    // user presses enter not knowing if its correct or wrong
    if(checkingAnswer === 'none'){
      const correctAnswers = questionStack[0].answers.map((answer: string) => answer.toLowerCase());

      
      if(correctAnswers.includes(input.toLowerCase())){
        // answer correct
        setCheckingAnswer('correct');
        setCompletedCount((prev) => prev + 1);

        // add one to tracking map for this word
        const cardId = questionStack[0].id;
        setTrackingMap((prev) => {
          const currentCount = prev[cardId] || 0;
          const newCount = currentCount + 1;
        
          // only send srs update if both variants of card is completed (or the single non reversible variant)
          if(newCount === 2){ sendSRSUpdate(cardId, true); }
        
          return { ...prev, [cardId]: newCount };
        });

      } else {
        // answer incorrect
        setCheckingAnswer('incorrect');
        sendSRSUpdate(questionStack[0].id, false);
      }

    
    } else if(checkingAnswer === 'correct'){
      // user sees answer correct and proceedes to next

      // remove current question from the stack
      setQuestionStack((prev) => {
        const newStack = [...prev];
        newStack.shift();
        return newStack;
      })

      setInput("");
      setCheckingAnswer("none");
      setCheckAnswerShown(false);

      // if there are more quetsions, set the next one
      if (questionStack.length > 1) {
        setCurrentQuestionTxt(questionStack[1].question);
      } else {
      // no more questions, go back to dashboard
        router.push('/');
      }

    
    } else if(checkingAnswer === 'incorrect'){
      // user sees answer incorrect and proceedes to next

      // move current question to random point in question stack but not 1st
      setQuestionStack((prev) => {
        if (prev.length <= 1) return prev;

        const newStack = [...prev];
        const currentQuestion = newStack.shift();

        const randomPos = Math.floor(Math.random() * newStack.length) + 1;
        newStack.splice(Math.min(randomPos, newStack.length), 0, currentQuestion!);

        setCurrentQuestionTxt(newStack[0].question);
        return newStack;
      })

      setInput("");
      setCheckingAnswer("none");
      setCheckAnswerShown(false);
    }
  }

  // display answer dialog
  const onCheck = () => {
    if(checkingAnswer === 'none'){ return; }
    setCheckAnswerShown(true);
  }
  
  // update card values on server
  const sendSRSUpdate = (cardId: string, correct: boolean) => {
    if(mode === 'worst'){ return; }
    console.log(cardId, correct);
  }


  return (
    <>
      { loading ? (
        <div className='flex justify-center mt-10'>
          <Loading/>
        </div>
      ) : (
        <>
          <div className={styles.container}>

            <div className={styles.progressTxtContainer}>
              <p className={styles.progressTxt}>{`${completedCount}/${totalQuestions}`}</p>
            </div>

            <div className={styles.questionContainer}>
              <div>
                <h1 className={styles.questionTxt}>{currentQuestionTxt}</h1>
              </div>
            </div>

            <div className='flex justify-center'>
              <p className={`${styles.helpTxt} ${showInputHelpTxt ? styles.show : ''}`}>{inputHelpTxt}</p>
            </div>
          
            <div className={styles.inputContainer}>
              <input
                className={ `${styles.input} ${checkingAnswer === 'correct' ? styles.correct : ''} ${checkingAnswer === 'incorrect' ? styles.incorrect : ""}` }
                value={ input }
                onChange={ (e) => setInput(e.target.value) }
                onKeyDown={ (e) => { if(e.key === 'Enter'){ handleSubmit(); } }}
                placeholder='Answer...'
              />
            </div>

            <div className={ styles.btnsUnderInput }>

              <button onClick={ onCheck } className={ `${checkingAnswer === 'none' ? styles.grayBtn : '' }` }>
                <div className={ styles.btnInner }>
                  <NotebookText/>
                  <p>Check</p>
                </div>
              </button>

              <button onClick={ handleSubmit }>
                <div className={ styles.btnInner }>
                  <Check/>
                  <p>Submit</p>
                </div>
              </button>

            </div>
          </div>

          <CheckAnswer
            currentItem={ questionStack[0] }
            open={ checkAnswerShown }
          />
        </>
      )}

      <WorstPopup
        open={ worstPopupShown }
        setOpen={ setWorstPopupShown }
        fetch={ fetchWorst }
      />
    
    </>
    
  )
}