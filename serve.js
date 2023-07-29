const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";

app.get("/", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});
app.get("/console", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/console.html");
});
app.get("/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});
app.get("/styles/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/styles/" + req.params.file);
});
app.get("/scripts/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/scripts/" + req.params.file);
});

io.on("connection", (socket)=>{
  console.log("A user connected.");
  // ルーム参加時処理
  socket.on("join", (data) => {
    
    if (data.previous_id != "") {
      socket.leave(data.previous_id);
      console.log("left")
    };
    socket.join(data.id);
    console.log("joined");
    io.to(data.id).emit("joined",data.id)
  });
  // クイズスタート
  socket.on("start", (id) => {
    io.to(id).emit("started", "")
  });
  // 解答時処理
  socket.on("answer", (data) => {

    io.to(data.id).emit("response",{q_number:data.q_number,answer:data.answer })
  });
  // 次のクイズへ
  socket.on("next_req", (id) => {

    io.to(id).emit("next","")
  });
});

http.listen(3000, ()=>{
  console.log("listening on *:3000");
});