import { ObjectId } from "mongoose";

export interface User {
    _id: ObjectId;
    googleId: string;
    name: string;
    profile_photo: string;
    birthdate: string;
    gender: string;
    bio: string;
    location: string;
    // Add any other fields you expect to receive
}

