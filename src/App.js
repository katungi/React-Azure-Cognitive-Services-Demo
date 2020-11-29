import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";

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
      <Button>Submit</Button>
      <br />
      <br />
      <p>{sentiment !== undefined ? sentiment : "waiting..."}</p>
    </div>
  );
}

export default App;
