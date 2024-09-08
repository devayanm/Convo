import React, { useState, useEffect } from 'react';
import { createMeeting, getMeetingById } from '../services/api';

function Meetings() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getMeetingById();
        setMeetings(response);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="container">
      <h2>Meetings</h2>
      <ul className="list-group">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="list-group-item">
            {meeting.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Meetings;
