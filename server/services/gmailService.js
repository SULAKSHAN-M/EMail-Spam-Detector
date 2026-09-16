const { google } = require('googleapis');

const FETCH_CONCURRENCY = 10;

function extractBody(payload) {
  if (payload.parts && payload.parts.length > 0) {
    const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html');
    if (htmlPart) return { type: 'html', data: htmlPart.body?.data };

    const textPart = payload.parts.find((p) => p.mimeType === 'text/plain');
    if (textPart) return { type: 'text', data: textPart.body?.data };

    for (const part of payload.parts) {
      const found = extractBody(part);
      if (found) return found;
    }
  }

  if (payload.body?.data) {
    return {
      type: payload.mimeType === 'text/html' ? 'html' : 'text',
      data: payload.body.data,
    };
  }

  return null;
}

function decodeBase64(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

async function fetchSingleEmail(gmail, msgId) {
  try {
    const data = await gmail.users.messages.get({
      userId: 'me',
      id: msgId,
      format: 'full',
    });

    const headers = data.data.payload.headers;
    const get = (name) => headers.find((h) => h.name === name)?.value;

    const bodyInfo = extractBody(data.data.payload);
    let body = '';
    let bodyType = 'text';

    if (bodyInfo?.data) {
      body = decodeBase64(bodyInfo.data);
      bodyType = bodyInfo.type;
    } else {
      body = data.data.snippet || '';
    }

    return {
      id: msgId,
      subject: get('Subject'),
      from: get('From'),
      to: get('To'),
      date: get('Date'),
      snippet: data.data.snippet,
      body,
      bodyType,
    };
  } catch (err) {
    console.warn(`Failed to fetch email ${msgId}:`, err.message);
    return null;
  }
}

async function fetchMailsByLabel(gmail, labelId) {
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: [labelId],
    maxResults: 50,
  });

  const messages = res.data.messages || [];
  const emails = [];

  // Fetch in parallel batches instead of sequentially
  for (let i = 0; i < messages.length; i += FETCH_CONCURRENCY) {
    const batch = messages.slice(i, i + FETCH_CONCURRENCY);
    const results = await Promise.all(batch.map((msg) => fetchSingleEmail(gmail, msg.id)));
    emails.push(...results.filter(Boolean));
  }

  return emails;
}

async function fetchEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  const [inbox, sent] = await Promise.all([
    fetchMailsByLabel(gmail, 'INBOX'),
    fetchMailsByLabel(gmail, 'SENT'),
  ]);

  return { inbox, sent };
}

module.exports = { fetchEmails };
