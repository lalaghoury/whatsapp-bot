# WhatsApp Attendance Bot

## Objective
Develop a WhatsApp chatbot that enables users to "check in" and "check out" via messages. The bot logs timestamps, calculates total hours worked, generates weekly reports, and provides feedback. The application is deployed on **Vercel using serverless API functions**.

## Setup Instructions

### 1. Set Up the Project Environment
- Initialize a new Node.js project with `npm init -y`.
- Install necessary dependencies:
  ```bash
  npm install express twilio dotenv mongodb
  ```
- Configure a `.env` file to store:
  - Twilio Account SID
  - Twilio Auth Token
  - Twilio WhatsApp number
  - Database connection URL (MongoDB or SQLite)

### 2. Integrate WhatsApp API via Twilio
- Register and configure a Twilio account.
- Activate the **Twilio WhatsApp Sandbox** for testing.
- Retrieve Twilio credentials and store them in the `.env` file.

### 3. Implement Serverless API Function in Vercel
- Instead of running an Express server, create an API function in `/api/webhook.js`.
- The function should handle incoming WhatsApp messages as follows:
  ```javascript
  export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { Body, From } = req.body;
    // Implement check-in/check-out logic
    res.status(200).send("Message received");
  }
  ```
- Ensure Vercel handles the API route properly.

### 4. Implement Check-in and Check-out Functionality
- Detect messages like `"check in"` and `"check out"`.
- Store timestamps associated with each user (based on WhatsApp number).
- Use MongoDB (or SQLite) to persist user records and work sessions.

### 5. Calculate Work Hours
- On receiving a `"check out"` message, retrieve the last `"check in"` time.
- Calculate hours worked in the session and update the user’s weekly log.
- Store data for generating weekly reports.

### 6. Generate Weekly Reports
- Aggregate the total hours worked per user at the end of each week.
- Format the report as a WhatsApp-friendly text summary.
- Send the weekly report automatically every Sunday via WhatsApp.

### 7. Provide Immediate Feedback
- Send instant confirmations after `"check in"` and `"check out"`.
- Handle error cases (e.g., checking out without checking in).
- Provide motivational messages based on weekly performance.

### 8. Deploy to Vercel
- Use `vercel init` to set up the project.
- Deploy using `vercel deploy`.
- Retrieve the deployed Vercel URL for API hosting.

### 9. Configure Twilio Webhook
- Set the Twilio webhook URL to the deployed Vercel API function:
  ```
  https://your-vercel-url/api/webhook
  ```
- Ensure Twilio correctly forwards WhatsApp messages to this webhook.

### 10. Test and Optimize
- Send test messages via WhatsApp to verify the bot's functionality.
- Debug potential errors such as incorrect time calculations or missing logs.
- Optimize the database queries and response times.

## Environment Variables Configuration
Create a `.env` file in the root directory of your project and add the following variables:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
DATABASE_URL=your_database_connection_url
```

## Deployment Instructions for Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Initialize the project with Vercel:
   ```bash
   vercel init
   ```
3. Deploy the project:
   ```bash
   vercel deploy
   ```
4. Retrieve the deployed Vercel URL and configure it as the Twilio webhook URL.
