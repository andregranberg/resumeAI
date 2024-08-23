import React, { useState, useRef, useEffect } from 'react';
import { Ollama } from 'ollama/browser';
import './App.css';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

const degreeOptions = ["PhD", "Masters", "Bachelors", "High School"];

function App() {
  const [name, setName] = useState(() => localStorage.getItem('name') || '');
  const [educations, setEducations] = useState(() => {
    const savedEducations = localStorage.getItem('educations');
    return savedEducations ? JSON.parse(savedEducations) : [{ school: '', degree: '', level: 'Bachelors' }];
  });
  const [workExperiences, setWorkExperiences] = useState(() => {
    const savedExperiences = localStorage.getItem('workExperiences');
    return savedExperiences ? JSON.parse(savedExperiences) : [{ company: '', title: '' }];
  });
  const [applyingCompany, setApplyingCompany] = useState(() => localStorage.getItem('applyingCompany') || '');
  const [applyingTitle, setApplyingTitle] = useState(() => localStorage.getItem('applyingTitle') || '');
  const [jobAd, setJobAd] = useState(() => localStorage.getItem('jobAd') || '');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(() => parseInt(localStorage.getItem('wordCount')) || 500);
  const resultRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('name', name);
    localStorage.setItem('educations', JSON.stringify(educations));
    localStorage.setItem('workExperiences', JSON.stringify(workExperiences));
    localStorage.setItem('applyingCompany', applyingCompany);
    localStorage.setItem('applyingTitle', applyingTitle);
    localStorage.setItem('jobAd', jobAd);
    localStorage.setItem('wordCount', wordCount.toString());
  }, [name, educations, workExperiences, applyingCompany, applyingTitle, jobAd, wordCount]);

  const addEducation = () => {
    setEducations([...educations, { school: '', degree: '', level: 'Bachelors' }]);
  };

  const removeEducation = (index) => {
    const newEducations = educations.filter((_, i) => i !== index);
    setEducations(newEducations);
  };

  const updateEducation = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index][field] = value;
    setEducations(newEducations);
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { company: '', title: '' }]);
  };

  const removeWorkExperience = (index) => {
    const newExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(newExperiences);
  };

  const updateWorkExperience = (index, field, value) => {
    const newExperiences = [...workExperiences];
    newExperiences[index][field] = value;
    setWorkExperiences(newExperiences);
  };

  const generateCoverLetter = async () => {
    setIsLoading(true);
    const educationString = educations
      .map(edu => `I have a ${edu.level} from ${edu.school} in ${edu.degree}.`)
      .join('\n');
    const experienceString = workExperiences
      .map((exp, index) => `Experience ${index + 1}: ${exp.company} - ${exp.title}`)
      .join('\n');

    const prompt = `Your job is to create a personalized cover letter for this person applying for the specified job.
    
    Name: ${name}
    Education:
    ${educationString}
    Work Experience:
    ${experienceString}
    Applying for:
    Company: ${applyingCompany}
    Position: ${applyingTitle}
    Job Ad: ${jobAd}
    
    Please provide a well-written, professional cover letter based on this information. The letter should highlight the applicant's relevant skills and experiences, and explain why they are a good fit for the ${applyingTitle} position at ${applyingCompany}.
    
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
        <div className="input-group">
          <label htmlFor="name">Full Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="input-group">
          <label>Education:</label>
          {educations.map((edu, index) => (
            <div key={index} className="education-entry">
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                placeholder="School/University name"
              />
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="Degree"
              />
              <select
                value={edu.level}
                onChange={(e) => updateEducation(index, 'level', e.target.value)}
              >
                {degreeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button onClick={() => removeEducation(index)}>Delete</button>
            </div>
          ))}
          <button onClick={addEducation}>Add Education</button>
        </div>
        <div className="input-group">
          <label>Work Experience:</label>
          {workExperiences.map((exp, index) => (
            <div key={index} className="work-experience-entry">
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                placeholder="Company name"
              />
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                placeholder="Job title"
              />
              <button onClick={() => removeWorkExperience(index)}>Delete</button>
            </div>
          ))}
          <button onClick={addWorkExperience}>Add Work Experience</button>
        </div>
        <div className="input-group">
          <label>Where are you applying?</label>
          <div className="applying-entry">
            <input
              type="text"
              value={applyingCompany}
              onChange={(e) => setApplyingCompany(e.target.value)}
              placeholder="Company name"
            />
            <input
              type="text"
              value={applyingTitle}
              onChange={(e) => setApplyingTitle(e.target.value)}
              placeholder="Job title"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="jobAd">Job Advertisement:</label>
          <textarea
            id="jobAd"
            value={jobAd}
            onChange={(e) => setJobAd(e.target.value)}
            placeholder="Paste the job advertisement here"
          />
        </div>
        <div className="input-group">
          <label htmlFor="wordCount">Word Count: {wordCount}</label>
          <input
            type="range"
            id="wordCount"
            min="0"
            max="1000"
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
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