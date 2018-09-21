let express = require("express");
let app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

let server = require('http').Server(app);
let io = require("socket.io")(server);

server.listen(3000);
let user = [];
io.on("connection",function (socket) {
    //console.log("Có thằng kết nối: "+socket.id);
    //console.log( socket.adapter.rooms);
    socket.on("Register_send_data",function (data) {
        if(user.indexOf(data) >=0){
           // Fail
           socket.emit("Register_fail","Đăng kí thất bại");
        }else{
            //ok
            user.push(data);
            socket.Username = data;
            socket.emit("Register_success",data);
            io.sockets.emit("Server_send_user",user);
        }
    });

    socket.on("UserName_logout",function () {
        user.splice(user.indexOf(socket.Username),1);
        io.sockets.emit("Server_send_user",user);
    })

    socket.on("User_send_message",function (data) {
        io.sockets.emit("Server_send_message",{user: socket.Username, mess: data});
    })

    socket.on("User_enter_text",function () {
        socket.broadcast.emit("HasUser_enter_text",{user: socket.Username, mess: 'đang nhập văn bản....'});
    })

    socket.on("User_not_enter_text",function () {
        socket.broadcast.emit("Server_user_not_enter_text");
    })

    // Tạo Room chat

    socket.on("Tao_room",function (data) {
        // Tạo room nếu không có room nó sẽ tạo
        socket.join(data,function () {});
        socket.roomChat = data;


        let listRoom = [];
        for(room in socket.adapter.rooms){
            listRoom.push(room);
        }


        io.sockets.emit("Server_send_list_room",listRoom);
        socket.emit("Server_send_current_room",data);
        // Dời khỏi room
        socket.leave('room',function () {

        })
    })

    socket.on("User_send_chat",function (data) {
        io.sockets.in(socket.roomChat).emit("Server_send_mess_to_room",{user: "User",mess:data});
    })

});

app.get("/",function (req,res) {
    res.render("trangchu");
});

app.get("/room",function (req,res) {
    res.render("roomchat");
});