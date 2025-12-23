# Real-time Comment System

A professional real-time comment system built with Next.js (frontend) and NestJS (backend) using Socket.IO for real-time communication.

## Features

- ✅ Real-time comment updates across all connected users
- ✅ Toast notifications for new comments from other users
- ✅ Professional UI with modern design
- ✅ User avatars and timestamps
- ✅ Online user count display
- ✅ Connection status indicator
- ✅ Responsive design
- ✅ Type-safe with TypeScript

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Socket.IO** - Real-time communication
- **TypeScript** - Type safety
- **UUID** - Unique comment IDs

### Frontend
- **Next.js 14** - React framework
- **Socket.IO Client** - Real-time client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **TypeScript** - Type safety

## Project Structure

```
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── comments/       # Comments module
│   │   │   ├── comments.gateway.ts    # Socket.IO gateway
│   │   │   ├── comments.service.ts    # Business logic
│   │   │   ├── comments.module.ts     # Module definition
│   │   │   └── comment.interface.ts   # TypeScript interfaces
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # Application entry point
│   └── package.json
│
└── frontend/               # Next.js Frontend
    ├── app/
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Main page
    ├── components/         # React components
    │   ├── CommentCard.tsx
    │   ├── CommentInput.tsx
    │   ├── CommentList.tsx
    │   ├── Header.tsx
    │   └── UsernameModal.tsx
    ├── hooks/
    │   └── useSocket.ts    # Socket.IO hook
    ├── types/
    │   └── index.ts        # TypeScript types
    ├── utils/
    │   └── dateUtils.ts    # Utility functions
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter your username to join the chat
3. Start typing comments in the input field
4. Open multiple browser tabs/windows to test real-time functionality
5. Watch as comments appear instantly across all connected clients
6. Receive toast notifications when others post comments

## Key Features Explained

### Real-time Communication
- Uses Socket.IO for bidirectional communication
- Comments appear instantly without page refresh
- Connection status is displayed in the header

### Professional UI
- Clean, modern design with Tailwind CSS
- Responsive layout that works on all devices
- Smooth animations and transitions
- User avatars generated automatically

### Notifications
- Toast notifications for new comments from other users
- Visual indicators for connection status
- Live user count display

### Type Safety
- Full TypeScript implementation
- Shared interfaces between frontend and backend
- Compile-time error checking

## Socket.IO Events

### Client to Server
- `join` - User joins the chat
- `add_comment` - User sends a new comment
- `get_comments` - Request existing comments

### Server to Client
- `existing_comments` - Send all existing comments
- `new_comment` - Broadcast new comment to other users
- `comment_added` - Confirm comment was added
- `user_count` - Update online user count

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### Components
All components are modular and can be easily customized:
- `CommentCard` - Individual comment display
- `CommentInput` - Comment input form
- `Header` - App header with status
- `UsernameModal` - Initial username setup

## Production Deployment

### Backend
1. Build the application: `npm run build`
2. Start production server: `npm run start:prod`
3. Configure environment variables for database if needed

### Frontend
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Update Socket.IO connection URL in `useSocket.ts`

## License

MIT License - feel free to use this project for learning or commercial purposes.