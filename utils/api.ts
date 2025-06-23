const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const fetchWordData = async (word: string) => {
  const prompt = `Explain the word "${word}" in simple English. Give 1 simple sentence example, 2 synonyms, 2 antonyms, and 1 mini story (3 lines). Format your response as JSON with these exact keys: meaning, example, synonyms (array), antonyms (array), story.`;

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
              "You are a helpful English vocabulary assistant. Always respond with valid JSON in the exact format requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Invalid API response structure");
    }

    const content = data.choices[0].message.content;
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON content:", content);
      // Fallback: create a simple response
      return {
        word,
        meaning: content || `Definition for "${word}" could not be parsed`,
        example: `Here's an example with "${word}".`,
        synonyms: ["related", "similar"],
        antonyms: ["opposite", "different"],
        story: `Once upon a time, someone used the word "${word}" in a sentence. It was meaningful. The end.`,
      };
    }

    return {
      word,
      meaning: parsedContent.meaning || "No meaning available",
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
              "You are a helpful writing assistant. Rewrite sentences to be more expressive and natural. Return only the improved sentence, nothing else.",
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

    console.log("Improve sentence response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Improve sentence API Response:", data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid API response structure");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Improve sentence API Error:", error);
    throw error;
  }
};
