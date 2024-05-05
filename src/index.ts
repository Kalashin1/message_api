import { Server } from "socket.io";
import { MESSAGE_STATUS, Message, MESSAGE_EVENTS } from "./types";
import Messages from "./data/models/message";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseFloat(process.env.PORT); // || 3000;

export const io = new Server({
  cors: {
    origin: "*",
  },
});

const url = process.env.DB_URL;

// "mongodb://127.0.0.1:27017/location-api";

mongoose
  .connect(url)
  .then((_result: any) => {
    io.listen(PORT);
    console.log("server runninig on PORT 3000");
  })
  .catch(console.log);

io.on("connection", (socket) => {
  socket.on(
    MESSAGE_EVENTS.GET_MESSAGES,
    ({
      project_id,
      owner,
      receiver,
    }: {
      project_id: string;
      owner: { id: string; role: string };
      receiver: { id: string; role: string };
    }) => {
      const chat = Messages.getProjectChat(project_id, owner, receiver);
      socket.broadcast.emit(MESSAGE_EVENTS.MESSAGES, JSON.stringify(chat));
    }
  );

  socket.on(
    MESSAGE_EVENTS.GET_OTHER_MESSAGES,
    ({
      owner,
      receiver,
    }: {
      project_id: string;
      owner: { id: string; role: string };
      receiver: { id: string; role: string };
    }) => {
      const chat = Messages.getChat(owner, receiver);
      socket.broadcast.emit(MESSAGE_EVENTS.MESSAGES, JSON.stringify(chat));
    }
  );

  socket.on(MESSAGE_EVENTS.MESSAGE_READ, ({ _id }: Message) => {
    Messages.updateMessageStatus(_id.toString(), MESSAGE_STATUS[2]);
    socket.broadcast.emit(MESSAGE_EVENTS.MESSAGE);
  });

  socket.on(MESSAGE_EVENTS.MESSAGES_READ, (messages: Message[]) => {
    messages.forEach((message: Message) => {
      Messages.updateMessageStatus(message._id.toString(), MESSAGE_STATUS[2]);
    });
    socket.broadcast.emit(MESSAGE_EVENTS.MESSAGE);
  });

  socket.on(MESSAGE_EVENTS.MESSAGES_DELIVERED, async (messages: Message[]) => {
    for (const { _id } of messages) {
      console.log("_id", _id);
      const message = await Messages.find({
        _id: { $eq: new ObjectId(_id.toString()) },
      });
      console.log("message", message);
    }
    socket.broadcast.emit(MESSAGE_EVENTS.MESSAGE);
  });

  socket.on(MESSAGE_EVENTS.MESSAGE_DELIVERED, (message: Message) => {
    Messages.updateMessageStatus(message._id.toString(), MESSAGE_STATUS[2]);
    socket.broadcast.emit(MESSAGE_EVENTS.MESSAGE);
  });

  socket.on(MESSAGE_EVENTS.NEW_MESSAGE, (payload: Partial<Message>) => {
    // const message = Messages.createMessage(payload);
    socket.broadcast.emit("message");
  });
});
