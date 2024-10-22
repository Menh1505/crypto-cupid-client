import { ObjectId } from 'mongoose';
import { User } from '../types/User'
export interface Match {
    _id: ObjectId;
    user1_id: ObjectId | User;
    user2_id: ObjectId | User;
    is_mutual: boolean;
    created_at: Date;
}