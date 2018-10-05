let express = require("express");
let app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

let server = require('http').Server(app);
let io = require("socket.io")(server);

server.listen(3000);
io.on("connection",function (socket) {
    socket.user = '';
    socket.roomChat = '';
    //Join user vào session phòng chat từ data
    socket.on("Client_join_room_chat",function (data) {
        // Tạo room nếu không có room nó sẽ tạo

        if(socket.roomChat != data.room){
            socket.join(data.room);
            socket.user = data.name;
            socket.roomChat = data.room;
            io.sockets.in(socket.roomChat).emit("User_join_room",socket.user)
        }
    });

    // Rời khỏi room
    socket.on("User_leave_room",function (data) {
        socket.leave(data);
        socket.roomChat = '';
    });

    // Gửi tin nhắn tới phòng chat
    socket.on("User_send_chat",function (data) {
        console.log(data);
        io.sockets.in(socket.roomChat).emit("Server_send_mess_to_room",{user: socket.user , mess:data});
    });

    // Thông báo đang nhập text
    socket.on("User_enter_text",function () {
        console.log('đá');
        socket.broadcast.in(socket.roomChat).emit("HasUser_enter_text",{user: socket.user, mess: 'đang nhập văn bản....'});
    });

    //Thông báo hết nhập text
    socket.on("User_not_enter_text",function () {
        console.log('đá');
        socket.broadcast.in(socket.roomChat).emit("Server_user_not_enter_text");
    });

    //

});

app.get("/",function (req,res) {
    res.render("trangchu");
});

app.get("/room",function (req,res) {
    res.render("roomchat");
});


