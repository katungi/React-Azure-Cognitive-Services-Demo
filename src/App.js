import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
const dotenv  = require('dotenv');

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [mode, setMode] = useState("languages");
  const [language, setLanguage] = useState("");
  const [languageConfidence, setConfidence] = useState("");
  const [negConfidence, setNegative] = useState('');
  const [posConfidence, setPositive] = useState('');
  const [neutralConfidence, setNeutral] = useState('');

  const env = dotenv.config();
  const onChangeHandler = (event) => {
    setText(event.target.value);
  };
  const onOptionSelect = (event) => {
    setMode(event.target.value);
  };
  const options = [
    {
      label: "Language Detection",
      value: "languages",
    },
    {
      label: "Sentiment Analysis",
      value: "sentiment",
    },
  ];

  useEffect(() => {
    axios({
      method: "post",
      url: `https://codeless.cognitiveservices.azure.com/text/analytics/v3.0/${mode}`,
      data: {
        documents: [
          {
            language: "en",
            id: "1",
            text: text,
          },
        ],  
      },
      headers: {
        "Ocp-Apim-Subscription-Key": env.SECRET_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((res) => {
        console.log(res.data.documents[0].sentiment);
        setSentiment(res.data.documents[0].sentiment);
        console.log(res.data.documents[0].detectedLanguage.name);
        setLanguage(res.data.documents[0].detectedLanguage.name);
        setConfidence(res.data.documents[0].detectedLanguage.confidenceScore);
        console.log(res.data.documents[0].confidenceScores);

        setNeutral(res.data.documents[0].confidenceScores.neutral);
        setPositive(res.data.documents[0].confidenceScores.positive);
        setNegative(res.data.documents[0].confidenceScores.negative);
        
      })
      .catch((err) => console.log(err));
  }, [text, mode]);

  return (
    <div className="App">
      <h1 id="heading">CodeLess Intelligence Demo</h1>
      <br />
      <h2>User Input</h2>
      <input
        className="input"
        type="text"
        onChange={onChangeHandler}
        value={text}
        max="4"
      />
      <br />
      <br />
      <select
        value={mode}
        onChange={onOptionSelect}
        className="single-select"
        classNamePrefix="react-select"
        placeholder="Choose an Analysis Mode"
        options={options}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <br />
      <br />

      <h2>Processed Output</h2>
      <p>{sentiment !== undefined ? `Sentiment: ${sentiment}` : ""}</p>
      <p>{language !== undefined || null ? `Language: ${language}` : ""}</p>
      <br/>
      <br/>
      <label>Sentiment Confidence Scores</label>
      <p>{sentiment !== undefined ? `Positive Score: ${neutralConfidence}` : ""}</p>
      <p>{sentiment !== undefined ? `Neutral Score: ${posConfidence}` : ""}</p>
      <p>{sentiment !== undefined ? `Negative Score: ${negConfidence}` : ""}</p>
      
      <label>Language Confidence Scores</label>
    
      <p>
        {language !== undefined
          ? `Confidence Score: ${languageConfidence}`
          : ""}
      </p>
         
      
    </div>
  );
}

export default App;
