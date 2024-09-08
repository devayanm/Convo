import React, { useState, useEffect } from 'react';
import { getMessagesForMeeting, createMessage } from '../services/api';

function Messages({ meetingId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessagesForMeeting(meetingId);
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [meetingId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const message = { content: newMessage, meeting_id: meetingId };
      await createMessage(message);
      setMessages([...messages, message]); // Update the message list
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container">
      <h3>Messages for Meeting {meetingId}</h3>
      <ul className="list-group">
        {messages.map((msg, index) => (
          <li key={index} className="list-group-item">
            {msg.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <div className="mb-3">
          <label className="form-label">Send a Message</label>
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default Messages;
