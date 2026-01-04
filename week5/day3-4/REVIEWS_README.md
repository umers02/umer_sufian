# 🎯 E-Commerce Reviews & Notifications System

A complete NestJS-based reviews and real-time notifications system integrated with your existing React + Express e-commerce app.

## ✅ Implemented Features

### 1️⃣ Reviews & Replies System
- ✅ **Add Reviews**: Users can add reviews with ratings (1-5 stars) to products
- ✅ **Add Replies**: Users can reply to reviews with threaded conversations
- ✅ **Fetch Reviews**: Get paginated reviews per product with nested replies
- ✅ **Like System**: Like/unlike reviews and replies with real-time count updates
- ✅ **User Mentions**: Support for mentioning users in reviews and replies
- ✅ **Rich Content**: Support for rich text content in reviews and replies

### 2️⃣ Real-Time Notifications with Socket.IO
- ✅ **Broadcast Notifications**: New review notifications sent to all users
- ✅ **Direct Notifications**: Reply notifications sent only to review owner
- ✅ **Like Notifications**: Notify users when their content is liked
- ✅ **Mention Notifications**: Notify users when mentioned in reviews/replies
- ✅ **Real-time Updates**: No page refresh needed - instant notifications

### 3️⃣ Admin Moderation Features
- ✅ **Delete Reviews**: Admins can delete inappropriate reviews
- ✅ **Flag Reviews**: Mark reviews for moderation
- ✅ **Admin Notifications**: Notify users of admin actions
- ✅ **Product Updates**: Notify reviewers when products are updated

### 4️⃣ Frontend Integration
- ✅ **Real-time UI**: Socket.IO integration with React
- ✅ **Notification Center**: Bell icon with unread count and dropdown
- ✅ **Interactive Reviews**: Like buttons, reply forms, threaded display
- ✅ **Toast Notifications**: Popup notifications for real-time events

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  NestJS Service │    │   MongoDB       │
│  (Port 5173)    │◄──►│   (Port 8000)   │◄──►│  (Same DB)      │
│                 │    │                 │    │                 │
│ • Reviews UI    │    │ • Reviews API   │    │ • Reviews       │
│ • Socket Client │    │ • Socket.IO     │    │ • Replies       │
│ • Notifications │    │ • Notifications │    │ • Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Start All Services
```bash
# Run the test script
test-reviews.bat
```

Or manually:
```bash
# Terminal 1: NestJS Reviews Service
cd reviews-system
npm run start:dev

# Terminal 2: React Frontend  
cd frontend
npm run dev

# Terminal 3: Express Backend
cd backend
npm start
```

### 2. Test the Features

1. **Add a Review**:
   - Go to any product page
   - Add a review with rating and content
   - See real-time notification broadcast to all users

2. **Reply to Review**:
   - Click "Reply" on any review
   - Add your reply
   - Review owner gets direct notification

3. **Like Content**:
   - Click heart icon on reviews/replies
   - Author gets notification when liked

4. **Real-time Notifications**:
   - Check bell icon in navbar
   - See unread count and notification dropdown
   - Toast notifications appear automatically

## 📡 API Endpoints

### Reviews
```
POST   /reviews                    # Create review
POST   /reviews/reply              # Create reply
GET    /reviews/product/:id        # Get product reviews
PUT    /reviews/:id/like           # Like/unlike review
PUT    /reviews/reply/:id/like     # Like/unlike reply
DELETE /reviews/admin/:id          # Admin: Delete review
PUT    /reviews/admin/:id/flag     # Admin: Flag review
```

### Notifications
```
GET    /notifications              # Get user notifications
PUT    /notifications/:id/read     # Mark as read
PUT    /notifications/read-all     # Mark all as read
```

### Socket.IO Events
```
# Client → Server
join_room                         # Join product room

# Server → Client  
notification                      # Direct notification
new_notification                  # Broadcast notification
product_update                    # Product-specific update
```

## 🔧 Configuration

