import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const joinedRoomsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!socketRef.current) {
            console.log('🔗 useSocket: Connecting to', SOCKET_URL);
            socketRef.current = io(SOCKET_URL, {
                transports: ['polling', 'websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
                console.log('✅ useSocket: Connected with ID:', socketRef.current?.id);
                joinedRoomsRef.current.clear(); // Clear joined rooms on reconnect
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('❌ useSocket: Connection error:', error);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('🔌 useSocket: Disconnected:', reason);
                joinedRoomsRef.current.clear();
            });
        }

        return () => {
            if (socketRef.current) {
                console.log('🧹 useSocket: Cleaning up socket connection');
                socketRef.current.disconnect();
                socketRef.current = null;
                joinedRoomsRef.current.clear();
            }
        };
    }, []);

    const joinAuction = useCallback((auctionId: string) => {
        if (socketRef.current?.connected && !joinedRoomsRef.current.has(auctionId)) {
            console.log(`🏠 useSocket: Joining auction ${auctionId}`);
            socketRef.current.emit('joinAuction', { auctionId });
            joinedRoomsRef.current.add(auctionId);
        }
    }, []);

    const leaveAuction = useCallback((auctionId: string) => {
        if (socketRef.current?.connected && joinedRoomsRef.current.has(auctionId)) {
            console.log(`💪 useSocket: Leaving auction ${auctionId}`);
            socketRef.current.emit('leaveAuction', { auctionId });
            joinedRoomsRef.current.delete(auctionId);
        }
    }, []);

    const onNewBid = (callback: (data: any) => void) => {
        if (socketRef.current) {
            console.log('👂 useSocket: Setting up newBid listener');
            socketRef.current.on('newBid', (data) => {
                console.log('📨 useSocket: Received newBid:', data);
                callback(data);
            });
        }
    };

    const onAuctionStart = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('auctionStart', callback);
        }
    };

    const onAuctionEnd = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('auctionEnd', callback);
        }
    };

    const onBidWinner = (callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on('bidWinner', callback);
        }
    };

    const off = (event: string, callback?: (data: any) => void) => {
        if (socketRef.current) {
            console.log(`🚫 useSocket: Removing listener for ${event}`);
            socketRef.current.off(event, callback);
        }
    };

    return { 
        socket: socketRef.current, 
        joinAuction, 
        leaveAuction, 
        onNewBid, 
        onAuctionStart, 
        onAuctionEnd, 
        onBidWinner, 
        off,
        isConnected: socketRef.current?.connected || false
    };
};