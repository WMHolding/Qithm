// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import { chatApi } from '../services/chatApi';
import '../styles/ChatPage.css'; // Make sure this path is correct
import debounce from 'lodash.debounce'; // Install: npm install lodash.debounce


// Helper function to format last message time (optional)
const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMilliseconds = now - messageDate;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInDays < 1 && messageDate.getDate() === now.getDate()) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 2 && messageDate.getDate() === now.getDate() - 1) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
        return messageDate.toLocaleDateString();
    }
};


export default function ChatPage() {
  const { currentUser, loadingAuth } = useAuth();
  const [chats, setChats] = useState([]); // State for the user's chat list
  const [loadingChats, setLoadingChats] = useState(true);
  const [errorLoadingChats, setErrorLoadingChats] = useState(null);

  const [activeChatId, setActiveChatId] = useState(null); // ID of the currently selected chat
  const [activeChat, setActiveChat] = useState(null); // Full object of the active chat
  const [messages, setMessages] = useState([]); // Messages for the active chat
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorLoadingMessages, setErrorLoadingMessages] = useState(null);

  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // --- Search States ---
  const [searchQuery, setSearchQuery] = useState(''); // State for search input value
  const [searchResults, setSearchResults] = useState([]); // State for user search results
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false); // Control visibility of results
  const searchInputRef = useRef(null); // Ref for the search input element

  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  // Ref to keep track of activeChatId in socket listeners where state might be stale
  const activeChatIdRef = useRef(activeChatId);


    // Update activeChatId ref whenever activeChatId state changes
    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);


  // --- Socket Connection Management and Message Listening ---
  useEffect(() => {
    if (!loadingAuth && currentUser) {
      const socket = chatApi.connectSocket(); // Connect the socket when user is logged in

      // Set up listener for incoming messages
      const removeNewMessageListener = chatApi.onNewMessage(({ chatId, message }) => {
          console.log("Received new message:", message);
          // Only add message if it belongs to the currently active chat
          if (chatId === activeChatIdRef.current) {
               setMessages(prevMessages => {
                    // Prevent adding duplicate messages if the server echoes the message back
                    // Compare by message._id if it exists, or a combination of sender/message/timestamp
                    if (message._id && prevMessages.some(msg => msg._id === message._id)) {
                        return prevMessages; // Already have this message
                    }
                     // Filter out any optimistic message that matches this new message
                     // This assumes the real message coming from the socket contains the same message text and sender ID
                     const filteredOptimistic = prevMessages.filter(msg =>
                        !(msg.isOptimistic && msg.message === message.message && msg.sender._id === message.sender._id)
                    );

                   return [...filteredOptimistic, message]; // Add the real message
               });

          } else {
              // Handle new message for a chat that is not currently active (e.g., notification)
               console.log(`New message for chat ${chatId} (not currently active)`);
               // Update the 'chats' state to move the chat to the top and indicate unread
               setChats(prevChats => {
                   const chatToUpdateIndex = prevChats.findIndex(chat => chat._id === chatId);
                   if (chatToUpdateIndex === -1) {
                       // If the chat isn't in the current list (shouldn't happen ideally)
                       // Maybe refetch the user's chat list to include the new chat?
                       // For simplicity, we'll just log a warning here.
                       console.warn(`Received message for chat ${chatId} not in current chat list.`);
                       return prevChats;
                   }
                   const chatToUpdate = { ...prevChats[chatToUpdateIndex], lastMessage: message, hasUnread: true };
                   const updatedChats = [...prevChats];
                   updatedChats.splice(chatToUpdateIndex, 1); // Remove from old position
                   updatedChats.unshift(chatToUpdate); // Add to the front (most recent)
                   return updatedChats;
               });
          }
      });

      // Set up listener for send message errors (optional feedback to user)
       const removeSendMessageErrorListener = chatApi.onSendMessageError(({ chatId, error }) => {
           if (chatId === activeChatIdRef.current) {
               console.error(`Error sending message in active chat: ${error}`);
               // TODO: Provide user feedback (e.g., a toast notification)
               alert(`Error sending message: ${error}`); // Simple alert for demonstration
           }
       });


      // Clean up socket connection and listeners on component unmount or user logout
      return () => {
        removeNewMessageListener();
        removeSendMessageErrorListener();
         // Leave the current chat room before disconnecting the socket
         if (activeChatIdRef.current) {
            chatApi.leaveChat(activeChatIdRef.current);
         }
        chatApi.disconnectSocket();
        console.log("ChatPage unmounted or user logged out. Socket disconnected.");
      };
    }
    // If loadingAuth finishes and there's no currentUser, disconnect any lingering socket
     if (!loadingAuth && !currentUser) {
         chatApi.disconnectSocket();
     }

  }, [currentUser, loadingAuth]); // Depend on currentUser and loadingAuth


    // Effect to join/leave Socket.IO room when activeChatId changes
    useEffect(() => {
        const socket = chatApi.getSocket();

        // Function to clean up previous room
        const leavePreviousRoom = (prevChatId) => {
            if (prevChatId && socket.connected) {
                 chatApi.leaveChat(prevChatId);
            }
        };

        // This runs when activeChatId *changes* OR component unmounts
        const prevActiveChatIdOnCleanup = activeChatIdRef.current;

        if (activeChatId) {
            // Ensure we leave the *previously* active chat room
             // The `joinChat` logic on the backend might already handle leaving previous rooms,
             // but explicit leaving on the frontend is safer. We need the ID *before* the update.
             // The cleanup function gets the value *before* the effect runs again or component unmounts.
             // So the return function handles leaving the *old* room.
             // The logic below handles joining the *new* room.

            // If we are changing chatIds, explicitly leave the old one first (handled by cleanup)
            // Then join the new one
            chatApi.joinChat(activeChatId); // Join the new chat room

            // If switching chats, mark the previous one as read (optional)
             // setChats(prevChats => prevChats.map(chat =>
             //     chat._id === prevActiveChatIdOnCleanup ? { ...chat, hasUnread: false } : chat
             // ));


        } else {
             // If activeChatId becomes null (e.g., no chats found)
             leavePreviousRoom(prevActiveChatIdOnCleanup);
        }


        // Return cleanup function to leave the room when activeChatId changes again or component unmounts
        return () => {
           leavePreviousRoom(activeChatIdRef.current); // Leave the room associated with the ID *before* this cleanup runs
        };

    }, [activeChatId]); // Only re-run this effect when activeChatId changes


  // --- Fetch user's chats on mount or when user changes ---
  useEffect(() => {
    if (currentUser && !loadingAuth) {
      const fetchUserChats = async () => {
        try {
          setLoadingChats(true);
          setErrorLoadingChats(null);
          // Fetch user chats - chatApi now gets user ID from token
          const userChats = await chatApi.getUserChats(); // No userId parameter here now
          console.log("Fetched user chats:", userChats);
          setChats(userChats);

          // Automatically select the first chat if no chat is currently active
          if (userChats.length > 0 && activeChatId === null) {
             // Check if a chat ID might be in the URL params (optional)
             // const urlChatId = // Get ID from URL params if you use routing like /chat/:chatId
             // setActiveChatId(urlChatId || userChats[0]._id);
             setActiveChatId(userChats[0]._id); // Select the first chat by default
          } else if (userChats.length === 0) {
             setActiveChatId(null); // No chats found, clear active chat
          } else {
             // If activeChatId is already set (e.g., from URL or previous state),
             // ensure that chat is still in the fetched list. If not, select first one.
             const activeChatExistsInList = userChats.some(chat => chat._id === activeChatId);
             if (!activeChatExistsInList) {
                 setActiveChatId(userChats.length > 0 ? userChats[0]._id : null);
             }
             // If activeChatId is already set AND exists, we don't change it here
             // The messages useEffect will handle fetching messages for the existing activeChatId
          }


        } catch (err) {
          setErrorLoadingChats('Failed to load your chats.');
          console.error(err);
          setChats([]);
          setActiveChatId(null);
          setActiveChat(null);
          setMessages([]);
        } finally {
          setLoadingChats(false);
        }
      };

      fetchUserChats();
    } else if (!currentUser && !loadingAuth) {
       // Handle case where user is not logged in after auth check
       setChats([]);
       setActiveChatId(null);
       setActiveChat(null);
       setMessages([]);
       setLoadingChats(false);
       setErrorLoadingChats('Please log in to view your chats.');
       // Optionally redirect to login page: navigate('/login');
    }
     // Dependencies: currentUser and loadingAuth determine if we should fetch chats
  }, [currentUser, loadingAuth]); // Keep these dependencies


  // --- Fetch messages and chat details for the active chat ---
  useEffect(() => {
    if (activeChatId) {
      const fetchChatDetailsAndMessages = async () => {
        try {
          setLoadingMessages(true);
          setErrorLoadingMessages(null);
          // Fetch the chat details (including participants and messages)
          const chatDetails = await chatApi.getChatById(activeChatId);
          console.log("Fetched active chat details:", chatDetails);
          setActiveChat(chatDetails); // Store the full chat object
          setMessages(chatDetails.messages || []); // Store the messages (ensure it's an array)

           // Mark chat as read when opened (optional)
            setChats(prevChats => prevChats.map(chat =>
                chat._id === activeChatId ? { ...chat, hasUnread: false } : chat
            ));


        } catch (err) {
          console.error('Failed to load messages for chat:', activeChatId, err);
          setErrorLoadingMessages('Failed to load messages.');
          setMessages([]); // Clear messages if loading fails
          setActiveChat(null); // Clear active chat state
           // If the chat wasn't found (e.g., deleted), remove it from the sidebar list
           setChats(prevChats => prevChats.filter(chat => chat._id !== activeChatId));
           setActiveChatId(null); // Clear active chat ID so sidebar selects first available or shows "no chat"


        } finally {
          setLoadingMessages(false);
        }
      };

      fetchChatDetailsAndMessages();
    } else {
       // Reset messages and active chat if no chat is selected or activeChatId becomes null
       setMessages([]);
       setActiveChat(null);
    }
     // Depend only on activeChatId changing, and setChats because it's used in error handling
  }, [activeChatId, setChats]);


  // --- Auto-scroll to the latest message ---
  useEffect(() => {
    // Scroll to the bottom when messages change (and there are messages to scroll to)
    // Use a slight delay to ensure DOM updates are painted
    const timer = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); // Added block: 'end'
        }
    }, 50); // Small delay

    return () => clearTimeout(timer); // Cleanup the timer

  }, [messages]); // Re-run when messages array changes


  // --- Handle sending a message ---
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    const messageText = newMessageText.trim();

    if (!messageText || !activeChatId || !currentUser || sendingMessage) {
      return; // Don't send empty messages or if no chat selected/user not logged in/already sending
    }

    // --- Optimistic UI Update ---
    // Generate a temporary ID. Using Date.now() + random is better than just Date.now()
    const tempMessageId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage = {
      _id: tempMessageId, // Use temporary ID for key prop
      sender: { // Use current user info for optimistic rendering (needs _id, username, profilePicture)
        _id: currentUser._id,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
         role: currentUser.role // Include role if you use it for message styling/info
      },
      message: messageText,
      timestamp: new Date().toISOString(), // Use current time
      isOptimistic: true, // Flag for styling/handling later if needed
    };

     // Add the optimistic message to the state immutably
     setMessages(prevMessages => [...prevMessages, optimisticMessage]);

     // Clear the input immediately
    setNewMessageText('');

     // Auto-scroll to see the optimistic message
     // A small delay helps ensure the new message is rendered before scrolling
     setTimeout(() => {
         if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
     }, 50);


    try {
      setSendingMessage(true); // Disable input/button while sending attempt is ongoing

      // Send the message via Socket.IO
      // This is an emission, it doesn't return a promise for the server response.
      // The backend will process it, save it, populate it, and broadcast the *real* message.
      chatApi.sendMessage({ chatId: activeChatId, message: messageText });

      // The 'newMessage' socket listener will receive the confirmed message from the backend.
      // The listener will update the state and replace/merge the optimistic message
      // if you implement logic there to match by message content + sender + timestamp
      // or if the backend includes the temporary ID in its broadcast (more complex).
      // The current listener logic adds the new message, assuming the backend doesn't echo.
      // If the backend echoes, the deduplication logic in the listener helps.


    } catch (err) {
       // Handle error if the socket emission itself failed (less common than HTTP error)
       console.error('Error sending message via socket:', err);
       // Revert optimistic update if emission failed
       setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessageId));
       // Display an error message to the user
       alert(`Failed to send message: ${err.message || 'Unknown error'}`);
    } finally {
       // The sending state can be set to false once the emission is attempted.
       // The actual success/failure of message delivery is handled by the socket listeners.
       setSendingMessage(false);
    }
  }, [newMessageText, activeChatId, currentUser, sendingMessage]);


  // --- Handle Search Input ---
  const handleSearchInputChange = (e) => {
      const query = e.target.value;
      setSearchQuery(query); // Update state immediately

      // Decide whether to show search results based on input focus and query length
      const shouldShow = query.length > 0; // Show results area if query is not empty

      setShowSearchResults(shouldShow); // Control visibility of results

      console.log("handleSearchInputChange: Query:", query);
    console.log("handleSearchInputChange: Should show results area:", shouldShow);
    console.log("handleSearchInputChange: Query length > 1?", query.length > 1);


      if (query.length > 1) { // Start search API call after typing at least 2 characters
        console.log("handleSearchInputChange: Calling debounced search..."); // Log before calling debounce
          debouncedSearch(query); // Call the debounced search function
      } else {
          // Clear results and error if query is too short or empty
          console.log("handleSearchInputChange: Query too short or empty, clearing results/search state."); // Log when clearing
          setSearchResults([]);
          setErrorSearch(null);
          setLoadingSearch(false);
          // When search query is cleared, the sidebar should show the chat list again,
          // which is handled by the conditional rendering in the JSX.
      }
  };

  // Debounce the search API call
  // useCallback ensures the debounce function instance is stable across renders

