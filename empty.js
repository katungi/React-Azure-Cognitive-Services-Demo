import axios as 'axios';
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
      "Ocp-Apim-Subscription-Key": "da2c66f59a9e4e61a4aed4c22fabdc93",
      "Content-Type": "application/json",
      Accept: "application/json",
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
console.log(data.documents[0].confidenceScores.positive);