function $(selector) {
  return (document.querySelector(selector));
}

let modeName = { "easy": "イージー", "normal": "ノーマル", "hard": "ハード" };

function answer_show(result, id) {
  if (result) {
    document.getElementById("answer_view_icon").textContent = "⭕";
    document.getElementById("answer_view_text").textContent = "正解";
    document.getElementById("answer_view").style.display = "flex";
  } else {
    document.getElementById("answer_view_icon").textContent = "❌";
    document.getElementById("answer_view_text").textContent = "不正解";
    document.getElementById("answer_view").style.display = "flex";
  }

  setTimeout(function () {
    document.getElementById("answer_view").style.display = "none";
    if (client === false) {
      document.getElementById("result_area").style.display = "flex";
    }
    setTimeout(() => {
      if (client === false) {
        document.getElementById("result_area").style.display = "none";
      }
      if (result === false) {
        document.querySelector(".playground").style.display = "none";
        document.getElementById("finished").style.display = "flex";
      } else if (client) {
        socket.emit("next_req", id);
      };
    }, 2000);
  }, 500);

}