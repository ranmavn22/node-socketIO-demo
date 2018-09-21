let socket = io("//localhost:3000");
$(document).ready(function () {
    $(".chatLogin .chatForm").hide();
    $(".chatLogin .register").show();

    $(".btnRegister").click(function () {
        socket.emit("Register_send_data",$(".txtNameRegister").val());
    });

    $(".logout").click(function () {
        socket.emit("UserName_logout");
        $(".chatForm").hide();
        $(".register").show();
    });

    $(".sendMessage").click(function () {
        socket.emit("User_send_message",$('#txtMessage').val());
        $('#txtMessage').val('');
        socket.emit("User_not_enter_text");

    });

    $('#txtMessage').keyup(function (){
        socket.emit("User_enter_text");
    });

    $('#txtMessage').on('input', function(){
        if($(this).val() == ''){
            socket.emit("User_not_enter_text");
        }
    });

    $(".btnRegisterRoom").click(function () {
        socket.emit("Tao_room",$(".txtNameRoom").val());
    })

    $(".sendMessageRoom").click(function () {
        socket.emit("User_send_chat",$("#txtMessageRoom").val())
    });

});
socket.on("Register_fail",function (data) {
    alert("Đăng kí thất bại rồi!!");
});
socket.on("Register_success",function (data) {
    $(".currentUser").html(data);
    $(".chatForm").show();
    $(".register").hide();
});
socket.on("Server_send_user",function (data) {
    let stringUser = '';
    $(".listUser ul").html('');
    data.forEach(function (i) {
        $(".listUser ul").append("<li>"+i+"</li>");
    })
});

socket.on('Server_send_message',function (data) {
   $('#ChatBox').append("<p>"+data.user+ ": "+data.mess+"</p>");
});

socket.on('HasUser_enter_text',function (data) {
    $('.userHasEnter').html(data.user+ ": "+data.mess);
});

socket.on('Server_user_not_enter_text',function (data) {
    $('.userHasEnter').html('');
});

// Room chat
socket.on('Server_send_list_room',function (data) {
    $(".listRoom ul").html('');
    data.forEach(function (i) {
        $(".listRoom ul").append("<li>"+i+"</li>");
    })
});

socket.on("Server_send_current_room",function (data) {
    $('.currentRoom').html(data);
});

socket.on('Server_send_mess_to_room',function (data) {
    $('#ChatBox').append("<p>"+data.user+ ": "+data.mess+"</p>");
});