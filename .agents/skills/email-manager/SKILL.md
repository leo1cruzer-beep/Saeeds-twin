# Email Manager Skill

This skill enables the OpenClaw agent to manage emails, including reading, sending, and organizing messages.

## Capabilities

- **Read Emails**: Fetch emails from a specified inbox.
- **Send Emails**: Compose and send emails to recipients.
- **Search Emails**: Search for emails based on criteria (sender, subject, keywords).

## Configuration

This skill requires the following environment variables to be set:

- `EMAIL_IMAP_HOST`: IMAP server host (e.g., `imap.gmail.com`)
- `EMAIL_IMAP_PORT`: IMAP server port (e.g., `993`)
- `EMAIL_IMAP_USER`: Email address for IMAP access
- `EMAIL_IMAP_PASSWORD`: App password or regular password for IMAP access
- `EMAIL_SMTP_HOST`: SMTP server host (e.g., `smtp.gmail.com`)
- `EMAIL_SMTP_PORT`: SMTP server port (e.g., `465`)
- `EMAIL_SMTP_USER`: Email address for SMTP access
- `EMAIL_SMTP_PASSWORD`: App password or regular password for SMTP access

## Usage

To use this skill, the agent can be prompted with commands such as:

- "Read my latest emails."
- "Send an email to [recipient] with subject [subject] and body [body]."
- "Search for emails from [sender] about [topic]."
