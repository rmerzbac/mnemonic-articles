import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Article from './Article';
import './App.css';
import {defaultText} from './defaultText';

interface HomeProps {
  setInputText: (text: string) => void;
}

const Home: React.FC<HomeProps> = ({ setInputText }) => {
  const navigate = useNavigate();
  const [inputText, setInputTextLocal] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputTextLocal(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputText(inputText);
    navigate('/article');
  };

  return (
    <div>
      <h1>Mnemonic Article Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          required
          className='text-submission'
          value={inputText}
          onChange={handleChange}
          placeholder="Enter text here"
        />
        <br/>
        <button type="submit">Create article</button>
      </form>
      <button onClick={() => setInputTextLocal(defaultText)}>Load default article (an excerpt from the Wikipedia article on the Battle of Cannae)</button>
    </div>
  );
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');

  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path="/" element={<Home setInputText={setInputText} />} />
          <Route path="/article" element={<Article text={inputText} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
