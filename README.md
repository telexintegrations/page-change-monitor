# Telex Website Change Monitor Integration

## Overview

This Telex integration monitors a specified website for content changes at set intervals and notifies a Telex channel whenever changes are detected. It falls under the **Interval Integrations** category in Telex and sends updates via a webhook when triggered.

## Features

- Monitors a specified website for content changes
- Sends notifications to a configured Telex channel
- Uses MongoDB to store website data and detect changes
- Fully configurable via Telex settings
- Runs at user-defined intervals

## Project Structure

```bash
/telex-integration
│── /config
│   ├── config.ts  # App configuration
│   ├── database.ts  # MongoDB connection setup
│── /models
│   ├── webpage.ts  # Mongoose schema for webpage tracking
│── /services
│   ├── monitorService.ts  # Website change detection logic
│   ├── notificationService.ts  # Telex notification handler
│── /routes
│   ├── index.ts  # API routes
│── index.ts  # Main Express server file
│── integration.json  # Telex integration definition
│── package.json  
│── tsconfig.json 
│── .env
```

## Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/telexintegrations/page-change-monitor.git
cd page-change-monitor
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Rename the `.env.example` file to `.env` and configure the following:

```ini
PORT=5000
MONGO_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/your-db
```

### 4️⃣ Start MongoDB (if using local database)

```bash
mongod --dbpath /path-to-your-db
```

### 5️⃣ Run the Application

```bash
npm run dev
```

## Telex Integration Setup

### 1️⃣ Define Integration JSON

Modify `integration.json`:

```json
{
  "data": {
    "descriptions": {
      "app_name": "Website Monitor",
      "app_description": "Monitors website content changes at intervals",
      "app_url": "https://your-hosted-url.com",
      "app_logo": "https://your-hosted-url.com/logo.png"
    },
    "integration_category": "Monitoring & Logging",
    "integration_type": "interval",
    "settings": [
      { "label": "website_url", "type": "text", "required": true, "default": "https://example.com" },
      { "label": "interval", "type": "text", "required": true, "default": "*/5 * * * *" }
    ],
    "tick_url": "https://your-hosted-url.com/tick"
  }
}
```

### 2️⃣ Add Integration to Telex

1. Deploy your server (e.g., Render, Fly.io, Vercel)
2. Host `integration.json` on your server
3. Add the integration to Telex using:

   ```text
   https://your-hosted-url.com/integration.json
   ```

4. Activate it in your Telex organization
5. Configure settings (website URL & interval)

## API Endpoints

### **`GET /integration.json`**

Returns the Telex integration schema.

### **`POST /tick`**

Triggered by Telex at configured intervals.

**Request Payload:**

```json
{
  "return_url": "https://telex.im/v1/return/channel_id",
  "settings": [
    { "label": "website_url", "default": "https://example.com" }
  ]
}
```

**Response:**

```json
{ "status": "accepted" }
```

## Testing the Integration Locally

1. **Start Your Local Server**  
   Make sure the integration is running on `http://localhost:5000`.

2. **Trigger `/tick` Manually**  
   Use `curl` (or an equivalent tool) to simulate Telex’s call to your `tick_url` endpoint:

   ```bash
   curl --location 'http://localhost:5000/tick' \
   --header 'Content-Type: application/json' \
   --data '{
       "return_url": "https://ping.telex.im/v1/return/channel_id",
       "settings": [
           {
               "label": "website_url",
               "type": "text",
               "required": true,
               "default": "https://example.com"
           }
       ]
   }'
   ```

   - **`return_url`**: Points to the Telex channel webhook where results are posted.
   - **`settings`**: Contains parameters for the integration (e.g., site URL).

3. **Check the Response**  
   - Your local server should respond with something like:

     ```json
     { "status": "accepted" }
     ```

   - Any changes or notifications triggered by your integration should appear in the specified Telex channel (the `return_url` you provided).

4. **Observe Changes**  
   - If you’re monitoring a website for changes, modify that site or choose one that updates frequently.
   - Invoke `curl` again and check the Telex channel for any new messages or notifications.

This approach works if you already have a functioning Telex channel and just want to verify your local integration’s flow with the real Telex environment.

## Deployment

1. **Choose a Hosting Provider:**
   - [Render](https://render.com/)
   - [Fly.io](https://fly.io/)
   - [Vercel](https://vercel.com/)

2. **Deploy the Server**
   - Push your code to GitHub
   - Deploy using one of the above services
   - Update `integration.json` with your **publicly hosted URL**

3. **Add to Telex**
   - Add integration using your **hosted `integration.json`**
   - Configure the website URL and interval in Telex
   - Activate the integration in your Telex organization

## License

MIT License.

## Contributors

- **[David Umoru](https://github.com/davidumoru)** - Developer
