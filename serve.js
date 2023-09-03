const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});
app.get("/console", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/console.html");
});
app.get("/:file", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});
app.get("/styles/:file", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/styles/" + req.params.file);
});
app.get("/scripts/:file", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/scripts/" + req.params.file);
});
app.get("/imgs/:file", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/imgs/" + req.params.file);
});


io.on("connection", (socket) => {
  // ルーム参加時処理
  socket.on("join", (data) => {

    if (data.previous_id != "") {
      socket.leave(data.previous_id);
    };
    socket.join(data.id);
    io.to(data.id).emit("joined", {id: data.id })
  });
  // クイズスタート
  socket.on("start", (id) => {
    io.to(id).emit("q_req", "")
  });
  socket.on("q_res", (data) => {
    io.to(data.id).emit("started",{question_data: data.question_data } )
  });
  // 解答時処理
  socket.on("answer", (data) => {

    io.to(data.id).emit("response", { q_number: data.q_number, answer: data.answer })
  });
  // 次のクイズへ
  socket.on("next_req", (id) => {

    io.to(id).emit("next", "")
  });
});

http.listen(443, () => {
  console.log("listening on *:443");
});