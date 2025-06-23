const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const fetchWordData = async (word: string) => {
  const prompt = `Explain the word "${word}" in simple English. 
  Give 1 simple sentence example, 2 synonyms, 2 antonyms, and 1 mini story (3 lines). 
  Return response as JSON with keys: meaning, example, synonyms, antonyms, story`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful English word assistant. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return {
      word,
      meaning: content.meaning,
      example: content.example,
      synonyms: Array.isArray(content.synonyms)
        ? content.synonyms
        : [content.synonyms],
      antonyms: Array.isArray(content.antonyms)
        ? content.antonyms
        : [content.antonyms],
      story: content.story,
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const improveSentence = async (sentence: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful writing assistant. Return only plain text.",
          },
          {
            role: "user",
            content: `Rewrite this sentence in more expressive and natural English: "${sentence}"`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
