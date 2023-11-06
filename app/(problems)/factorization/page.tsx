'use client';

import axios from 'axios';
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assignFactorizationProblem } from "@/lib/problems";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Checkbox } from '@/components/ui/checkbox';

export default function FactorizationPage() {
    const [problem, setProblem] = useState('');
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [isAttempted, setIsAttempted] = useState(false);

    const [includeNegative, setIncludeNegative] = useState(false);
    const [includeTwoDigit, setIncludeTwoDigit] = useState(false);
    const [numberSolved, setNumberSolved] = useState(0);

    const { userId } = useAuth();

    // init
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

    return (
        <div className='flex flex-col h-screen'>
            <Navbar title='Factorization' />

            {/* counter */}
            <div className='p-4 w-full align-right flex gap-2 text-xl'>
                    <p>Solve counts: </p>
                    <p>{numberSolved}</p>
            </div>

            <div className='p-4 flex flex-col items-center justify-center grow gap-2 text-4xl font-bold'>
                <div className='flex items-center justify-center gap-2 py-16'>
                <p>{problem}</p>
                <p> = </p>
                <Input
                    id='answer' 
                    type='string'
                    className={cn('text-4xl font-bold flex-grow-0 flex-shrink-1', includeTwoDigit? 'w-32': 'w-24')}
                    onKeyDown={(e) => {
                    // if key is enter
                    if (e.keyCode !== 13) {
                        return;
                    }
                    const value = (document.getElementById('answer') as HTMLInputElement).value;
                    if (value === answer && !isCorrect) {
                        setIsCorrect(true);
                        setNumberSolved(numberSolved + 1);
                    }
                    setIsAttempted(true);
                    (document.getElementById('next') as HTMLInputElement).focus();
                    }}
                />
                </div>
                <div className={cn('flex flex-col items-center gap-8', isAttempted? '': 'invisible')}>
                {isCorrect && <p>Correct!</p>}
                {!isCorrect && <p>Incorrect! Answer is {answer}.</p>}
                <Button
                    id='next'
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