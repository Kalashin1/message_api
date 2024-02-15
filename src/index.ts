import {Server} from 'socket.io'
import { Message } from './types';
import Messages from './data/models/message';
import mongoose from 'mongoose';

export const io = new Server({
  cors: {
    origin: "http://localhost:5173"
  },
});


const url = 

'mongodb+srv://kalashin:Kalashin1@cluster0.4umw1.gcp.mongodb.net/magga?retryWrites=true&w=majority'

// 'mongodb://127.0.0.1:27017/location-api';

mongoose.connect(url)
.then((_result: any) => {
  io.listen(8080)
  console.log('server runninig on PORT 3000')
}).catch(console.log)



io.on('connection', (socket) => {
  
  socket.on('get_message', ({project_id, owner, receiver}: {
    project_id: string,
    owner: {id: string;role: string},
    receiver: {id: string;role: string}
  }) => {
    const chat = Messages.getProjectChat(project_id, owner, receiver)
    socket.broadcast.emit('messages', chat);
  })

  socket.on('mew_message', (payload: Partial<Message>) => {
    const message = Messages.createMessage(payload);
    socket.broadcast.emit('message', message);
  })


})