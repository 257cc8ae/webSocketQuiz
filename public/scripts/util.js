function $(selector) {
  return (document.querySelector(selector));
}


function answer_show(result,id) {
  if (result) {
    document.getElementById("answer_view_icon").textContent = "⭕";
    document.getElementById("answer_view_text").textContent = "正解";
    document.getElementById("answer_view").style.display = "flex";
  } else {
    document.getElementById("answer_view_icon").textContent = "❌";
    document.getElementById("answer_view_text").textContent = "不正解";
    document.getElementById("answer_view").style.display = "flex";
  }

  if (id != false) {
    setTimeout(function () {socket.emit("next_req", id); }, 1000);
  }
}