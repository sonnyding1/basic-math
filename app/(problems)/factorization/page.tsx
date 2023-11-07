'use client';

import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { assignFactorizationProblem, evalFactorizationProblem } from '@/lib/problems';
import { cn } from '@/lib/utils';
import { UserButton, useAuth } from '@clerk/nextjs';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import Script from 'next/script';
import "//unpkg.com/mathlive";
// import MathField from 'math-field';

export default function FactorizationPage() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
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
  const mf = useRef();
  useEffect(() => {
    async function getNumberSolved() {
      const numberSolved = await axios.get('/api/solve-count');
      setNumberSolved(numberSolved.data);
    }
    if (userId) {
      getNumberSolved();
    }

    const { problemString, problemAnswer } = assignFactorizationProblem(includeNegative, includeTwoDigit);
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
      <Navbar title='Factorization' />

      {/* counter */}
      <div className='p-4 w-full align-right flex gap-2 text-xl'>
            <p>Solve counts: </p>
            <p>{numberSolved}</p>
      </div>

      <div className='p-4 flex flex-col items-center justify-center gap-2 text-4xl font-normal'>
        <div className='flex items-center justify-center gap-2 mt-32'>
          <p className='text-3xl'>{'$$'+problem+'=$$'}</p>
          <div>
            <math-field
              id='answer'
              ref={mf}
              onInput={(e: React.ChangeEvent<HTMLInputElement> ) => {setUserAnswer(e.target.value)}}
              // onInput={(e: { target: { getValue: () => React.SetStateAction<number>; }; }) => {setUserAnswer(e.target.getValue())}}
            >
              {userAnswer}
            </math-field>
          </div>
          {/* <Input 
            id='answer' 
            type='string'
            className={cn('text-4xl font-normal flex-grow-0 flex-shrink-1', includeTwoDigit? 'w-64': 'w-64')}
            onKeyDown={(e) => {
              // if key is enter
              if (e.key !== 'Enter') {
                return;
              }
              const value = (document.getElementById('answer') as HTMLInputElement).value;
              if (evalFactorizationProblem(problem, value) && !isCorrect) {
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
              if (evalFactorizationProblem(problem, userAnswer) && !isCorrect) {
                setIsCorrect(true);
                setNumberSolved(numberSolved + 1);
              }
              setIsAttempted(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
            onClick={(e) => {
              if (evalFactorizationProblem(problem, userAnswer) && !isCorrect) {
                setIsCorrect(true);
                setNumberSolved(numberSolved + 1);
              }
              setIsAttempted(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
          >Submit</Button>
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
              const { problemString, problemAnswer } = assignFactorizationProblem(includeNegative, includeTwoDigit);
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
            const { problemString, problemAnswer } = assignFactorizationProblem(!includeNegative, includeTwoDigit);
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
            const { problemString, problemAnswer } = assignFactorizationProblem(includeNegative, !includeTwoDigit);
            setProblem(problemString);
            setAnswer(problemAnswer);
          }} />
          <label htmlFor="include-negative">Include 2 digit numbers</label>
        </div>
      </div>
    </div>
  )
}