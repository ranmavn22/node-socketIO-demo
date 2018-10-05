let socket = io("//localhost:3000");
//=============================================================//

$(document).ready(function () {

    $(document).on('click', '.listRoom a', function (e) {
        e.preventDefault();
        let room = $(this).data('room');
        socket.emit("Client_join_room_chat", {name: "Guard", room: room})
    });

    $(".sendMessageRoom").click(function () {
        console.log($('#txtMessageRoom').val());
        socket.emit("User_send_chat", $('#txtMessageRoom').val());
        $('#txtMessageRoom').val('');
        socket.emit("User_not_enter_text");
    });

    $('#txtMessageRoom').keyup(function () {
        socket.emit("User_enter_text");
    });

    $('#txtMessageRoom').on('input', function () {
        if ($(this).val() == '') {
            socket.emit("User_not_enter_text");
        }
    });
});

socket.on("User_join_room", function (data) {
    $('#ChatBox').append("<p style='text-align: center'><strong>" + data + "</strong>: Đã vào phòng</p>");
});

socket.on('Server_send_mess_to_room',function (data) {
    $('#ChatBox').append("<p>"+data.user+ ": "+data.mess+"</p>");
});


socket.on('HasUser_enter_text', function (data) {
    $('.userHasEnter').html(data.user + ": " + data.mess);
});

socket.on('Server_user_not_enter_text', function (data) {
    $('.userHasEnter').html('');
});

















