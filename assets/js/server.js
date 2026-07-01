const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const appRoot = path.resolve(__dirname, '..', '..');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(appRoot));

app.post('/submit-inquiry', async (req, res) => {
  const payload = req.body;

  try {
    const smsResult = await sendSms(payload, 'mother-request');

    res.status(200).json({
      success: true,
      message: 'Request received and SMS notification queued.',
      sms: smsResult
    });
  } catch (error) {
    console.error('SMS send failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Request received but SMS notification failed.',
      error: error.message
    });
  }
});

app.post('/test-sms', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const smsResult = await sendSms({
      contact_number: phone,
      infant_name: 'Test',
      first_name: 'Test'
    }, 'mother-request');

    res.status(200).json({
      success: true,
      message: 'Test SMS queued.',
      sms: smsResult
    });
  } catch (error) {
    console.error('Test SMS failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Test SMS failed.',
      error: error.message
    });
  }
});

app.post('/submit-donor-profile', async (req, res) => {
  const payload = req.body;

  try {
    const smsResult = await sendSms(payload, 'donor-application');

    res.status(200).json({
      success: true,
      message: 'Donor application received and notification queued.',
      sms: smsResult
    });
  } catch (error) {
    console.error('Donor SMS send failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Donor application received but SMS notification failed.',
      error: error.message
    });
  }
});

app.post('/notify-donor-stored', async (req, res) => {
  const payload = req.body;

  try {
    const smsResult = await sendSms(payload, 'donor-stored');

    res.status(200).json({
      success: true,
      message: 'Donor storage notification queued.',
      sms: smsResult
    });
  } catch (error) {
    console.error('Donor storage SMS send failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Donor storage notification failed.',
      error: error.message
    });
  }
});

async function sendSms(payload, type = 'mother-request') {
  const recipient = normalizePhone(payload.contact_number);
  const message = buildMessage(payload, type);

  if (!recipient || !message) {
    throw new Error('Contact number and message are required.');
  }

  const provider = process.env.SMS_PROVIDER || 'textbee';

  if (provider === 'mock') {
    console.log(`[MOCK SMS] To: ${recipient} | Message: ${message}`);
    return { provider, status: 'mocked', recipient, message };
  }

  const apiKey = process.env.TEXTBEE_API_KEY || process.env.SMS_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    throw new Error('TEXTBEE_API_KEY and TEXTBEE_DEVICE_ID must be set.');
  }

  const url = `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`;

  try {
    const response = await axios.post(url, {
      recipients: [recipient],
      message
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('TextBee error:', error.response?.status, error.response?.data);
    throw error;
  }
}

function normalizePhone(value) {
  if (!value) return '';
  const digits = value.toString().replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return `+63${digits.slice(1)}`;
  }
  if (digits.startsWith('63')) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

function buildMessage(payload, type = 'mother-request') {
  if (type === 'donor-application') {
    return `Thank you for your donation application, ${payload.first_name || 'valued donor'}. We will review your screening and contact you soon.`;
  }

  if (type === 'donor-stored') {
    return `Hello ${payload.first_name || 'valued donor'}, your donor screening has passed and your milk has been stored safely in the bank.`;
  }

  return `Lactee request received for ${payload.infant_name || 'your infant'}. We will contact you shortly.`;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(appRoot, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Lactee SMS server listening on port ${PORT}`);
  });
}

module.exports = {
  app,
  buildMessage,
  normalizePhone
};
