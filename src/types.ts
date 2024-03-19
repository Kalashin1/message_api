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
  ): Message[];
  getChat(
    owner: {
      id: string;
      role: string;
    },
    reciever: {
      id: string;
      role: string;
    }
  ): Message[];
  getMessageById(message_id: string): Message;
  updateMessageStatus(id: any, status: typeof MESSAGE_STATUS[number]): Message;
}

export const MESSAGE_STATUS = ["SENT", "DELIVERED", "READ", "DELETED"] as const;

export enum MESSAGE_EVENTS {
  GET_MESSAGES = 'get_messages',
  MESSAGES = 'messages',
  MESSAGE = 'message',
  MESSAGE_READ = 'message_read',
  MESSAGES_READ = 'messages_read',
  MESSAGE_DELIVERED = 'message_delivered',
  MESSAGES_DELIVERED = 'messages_delivered',
  NEW_MESSAGE = 'new_message',
  GET_OTHER_MESSAGES = 'get_other_messages'
}