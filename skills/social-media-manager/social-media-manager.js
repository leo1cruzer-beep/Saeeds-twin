const axios = require("axios");

// Function to generate a social media post using the LLM
async function generateSocialMediaPost(platform, topic, tone) {
  const LLM_API_KEY = process.env.LLM_API_KEY;
  const LLM_API_URL = process.env.LLM_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const LLM_MODEL = process.env.LLM_MODEL || "llama3-8b-8192";

  const prompt = `Generate a ${platform} post about "${topic}" in a ${tone} tone. Keep it concise and engaging.`;

  try {
    const response = await axios.post(
      LLM_API_URL,
      {
        model: LLM_MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${LLM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating social media post with LLM:", error.response ? error.response.data : error.message);
    return "Sorry, I couldn't generate a social media post at this time.";
  }
}

// Placeholder for actual social media posting functions
async function postToX(content) {
  return `(Simulated) Posted to X: "${content}"`;
}

async function postToLinkedIn(content) {
  return `(Simulated) Posted to LinkedIn: "${content}"`;
}

async function postToInstagram(content) {
  return `(Simulated) Posted to Instagram: "${content}"`;
}

module.exports = {
  generateSocialMediaPost,
  postToX,
  postToLinkedIn,
  postToInstagram
};
