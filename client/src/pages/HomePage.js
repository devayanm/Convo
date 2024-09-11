import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Alert, Spinner, Card } from "react-bootstrap";
import {
  getUserById,
  getMeetings,
  createMeeting,
  deleteMeeting,
} from "../services/api";

const Homepage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userStatus, setUserStatus] = useState("Online");
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndMeetings = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const userId = localStorage.getItem("userId");
          const user = await getUserById(userId);
          setUserStatus(user.status);

          const meetingsResponse = await getMeetings();
          setUpcomingMeetings(meetingsResponse);
        } catch (err) {
          setError("Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserAndMeetings();
  }, [isAuthenticated]);

  const handleScheduleMeeting = async () => {
    if (newMeetingTitle.trim() && newMeetingTime.trim()) {
      try {
        const newMeeting = {
          title: newMeetingTitle,
          time: newMeetingTime,
        };
        const scheduledMeeting = await createMeeting(newMeeting);

        setUpcomingMeetings([...upcomingMeetings, scheduledMeeting]);

        setNewMeetingTitle("");
        setNewMeetingTime("");
        setShowScheduleModal(false);
      } catch (err) {
        setError("Failed to schedule the meeting. Please try again.");
      }
    } else {
      setError("Please fill in both fields.");
    }
  };

  const handleCancelMeeting = async (id) => {
    try {
      await deleteMeeting(id);
      setUpcomingMeetings(
        upcomingMeetings.filter((meeting) => meeting.id !== id)
      );
    } catch (err) {
      setError("Failed to cancel the meeting. Please try again.");
    }
  };

  const MeetingCard = ({ meeting }) => (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title>{meeting.title}</Card.Title>
          <Card.Subtitle className="text-muted">{meeting.time}</Card.Subtitle>
        </div>
        <div>
          <Link
            to={`/meeting/${meeting.id}`}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Join
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleCancelMeeting(meeting.id)}
          >
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const UserStatus = () => (
    <div className="d-flex align-items-center mb-4">
      <span
        className={`badge ${
          userStatus === "Online" ? "bg-success" : "bg-warning"
        } me-2`}
      >
        {userStatus === "Online" ? "🟢" : "🟡"} {userStatus}
      </span>
      <Button
        variant="outline-primary"
        size="sm"
        className="me-1"
        onClick={() => setUserStatus("Online")}
      >
        Set Online
      </Button>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setUserStatus("Away")}
      >
        Set Away
      </Button>
    </div>
  );

  return (
    <div className="homepage">
      <div className="container my-4">
        {isAuthenticated ? (
          <>
            <UserStatus />

            <div className="d-flex justify-content-between mb-4">
              <Link to="/start-meeting" className="btn btn-primary">
                Start a Meeting
              </Link>
              <Link to="/join-meeting" className="btn btn-secondary">
                Join a Meeting
              </Link>
              <Button
                variant="success"
                onClick={() => setShowScheduleModal(true)}
              >
                Schedule a New Meeting
              </Button>
            </div>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="upcoming-meetings-section">
                <h3 className="mb-4">Upcoming Meetings</h3>
                {upcomingMeetings.length ? (
                  upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))
                ) : (
                  <p>No upcoming meetings</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center mb-4">
            <h1 className="h2">Welcome to Convo</h1>

            <h2 className="h4">Not Logged In?</h2>
            <p>
              Sign in to access all your meetings, schedule new ones, and more.
            </p>
            <div className="mb-4">
              <Link to="/login" className="btn btn-light me-2">
                Log In to Access Meetings
              </Link>
              <Link to="/register" className="btn btn-light">
                Register for new account
              </Link>
            </div>
            <div>
              <h3 className="h5">Why Convo?</h3>
              <p>
                Convo is a powerful platform for scheduling and managing your
                meetings effortlessly. With Convo, you can:
              </p>
              <ul className="list-unstyled">
                <li>Start and join meetings quickly</li>
                <li>Manage your schedule with ease</li>
                <li>Stay connected with your team or clients</li>
              </ul>
              <Button variant="info" as={Link} to="/features">
                Learn More About Convo
              </Button>
            </div>
          </div>
        )}

        <Modal
          show={showScheduleModal}
          onHide={() => setShowScheduleModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Schedule a Meeting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Meeting Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter meeting title"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Meeting Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="Enter meeting time"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleScheduleMeeting}>
                Schedule
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Homepage;
