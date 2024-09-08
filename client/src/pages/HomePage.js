import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className="container">
            <main className="text-center">
                <h1 className="display-4">Welcome to Convo</h1>
                <p className="lead">Your platform for seamless communication and collaboration.</p>
                <div className="my-4">
                    <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                </div>
            </main>
        </div>
    );
};

export default Homepage;
