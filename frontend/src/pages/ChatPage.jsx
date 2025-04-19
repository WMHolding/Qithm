import React, { useState } from 'react';
import Navbar from './Navbar';

import '../styles/ChatPage.css';

// Sample data
const chats = [
  {
    id: 1,
    name: 'Coach Yasir',
    avatar: 'https://i.pravatar.cc/40?img=1',
    last: "Checking your progress...",
    online: true,
  },
  {
    id: 2,
    name: 'Coach Ayman',
    avatar: 'https://i.pravatar.cc/40?img=4',
    last: "Great work today!",
    online: false,
  },
  {
    id: 3,
    name: 'Coach Ahmad',
    avatar: 'https://i.pravatar.cc/40?img=31',
    last: "Let’s review your goals...",
    online: false,
  },
];

const messagesByChat = {
  1: [
    { id: 1, sender: 'them', text: "Hi! I saw you completed today's challenge. How are you feeling?", time: '10:30 AM' },
    { id: 2, sender: 'me',   text: "Great! The new routine is challenging but I'm keeping up!", time: '10:32 AM' },
    { id: 3, sender: 'them', text: "That's awesome! Let's look at your progress and adjust if needed.", time: '10:35 AM' },
  ],
  2: [
    { id: 1, sender: 'them', text: "Great work today!", time: 'Yesterday' },
  ],
  3: [
    { id: 1, sender: 'them', text: "Let's review your goals for next week.", time: '2 days ago' },
  ],
};

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);
  const messages = messagesByChat[activeChat] || [];

  return (
    <div className='chat'>
    <Navbar />
    <div className="chat-page">
        
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <input type="text" placeholder="Search trainers…" />
        </div>
        <ul className="chat-list">
          {chats.map(c => (
            <li
              key={c.id}
              className={c.id === activeChat ? 'chat-item active' : 'chat-item'}
              onClick={() => setActiveChat(c.id)}
            >
              <img src={c.avatar} alt={c.name} className="chat-avatar" />
              <div className="chat-info">
                <div className="chat-name">{c.name}</div>
                <div className="chat-last">{c.last}</div>
              </div>
              {c.online && <span className="status-dot" />}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-window">
        <header className="chat-header">
          <img
            src={chats.find(c => c.id === activeChat).avatar}
            alt=""
            className="chat-window-avatar"
          />
          <div className="chat-window-info">
            <div className="chat-window-name">
              {chats.find(c => c.id === activeChat).name}
            </div>
            <div className="chat-window-sub">
              Personal Trainer • Running Specialist
            </div>
          </div>
        </header>

        <section className="messages">
          {messages.map(m => (
            <div key={m.id} className={`message ${m.sender}`}>
              <div className="message-bubble">{m.text}</div>
              <div className="message-time">{m.time}</div>
            </div>
          ))}
        </section>

        <footer className="chat-input">
          <input type="text" placeholder="Type a message…" />
          <button className="send-btn">➤</button>
        </footer>
      </main>
    </div>
    </div>
  );
}