### Environment Variables
```env
# reviews-system/.env
PORT=8000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### CORS Settings
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Reviews Service: `http://localhost:8000`

## 📊 Database Schema

### Reviews Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId,      // Reference to Product
  userId: ObjectId,         // Reference to User  
  rating: Number,           // 1-5 stars
  content: String,          // Review text
  mentions: [ObjectId],     // Mentioned users
  likes: Number,            // Like count
  likedBy: [ObjectId],      // Users who liked
  isModerated: Boolean,     // Admin flag
  isFlagged: Boolean,       // Flagged for review
  createdAt: Date,
  updatedAt: Date
}
```

### Replies Collection
```javascript
{
  _id: ObjectId,
  reviewId: ObjectId,       // Reference to Review
  userId: ObjectId,         // Reference to User
  content: String,          // Reply text
  mentions: [ObjectId],     // Mentioned users
  likes: Number,            // Like count
  likedBy: [ObjectId],      // Users who liked
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // Recipient
  type: String,             // Notification type
  title: String,            // Notification title
  message: String,          // Notification message
  data: Object,             // Additional data
  isRead: Boolean,          // Read status
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Components

### Key Components
- `SimpleReviewList.jsx` - Display reviews with replies
- `SimpleReviewForm.jsx` - Add new reviews
- `SimpleReplyForm.jsx` - Add replies to reviews
- `NotificationCenter.jsx` - Notification bell and dropdown
- `SocketContext.jsx` - Socket.IO integration

### Socket Integration
```javascript
// Auto-connect when user logs in
const socket = io('http://localhost:8000', {
  auth: { token: localStorage.getItem('token') }
});

// Listen for notifications
socket.on('notification', (notification) => {
  // Show toast and update state
});
```

## 🔐 Authentication

- Uses JWT tokens from existing Express app
- NestJS validates tokens using same secret
- Socket.IO authenticates via token in handshake
- Protected routes require valid JWT

## 🚨 Error Handling

- Comprehensive try-catch blocks
- Graceful fallbacks for notification failures
- Console logging for debugging
- User-friendly error messages

## 📈 Performance Features

- Pagination for reviews (10 per page)
- Efficient MongoDB queries with population
- Real-time updates without polling
- Optimized Socket.IO room management

## 🎯 Testing Scenarios

1. **Multi-user Testing**:
   - Open multiple browser tabs
   - Login as different users
   - Add reviews/replies and see real-time updates

2. **Notification Testing**:
   - Add review → All users get broadcast
   - Reply to review → Owner gets direct notification
   - Like content → Author gets notification

3. **Admin Testing**:
   - Delete/flag reviews as admin
   - Check if users get admin action notifications

## 🔮 Future Enhancements

- [ ] Email notifications for important events
- [ ] Push notifications for mobile
- [ ] Advanced moderation dashboard
- [ ] Review analytics and insights
- [ ] Bulk operations for admins
- [ ] Review templates and quick replies

## 🐛 Troubleshooting

### Common Issues

1. **Socket not connecting**:
   - Check JWT token in localStorage
   - Verify CORS settings
   - Check console for connection errors

2. **Notifications not appearing**:
   - Ensure Socket.IO is connected
   - Check notification service logs
   - Verify user authentication

3. **Reviews not loading**:
   - Check MongoDB connection
   - Verify API endpoints are running
   - Check browser network tab

### Debug Commands
```bash
# Check all replies in database
GET /reviews/debug/replies

# Check specific review replies
GET /reviews/replies/:reviewId

# Monitor Socket.IO connections
# Check browser console for connection logs
```

## 📝 Notes

- All notifications work in real-time without page refresh
- System handles mentions in rich text content
- Admin actions notify affected users
- Product updates notify all reviewers
- Graceful degradation if Socket.IO fails
- Comprehensive error handling throughout

---

**🎉 Your reviews system is now complete with real-time notifications!**

Test it by adding reviews, replies, and likes across multiple browser tabs to see the real-time magic in action.