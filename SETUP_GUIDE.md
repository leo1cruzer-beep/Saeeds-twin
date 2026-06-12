# Personal Telegram Agent Bot Setup Guide

This guide will walk you through setting up your personal Telegram agent bot, enabling it to manage emails, automate social media content generation, and answer general questions. The bot will be hosted on Vercel using GitHub Actions for continuous, free 24/7 operation.

## Prerequisites

Before you begin, ensure you have the following:

1.  **GitHub Account**: For hosting your bot's code and deploying via Vercel.
2.  **Telegram Account**: To create and interact with your bot.
3.  **Gmail Account**: For email management features. You will need to generate an App Password for secure access.
4.  **Groq or OpenRouter Account**: For access to a Large Language Model (LLM) API. Both offer generous free tiers.
5.  **Vercel Account**: For free serverless hosting and continuous deployment.

## Step-by-Step Setup

### 1. Create Your Telegram Bot

1.  Open Telegram and search for `@BotFather`.
2.  Start a chat with `@BotFather` and send the command `/newbot`.
3.  Follow the instructions to choose a name and a username for your bot. The username must end with `bot` (e.g., `MyPersonalAgentBot`).
4.  `@BotFather` will provide you with an **HTTP API Token**. **Save this token securely**, as it is essential for your bot to function.

### 2. Obtain LLM API Key (Groq or OpenRouter)

#### Option A: Groq

1.  Go to [Groq](https://groq.com/) and sign up for a free account.
2.  Navigate to the API keys section and generate a new API key. **Save this key securely**.

#### Option B: OpenRouter

1.  Go to [OpenRouter](https://openrouter.ai/) and sign up for a free account.
2.  Navigate to the API keys section and generate a new API key. **Save this key securely**.

### 3. Configure Gmail for App Password

To allow your bot to access your Gmail account without compromising your main password, you need to generate an App Password.

1.  Go to your [Google Account Security page](https://myaccount.google.com/security).
2.  Under 
"How you sign in to Google" section, click on **2-Step Verification** and ensure it is **ON**. If not, enable it.
3.  Once 2-Step Verification is enabled, go back to the [Google Account Security page](https://myaccount.google.com/security) and click on **App passwords**.
4.  Select **Mail** for the app and **Other (Custom name)** for the device. Enter a name like "Telegram Bot" and click **Generate**.
5.  Google will provide you with a 16-character App password. **Save this password securely**.

### 4. Create a GitHub Repository

1.  Go to [GitHub](https://github.com/) and log in to your account.
2.  Click on the **+** sign in the top right corner and select **New repository**.
3.  Give your repository a name (e.g., `personal-telegram-agent`). Make it **Private** to protect your API keys and sensitive information.
4.  Do **not** initialize the repository with a README, .gitignore, or license file. You will push your existing code.
5.  Click **Create repository**.

### 5. Upload Your Bot Code to GitHub

1.  Open your terminal or command prompt.
2.  Navigate to the `personal-agent-bot` directory you created earlier:
    ```bash
    cd /home/ubuntu/personal-agent-bot
    ```
3.  Initialize a Git repository in your project folder:
    ```bash
    git init
    ```
4.  Add all your project files to the repository:
    ```bash
    git add .
    ```
5.  Commit your changes:
    ```bash
    git commit -m "Initial commit: Personal Telegram Agent Bot"
    ```
6.  Add your GitHub repository as a remote origin. Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and repository name:
    ```bash
    git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
    ```
7.  Push your code to GitHub:
    ```bash
    git branch -M main
    git push -u origin main
    ```

### 6. Deploy to Vercel

1.  Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2.  Click on **Add New...** and then **Project**.
3.  Select your newly created GitHub repository (e.g., `personal-telegram-agent`).
4.  In the **Configure Project** screen:
    *   **Framework Preset**: Select `Other`.
    *   **Root Directory**: Leave as default (`./`).
    *   **Build and Output Settings**: Keep default.
    *   **Environment Variables**: This is crucial. Add the following environment variables with the values you saved earlier:
        *   `TELEGRAM_BOT_TOKEN`: Your Telegram Bot API Token.
        *   `LLM_API_KEY`: Your Groq or OpenRouter API Key.
        *   `LLM_API_URL`: `https://api.groq.com/openai/v1/chat/completions` (or the appropriate URL for OpenRouter).
        *   `LLM_MODEL`: `llama3-8b-8192` (or your chosen LLM model).
        *   `EMAIL_IMAP_HOST`: `imap.gmail.com`
        *   `EMAIL_IMAP_PORT`: `993`
        *   `EMAIL_IMAP_SECURE`: `true`
        *   `EMAIL_IMAP_USER`: Your Gmail address.
        *   `EMAIL_IMAP_PASSWORD`: Your Gmail App Password.
        *   `EMAIL_SMTP_HOST`: `smtp.gmail.com`
        *   `EMAIL_SMTP_PORT`: `465`
        *   `EMAIL_SMTP_SECURE`: `true`
        *   `EMAIL_SMTP_USER`: Your Gmail address.
        *   `EMAIL_SMTP_PASSWORD`: Your Gmail App Password.
        *   `WEBHOOK_URL`: This will be your Vercel deployment URL. You will get this after the first deployment. For now, you can leave it blank or put a placeholder. You will update it later.

5.  Click **Deploy**.
6.  Once the deployment is complete, Vercel will provide you with a **Deployment URL**. Copy this URL.

### 7. Update Webhook URL in Vercel

1.  Go back to your Vercel project dashboard.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Edit the `WEBHOOK_URL` variable and paste your Vercel Deployment URL (e.g., `https://your-project-name.vercel.app`).
4.  Click **Save**.
5.  Vercel will automatically redeploy your project with the updated `WEBHOOK_URL`.

### 8. Test Your Bot

Once the deployment is complete and the webhook is updated, you can test your bot in Telegram:

*   Send `/start` to your bot.
*   Try `/email_read` to fetch your latest emails.
*   Try `/email_send recipient@example.com Subject Body` to send an email.
*   Try `/social_generate twitter MyProduct exciting` to generate a tweet.
*   Ask general questions, e.g., "What is the capital of France?"

## Important Notes

*   **Security**: Keep your API keys and App Passwords secure. Never share them publicly.
*   **Free Tier Limits**: While the services used offer free tiers, be mindful of their usage limits to avoid unexpected charges. For personal use, these limits are generally sufficient.
*   **Social Media Posting**: Direct social media posting via APIs often requires complex OAuth flows and adherence to platform policies. The current social media feature focuses on content generation. For actual posting, you might need to explore dedicated social media management tools or more advanced API integrations.
*   **Error Handling**: The bot includes basic error handling, but you may want to enhance it for more robust operation.

Enjoy your personal Telegram agent bot!
