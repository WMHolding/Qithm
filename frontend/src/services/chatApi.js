// src/services/chatApi.js

import axios from 'axios';
import io from 'socket.io-client';

// Use Vite environment variable for API URL if available, otherwise use localhost for development
const API_URL = import.meta.env.MODE === 'production'
  ? '/api' // Relative path for production on Vercel
  : 'http://localhost:3000/api'; // Your local backend URL for development
console.log("API_URL for chatApi:", API_URL); // Log the API URL being used

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Axios instance with base URL and default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token for protected routes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    // --- Add these logs ---
    console.log(`Axios Interceptor: Requesting ${config.url}`);
    console.log(`Axios Interceptor: Token found?`, !!token); // Log if token exists (boolean)
    // console.log(`Axios Interceptor: Token value (first 10 chars):`, token ? token.substring(0, 10) + '...' : 'None'); // Keep this off unless needed for specific debugging
    // --------------------
    if (token) {
      // Use 'x-auth-token' as defined in your backend authMiddleware
      config.headers['x-auth-token'] = token;
       // Optional: If backend expects Authorization: Bearer
       // config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Axios Interceptor: Request error", error);
    return Promise.reject(error);
  }
);

// --- Socket.IO Client Setup ---
// The Socket.IO server is typically on the base URL (without /api)
const socket = io(API_URL.replace('/api', ''), {
    auth: {
        token: localStorage.getItem('token') // Pass the token for authentication middleware
    },
    autoConnect: false // Don't auto-connect, we'll manage connection manually
});

// --- Socket Event Listeners (Optional but recommended for debugging/handling) ---
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
   // Automatically join the current user's "presence" room or similar if needed
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
   // TODO: Handle UI changes on disconnect (e.g., show reconnecting indicator)
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    // Handle specific errors, e.g., auth error during connection
    if (err.message && err.message.startsWith('Authentication error')) {
        console.warn('Socket authentication failed during connection. User might need to re-login.');
        // TODO: Trigger logout or redirect user to login page
        // Example: If using AuthContext and it has a logout function available globally:
        // import { useAuth } from '../contexts/AuthContext';
        // const { logout } = useAuth(); // Cannot use hook here, need a different pattern
        // Alternative: Emit a custom event or use a global event bus
    }
});

// You can add more global socket listeners here (e.g., for user online/offline status)


