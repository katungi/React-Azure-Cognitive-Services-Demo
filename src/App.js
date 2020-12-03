import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { debounce } from "lodash";

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [mode, setMode] = useState("languages");
  const [language, setLanguage] = useState("");
  const [languageConfidence, setConfidence] = useState("");

  const [document, setDocuments] = useState({});

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
    const debouncedSave = debounce(() => makeRequest(), 1000);
    debouncedSave();

    const makeRequest = () => {
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
          "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })  
        .then(({ data }) => {
          setDocuments(data.documents[0]);
          console.log(document.confidenceScores.positive);

          setSentiment(data.documents[0].sentiment);
          setLanguage(data.documents[0].detectedLanguage.name);
          setConfidence(data.documents[0].detectedLanguage.confidenceScore);
        console.log(document);
        })
        .catch((err) => console.log(err));
    };
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
      <br />
      <br />
      <label>Sentiment Confidence Scores</label>
      <p>
        {document !== undefined
          ? `Positive Score: `
          : ""}
      </p>
      <p>
        {document !== undefined
          ? `Neutral Score: `
          : ""}
      </p>
      <p>
        {document !== undefined
          ? `Negative Score: `
          : ""}
      </p>

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