const debouncedSearch = useCallback(
  // The debounce function takes the async search logic
  debounce(async (query) => {
      // --- Add this log inside the debounce ---
      console.log("debouncedSearch: Function triggered with query:", query);
      // ----------------------------------------

      // Check query length again inside debounce, using the 'query' argument
      if (query.length < 2) {
           console.log("debouncedSearch: Query too short after debounce, returning.");
           // Optional: Maybe clear results if query becomes too short while debounce was pending
           setSearchResults([]);
           setErrorSearch(null);
           setLoadingSearch(false);
           setShowSearchResults(false); // Hide results if query is now too short
           return;
      }

      console.log("debouncedSearch: Proceeding to call chatApi.searchUsers...");
      try {
          setLoadingSearch(true);
          setErrorSearch(null);
          const results = await chatApi.searchUsers(query);
          console.log("debouncedSearch: chatApi.searchUsers successful. Results:", results);
          setSearchResults(results);
          // Always show results if search was successful and query is long enough
           if (query.length >= 2) setShowSearchResults(true);


      } catch (err) {
          console.error("debouncedSearch: Error calling chatApi.searchUsers:", err);
          setErrorSearch(err.message || 'Failed to search for users.');
          setSearchResults([]); // Clear previous results on error
          setShowSearchResults(true); // Keep results area visible to show the error
      } finally {
          setLoadingSearch(false);
          console.log("debouncedSearch: Finally block reached.");
      }
  }, 300), // 300ms debounce delay
  [] // **EMPTY DEPENDENCY ARRAY** - This ensures the debounced function is created only once.
);


    // Effect to clean up debounce on component unmount
    useEffect(() => {
        return () => {
            // Cancel any pending debounce calls when the component unmounts
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]); // Depend on the debouncedSearch function instance


  // --- Handle Selecting a User from Search Results ---
  const handleSelectUser = async (user) => {
      if (!currentUser || !user || !user._id) {
          console.warn("handleSelectUser called without currentUser or valid user object.");
          return;
      }
       // --- Add these logs before calling createChat ---
       console.log("Attempting to create/find chat with user ID:", user._id);
       console.log("Type of user._id:", typeof user._id);
       // ------------------------------------------------

      try {
          setLoadingChats(true); // Show loading state for chat list area
          setErrorLoadingChats(null); // Clear chat list errors
          setLoadingSearch(true); // Keep search loading on while creating/finding chat
          setErrorSearch(null); // Clear search errors

          // Attempt to create a chat with the selected user (backend uses token for current user)
          // Pass ONLY the other participant's ID
          const chat = await chatApi.createChat(user._id);

          console.log("Chat created or found:", chat);

          // Check if the chat already exists in the current chats list state
          setChats(prevChats => {
              const chatExists = prevChats.some(c => c._id === chat._id);
              if (!chatExists) {
                   // Add the new chat to the front of the list (most recent)
                  return [chat, ...prevChats];
              } else {
                   // If chat exists, find its current position and move it to the top
                   const existingChatIndex = prevChats.findIndex(c => c._id === chat._id);
                   if (existingChatIndex > -1) {
                       const updatedChats = [...prevChats];
                       const [movedChat] = updatedChats.splice(existingChatIndex, 1); // Remove from old spot
                        // Use the updated chat object from the createChat response, not the one from state
                       updatedChats.unshift(chat); // Add the received chat to the front
                       return updatedChats;
                   }
                   return prevChats; // Should not happen
              }
          });


          // Set the newly created/found chat as the active chat
          setActiveChatId(chat._id);

          // Clear the search state and hide results
          setSearchQuery('');
          setSearchResults([]); // Clear search results
          setShowSearchResults(false); // Hide search results after selection

      } catch (err) {
          console.error("Error creating/finding chat:", err);
          // Show error in chat list area OR search results area
          setErrorLoadingChats(err.message || 'Failed to open chat.');
          setErrorSearch(err.message || 'Failed to open chat with user.'); // Show also in search results area for clarity

      } finally {
          setLoadingChats(false); // Turn off chat list loading
          setLoadingSearch(false); // Turn off search loading
      }
  };

  // --- Handle Click outside search results to hide them ---
  // Use a ref for the search input and results container to determine clicks outside
   const sidebarSearchAreaRef = useRef(null); // Ref for the entire sidebar search area

   useEffect(() => {
       const handleClickOutside = (event) => {
           // Check if the click target is outside the sidebar search area
           if (sidebarSearchAreaRef.current && !sidebarSearchAreaRef.current.contains(event.target)) {
               // Only hide if the search query is empty (so the default chat list can be shown)
               // If query exists, keep results visible until cleared or item is selected
               if (!searchQuery) {
                   setShowSearchResults(false);
               }
           }
       };

       // Add listener only when component mounts
       document.addEventListener('mousedown', handleClickOutside);

       return () => {
           // Clean up listener on component unmount
           document.removeEventListener('mousedown', handleClickOutside);
       };
       // No dependencies needed as listeners are added/removed once
   }, [searchQuery]); // Added searchQuery dependency to re-evaluate hiding logic

// src/pages/ChatPage.jsx (JSX portion - include all the code above this)
// ... (all the imports, state variables, useEffect hooks, useCallback handlers)

  // --- Render logic ---
  // Check authentication loading state
  if (loadingAuth) {
    return (
      <div className='chat-page-container'> {/* Add a container div for full page */}
           <Navbar /> {/* Render Navbar even when loading auth */}
          <div className="loading-state" style={{marginTop: 'var(--header-h)', textAlign: 'center', padding: '20px'}}>Loading authentication...</div>
      </div>
    );
}

// Check if user is logged in after auth check
if (!currentUser) {
    return (
      <div className='chat-page-container'> {/* Add a container div for full page */}
          <Navbar /> {/* Render Navbar even when not logged in */}
          <div className="not-logged-in-state" style={{marginTop: 'var(--header-h)', textAlign: 'center', padding: '20px'}}>Please log in to view chats.</div>
      </div>
    );
    // Optionally redirect to login page using navigate('/login');
}

// Find the other participant in the active chat for display in the header
// Check if activeChat object and its participants array exist before trying to find
const otherParticipant = activeChat && activeChat.participants
  ? activeChat.participants.find(p => p && p._id !== currentUser._id)
  : null;


return (
  // Outer wrapper div for the whole chat page, including Navbar
  <div className='chat'> {/* Keep your original chat wrapper if needed for overall layout */}
    <Navbar /> {/* Render the Navbar */}

    {/* Main flex container for sidebar and chat window */}
    <div className="chat-page">

      {/* --- Sidebar --- */}
      {/* Attach ref to the container holding search and chat list/results */}
      <aside className="chat-sidebar" ref={sidebarSearchAreaRef}>
        <div className="sidebar-header">
          {/* Search Input for Users */}
          <input
              ref={searchInputRef} // Attach ref for focus/blur detection
              type="text"
              placeholder="Search users to chat with…"
              value={searchQuery}
              onChange={handleSearchInputChange} // Use the search handler
              // Show results area when input is focused, but only if there's a query or existing results
              onFocus={() => setShowSearchResults(searchQuery.length > 0 || searchResults.length > 0)}
              // onBlur is handled by the handleClickOutside effect
          />
           {/* Optional: Clear search button - shown only when there's a query */}
          {searchQuery && (
              <button className="clear-search-btn" onClick={() => {
                  setSearchQuery(''); // Clear the search query
                  setSearchResults([]); // Clear results
                  setErrorSearch(null); // Clear errors
                  setLoadingSearch(false); // Ensure loading is off
                  setShowSearchResults(false); // Hide results area when cleared
              }}>
                  &times; {/* Unicode multiplication sign for a simple 'x' button */}
              </button>
          )}
        </div>

        {/* Conditional Rendering: Search Results List OR Standard Chat List */}
        {/* Show search results if showSearchResults is true AND there's a query */}
        {showSearchResults && searchQuery.length > 0 ? (
            <div className="search-results-list"> {/* Add a class for styling */}
               {loadingSearch ? (
                  <div className="search-state-message">Searching...</div>
               ) : errorSearch ? (
                  <div className="search-state-message error">{errorSearch}</div>
               ) : searchResults.length === 0 ? (
                   <div className="search-state-message">No users found.</div>
               ) : (
                  // Map through search results and display found users
                  searchResults.map(user => (
                     <div
                         key={user._id} // Use user._id as the unique key
                         className="chat-item search-result-item" // Re-use chat-item styles, add search-result-item
                         onClick={() => handleSelectUser(user)} // Handle clicking on a user to open/create chat
                     >
                         {/* Display user's profile picture or a default placeholder */}
                         <img src={user.profilePicture || 'https://via.placeholder.com/40'} alt={user.username} className="chat-avatar" />
                         <div className="chat-info">
                             <div className="chat-name">
                                 {user.username}
                                 {/* Display user role indicator if role exists */}
                                 {user.role && (
                                     <span className={`user-role-badge ${user.role.toLowerCase()}`}>
                                         {user.role} {/* e.g., User, Coach, Admin */}
                                     </span>
                                 )}
                             </div>
                             {/* You could add email or other info here */}
                             {/* <div className="chat-last">{user.email}</div> */}
                         </div>
                         {/* Online status dot - requires real-time presence features (more complex) */}
                         {/* {user.onlineStatus === 'online' && <span className="status-dot" />} */}
                     </div>
                  ))
               )}
            </div>
        ) : (
            // Show the standard chat list if not searching or query is too short/cleared
            <ul className="chat-list">
              {loadingChats ? (
                <li style={{padding: '12px 16px'}}>Loading chats...</li>
              ) : errorLoadingChats ? (
                <li style={{padding: '12px 16px', color: 'red'}}>{errorLoadingChats}</li>
              ) : chats.length === 0 ? (
                 <li style={{padding: '12px 16px', color: '#666'}}>No chats found.</li>
              ) : (
                // Map through the user's chat list
                chats.map(chat => {
                  // Find the other participant for displaying in the sidebar chat item
                  // Ensure chat and participants array exist before accessing
                  const otherUser = chat && chat.participants
                    ? chat.participants.find(p => p && p._id !== currentUser._id)
                    : null;
                   // Get the last message preview
                   // Ensure chat.messages array exists and is not empty
                   const lastMessage = chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1]
                      : null;


                  return (
                    // Use chat._id as the unique key for list items
                    <li
                      key={chat._id}
                      // Apply 'active' class if this is the currently selected chat
                      className={chat._id === activeChatId ? 'chat-item active' : 'chat-item'}
                      // Handle clicking on a chat item to make it active
                      onClick={() => setActiveChatId(chat._id)}
                    >
                      {/* Display other user's avatar or a default placeholder */}
                      <img src={otherUser?.profilePicture || 'https://via.placeholder.com/40'} alt={otherUser?.username || 'User'} className="chat-avatar" />
                      <div className="chat-info">
                        {/* Display other user's username */}
                        <div className="chat-name">
                            {otherUser?.username || 'Unknown User'}
                            {/* Display user role indicator for the other user */}
                            {otherUser?.role && (
                              <span className={`user-role-badge ${otherUser.role.toLowerCase()}`}>
                                  {otherUser.role}
                              </span>
                            )}
                         </div>
                        {/* Display the last message preview and formatted time */}
                        <div className="chat-last">
                           {/* Show 'You:' prefix if the last message was sent by the current user */}
                           {lastMessage ? `${lastMessage.sender && lastMessage.sender._id === currentUser._id ? 'You: ' : ''}${lastMessage.message}` : 'No messages yet.'}
                            {/* Display formatted timestamp if last message and timestamp exist */}
                            {lastMessage && lastMessage.timestamp && (
                                <span className="last-message-time">
                                   {formatLastMessageTime(lastMessage.timestamp)}
                                </span>
                            )}
                       </div>
                      </div>
                      {/* Unread indicator dot (optional - requires backend tracking of read status) */}
                       {/* {chat.hasUnread && <span className="unread-dot" />} */}

                      {/* Online status dot - requires real-time presence (more advanced Socket.IO) */}
                      {/* {otherUser?.onlineStatus === 'online' && <span className="status-dot" />} */}
                    </li>
                  );
                })
              )}
            </ul>
        )} {/* End Conditional Rendering for Sidebar List */}
      </aside>

      {/* --- Main Chat Window --- */}
      <main className="chat-window">
        {/* Conditionally render chat header, messages, and input based on whether a chat is active */}
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="chat-header">
              {/* Display other participant's info */}
              <img
                src={otherParticipant?.profilePicture || 'https://via.placeholder.com/48'}
                alt={otherParticipant?.username || 'User'}
                className="chat-window-avatar"
              />
              <div className="chat-window-info">
                <div className="chat-window-name">
                  {otherParticipant?.username || 'Unknown User'}
                  {/* Display other participant's role */}
                  {otherParticipant?.role && (
                      <span className={`user-role-badge ${otherParticipant.role.toLowerCase()}`}>
                          {otherParticipant.role}
                      </span>
                  )}
                </div>
                <div className="chat-window-sub">
                   {/* You can put a status or connection info here (e.g., "Online", "Last seen...") */}
                  Online {/* Static placeholder for now */}
                </div>
              </div>
            </header>

            {/* Message Area */}
            <section className="messages">
               {loadingMessages ? (
                  <div className="message-state-message">Loading messages...</div>
               ) : errorLoadingMessages ? (
                  <div className="message-state-message error">{errorLoadingMessages}</div>
               ) : messages.length === 0 ? (
                  <div className="message-state-message">No messages yet. Start the conversation!</div>
               ) : (
                  // Map through messages to display bubbles
                  messages.map(m => (
                     // Determine if the message is from the current user ('me') or the other person ('them')
                     // Ensure m.sender exists before accessing _id
                     <div key={m._id || m.tempId} className={`message ${m.sender && m.sender._id === currentUser._id ? 'me' : 'them'}`}> {/* Use tempId for optimistic message key */}
                       <div className="message-bubble">{m.message}</div>
                       {/* Optional: Display formatted time below the bubble */}
                       {/* Ensure m.timestamp exists before formatting */}
                       <div className={`message-time ${m.sender && m.sender._id === currentUser._id ? 'me' : 'them'}`}>
                         {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'} {/* Show 'Sending...' for optimistic without timestamp */}
                       </div>
                     </div>
                  ))
               )}
               {/* Dummy div for auto-scrolling - its position helps scrollIntoView */}
               <div ref={messagesEndRef} />
            </section>

            {/* Input Area */}
            <footer className="chat-input">
              {/* Use a form for better input handling and submit on Enter key press */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
                  <input
                      type="text"
                      placeholder="Type a message…"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      disabled={sendingMessage} // Disable input while sending
                  />
                  {/* Send button - disabled while sending or if input is empty or no chat selected */}
                  <button
                      type="submit"
                      className="send-btn"
                      disabled={sendingMessage || !activeChatId || !newMessageText.trim()} // Disable if no text, no chat, or sending
                  >
                      {sendingMessage ? '...' : '➤'} {/* Show sending indicator */}
                  </button>
               </form>
               {/* Optional: Error message below input for sending failure */}
               {/* {errorSendingMessage && <div className="send-error-message">{errorSendingMessage}</div>} */}
            </footer>
          </>
        ) : (
          // State when no chat is selected (initially or if user has no chats)
          <div className="no-chat-selected">
            {/* Display message guiding the user */}
            Select a chat or search for a user to start a conversation.
          </div>
        )}
      </main>
    </div>
  </div>
);
}
