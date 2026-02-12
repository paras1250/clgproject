/**
 * Email Notification Service
 * Sends email notifications for new conversations
 */

// Simple email sending function
// For production, use nodemailer or SendGrid
async function sendConversationNotification(botName, userMessage, botResponse, recipientEmail, botId) {
  try {
    // Check if email notifications are enabled
    if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED !== 'true') {
      console.log('Email notifications are disabled');
      return;
    }

    // For now, we'll log the notification
    // In production, integrate with nodemailer, SendGrid, or similar
    console.log('\n📧 NEW CONVERSATION NOTIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Bot: ${botName}`);
    console.log(`User Question: ${userMessage}`);
    console.log(`Bot Response: ${botResponse.substring(0, 100)}...`);
    console.log(`Recipient: ${recipientEmail}`);
    console.log(`Bot ID: ${botId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // If you want to use nodemailer, uncomment and configure:
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `New Conversation on ${botName}`,
      html: `
        <h2>New Conversation on ${botName}</h2>
        <p><strong>User Question:</strong></p>
        <p>${userMessage}</p>
        <p><strong>Bot Response:</strong></p>
        <p>${botResponse}</p>
        <hr>
        <p><small>This is an automated notification from your AI Chatbot Builder.</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    */
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw - email failures shouldn't break the chat
  }
}

/**
 * Check if bot has email notifications enabled and send if configured
 */
async function sendNotificationIfEnabled(bot, userMessage, botResponse) {
  try {
    const notificationSettings = bot.notification_settings || {};
    
    if (notificationSettings.emailNotifications && notificationSettings.emailAddress) {
      await sendConversationNotification(
        bot.name,
        userMessage,
        botResponse,
        notificationSettings.emailAddress,
        bot.id
      );
    }
  } catch (error) {
    console.error('Error in notification check:', error);
  }
}

module.exports = {
  sendConversationNotification,
  sendNotificationIfEnabled
};

