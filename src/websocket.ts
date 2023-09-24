import { io } from './http';

interface RoomUser {
    socket_id: string,
    username: string,
    room: string,
}

interface Message {
    room: string,
    text: string,
    createdAt: Date,
    username: string
}

const users: RoomUser[] = [];

const messages: Message[] = [];

io.on("connection", (socket) => {
    socket.on("select_room", (data, callback) => {
        socket.join(data.room);

        const userInRoom = users.find(
            (user) => userAlredyInRoom(user, data)
        );

        if (userInRoom){
            userInRoom.socket_id = socket.id;
        } else {
            users.push({
                room: data.room,
                username: data.username,
                socket_id: data.socket_id
            });
        }

        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
    });

    socket.on("message", data => {
        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message);

        io.to(data.room).emit("message", message);
    });

    socket.on("leave_room", (data)=> {
        console.log(data);
        socket.leave(data.room);
    });
});


//#region utilitarios
function userAlredyInRoom(user: any ,data: any){
    return user.username === data.username && user.room === data.room
}

function getMessagesRoom(room: string){
    const messagesRoom = messages.filter(message => message.room == room);

    return messagesRoom;
}


//#endregion

/* interface Message {
    sender: string,
    message: string 
}

interface Chat {
    id: number,
    messages: Message[]
}

interface User {
    socket_id: string,
    username: string,
    chats: Chat[]
}

const users: User[] = [];

let id = 0;

export const getUsers = (): User[] => {
    return users;
};

io.on("connection", (socket) => {

    socket.on("chat_begin", (data) => {
        const chat: Chat = {
            id: id,
            messages: [],
        };
        id++;

        const receiver = users.find( user => user.username == data.receiver);
        const sender = users.find( user => user.username == data.sender);

        if(receiver && sender){
            receiver.chats.push(chat);
            sender.chats.push(chat);
            socket.emit("chat_begin", {user: receiver.username, chat_id: chat.id});
            socket.to(receiver.socket_id).emit("chat_begin", {user: sender.username, chat_id: chat.id});
            socket.join(chat.id.toString());
        }
    });

    socket.on("connect_in_chat", (data) => {
        socket.join(data.chat_id);
    })

    socket.on("new_user", (data) => {
        const username = data.username;

        const user = users.find( user => username == user.username);

        if(user){
            user.socket_id = socket.id
        }
        else{
            const newUser: User = {
                socket_id: socket.id,
                username: username,
                chats: []
            }
            
            users.push(newUser);
        }
        
    })

    socket.on("message", data => {
        const chat: Chat | undefined = (users.find( user => data.username == user.username))?.chats.find( chat => chat.id == data.chat_id);
        if(chat){
            //Salvas as mensagens
            chat.messages.push({
                sender: data.username,
                message: data.message
            }) 
            
            //Enviar para os usuaríos
            socket.to(chat.id.toString()).emit("message", {message: data.message, chat_id: chat.id, sender: data.username});
        }
    })
}) */