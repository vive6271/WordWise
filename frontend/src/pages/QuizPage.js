import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";

const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        fetch('/api/quiz/')
            .then(response => response.json())
            .then(data => setQuestions(data));
    }, []);

    const handleAnswer = (answer) => {
        setUserAnswers([...userAnswers, answer]);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setIsFinished(true);
            }
        }, 300); // Delay of 0.3 second
    };

    const startQuiz = () => {
        setQuizStarted(true);
    };

    const calculateScore = () => {
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correct) {
                score += 1;
            }
        });
        return score;
    };

    return (
        <div>
            <NavBar logoHide={false} />
            <div className='card'>
                {!quizStarted ? (
                    <div className="start-grid" style={{justifyContent: "center", alignItems: "center"}}>
                        <button className="start-quiz-btn" onClick={startQuiz}>Start Quiz</button>
                    </div>
                ) : !isFinished ? (
                    <div className='quiz-grid'>
                        <h2>Q{currentQuestion + 1}. {questions[currentQuestion].question}</h2>
                        <div className='quiz-answer'>
                            {questions[currentQuestion].answers.map((answer, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(answer)}
                                    className={`quiz-button ${userAnswers[currentQuestion] === answer ? (answer === questions[currentQuestion].correct ? 'correct' : 'incorrect') : ''}`}
                                >
                                    {answer}
                                </button>))}
                        </div>
                    </div>
                ) : (
                    <div className='result' style={{ textAlign: "center", marginTop: "4vh", marginBottom: "10vh" }}>
                        <h2 style={{ fontSize: "5vh", color: "#FF5F6D", marginTop: "2vh", textDecoration: "underline", marginBottom: "5vh" }}>Quiz Finished</h2>
                        <h2 style={{ fontSize: "5vh", marginTop: "4vh", marginBottom: "5vh" }}>Your score: {calculateScore()}/{questions.length}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizPage;