
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { readLatestEmails, sendEmail, searchEmails } = require("./.agents/skills/email-manager/email-manager");
const { generateSocialMediaPost, postToX, postToLinkedIn, postToInstagram } = require("./.agents/skills/social-media-manager/social-media-manager");

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT || 3000;
const url = process.env.WEBHOOK_URL; // Vercel deployment URL

// Create a bot that uses webhooks
const bot = new TelegramBot(token);

// Set the webhook
bot.setWebHook(`${url}/webhook`).then(() => {
  console.log(`Webhook set to ${url}/webhook`);
}).catch(err => {
  console.error("Error setting webhook:", err.message);
});

const app = express();

// Parse incoming requests as JSON
app.use(bodyParser.json());

// LLM API configuration (e.g., Groq or OpenRouter)
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_API_URL = process.env.LLM_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const LLM_MODEL = process.env.LLM_MODEL || "llama3-8b-8192"; // Example model

// Webhook endpoint to receive updates from Telegram
app.post("/webhook", async (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    bot.sendMessage(chatId, "Welcome! I am your personal agent bot. How can I help you today?");
  } else if (text.startsWith("/email_read")) {
    try {
      const emails = await readLatestEmails();
      if (emails.length > 0) {
        let response = "Latest emails:\n";
        emails.forEach((email) => {
          response += `\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\n---\n`;
        });
        bot.sendMessage(chatId, response);
      } else {
        bot.sendMessage(chatId, "No emails found.");
      }
    } catch (error) {
      console.error("Error reading emails:", error);
      bot.sendMessage(chatId, "Failed to read emails. Please check your email configuration.");
    }
  } else if (text.startsWith("/email_send")) {
    // Expected format: /email_send to@example.com Subject of email Body of email
    const parts = text.split(" ");
    if (parts.length >= 4) {
      const to = parts[1];
      const subject = parts[2];
      const body = parts.slice(3).join(" ");
      try {
        await sendEmail(to, subject, body);
        bot.sendMessage(chatId, `Email sent to ${to} with subject "${subject}".`);
      } catch (error) {
        console.error("Error sending email:", error);
        bot.sendMessage(chatId, "Failed to send email. Please check your email configuration.");
      }
    } else {
      bot.sendMessage(chatId, "Usage: /email_send <to> <subject> <body>");
    }
  } else if (text.startsWith("/email_search")) {
    // Expected format: /email_search keyword
    const keyword = text.substring("/email_search ".length);
    if (keyword) {
      try {
        const emails = await searchEmails(keyword);
        if (emails.length > 0) {
          let response = `Emails matching "${keyword}":\n`;
          emails.forEach((email) => {
            response += `\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\n---\n`;
          });
          bot.sendMessage(chatId, response);
        } else {
          bot.sendMessage(chatId, `No emails found matching "${keyword}".`);
        }
      } catch (error) {
        console.error("Error searching emails:", error);
        bot.sendMessage(chatId, "Failed to search emails. Please check your email configuration.");
      }
    } else {
      bot.sendMessage(chatId, "Usage: /email_search <keyword>");
    }
  } else if (text.startsWith("/social_generate")) {
    // Expected format: /social_generate platform topic tone
    const parts = text.split(" ");
    if (parts.length >= 4) {
      const platform = parts[1];
      const topic = parts[2];
      const tone = parts.slice(3).join(" ");
      try {
        const postContent = await generateSocialMediaPost(platform, topic, tone);
        bot.sendMessage(chatId, `Generated ${platform} post: "${postContent}"\n\nTo post, use: /social_post <platform> <content>`);
      } catch (error) {
        console.error("Error generating social media post:", error);
        bot.sendMessage(chatId, "Failed to generate social media post.");
      }
    } else {
      bot.sendMessage(chatId, "Usage: /social_generate <platform> <topic> <tone>");
    }
  } else if (text.startsWith("/social_post")) {
    // Expected format: /social_post platform content
    const parts = text.split(" ");
    if (parts.length >= 3) {
      const platform = parts[1];
      const content = parts.slice(2).join(" ");
      let result = "";
      try {
        switch (platform.toLowerCase()) {
          case "x":
          case "twitter":
            result = await postToX(content);
            break;
          case "linkedin":
            result = await postToLinkedIn(content);
            break;
          case "instagram":
            result = await postToInstagram(content);
            break;
          default:
            result = `Unsupported platform: ${platform}. Content: "${content}"`;
        }
        bot.sendMessage(chatId, result);
      } catch (error) {
        console.error("Error posting to social media:", error);
        bot.sendMessage(chatId, `Failed to post to ${platform}.`);
      }
    } else {
      bot.sendMessage(chatId, "Usage: /social_post <platform> <content>");
    }
  } else {
    // General Q&A using LLM
    try {
      const response = await axios.post(
        LLM_API_URL,
        {
          model: LLM_MODEL,
          messages: [{ role: "user", content: text }],
        },
        {
          headers: {
            "Authorization": `Bearer ${LLM_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      bot.sendMessage(chatId, response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error with LLM API:", error.response ? error.response.data : error.message);
      bot.sendMessage(chatId, "Sorry, I couldn\'t process that request with the AI. Please try again later.");
    }
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
