# Quick Start Guide - MongoDB Event Creation

## ⚡ Quick Setup (5 minutes)

### 1. Get MongoDB Atlas Connection String

```bash
# Go to: https://cloud.mongodb.com
# 1. Sign up / Log in
# 2. Create a FREE cluster (M0)
# 3. Create a database user (Database Access)
# 4. Whitelist your IP (Network Access) - use 0.0.0.0/0 for testing
# 5. Click "Connect" → "Connect your application"
# 6. Copy the connection string
```

### 2. Set Up Environment

```bash
# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
EOF

# Replace USERNAME, PASSWORD, and CLUSTER with your values
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test Event Creation

1. Open http://localhost:3000
2. Navigate to Seller dashboard
3. Click "Create Event" (highlighted button)
4. Fill out the form
5. Click "Create Event"
6. ✅ Success! Check MongoDB Atlas to see your data

## 📊 Verify Data in MongoDB

```bash
# Go to MongoDB Atlas Dashboard
# → Browse Collections
# → proplive → events
# You should see your created event!
```

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"

**Solution 1: IP Whitelist**

```bash
# MongoDB Atlas → Network Access → Add IP Address
# Use 0.0.0.0/0 for development (allows all IPs)
```

**Solution 2: Check Connection String**

```bash
# Ensure .env has correct format:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Common mistakes:
# ✗ Missing protocol: username:password@cluster...
# ✗ Wrong quotes: 'mongodb+srv://...'
# ✓ Correct: MONGODB_URI=mongodb+srv://...
```

**Solution 3: Database User**

```bash
# MongoDB Atlas → Database Access
# Ensure user has "Read and write to any database" permissions
```

### Error: "Validation failed"

Form fields are validated. Required fields:

- Event Title (5-100 characters)
- Event Type
- Property Name
- Developer
- Sector/Location
- Date (future date only)
- Time
- Duration
- Description (20-500 characters)
- Property Type
- Price Range
- Max Attendees

## 🎯 What Happens When You Create an Event

```
User fills form → Form validation (Zod) →
Server function (createEventInDB) →
MongoDB insert →
Success response →
Toast notification →
Redirect to /seller/host
```

## 📝 Event Data Structure

```typescript
{
  _id: "507f1f77bcf86cd799439011",
  title: "M3M Golf Estate — Exclusive Live Tour",
  eventType: "live-tour",
  propertyName: "M3M Golf Estate",
  developer: "M3M Group",
  sector: "Sector 65",
  date: "2026-05-15",
  time: "18:00",
  duration: "60",
  description: "Join us for an exclusive...",
  propertyType: "3bhk",
  priceRange: "₹2.4 Cr - ₹3.1 Cr",
  amenities: "Clubhouse, Pool, Gym",
  maxAttendees: "500",
  createdBy: "demo-user@proplive.com",
  status: "scheduled",
  registeredCount: 0,
  createdAt: "2026-05-07T10:30:00.000Z",
  updatedAt: "2026-05-07T10:30:00.000Z"
}
```

## 🚀 Production Deployment

### Cloudflare Workers

```bash
# Add MongoDB URI as Cloudflare secret
wrangler secret put MONGODB_URI

# When prompted, paste your connection string
# Then deploy
npm run build
wrangler deploy
```

### Vercel / Other Platforms

```bash
# Add environment variable in platform dashboard
MONGODB_URI=mongodb+srv://...
```

## 📚 Next Steps

1. ✅ Create your first event
2. [ ] Add user authentication
3. [ ] Implement image upload for thumbnails
4. [ ] Create event management page (edit/delete)
5. [ ] Build event listing page
6. [ ] Add real-time analytics

## 🆘 Need Help?

- MongoDB Issues: [MongoDB Support](https://www.mongodb.com/support)
- TanStack Start: [Documentation](https://tanstack.com/start)
- Check [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed setup

## 🎉 You're All Set!

Your event creation system is ready to go. Events are stored securely in MongoDB and ready for production use!
