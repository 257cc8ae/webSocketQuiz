const socket = io();
let room_id = "";
let previous_id = "";
var mode = "easy";
let selected_questions;
const searchParams = new URLSearchParams(window.location.search)
if (searchParams.has('room_id')) {
  document.getElementById("roomId").value = searchParams.get("room_id");
  document.getElementById("roomId").style.display = "none";
}

document.getElementById("joinRoom").addEventListener("submit", (e) => {
  e.preventDefault();
  room_id = document.getElementById("roomId").value;
  socket.emit("join", { id: room_id, previous_id: previous_id });
});

socket.on("joined", (data) => {
  document.querySelector(".joinRoomArea").style.display = "none";
  document.querySelector(".waitForStart").style.display = "flex";
  document.querySelector(".roomNumber").textContent = data.id;
  mode = data.mode;
});
// rewrite the room id
document.getElementById("rewriteRoomId").addEventListener("click", () => {
  document.querySelector(".joinRoomArea").style.display = "flex";
  document.querySelector(".waitForStart").style.display = "none";
  document.getElementById("roomId").value = "";
  previous_id = room_id
});


socket.on("q_req", (data) => {
  if (client) {
    console.log(document.getElementById("mode").value)

    let questionArr = selectQuestions(document.getElementById("mode").value);
    console.log(questionArr)
    socket.emit("q_res", { id: room_id, question_data: questionArr });
  }
});
