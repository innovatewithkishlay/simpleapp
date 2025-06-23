const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const ACTIVE_MODEL = "llama-3.3-70b-versatile";

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
        model: ACTIVE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful English word assistant. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Invalid API response structure");

    const parsedContent = JSON.parse(content);

    return {
      word,
      meaning: parsedContent.meaning || "No definition available",
      example: parsedContent.example || "No example available",
      synonyms: Array.isArray(parsedContent.synonyms)
        ? parsedContent.synonyms
        : ["synonym1", "synonym2"],
      antonyms: Array.isArray(parsedContent.antonyms)
        ? parsedContent.antonyms
        : ["antonym1", "antonym2"],
      story: parsedContent.story || "No story available",
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      word,
      meaning: `Couldn't fetch definition for "${word}"`,
      example: `Example using "${word}"`,
      synonyms: ["synonym1", "synonym2"],
      antonyms: ["antonym1", "antonym2"],
      story: `A short story about "${word}"`,
    };
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
        model: ACTIVE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful writing assistant. Return only the improved sentence.",
          },
          {
            role: "user",
            content: `Rewrite this sentence in more expressive and natural English: "${sentence}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "Couldn't improve this sentence"
    );
  } catch (error) {
    console.error("Improve sentence error:", error);
    return "Sentence improvement failed";
  }
};
