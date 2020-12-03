import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { debounce } from "lodash";

// These are the headers required for the network requests --> the API Key is stored in the Ocp-Apim-Subscription-Key header
const headers = {
  "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Network request to get languages analysis 💸
const requestLang = async (text) => {
  const { data } = await axios({
    method: "post",
    url: `https://codeless.cognitiveservices.azure.com/text/analytics/v3.0/languages`,
    data: {
      documents: [
        {
          language: "en",
          id: "1",
          text: text,
        },
      ],
    },
    headers,
  });
  return data;
};

// Network request to make sentiment analysis
const requestSentiment = async (text) => {
  const { data } = await axios({
    method: "post",
    url: `https://codeless.cognitiveservices.azure.com/text/analytics/v3.0/sentiment`,
    data: {
      documents: [
        {
          language: "en",
          id: "1",
          text: text,
        },
      ],
    },
    headers,
  });
  return data;
};

function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("languages");

  // state variable to store language result
  const [langDoc, setLangDoc] = useState({});

  // state variable to store sentiment result
  const [sentimentDoc, setSentimentDoc] = useState({});

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
    // Limit the request made to when a user stops typing.
    const debouncedSave = debounce(() => makeRequest(), 1500);
    debouncedSave();

    // Checks the mode and makes the appropriate request --> whether it's sentiment or language analysis
    const makeRequest = () => {
      if (mode === "languages") {
        setSentimentDoc({});
        requestLang(text)
          .then((res) => setLangDoc(res.documents[0]))
          .catch(console.log);
      }

      if (mode === "sentiment") {
        setLangDoc({});
        requestSentiment(text)
          .then((res) => setSentimentDoc(res.documents[0]))
          .catch(console.log);
      }
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

      <h2>Processed Output</h2>
      {mode === "languages" ? (
        <>
          {langDoc && langDoc !== undefined ? (
            <>
              <p>Language: {langDoc?.detectedLanguage?.name}</p>
              <p>Confidence Score: {langDoc?.detectedLanguage?.confidenceScore}</p>
            </>
          ) : null}
        </>   
      ) : (
        <>
          <label>Sentiment Confidence Scores</label>
          {sentimentDoc && sentimentDoc !== undefined ? (
            <>
              <p>Sentiment: {sentimentDoc.sentiment}</p>
              <p>Positive Score: {sentimentDoc?.confidenceScores?.positive}</p>
              <p>Neutral Score: {sentimentDoc?.confidenceScores?.neutral}</p>
              <p>Negative Score: {sentimentDoc?.confidenceScores?.negative}</p>
            </>
          ) : null
          }
        </>
      )}
    </div>
  );
}

export default App;
