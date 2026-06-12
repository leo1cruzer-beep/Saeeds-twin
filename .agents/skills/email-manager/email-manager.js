const { ImapFlow } = require('imapflow');
const nodemailer = require('nodemailer');

// Function to get email configuration from environment variables
function getEmailConfig() {
  return {
    imap: {
      host: process.env.EMAIL_IMAP_HOST || 'imap.gmail.com',
      port: parseInt(process.env.EMAIL_IMAP_PORT || '993', 10),
      secure: process.env.EMAIL_IMAP_SECURE === 'true' || true,
      user: process.env.GMAIL_ADDRESS || '',
      pass: process.env.GMAIL_APP_PASSWORD || '',
    },
    smtp: {
      host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SMTP_PORT || '465', 10),
      secure: process.env.EMAIL_SMTP_SECURE === 'true' || true,
      user: process.env.GMAIL_ADDRESS || '',
      pass: process.env.GMAIL_APP_PASSWORD || '',
    },
  };
}

// Function to read latest emails
async function readLatestEmails(count = 5) {
  const config = getEmailConfig();
  const client = new ImapFlow(config.imap);
  await client.connect();
  let emails = [];
  try {
    let lock = await client.getMailboxLock('INBOX');
    try {
      for await (let msg of client.fetch('1:*', { envelope: true, body: true }, { uid: true })) {
        emails.push({
          uid: msg.uid,
          from: msg.envelope.from[0].address,
          subject: msg.envelope.subject,
          date: msg.envelope.date,
          body: msg.body
        });
        if (emails.length >= count) break;
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
  return emails;
}

// Function to send an email
async function sendEmail(to, subject, text, html) {
  const config = getEmailConfig();
  const transporter = nodemailer.createTransport(config.smtp);
  const info = await transporter.sendMail({
    from: config.smtp.user,
    to,
    subject,
    text,
    html,
  });
  return info;
}

// Function to search emails (simplified example)
async function searchEmails(criteria, count = 5) {
  const config = getEmailConfig();
  const client = new ImapFlow(config.imap);
  await client.connect();
  let emails = [];
  try {
    let lock = await client.getMailboxLock('INBOX');
    try {
      const searchResults = await client.search({ body: criteria });
      for await (let msg of client.fetch(searchResults.slice(0, count), { envelope: true, body: true }, { uid: true })) {
        emails.push({
          uid: msg.uid,
          from: msg.envelope.from[0].address,
          subject: msg.envelope.subject,
          date: msg.envelope.date,
          body: msg.body
        });
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
  return emails;
}

module.exports = {
  readLatestEmails,
  sendEmail,
  searchEmails
};
