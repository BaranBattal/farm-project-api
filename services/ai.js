import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content:
                    "i have a feild and what crops that i have in it, and watering data that i make, can you tell me when should i water it next time?",
            },
        ],
        model: "openai/gpt-oss-20b",
    });
}
/*
const chatCompletion = await getGroqChatCompletion();
console.log(chatCompletion.choices[0]?.message?.content || "no response");
*/
