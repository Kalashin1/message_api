import { Document, Model, ObjectId } from "mongoose";

export interface Message extends Document {
  _id: ObjectId;
  content: string;
  assetUrl: string[];
  owner_id: string;
  reciever_id: string[];
  project_id: string;
  createdAt: string;
  position_id?: string;
  trade_id?: string;
  parentMessage?: string;
  status: (typeof MESSAGE_STATUS)[number];
}

export interface Messages extends Model<Message> {
  createMessage(payload: Partial<Message>): Messages;
  getProjectMessages(project_id: string): Message[];
  getProjectChat(
    project_id: string,
    owner: {
      id: string;
      role: string;
    },
    reciever: {
      id: string;
      role: string;
    }
  ): [];
  getMessageById(message_id: string): Message;
}

export const MESSAGE_STATUS = ["SENT", "DELIVERED", "READ", "DELETED"] as const;

