'use client';

import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { additionWeight, assignAdditionProblem } from '@/lib/problems';
import { cn } from '@/lib/utils';
import { UserButton, useAuth } from '@clerk/nextjs';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import Script from 'next/script';
import { Progress } from '@/components/ui/progress';
import { useXP } from '@/store/useXP';
import { useLevel } from '@/store/useLevel';
import { useNumberSolved } from '@/store/useNumberSolved';

export default function AdditionPage() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('0');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAttempted, setIsAttempted] = useState(false);

  const [includeNegative, setIncludeNegative] = useState(false);
  const [includeTwoDigit, setIncludeTwoDigit] = useState(false);

  const { userId } = useAuth();

  const { numberSolved, incrementNumberSolved, setNumberSolved } = useNumberSolved();
  const { xp, incrementXP, setXP } = useXP();
  const { level, incrementLevel, setLevel } = useLevel();

  const typeset = (selector: () => HTMLElement) => {
    const mathJax = (window as any).MathJax;
    // If MathJax script hasn't been loaded yet, then do nothing.
    if (!mathJax) {
        return null;
    }
    mathJax.startup.promise = mathJax.startup.promise
        .then(() => {
        selector();
        return mathJax.typesetPromise();
        })
        .catch((err: any) => console.error(`Typeset failed: ${err.message}`));
    return mathJax.startup.promise;
  };

  const ref = React.createRef<HTMLSpanElement>();
  useEffect(() => {
      typeset(() => ref.current!);
  }, [problem, answer]);


  // init
  const mf = useRef() as any;
  useEffect(() => {
    async function getFromDb() {
      const response = await axios.get('/api/db');
      const { numberSolved, level, xp } = response.data;
      setNumberSolved(numberSolved);
      setLevel(level);
      setXP(xp);
    }
    if (userId) {
      getFromDb();
    }

    const { problemString, problemAnswer } = assignAdditionProblem(includeNegative, includeTwoDigit);
    setProblem(problemString);
    setAnswer(problemAnswer);
    (document.getElementById('answer') as HTMLInputElement).focus();
  }, []);

  // update number solved
  useEffect(() => {
    async function updateNumberSolved() {
      await axios.post('/api/db', { numberSolved, level, xp });
    }
    if (userId && numberSolved > 0) {
      updateNumberSolved();
    }
  }, [numberSolved, level, xp]);

  // update level
  useEffect(() => {
    if (xp >= level*1.25*20) {
      incrementLevel(Math.floor(xp/(level*1.25*20)));
      setXP(Math.floor(xp%(level*1.25*20)));
    }
  })

  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key !== 'Enter') {
  //       return;
  //     }
  //     console.log('captured')
  //     if (userAnswer === answer && !isCorrect) {
  //       setIsCorrect(true);
  //       setNumberSolved(numberSolved + 1);
  //     }
  //     setIsAttempted(true);
  //     (document.getElementById('next') as HTMLInputElement).focus();
  //   };

  //   // Add the event listener
  //   const mathField = mf.current;
  //   if (mathField) {
  //     (mathField as HTMLElement).addEventListener('keydown', handleKeyPress);
  //   }

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     if (mathField) {
  //       (mathField as HTMLElement).addEventListener('keydown', handleKeyPress);
  //     }
  //   };
  // }, []);

  return (
    <div className='flex flex-col h-screen'>
      <Script src='//unpkg.com/mathlive' />
      <Navbar title='Addition' />

      <div className='p-4'>
        {/* counter */}
        <div className='w-full align-right flex gap-2'>
              <p>Solve counts: </p>
              <p>{numberSolved}</p>
        </div>
        {/* level bar */}
        <div className='flex gap-4 items-center'>
          <p>Level {level} </p>
          <Progress value={Math.floor(xp/(level*1.25*20)*100)} className='w-32 h-2' />
          <p>{xp} / {Math.floor(level*1.25*20)}</p>
        </div>
      </div>

      <div className='p-4 flex flex-col items-center justify-center gap-2 text-4xl font-normal'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-2 mt-32'>
          <p className='text-3xl'>{'$$'+problem+'=$$'}</p>
          <div>
            <math-field
              id='answer'
              ref={mf}
              onInput={(e: React.ChangeEvent<HTMLInputElement> ) => {setUserAnswer(e.target.value)}}
            >
              {userAnswer}
            </math-field>
          </div>
          {/* <Input 
            id='answer' 
            type='number'
            className={cn('text-4xl font-normal flex-grow-0 flex-shrink-1', includeTwoDigit? 'w-32': 'w-24')}
            onKeyDown={(e) => {
              // if key is enter
              if (e.key !== 'Enter') {
                return;
              }
              const value = parseInt((document.getElementById('answer') as HTMLInputElement).value);
              if (value === answer && !isCorrect) {
                setIsCorrect(true);
                setNumberSolved(numberSolved + 1);
              }
              setIsAttempted(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
          /> */}
          <Button
            onKeyDown={(e) => {
              // if key is enter
              if (e.key !== 'Enter') {
                return;
              }
              if (parseInt(userAnswer) === answer && !isCorrect) {
                setIsCorrect(true);
                incrementNumberSolved();
                incrementXP(additionWeight(includeNegative, includeTwoDigit));
              }
              setIsAttempted(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
            onClick={(e) => {
              if (parseInt(userAnswer) === answer && !isCorrect) {
                setIsCorrect(true);
                incrementNumberSolved();
                incrementXP(additionWeight(includeNegative, includeTwoDigit));
              }
              setIsAttempted(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
          >Submit</Button>
        </div>
        <div className={cn('flex flex-col items-center text-xl font-normal gap-2', isAttempted? '': 'invisible')}>
          {isCorrect && <p>Correct!</p>}
          {!isCorrect && <p>Incorrect! Answer is {answer}.</p>}
          <Button 
            id='next'
            variant='outline'
            onClick={() => {
              const { problemString, problemAnswer } = assignAdditionProblem(includeNegative, includeTwoDigit);
              setProblem(problemString);
              setAnswer(problemAnswer);
              (document.getElementById('answer') as HTMLInputElement).value = '';
              setIsCorrect(false);
              setIsAttempted(false);
              (document.getElementById('answer') as HTMLInputElement).focus();
          }}>
            Next
          </Button>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 flex flex-col p-8'>
        <div className='flex gap-2 items-center'>
          <Checkbox 
            id='include-negative'
            checked={includeNegative}
            onClick={() => {
            setIncludeNegative(!includeNegative);
            const { problemString, problemAnswer } = assignAdditionProblem(!includeNegative, includeTwoDigit);
            setProblem(problemString);
            setAnswer(problemAnswer);
          }} />
          <label htmlFor="include-negative">Include negative numbers</label>
        </div>
        <div className='flex gap-2 items-center'>
          <Checkbox 
            id='include-two-digit'
            checked={includeTwoDigit}
            onClick={() => {
            setIncludeTwoDigit(!includeTwoDigit);
            const { problemString, problemAnswer } = assignAdditionProblem(includeNegative, !includeTwoDigit);
            setProblem(problemString);
            setAnswer(problemAnswer);
          }} />
          <label htmlFor="include-two-digit">Include 2 digit numbers</label>
        </div>
      </div>
    </div>
  )
}