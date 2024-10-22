import React, { useEffect, useState } from 'react';
import '../styles/chat.css';
import { User } from '../types/User'; // Import your User type
import { Message } from '../types/Message'; // Import your Message type
import Navbar from '../components/navbar';
import ToastService from '../services/toast';
import { ToastContainer } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { Match } from '../types/Match';

const ChatPage: React.FC = () => {
    const { user } = useUser();
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (user?._id) {
            const fetchMatches = async () => {
                const response = await fetch(`http://localhost:8080/matches/user/${user._id}`);
                const data = await response.json();
                setMatches(data);
            };
            fetchMatches();
            // console.log('matches: ', matches);
        }
    }, [matches, user]);

    useEffect(() => {
        if (selectedMatch) {
            // Fetch messages for the selected match
            const fetchMessages = async () => {
                const response = await fetch(`http://localhost:8080/messages/match/${selectedMatch._id}`);
                const data = await response.json();
                console.log('data: ', data);
                setMessages(data); // Set messages related to the selected match
            };

            fetchMessages();
        } else {
            setMessages([]); // Clear messages if no match is selected
        }
    }, [selectedMatch]); // Dependency on selectedMatch

    const handleSendMessage = async () => {
        if (!newMessage || !selectedMatch) return;

        // Determine the receiver based on the current user
        const receiver_id = user?._id === (selectedMatch.user1_id as User)._id
            ? (selectedMatch.user2_id as User)._id
            : (selectedMatch.user1_id as User)._id;

        const response = await fetch('http://localhost:8080/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                match_id: selectedMatch._id,
                sender_id: user?._id,
                receiver_id: receiver_id,
                content: newMessage,
            }),
        });

        if (response.ok) {
            const message = await response.json();
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
            ToastService.success('Message sent!');
        } else {
            ToastService.error('Failed to send message.');
        }
    };

    return (
        <div className="chat-page">
            <Navbar />
            <ToastContainer />
            <div className="chat-container">
                <div className="matches-list">
                    <h2>Your Matches</h2>
                    {matches.length > 0 ? (
                        matches.map((match) => {
                            const otherUser = (match.user1_id as User)._id === user?._id
                                ? (match.user2_id as User)
                                : (match.user1_id as User);

                            return (
                                <div
                                    key={match._id.toString()}
                                    className={`match-item ${selectedMatch?._id.toString() === match._id.toString() ? 'active' : ''}`}
                                    onClick={() => setSelectedMatch(match)}
                                >
                                    {otherUser.name}
                                </div>
                            );
                        })
                    ) : (
                        <p>No matches found.</p> // Fallback message
                    )}
                </div>
                <div className="message-area">
                    {selectedMatch ? (
                        <>
                            <h2>Chatting with {(selectedMatch.user2_id as User).name}</h2>
                            <div className="messages">
                                {messages.map((message) => (
                                    <div key={message._id.toString()} className={`message ${message.sender_id === user?._id ? 'sent' : 'received'}`}>
                                        {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <h2>Select a match to start chatting</h2>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
