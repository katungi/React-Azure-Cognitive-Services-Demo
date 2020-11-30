import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");

  const onChangeHandler = (event) => {
    setText(event.target.value);
  };
   

  useEffect(() => {
    axios({
      method: "post",
      url:
        "https://skeshy.cognitiveservices.azure.com/text/analytics/v3.0/sentiment",
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
      })
      .catch((err) => console.log(err));
  }, [text]);

  return (
    <div className="App">
      <h1 id="heading">CodeLess Intelligence Demo</h1>
      <br/>
      <h2>User Input</h2>
      <input
        className="input"
        type='text'
        onChange={onChangeHandler}
      />
      <br />
      <br />

      <h2>Processed Output</h2>

      <p>{sentiment !== undefined ? sentiment : "waiting..."}</p>
    </div>
  );
}

export default App;
