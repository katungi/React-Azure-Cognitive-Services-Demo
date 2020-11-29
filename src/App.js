import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Textfield from "@atlaskit/textfield";


function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");

  const onChangeHandler = (event) => {
    setText(event.target.value);
  };
  const onOptionSelect = (event)=> {
    setMode(event.target.value);
  }
    const options = [
      {
        label: "Languages",
        value: "languages",
      },
      {
        label: "Sentiment",
        value: "sentiment",
      }
    ];

  useEffect(() => {
    axios({
      method: "post",
      url:
        `https://skeshy.cognitiveservices.azure.com/text/analytics/v3.0/${mode}`,
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
        "Accept": "application/json",
      },
    })
      .then((res) => {
        console.log(res.data.documents[0].sentiment);
        setSentiment(res.data.documents[0].sentiment);
        console.log(res.data.documents[0].detectedLanguage.name);
        setLanguage(res.data.documents[0].detectedLanguage.name);
      })
      .catch((err) => console.log(err));
  }, [text,mode]);

  return (
    <div className="App">
      <h1>CodeLess Intelligence Demo</h1>
      <Textfield
        type="text"
        name="input1"
        onChange={onChangeHandler}
        value={text}
        max="4"
      />
      <br />
      <br />
      <select value={mode} onChange={onOptionSelect}>
            {options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
      <br />
      <br />
      <p>{(sentiment !== undefined) ? sentiment : ""}</p>
      <p>{(language !== undefined) ? language : ""}</p>
    </div>
  );
}

export default App;
