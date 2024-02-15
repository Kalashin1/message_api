import { Schema } from "mongoose";
import {MESSAGE_STATUS, Message} from '../../types';

const MessageSchema = new Schema<Message>({
  status: {
    type: String,
    default: MESSAGE_STATUS[0]
  },
  content: {
    type: String,
  },
  assetUrl: {
    type: [String]
  },
  owner_id: {
    type: String
  },
  reciever_id: {
    type: [String]
  },
  project_id: {
    type: String
  },
  createdAt: {
    type: String
  },
  position_id: String,
  trade_id: String,
  parentMessage: String
}, {
  timestamps: true
})

export default MessageSchema