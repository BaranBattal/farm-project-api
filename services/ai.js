const getGroqHarvestEstimate = async (cropName, planting_date, weather, farm) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY");
    }

    const safeWeather = typeof weather === "string" ? weather : JSON.stringify(weather);

    const safeFarm = typeof farm === "string" ? farm : JSON.stringify(farm);

    const prompt = `You are an agriculture assistant.

Estimate the expected nearest harvest date for the crop.

Rules:
- Return ONLY one date in YYYY-MM-DD format.
- Do not explain it to me.
- take care of every information that i send, the nearest harvest may not be in the next few years if crop is still not big enough, or maybe today or tomorrow.
- Do not return JSON.
- Always give your estimate carfully.

Crop name: ${cropName}
Planting date: ${planting_date}
Farm information: ${safeFarm}
Weather of location: ${safeWeather}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Return exactly one estimated harvest date in YYYY-MM-DD format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message);
    const content = data?.choices?.[0]?.message?.content?.trim();

    console.log("Groq raw content:", content);

    const match = content?.match(/\d{4}-\d{2}-\d{2}/);

    if (!match) {
      throw new Error(`Groq did not return a valid date. Raw output: ${content}`);
    }

    return match[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = getGroqHarvestEstimate;
