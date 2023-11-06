'use client';

import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { assignAdditionProblem } from '@/lib/problems';
import { cn } from '@/lib/utils';
import { UserButton, useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';

export default function AdditionPage() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAttempted, setIsAttempted] = useState(false);

  const [includeNegative, setIncludeNegative] = useState(false);
  const [includeTwoDigit, setIncludeTwoDigit] = useState(false);
  const [numberSolved, setNumberSolved] = useState(0);

  const { userId } = useAuth();

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
  useEffect(() => {
    async function getNumberSolved() {
      const numberSolved = await axios.get('/api/solve-count');
      setNumberSolved(numberSolved.data);
    }
    if (userId) {
      getNumberSolved();
    }

    const { problemString, problemAnswer } = assignAdditionProblem(includeNegative, includeTwoDigit);
    setProblem(problemString);
    setAnswer(problemAnswer);
    (document.getElementById('answer') as HTMLInputElement).focus();
  }, []);

  // update number solved
  useEffect(() => {
    async function updateNumberSolved() {
      await axios.post('/api/solve-count', { numberSolved });
    }
    if (userId && numberSolved > 0) {
      updateNumberSolved();
    }
  }, [numberSolved]);

  return (
    <div className='flex flex-col h-screen'>
      <Navbar title='Addition' />

      {/* counter */}
      <div className='p-4 w-full align-right flex gap-2 text-xl'>
            <p>Solve counts: </p>
            <p>{numberSolved}</p>
      </div>

      <div className='p-4 flex flex-col items-center justify-center gap-2 text-4xl font-bold'>
        <div className='flex items-center justify-center gap-2 mt-32'>
          <p>{'$$'+problem+'=$$'}</p>
          <Input 
            id='answer' 
            type='number'
            className={cn('text-4xl font-bold flex-grow-0 flex-shrink-1', includeTwoDigit? 'w-32': 'w-24')}
            onKeyDown={(e) => {
              // if key is enter
              if (e.keyCode !== 13) {
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
          />
          {/* <math-field></math-field> */}
        </div>
        <div className={cn('flex flex-col items-center text-xl font-normal gap-2', isAttempted? '': 'invisible')}>
          {isCorrect && <p className='my-2'>Correct!</p>}
          {!isCorrect && <div className='flex items-center'>
              <p>Incorrect! Answer is &nbsp;</p>
              <p>{'$$'+answer+'$$'}</p>
              <p>.</p>
            </div>
          }
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
          <label htmlFor="include-negative">Include 2 digit numbers</label>
        </div>
      </div>
    </div>
  )
}