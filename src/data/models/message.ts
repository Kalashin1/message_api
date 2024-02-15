import { model } from "mongoose";
import { Message, Messages } from "../../types";
import MessageSchema from "../schemas/message";

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

const MessageModel = model<Message, Messages>('message', MessageSchema);

export default MessageModel;