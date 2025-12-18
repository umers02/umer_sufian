# Live Voting/Governance System Frontend

A professional React/Next.js frontend for the Live Voting/Governance System with real-time updates using Socket.IO and RTK Query.

## Features

- 🗳️ **Real-time Voting**: Cast votes with instant updates across all clients
- 📊 **Live Statistics**: Real-time governance statistics and participation metrics
- 🔐 **Wallet Integration**: Connect wallet for secure voting authentication
- 📱 **Responsive Design**: Professional UI built with shadcn/ui components
- ⚡ **Real-time Updates**: Socket.IO integration for live proposal and vote updates
- 🎯 **State Management**: RTK Query for efficient API data management

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend server running on http://localhost:5001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── providers.tsx     # Redux & Socket providers
│   └── socket-provider.tsx
├── components/
│   ├── governance/       # Governance-related components
│   ├── layout/          # Layout components
│   ├── proposals/       # Proposal components
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── api/            # RTK Query API definitions
│   ├── slices/         # Redux slices
│   ├── hooks.ts        # Typed Redux hooks
│   ├── socket.ts       # Socket.IO client
│   ├── store.ts        # Redux store
│   └── utils.ts        # Utility functions
```

## Key Components

### ProposalCard
Displays individual proposals with voting interface and real-time vote counts.

### GovernanceStats  
Shows live governance statistics including total proposals, active votes, and participation metrics.

### Header
Navigation header with wallet connection and active user count.

### VotingHistory
User's personal voting history and participation overview.

## API Integration

The frontend integrates with the backend API using RTK Query:

- **Proposals API**: Fetch proposals, cast votes, get statistics
- **Auth API**: Wallet connection and user authentication  
- **Governance API**: Governance statistics and proposal execution

## Real-time Features

Socket.IO integration provides:

- Live proposal updates
- Real-time vote counting
- Active user tracking
- Instant vote confirmations
- Governance statistics updates

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to authenticate
2. **View Proposals**: Browse active and historical proposals
3. **Cast Votes**: Vote Yes/No/Abstain on active proposals
4. **Real-time Updates**: See live vote counts and new proposals
5. **Dashboard**: View personal voting history and statistics

## Development

### Adding New Components

1. Create component in appropriate directory
2. Export from index file if needed
3. Add to relevant page/layout

### API Integration

1. Define API endpoints in `lib/api/`
2. Use RTK Query hooks in components
3. Handle loading/error states

### Socket Events

1. Add event listeners in components
2. Emit events for user actions
3. Update Redux state as needed

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local` for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```