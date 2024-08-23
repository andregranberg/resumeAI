import React, { useState } from 'react';
import { Ollama } from 'ollama/browser';
import './App.css';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

function App() {
  const [name, setName] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [jobAd, setJobAd] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResume = async () => {
    setIsLoading(true);
    const prompt = `Your job is to create a resume and personal letter for this person, and for this job ad.
    
    Name: ${name}
    Education: ${education}
    Work Experience: ${experience}
    Job Ad: ${jobAd}
    
    Please provide a well-formatted resume and a personalized cover letter based on this information.`;

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

  return (
    <div className="App">
      <h1>Resume and Cover Letter Generator</h1>
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
        <textarea
          value={jobAd}
          onChange={(e) => setJobAd(e.target.value)}
          placeholder="Paste the job ad here..."
        />
        <button onClick={generateResume} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Resume and Cover Letter'}
        </button>
      </div>
      {result && (
        <div className="result-container">
          <h2>Generated Resume and Cover Letter:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;