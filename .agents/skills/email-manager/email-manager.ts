
import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';

interface EmailConfig {
  imap: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
}

// Function to get email configuration from environment variables
function getEmailConfig(): EmailConfig {
  return {
    imap: {
      host: process.env.EMAIL_IMAP_HOST || '',
      port: parseInt(process.env.EMAIL_IMAP_PORT || '993', 10),
      secure: process.env.EMAIL_IMAP_SECURE === 'true',
      user: process.env.EMAIL_IMAP_USER || '',
      pass: process.env.EMAIL_IMAP_PASSWORD || '',
    },
    smtp: {
      host: process.env.EMAIL_SMTP_HOST || '',
      port: parseInt(process.env.EMAIL_SMTP_PORT || '465', 10),
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      user: process.env.EMAIL_SMTP_USER || '',
      pass: process.env.EMAIL_SMTP_PASSWORD || '',
    },
  };
}

// Function to read latest emails
export async function readLatestEmails(count: number = 5): Promise<any[]> {
  const config = getEmailConfig();
  const client = new ImapFlow(config.imap);

  await client.connect();

  let emails: any[] = [];
  try {
    let lock = await client.get=mailboxLock('INBOX');
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
export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<any> {
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
export async function searchEmails(criteria: string, count: number = 5): Promise<any[]> {
  const config = getEmailConfig();
  const client = new ImapFlow(config.imap);

  await client.connect();

  let emails: any[] = [];
  try {
    let lock = await client.get=mailboxLock('INBOX');
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
