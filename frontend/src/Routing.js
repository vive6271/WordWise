import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import AnswerPage from './pages/AnswerPage';
import WordGuess from './pages/WordGuess';

const Routing = (props) => {
    return (
        <Routes>
          <Route exact path='/' element={<HomePage/>} />
          <Route path='/quiz' element={<QuizPage/>} />
          <Route path='/support' element={<SupportPage/>} />
          <Route path='/privacy' element={<PrivacyPage/>} />
          <Route path='/about' element={<AboutPage/>} />
          <Route path='/search/:word' element={<AnswerPage/>} />
          <Route path='/word_guess' element={<WordGuess/>} />
       </Routes>
    );
}

export default Routing;