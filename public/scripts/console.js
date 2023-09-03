let question_number = 0;
let correct_answer_count = 0;
let timer = { state: false, time: 31 };
let client = false;
function generateQuestionConsole(number, quiz_array) {
    if (number < 10) {
        let k, l;
        if (number <= 3) {
            k = 0;
            l = 0;
        } else if (number <= 5) {
            k = 1;
            l = 4;
        } else if (number <= 7) {
            k = 2;
            l = 6;
        } else if (number <= 9) {
            k = 3;
            l = 8;
        }
        console.log(selected_questions)
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        let selects = document.querySelectorAll(".selects .select");
        for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            select.textContent = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].selects[i];
        };
        document.getElementById("question").textContent = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].question;
        let answer = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].answer;
        document.getElementById("correct_answer").textContent = answer;
        console.log(answer)
        document.getElementById("result_area").style.display = "none";
    } else {
        alert("finished")
    }
};

socket.on("started", (data) => {
    selected_questions = data.question_data;
    console.log(selected_questions)
    console.log("k")
    generateQuestionConsole(question_number, questions);
    document.querySelector(".waitForStart").style.display = "none";
    document.querySelector(".playground").style.display = "flex";
});

//  進行状況を生成する関数
function generateProgressBar(current_question) {
    let progressBar = document.getElementById("progress_bar");
    progressBar.innerHTML = ""
    for (let i = 0; i < 10; i++) {
        let countDiv = document.createElement("div");
        countDiv.textContent = String(i + 1);
        countDiv.setAttribute("class", "progress_count")
        if (current_question >= i + 1) {
            countDiv.setAttribute("isColorful", i + 1)
        };
        progressBar.appendChild(countDiv);

    };
}

socket.on("response", (data) => {
    timer.state = false;
    if (data.answer) {
        answer_show(true, room_id);
    } else {
        answer_show(false, false);
    }
});

// 本番環境では下のイベント内に記述するのが望ましい
generateProgressBar(question_number)

//  問題が来たとき(最初のボタン)
document.getElementById("start_quiz").addEventListener("click", function () {
    socket.emit("start", room_id);
    timer.state = true;
    timer.time = 31;
});
//通信で次への遷移
socket.on("next", (data) => {
    question_number += 1;

    setTimeout(() => {
        console.log(question_number)
        generateQuestionConsole(question_number, questions);
        generateProgressBar(question_number);
        timer.state = true;
        timer.time = 2;
        document.getElementById("result_area").style.display = "none";
    }, 3000);

});
// タイマーの処理
setInterval(() => {
    let timerElement = document.getElementById("timer");
    if (timer.state) {
        timer.time -= 1;
        if (timer.time < 0) {
            timerElement.style.display = "none";
            timer.state = false;
            socket.emit("answer", { id: room_id, q_number: question_number, answer: "" });
        } else {
            timerElement.textContent = timer.time
            timerElement.style.display = "block";
        }

    } else {
        timerElement.style.display = "none"
    }
}, 1000);