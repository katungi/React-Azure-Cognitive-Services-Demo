import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");

   
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
      url: `https://skeshy.cognitiveservices.azure.com/text/analytics/v3.0/${mode}`,
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
        "Ocp-Apim-Subscription-Key": "a9ac1ff619c94b028020e87ef413708e",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res.data.documents[0].sentiment);
        setSentiment(res.data.documents[0].sentiment);
        console.log(res.data.documents[0].detectedLanguage.name);
        setLanguage(res.data.documents[0].detectedLanguage.name);
      })
      .catch((err) => console.log(err));
  }, [text, mode]);

  return (
    <div className="App">
      <h1 id="heading">CodeLess Intelligence Demo</h1>
      <br/>
      <h2>User Input</h2>
      <input
        className="input"
        type='text'
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
        options= {options}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <br />
      <br />

      <h2>Processed Output</h2>
      <p>{sentiment !== undefined ? sentiment : ""}</p>
      <p>{language !== undefined ? language : ""}</p>
    </div>
  );
}

export default App;
