'use client';

import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { assignProblem } from '@/lib/problems';
import { cn } from '@/lib/utils';
import { Menu, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const [includeNegative, setIncludeNegative] = useState(false);

  useEffect(() => {
    const { problemString, problemAnswer } = assignProblem(includeNegative);
    setProblem(problemString);
    setAnswer(problemAnswer);
    (document.getElementById('answer') as HTMLInputElement).focus();
  }, []);

  return (
    <div className='flex flex-col h-screen'>
      {/* navbar */}
      <div className='p-4 flex justify-between'>
        {/* menu bar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon'>
              <Menu className='h-[1.2rem] w-[1.2rem]' />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col pt-4'>
              
            </div>
          </SheetContent>
        </Sheet>
        <h1 className='text-4xl font-bold'>Arithmetics</h1>
        <DarkModeToggle />
      </div>

      <div className='p-4 flex flex-col items-center justify-center grow gap-2 text-4xl font-bold'>
        <div className='flex items-center justify-center gap-2 py-16'>
          <p>{problem}</p>
          <p> = </p>
          <Input 
            id='answer' 
            type='number'
            className='text-4xl font-bold w-24 flex-grow-0 flex-shrink-1'
            onKeyDown={(e) => {
              // if key is enter
              if (e.keyCode !== 13) {
                return;
              }
              const value = parseInt((document.getElementById('answer') as HTMLInputElement).value);
              if (value === answer) {
                setIsCorrect(true);
              }
              setIsSolved(true);
              (document.getElementById('next') as HTMLInputElement).focus();
            }}
          />
        </div>
        <div className={cn('flex flex-col items-center gap-8', isSolved? '': 'invisible')}>
          {isCorrect && <p>Correct!</p>}
          {!isCorrect && <p>Incorrect! Answer is {answer}.</p>}
          <Button 
            id='next'
            onClick={() => {
            const { problemString, problemAnswer } = assignProblem(includeNegative);
            setProblem(problemString);
            setAnswer(problemAnswer);
            (document.getElementById('answer') as HTMLInputElement).value = '';
            setIsCorrect(false);
            setIsSolved(false);
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
                  const { problemString, problemAnswer } = assignProblem(!includeNegative);
                  setProblem(problemString);
                  setAnswer(problemAnswer);
                }} />
                <label htmlFor="include-negative">Include negative numbers</label>
              </div>
            </div>
    </div>
  )
}