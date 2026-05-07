# MongoDB Setup Guide

This project uses MongoDB to store property events. Follow these steps to set up your database.

## 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free Tier M0 is sufficient)

## 2. Get Your Connection String

1. In MongoDB Atlas dashboard, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your MongoDB connection string to `.env`:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority
```

**Important:** Replace `your-username`, `your-password`, and `your-cluster` with your actual credentials.

## 4. Database Structure

The application will automatically create a database named `proplive` with the following collections:

### Events Collection

```typescript
{
  _id: ObjectId,
  title: string,
  eventType: "live-tour" | "masterclass" | "open-house" | "q-and-a" | "launch-event",
  propertyName: string,
  developer: string,
  sector: string,
  date: string,
  time: string,
  duration: string,
  description: string,
  propertyType: "3bhk" | "4bhk" | "villa" | "plot" | "penthouse" | "studio",
  priceRange: string,
  amenities: string,
  maxAttendees: string,
  thumbnailUrl: string (optional),
  createdBy: string,
  createdAt: Date,
  updatedAt: Date,
  status: "scheduled" | "live" | "completed" | "cancelled",
  registeredCount: number,
  viewersPeak: number (optional),
  replayViews: number (optional)
}
```

## 5. Test the Connection

Run the development server:

```bash
npm run dev
```

Navigate to `/seller/create-event` and try creating an event. Check the MongoDB Atlas dashboard to verify the data was saved.

## 6. Security Best Practices

- ✅ Never commit `.env` file to Git
- ✅ Use environment variables for sensitive data
- ✅ Whitelist your IP address in MongoDB Atlas Network Access
- ✅ Create a database user with minimal required permissions
- ✅ Rotate credentials regularly

## 7. Production Deployment (Cloudflare Workers)

For Cloudflare Workers deployment, add the environment variable:

```bash
wrangler secret put MONGODB_URI
```

Then paste your connection string when prompted.

## Troubleshooting

### Connection Issues

1. **IP Whitelist**: Ensure your IP is whitelisted in MongoDB Atlas
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allow all) or Cloudflare Workers IPs

2. **Network Access**: Check MongoDB Atlas → Network Access → IP Access List

3. **Database User**: Verify credentials in MongoDB Atlas → Database Access

### Common Errors

- `MongoServerError: bad auth`: Wrong username/password
- `MongoNetworkError`: IP not whitelisted
- `ENOTFOUND`: Invalid cluster URL

## API Functions

### Create Event

```typescript
import { createEventInDB } from "@/lib/api/events";

const result = await createEventInDB({
  title: "M3M Golf Estate Tour",
  eventType: "live-tour",
  propertyName: "M3M Golf Estate",
  // ... other fields
});
```

### Get Events

```typescript
import { getEventsFromDB } from "@/lib/api/events";

const { events } = await getEventsFromDB();
```
