import React, { useState, useRef, useEffect } from 'react';
import { Ollama } from 'ollama/browser';
import './App.css';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

function App() {
  const [name, setName] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobAd, setJobAd] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(500); // Default to 500 words
  const resultRef = useRef(null);

  const generateCoverLetter = async () => {
    setIsLoading(true);
    const prompt = `Your job is to create a personalized cover letter for this person applying for the specified job.
    
    Name: ${name}
    Education: ${education}
    Work Experience: ${experience}
    Desired Job Title: ${jobTitle}
    Job Ad: ${jobAd}
    
    Please provide a well-written, professional cover letter based on this information. The letter should highlight the applicant's relevant skills and experiences, and explain why they are a good fit for the position.
    
    It is important that the letter is around ${wordCount} words.`;

    try {
      const response = await ollama.chat({
        model: 'llama3.1',
        messages: [{ role: 'user', content: prompt }],
      });

      setResult(response.message.content);
    } catch (error) {
      console.error('Error:', error);
      setResult(`An error occurred: ${error.message}`);
    }

    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (resultRef.current) {
      navigator.clipboard.writeText(resultRef.current.value).then(() => {
        setCopied(true);
      });
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="App">
      <h1>Cover Letter Generator</h1>
      <div className="input-container">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
        />
        <textarea
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Enter your education..."
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter your work experience..."
        />
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter desired job title..."
        />
        <textarea
          value={jobAd}
          onChange={(e) => setJobAd(e.target.value)}
          placeholder="Paste the job ad here..."
        />
        <div className="word-count-container">
          <label htmlFor="wordCount">Make the letter around {wordCount} words</label>
          <input
            type="range"
            id="wordCount"
            min="0"
            max="500"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
          />
        </div>
        <button onClick={generateCoverLetter} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </div>
      {result && (
        <div className="result-container">
          <h2>Generated Cover Letter:</h2>
          <div className="copy-container">
            <button onClick={copyToClipboard}>Copy to Clipboard</button>
            {copied && <span className="copied-message">Copied to clipboard</span>}
          </div>
          <textarea
            ref={resultRef}
            value={result}
            readOnly
            className="result-text"
          />
        </div>
      )}
    </div>
  );
}

export default App;