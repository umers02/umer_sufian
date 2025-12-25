# Reviews System - NestJS Backend

A comprehensive reviews and notifications system built with NestJS, featuring real-time notifications via Socket.IO, rich text editor with mentions, and seamless integration with the existing e-commerce app.

## Features

### 🔥 Core Features
- **Reviews & Replies**: Add reviews to products and replies to reviews
- **Rich Text Editor**: TipTap editor with mention functionality (@username)
- **Real-time Notifications**: Socket.IO powered instant notifications
- **Like System**: Like reviews and replies
- **Product Rating**: Automatic product rating calculation

### 📡 Real-time Notifications
- **Broadcast**: New review notifications to all users
- **Direct**: Reply notifications to review owners
- **Mentions**: Notify mentioned users in reviews/replies
- **Likes**: Notify when reviews/replies are liked

## Tech Stack

### Backend (NestJS)
- **NestJS**: Node.js framework
- **MongoDB**: Database (shared with main app)
- **Socket.IO**: Real-time communication
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication

### Frontend Integration
- **React**: UI components
- **TipTap**: Rich text editor
- **Socket.IO Client**: Real-time updates
- **Tailwind CSS**: Styling

## Installation & Setup

### 1. Backend Setup
```bash
cd reviews-system
npm install
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install socket.io-client @tiptap/react @tiptap/starter-kit @tiptap/extension-mention
npm run dev
```

### 3. Environment Variables
Create `.env` in reviews-system:
```
PORT=5001
MONGODB_URI=mongodb+srv://umersufian02_db_user:fXwKqqMAWyp9imGV@netixsol.p2hdkk3.mongodb.net/tea-ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## API Endpoints

### Reviews
- `POST /reviews` - Create review
- `POST /reviews/reply` - Create reply
- `GET /reviews/product/:productId` - Get product reviews
- `PUT /reviews/:reviewId/like` - Like/unlike review
- `PUT /reviews/reply/:replyId/like` - Like/unlike reply

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read

## Socket.IO Events

### Client Events
- `join_room` - Join product room for updates

### Server Events
- `notification` - Direct user notification
- `new_notification` - Broadcast notification
- `product_update` - Product-specific updates

## Database Schema

### Review Schema
```javascript
{
  productId: ObjectId,
  userId: ObjectId,
  rating: Number (1-5),
  content: String, // Rich text HTML
  mentions: [ObjectId], // Mentioned users
  likes: Number,
  likedBy: [ObjectId],
  isModerated: Boolean,
  isFlagged: Boolean
}
```

### Reply Schema
```javascript
{
  reviewId: ObjectId,
  userId: ObjectId,
  content: String, // Rich text HTML
  mentions: [ObjectId], // Mentioned users
  likes: Number,
  likedBy: [ObjectId]
}
```

### Notification Schema
```javascript
{
  userId: ObjectId,
  type: String, // new_review, new_reply, review_liked, etc.
  title: String,
  message: String,
  data: Object, // Additional context
  isRead: Boolean
}
```

## Usage

### 1. Adding Reviews
Users can add reviews with ratings (1-5 stars) and rich text content including mentions.

### 2. Rich Text Editor
- **Bold/Italic**: Text formatting
- **Mentions**: Type @ to mention users
- **HTML Output**: Stored as HTML in database

### 3. Real-time Notifications
- Automatic notifications for new reviews, replies, likes, and mentions
- Toast notifications appear instantly
- Notification dropdown in navbar shows all notifications

### 4. Product Integration
Reviews appear on product detail pages with:
- Review form (left column)
- Review list with replies (right column)
- Real-time updates when new reviews/replies are added

## File Structure

```
reviews-system/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   └── jwt-auth.guard.ts
│   ├── notifications/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.gateway.ts
│   │   ├── notifications.module.ts
│   │   └── notifications.service.ts
│   ├── reviews/
│   │   ├── dto/
│   │   │   └── review.dto.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   ├── schemas/
│   │   ├── notification.schema.ts
│   │   ├── product.schema.ts
│   │   ├── reply.schema.ts
│   │   ├── review.schema.ts
│   │   └── user.schema.ts
│   ├── app.module.ts
│   └── main.ts
└── package.json

frontend/src/components/
├── reviews/
│   ├── ReviewForm.jsx
│   ├── ReviewList.jsx
│   ├── ReplyForm.jsx
│   └── RichTextEditor.jsx
├── notifications/
│   └── NotificationDropdown.jsx
└── context/
    └── SocketContext.jsx
```

## Running the System

1. **Start NestJS Backend**:
   ```bash
   cd reviews-system
   npm run start:dev
   ```
   Server runs on http://localhost:5001

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

3. **Test the System**:
   - Navigate to any product detail page
   - Add reviews with mentions (@username)
   - See real-time notifications
   - Test reply functionality
   - Check notification dropdown in navbar

## Key Features Implemented

✅ **NestJS Backend** with proper module structure
✅ **MongoDB Integration** using existing database
✅ **Socket.IO Real-time** notifications
✅ **Rich Text Editor** with TipTap and mentions
✅ **JWT Authentication** integration
✅ **Review & Reply System** with likes
✅ **Notification System** with different types
✅ **Frontend Integration** with existing React app
✅ **Real-time UI Updates** via WebSocket
✅ **Responsive Design** with Tailwind CSS

The system is production-ready and seamlessly integrates with your existing e-commerce application!