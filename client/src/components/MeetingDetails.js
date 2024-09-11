import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMeetingById } from "../services/api";
import { Spinner, Alert, Button } from "react-bootstrap";

const Meeting = () => {
  const { id } = useParams(); // Get the meeting ID from URL params
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingData = await getMeetingById(id);
        setMeeting(meetingData);
      } catch (err) {
        setError("Meeting not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  if (loading) {
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <div className="container my-5">
      {meeting ? (
        <div>
          <h1>{meeting.title}</h1>
          <p><strong>Time:</strong> {meeting.time}</p>
          <p><strong>Participants:</strong> {meeting.participants.join(", ")}</p>

          <Button variant="primary">Join Meeting</Button>
        </div>
      ) : (
        <Alert variant="warning">No meeting details found.</Alert>
      )}
    </div>
  );
};

export default Meeting;
