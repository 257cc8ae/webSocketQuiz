const socket = io();
let room_id = "";
let previous_id = "";
document.getElementById("joinRoom").addEventListener("submit", (e) => {
  e.preventDefault()
  room_id = document.getElementById("roomId").value;
  socket.emit("join", { id: room_id, previous_id: previous_id });
});

socket.on("joined", (data) => {
  document.querySelector(".joinRoomArea").style.display = "none";
  document.querySelector(".waitForStart").style.display = "flex";
  document.querySelector(".roomNumber").textContent = data;
});
// rewrite the room id
document.getElementById("rewriteRoomId").addEventListener("click", () => {
  document.querySelector(".joinRoomArea").style.display = "flex";
  document.querySelector(".waitForStart").style.display = "none";
  document.getElementById("roomId").value = "";
  previous_id = room_id
});

socket.on("started", (data) => {
  document.querySelector(".playground").style.display = "flex";
  document.querySelector(".waitForStart").style.display = "none";
});
