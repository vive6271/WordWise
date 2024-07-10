import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [searchWord, setSearchWord] = useState('');
    const [wordOfDay, setWordOfDay] = useState({});
    const [wordsArray, setWordsArray] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/lookup/')
            .then(response => response.json())
            .then(data => setWordsArray(data));

        fetch('/api/wordofday/')
            .then(response => response.json())
            .then(data => setWordOfDay(data));
    }, []);

    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const handleInputChange = (e) => {
        const capitalizedWord = capitalizeFirstLetter(e.target.value);
        setSearchWord(capitalizedWord);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        if (searchWord) {
            navigate(`/search/${searchWord}`);
        } else {
            console.log("Search word is empty");
        }
    }

    return (
        <div className="home-page">
            <div className="search-bg">
                <NavBar className="nav" logoHide={true} />
                <div className="search">
                    <h1>WordWise</h1>
                    <p>Your Trusted Source for Language Mastery and Word Exploration.</p>
                    <div className="search-input">
                        <input
                            type="text"
                            placeholder="Search for a word..."
                            value={searchWord}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="input-button" onClick={handleSearch}>
                            <img src="/static/images/img_rectangle19.png" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid-content">
                <div className="word-day">
                    <h1 id="grid-heading" style={{ backgroundColor: '#FF9885'}}>Word Of The Day</h1>
                    <div className="word-day-content">
                        <h1>{wordOfDay.word}</h1>
                        <h3>{wordOfDay.sentence}</h3>
                        <p>{wordOfDay.about}</p>
                        <Link to={`/search/${wordOfDay.word}`}><p className="word-day-link" > Explore more about this word ➤ </p></Link>
                    </div>
                </div>
                <div className="top-lookups">
                    <h1 id="grid-heading" style={{ backgroundColor: '#FFC575'}}>Top Lookups Right Now</h1>
                    <div className="items-list">
                        <ol>
                            {wordsArray.map((word, index) => (
                                <li key={index}>{index + 1}. {word}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className="word-finder">
                    <Link to="/word_guess">
                        <h1 id="grid-heading" style={{ backgroundColor: '#55BA71B5'}}>Word Guess</h1>
                        <p id="grid-para" >Guess the word with missing letters.</p>
                        <p id="grid-para" style={{ marginTop: "0.5vw"}}>
                            <span id='word-box'>C</span>
                            <span id='word-box'>_</span>
                            <span id='word-box'>_</span>
                            <span id='word-box'>P</span>
                            <span id='word-box'>_</span>
                            <span id='word-box'>_</span>
                            <span id='word-box'>X</span>
                            </p>
                    </Link>
                </div>
                <div className="play-quiz">
                    <Link to="/quiz">
                        <h1 id="grid-heading" style={{ backgroundColor: '#5C72BF9C'}}>Play Quiz</h1>
                        <p  id="grid-para">Boost your vocabulary with our interactive dictionary quizzes. Test your word knowledge and have fun learning!</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