export const chatApi = {
  // Method to connect the socket - call this when the user is logged in and on chat page
  connectSocket: () => {
      if (!socket.connected) {
           const token = getToken(); // Get latest token just before connecting
           if (token) {
               socket.auth = { token }; // Update auth token in case it changed (e.g., after login)
               socket.connect();
           } else {
               console.warn("Cannot connect socket: No auth token found.");
               // TODO: Redirect to login or show error if socket connection is required
           }
      } else {
         console.log('Socket already connected.');
      }
      return socket; // Return the socket instance
  },

  // Method to disconnect the socket - call this when the user logs out or leaves chat page
  disconnectSocket: () => {
      if (socket.connected) {
          socket.disconnect();
          console.log('Socket disconnected manually.');
      } else {
         console.log('Socket already disconnected.');
      }
  },

   // Method to get the socket instance for adding event listeners in components
   getSocket: () => socket,


  // --- REST API Calls (for fetching history and initial data) ---

  // Get all chats for the authenticated user
  // NO LONGER needs userId parameter, backend gets it from token
  getUserChats: async () => { // Removed userId parameter
    try {
      // Call the new /chats/user/me endpoint
      const response = await axiosInstance.get('/chats/user/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user chats:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load chats'); // Throw specific backend error if available
    }
  },

  // Get messages for a specific chat (primarily for history)
  getChatMessages: async (chatId) => {
     if (!chatId) {
         const errorMsg = 'Chat ID is required to fetch messages.';
         console.error(errorMsg);
         throw new Error(errorMsg);
     }
    try {
      // This route is protected and uses chatId from the URL params on backend
      const response = await axiosInstance.get(`/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load messages');
    }
  },

   // Get a specific chat by ID (used when selecting a chat from sidebar or direct access)
   getChatById: async (chatId) => {
     if (!chatId) {
         const errorMsg = 'Chat ID is required to fetch chat details.';
         console.error(errorMsg);
         throw new Error(errorMsg);
     }
    try {
      // This route is protected and uses chatId from the URL params on backend
      const response = await axiosInstance.get(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat by ID:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load chat details');
    }
  },

  // Search for users
  searchUsers: async (query) => {
    console.log("chatApi.searchUsers called with query:", query);
     if (!query || query.trim().length === 0) {
         console.log("Search users called with empty query, returning empty array.");
         return []; // Return empty array for empty query
     }
    try {
      console.log(`chatApi.searchUsers: Making GET request to /profile/search?q=${encodeURIComponent(query)}`); // Log before axios call
        // This route is protected and uses query from URL params on backend
       const response = await axiosInstance.get(`/profile/search?q=${encodeURIComponent(query)}`);
       console.log("chatApi.searchUsers: API call successful. Response data:", response.data); // Log successful response
       return response.data; // Array of user objects (_id, username, profilePicture, role)
    } catch (error) {
      console.error('chatApi.searchUsers: Error during API call:', error.response?.data || error.message); // Log the error from the API call
      // Check if the error has a response status and data message
       if (error.response && error.response.data && error.response.data.message) {
           console.error("chatApi.searchUsers: Backend error message:", error.response.data.message);
       } else if (error.message) {
            console.error("chatApi.searchUsers: Generic error message:", error.message);
       }
       throw new Error(error.response?.data?.message || 'Failed to search users');
    }
   },

  // Create or get an existing chat with another participant
  // Now expects only the other participant's ID
   createChat: async (otherParticipantId) => { // Expecting ONLY the other participant's ID here
     if (!otherParticipantId) {
         const errorMsg = 'Other participant ID is required to create/find chat.';
         console.error(errorMsg);
         throw new Error(errorMsg);
     }
     console.log(`Attempting to create or find chat with participant ID: ${otherParticipantId}`);
    try {
        // This route is protected. Backend gets current user ID from token (req.user.userId).
        // We send ONLY the other participant's ID in the body.
      const response = await axiosInstance.post('/chats', { participantId: otherParticipantId }); // Correctly sends { participantId: 'single_id' }
      console.log("Create/Find chat response:", response.status, response.data);
      return response.data; // Returns existing chat if found (200), or the new chat (201)
    } catch (error) {
      console.error('Error creating chat:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create or find chat');
    }
  },


  // --- Socket.IO Calls (for real-time actions) ---
  // NOTE: These don't typically return promises for the emission itself

  // Send a message using the socket
  sendMessage: ({ chatId, message }) => {
    if (!chatId || !message) {
        console.warn('sendMessage called with missing chatId or message.');
        return; // Don't emit if data is missing
    }
    if (socket.connected) {
      socket.emit('sendMessage', { chatId, message });
      console.log(`Emitted sendMessage to chat ${chatId}`);
    } else {
      console.error('Socket not connected. Cannot send message.');
      // TODO: Provide user feedback that message could not be sent due to connection
      // Or queue the message to send later
      // throw new Error('Connection error: Cannot send message'); // Can throw if you want the caller to handle
    }
  },

  // Emit event to join a chat room on the backend
  joinChat: (chatId) => {
      if (socket.connected && chatId) { // Ensure chatId is not null/undefined
          socket.emit('joinChat', chatId);
          console.log(`Emitted joinChat: ${chatId}`);
      } else {
          console.warn('Socket not connected or chatId missing. Cannot join chat room.');
      }
  },

   // Emit event to leave a chat room on the backend
  leaveChat: (chatId) => {
       if (socket.connected && chatId) { // Ensure chatId is not null/undefined
           socket.emit('leaveChat', chatId);
           console.log(`Emitted leaveChat: ${chatId}`);
       } else {
            console.warn('Socket not connected or chatId missing. Cannot leave chat room.');
       }
   },

   // Add a listener for the 'newMessage' event
   onNewMessage: (callback) => {
       socket.on('newMessage', callback);
       return () => { // Return cleanup function to remove listener
           socket.off('newMessage', callback);
       };
   },

   onSendMessageError: (callback) => {
       socket.on('sendMessageError', callback);
        return () => { // Return cleanup function to remove listener
           socket.off('sendMessageError', callback);
       };
   },

   // Optional: Add listener for socket authentication errors if needed for global handling
   onSocketAuthError: (callback) => {
       socket.on('connect_error', callback); // Use 'connect_error' for auth issues during connection
       return () => { // Return cleanup function
           socket.off('connect_error', callback);
       };
   }
};
