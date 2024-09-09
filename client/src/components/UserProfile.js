import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Ensure you are using useParams to get userId from URL
import { getUserById } from "../services/api";

function UserProfile() {
  const { id: userId } = useParams(); // Get userId from URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response);
      } catch (error) {
        setError("Error fetching user data. Please try again later.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-center text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
          <p className="card-text">
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p className="card-text">
            <strong>Address:</strong> {user.address || "N/A"}
          </p>
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
