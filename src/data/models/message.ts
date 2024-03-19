import { model } from "mongoose";
import { MESSAGE_STATUS, Message, Messages } from "../../types";
import MessageSchema from "../schemas/message";
import { ObjectId} from 'mongodb';

MessageSchema.statics.createMessage = function (payload: Partial<Message>){
  return this.create(payload);
}

MessageSchema.statics.getProjectMessages = function(project_id: string) {
  return this.find({project_id})
}


MessageSchema.statics.getMessageById = function(message_id: string) {
  return this.findById(message_id)
}

MessageSchema.statics.getProjectChat = function(
  project_id: string,
  owner: {
    id: string;
    role: string;
  },
  reciever: {
    id: string;
    role: string;
  }
){
  return this.find({
    $or: [{
      project_id: project_id,
      owner_id: owner.id,
      reciever_id: {$in: [reciever.id]}
    }, {
      project_id: project_id,
      owner_id: reciever.id,
      reciever_id: {$in: [owner.id]}
    }]
  })
}

MessageSchema.statics.getChat = function(
  owner: {
    id: string;
    role: string;
  },
  reciever: {
    id: string;
    role: string;
  }
){
  return this.find({
    $or: [{
      owner_id: owner.id,
      reciever_id: {$in: [reciever.id]}
    }, {
      owner_id: reciever.id,
      reciever_id: {$in: [owner.id]}
    }]
  })
}

MessageSchema.statics.updateMessageStatus = async function(message_id: string, status: typeof MESSAGE_STATUS[number]) {
  const message = await this.findById(message_id)
  console.log(message)
  return this.updateOne(message, {status})
}

const MessageModel = model<Message, Messages>('message', MessageSchema);

export default MessageModel;