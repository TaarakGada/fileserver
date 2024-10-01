import React, { useEffect, useRef, useState } from 'react';
import { getRandomFileFact } from '@/app/actions';

function RandomFact() {
    const [fact, setFact] = useState('');
    const [displayedFact, setDisplayedFact] = useState('');
    const typingSpeed = 45; // Adjust typing speed (milliseconds)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Track the timeout
    const [currentFont, setCurrentFont] = useState('monospace');
    const fontFamilyOptions = [
        'monospace',
        'sans-serif',
        'serif',
        'cursive',
        'fantasy',
        'system-ui',
    ]

    useEffect(() => {
        const getFact = async () => {
            const newFact = await getRandomFileFact();
            setFact(newFact);
        }
        getFact();
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear existing timeout if any
        }

        let currentIndex = 0;
        const text = fact;

        const typeCharacter = () => {
            // only 70 percent chance it advances
            if (Math.random() < 0.5) {
                currentIndex++;
                setDisplayedFact((prev) => text.slice(0, prev.length + 1));
            }

            setCurrentFont(fontFamilyOptions[Math.floor(Math.random() * fontFamilyOptions.length)]);
            if (currentIndex < text.length) {
                timeoutRef.current = setTimeout(typeCharacter, typingSpeed);
            }
        };

        if (fact) {
            setDisplayedFact('');
            typeCharacter();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // Clean up timeout on component unmount
            }
        };
    }, [fact]);

    const getLastWord = (text: string) => {
        const words = text.trim().split(/\s+/);
        return words.length > 0 ? words[words.length - 1] : '';
    };

    const lastWord = getLastWord(displayedFact);
    const textWithoutLastWord = displayedFact.slice(0, -lastWord.length);

    return (
        <p>
            {textWithoutLastWord}
            <span style={{ fontFamily: currentFont }}>{lastWord}</span>
        </p>
    );
}

export default RandomFact;
