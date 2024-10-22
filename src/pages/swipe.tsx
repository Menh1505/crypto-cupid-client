// src/pages/SwipePage.tsx
import React, { useEffect, useState } from 'react';
import '../styles/swipe.css'
import { User } from '../types/User'; // Import your User type
import Navbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import ToastService from '../services/toast';
import { ToastContainer } from 'react-toastify';

const SwipePage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const { user } = useUser();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8080/users'); // Adjust the endpoint as needed
            const data: User[] = await response.json();

            // Filter out the current user from the list
            const filteredUsers = data.filter(users => users._id !== user?._id);
            setUsers(filteredUsers);
        };

        fetchUsers();
    });

    const handleSwipe = async () => {
        // const userToSwipe = users[currentUserIndex];
        
        // Send swipe data to the server using GET method
        const response = await fetch(`http://localhost:8080/swipes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            // Handle error response
            console.error('Error swiping:', response.statusText);
        }

        // Move to the next user
        setCurrentUserIndex((prevIndex) => prevIndex + 1);
    };

    const handleMatch = async () => {
        const userToMatch = users[currentUserIndex];

        // Create a match for user1 (current user) and user2 (userToMatch)
        await fetch('http://localhost:8080/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user1_id: user?._id, // Current user ID
                user2_id: userToMatch._id, // User to match with
                is_mutual: true, // Set to true to indicate mutual matching
            }),
        });

        // Create a reverse match for user2 (userToMatch) and user1 (current user)
        await fetch('http://localhost:8080/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user1_id: userToMatch._id, // User to match with
                user2_id: user?._id, // Current user ID
                is_mutual: true, // Set to true to indicate mutual matching
            }),
        });

        // Optionally, you can provide feedback to the user
        ToastService.success(`Matched with ${userToMatch.name}`);
    };

    const calculateAge = (birthdate: string | null) => {
        if (!birthdate) {
            return null; // or return a default value, e.g., 0
        }

        const birthDateObj = new Date(birthdate);

        // Check if the date is valid
        if (isNaN(birthDateObj.getTime())) {
            return null; // or handle invalid date case
        }

        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        if (
            today.getMonth() < birthDateObj.getMonth() ||
            (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }

        return age;
    };
    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div className="swipe-page">
                {users.length > 0 && currentUserIndex < users.length ? (
                    <div className="user-card">
                        <h2>{users[currentUserIndex].name}</h2>
                        <img src={users[currentUserIndex].profile_photo} alt={users[currentUserIndex].name} />
                        <p><strong>Age:</strong> {calculateAge(users[currentUserIndex].birthdate)}</p>
                        <p><strong>Gender:</strong> {users[currentUserIndex].gender}</p>
                        <p><strong>Bio:</strong> {users[currentUserIndex].bio}</p>
                        <p><strong>Location:</strong> {users[currentUserIndex].location}</p>
                        <div className="swipe-buttons">
                            <button onClick={() => handleSwipe()}>Next</button>
                            <button onClick={handleMatch}>Match</button> {/* Match button */}
                        </div>
                    </div>
                ) : (
                    <h2>No more users to swipe!</h2>
                )}
            </div>
        </div>
    );
};

export default SwipePage;
