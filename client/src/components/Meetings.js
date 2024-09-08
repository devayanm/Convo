import React, { useState, useEffect } from 'react';
import { getMeetings, deleteMeeting } from '../services/api';
import { Link } from 'react-router-dom';

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getMeetings(); // Corrected to fetch all meetings
        setMeetings(response); // Assume response is an array of meetings
        setLoading(false); // Turn off loading state when done
      } catch (error) {
        setError('Failed to fetch meetings. Please try again later.');
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDeleteMeeting = async (id) => {
    try {
      await deleteMeeting(id); // API call to delete the meeting
      setMeetings(meetings.filter((meeting) => meeting.id !== id)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete the meeting. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading meetings...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Your Meetings</h2>
      {meetings.length === 0 ? (
        <div className="alert alert-info text-center">No meetings scheduled.</div>
      ) : (
        <ul className="list-group">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{meeting.title}</h5>
                <p className="mb-1 text-muted">
                  <strong>Time:</strong> {meeting.time} <br />
                  <strong>Participants:</strong> {meeting.participants?.join(', ')}
                </p>
              </div>
              <div>
                <Link to={`/meeting/${meeting.id}`} className="btn btn-outline-primary btn-sm me-2">
                  Join
                </Link>
                <Link to={`/edit-meeting/${meeting.id}`} className="btn btn-outline-secondary btn-sm me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Meetings;
