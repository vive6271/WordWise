import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';

const QuizPage = () => {
    const [wordWithBlanks, setWordWithBlanks] = useState('');
    const [matchingWords, setMatchingWords] = useState([]);
    const [inputs, setInputs] = useState({});
    const [result, setResult] = useState('');
    const [showResult, setShowResult] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        fetchNewWord();
    }, []);

    const fetchNewWord = () => {
        fetch('/api/word_guess/')
            .then(response => response.json())
            .then(data => {
                setWordWithBlanks(data.word_with_blanks);
                setMatchingWords(data.matching_words);
                const initialInputs = {};
                data.word_with_blanks.split('').forEach((char, index) => {
                    if (char === '_') {
                        initialInputs[index] = '';
                    }
                });
                setInputs(initialInputs);
                setShowResult(false); // Reset showResult to hide the result
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleInputChange = (index, value) => {
        setInputs({
            ...inputs,
            [index]: value
        });

        let nextIndex = index + 1;
        while (nextIndex < wordWithBlanks.length && wordWithBlanks[nextIndex] !== '_') {
            nextIndex++;
        }
        if (nextIndex < wordWithBlanks.length) {
            inputRefs.current[nextIndex].focus();
        }
    };

    const checkWord = () => {
        let completeWord = wordWithBlanks.split('').map((char, index) => {
            return char === '_' ? inputs[index] || '_' : char;
        }).join('');

        if (matchingWords.includes(completeWord)) {
            setResult('Correct! Well done.');
        } else {
            setResult('Incorrect. Try again.');
        }
        setShowResult(true);
    };

    return (
        <div>
            <NavBar logoHide={false} />
            <div className='card'>
                <div className="word-guess-card" style={{ alignItems: 'center', width: 'auto', padding:'2vw 5vw 3vw 5vw' }}>
                    <h1>Guess the Word !</h1>
                    {!showResult && (
                        <>
                            <p>Fill in the blanks:</p>
                            <div className='word-input' style={{ marginTop: '3vh', marginBottom: '2vh' }}>
                                {wordWithBlanks.split('').map((char, index) => (
                                    char === '_' ?
                                        <input
                                            className='word-box'
                                            key={index}
                                            ref={el => inputRefs.current[index] = el}
                                            type="text"
                                            value={inputs[index] || ''}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            maxLength={1}
                                        /> :
                                        <span id='word-box' key={index}>{char}</span>
                                ))}
                            </div>
                            <button className='word-guess-btn' onClick={checkWord}>Check</button>
                        </>
                    )}
                    {showResult && (
                        <div className='word-guess-result'>
                            <div className='guess-result-top'>
                                <h2>{result}</h2>
                                <button className='try-btn' onClick={fetchNewWord}>Try Again</button>
                            </div>
                            <h3>Matching Words:</h3>
                            <h4>{matchingWords.join(', ')}</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
