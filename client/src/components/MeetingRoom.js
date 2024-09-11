import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMeetingById, sendSignalingMessage } from "../services/api"; 
import { Button, Spinner } from "react-bootstrap"; 

const MeetingRoom = () => {
  const { id } = useParams(); 
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null); 
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [participants, setParticipants] = useState([]); 

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await getMeetingById(id);
        setMeeting(response);
        setParticipants(response.participants || []); 
      } catch (err) {
        setError("Failed to load the meeting. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [id]);

  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection();

        stream
          .getTracks()
          .forEach((track) => peerConnection.current.addTrack(track, stream));

        peerConnection.current.ontrack = (event) => {
          const [remoteStream] = event.streams;
          remoteVideoRef.current.srcObject = remoteStream;
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignalingMessage({ candidate: event.candidate }); 
          }
        };

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        sendSignalingMessage({ offer });

        // Handle incoming signaling messages (e.g., answer, ICE candidates)
        // Add this logic inside a listener or WebSocket message handler
        // Example (pseudo-code):
        // signalingSocket.onmessage = async (message) => {
        //   const { answer, candidate } = message;
        //   if (answer) await peerConnection.current.setRemoteDescription(answer);
        //   if (candidate) await peerConnection.current.addIceCandidate(candidate);
        // };
      } catch (err) {
        setError(
          "Failed to access media devices. Please ensure you have granted permissions."
        );
      }
    };

    setupWebRTC();
  }, []);

  const toggleAudio = () => {
    const stream = localVideoRef.current.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setAudioEnabled(!audioEnabled);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current.srcObject;
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setVideoEnabled(!videoEnabled);
  };

  const ParticipantsList = ({ participants }) => (
    <div className="participants-list">
      <h5>Participants</h5>
      <ul>
        {participants.length > 0 ? (
          participants.map((participant) => (
            <li key={participant.id}>{participant.name}</li>
          ))
        ) : (
          <li>No participants yet.</li>
        )}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Loading meeting details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="meeting-room container">
      <h2>{meeting.title}</h2>
      <p>{meeting.time}</p>

      <div className="video-container my-4 d-flex justify-content-around">
        <div>
          <h5>Your Video</h5>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="border"
            style={{ width: "320px", height: "240px" }}
          />
        </div>
        <div>
          <h5>Remote Video</h5>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="border"
            style={{ width: "320px", height: "240px" }}
          />
        </div>
      </div>

      <div className="meeting-controls d-flex justify-content-center my-4">
        <Button
          variant={audioEnabled ? "danger" : "success"}
          onClick={toggleAudio}
        >
          {audioEnabled ? "Mute Audio" : "Unmute Audio"}
        </Button>
        <Button
          variant={videoEnabled ? "danger" : "success"}
          onClick={toggleVideo}
          className="ms-3"
        >
          {videoEnabled ? "Turn Off Video" : "Turn On Video"}
        </Button>
      </div>

      <ParticipantsList participants={participants} />
    </div>
  );
};

export default MeetingRoom;
