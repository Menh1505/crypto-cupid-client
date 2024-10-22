import React, { useState } from 'react';
import { User } from '../types/User';
import { useUser } from '../context/UserContext';
import Navbar from '../components/navbar';
import '../styles/profile.css';

const Profile: React.FC = () => {
    const { user, setUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    // Form state variables
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editBirthdate, setEditBirthdate] = useState('');
    const [editGender, setEditGender] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editProfilePhoto, setEditProfilePhoto] = useState('');

    /* useEffect(() => {
        // Fetch user data from the server
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8080/user/profile', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data: User = await response.json();
                    setUser(data);
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [setUser]); */

    if (!user) {
        return (
            <div>
                <Navbar />
                <h1>Please login to view your profile</h1>
            </div>
        );
    }

    const handleEditClick = () => {
        setEditName(user.name || '');
        setEditBio(user.bio || '');
        setEditBirthdate(user.birthdate || '');
        setEditGender(user.gender || '');
        setEditLocation(user.location || '');
        setEditProfilePhoto(user.profile_photo || '');
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedUser: User = {
            ...user,
            name: editName,
            bio: editBio,
            birthdate: editBirthdate,
            gender: editGender,
            location: editLocation,
            profile_photo: editProfilePhoto,
        };

        try {
            const response = await fetch(`http://localhost:8080/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                const data: User = await response.json();
                setUser(data);
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                alert(`Error updating profile: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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
            <div className="profile-container">
                <h1>Welcome, {user.name}</h1>
                {isEditing ? (
                    <div className="profile-card">
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSave}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                />
                            </label>
                            <label>
                                Birthdate:
                                <input
                                    type="date"
                                    value={editBirthdate}
                                    onChange={(e) => setEditBirthdate(e.target.value)}
                                />
                            </label>
                            <label>
                                Gender:
                                <select
                                    value={editGender}
                                    onChange={(e) => setEditGender(e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                />
                            </label>
                            <label>
                                Profile Photo URL:
                                <input
                                    type="text"
                                    value={editProfilePhoto}
                                    onChange={(e) => setEditProfilePhoto(e.target.value)}
                                />
                            </label>
                            <div className="buttons">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="profile-card">
                        <img
                            className="profile-photo"
                            src={user.profile_photo}
                            alt="Profile"
                        />
                        <div className="profile-details">
                            <h2>Profile</h2>
                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong>Age:</strong> {calculateAge(user.birthdate)}
                            </p>
                            <p>
                                <strong>Birthday:</strong> {formatDate(user.birthdate)}
                            </p>
                            <p>
                                <strong>Gender:</strong> {user.gender}
                            </p>
                            <p>
                                <strong>Bio:</strong> {user.bio}
                            </p>
                            <p>
                                <strong>Location:</strong> {user.location}
                            </p>
                        </div>
                        <button onClick={handleEditClick}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
