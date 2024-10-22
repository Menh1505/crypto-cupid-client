import { ObjectId } from "mongoose";

export interface Message {
    _id: ObjectId;
    match_id: ObjectId;
    sender_id: ObjectId;
    receiver_id: ObjectId;
    content: string;
    created_at: Date;
}