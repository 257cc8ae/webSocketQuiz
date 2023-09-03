let question_number = 0;
let correct_answer_count = 0;
let timer = { state: false, time: 31 };

function generateQuestionConsole(number, quiz_array) {
    if (quiz_array.length < number + 1) {
        document.getElementById("finished").style.display = "flex";
        document.querySelector(".playground").style.display = "none";
    } else {
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        let selects = document.querySelectorAll(".selects .select");
        for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            select.textContent = `${i + 1}. ${quiz_array[number].selects[i]}`
        };
        document.getElementById("question").textContent = quiz_array[number].main
        document.getElementById("result_area").setAttribute("class", "results hidden-result");
    }

};

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
    document.getElementById("result_area").setAttribute("class", "results");
    document.getElementById("correct_answer").textContent = `${questions[question_number].answer}`;
    if (data.answer == questions[question_number].answer) {
        correct_answer_count += 1
        answer_show(true, room_id);
    } else {
        answer_show(false, room_id);
    }
});

// 本番環境では下のイベント内に記述するのが望ましい
generateQuestionConsole(question_number, questions)
generateProgressBar(question_number)

//  問題が来たとき(最初のボタン)
document.getElementById("start_quiz").addEventListener("click", function () {
    socket.emit("start", room_id);
    timer.state = true;
    timer.time = 31;
});
//通信で次への遷移
socket.on("next", (data) => {
    document.getElementById("answer_view").style.display = "none";
    setTimeout(() => {
        question_number += 1;
        generateQuestionConsole(question_number, questions);
        generateProgressBar(question_number);
        timer.state = true;
        timer.time = 31;
    }, 3000);

});

setInterval(() => {
    let timerElement = document.getElementById("timer");
    if (timer.state) {
        timer.time -= 1;
        if (timer.time + 1 === 0) {
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