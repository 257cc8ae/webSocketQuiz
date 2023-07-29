let question_number = 0;
let correct_answer_count = 0;
document.getElementById("start_quiz").addEventListener("click", function () {
    console.log("s")
    socket.emit("start", room_id);
});

function generateQuestionConsole(number, quiz_array) { 
    if (quiz_array.length < number + 1) {
        document.getElementById("finished").style.display = "flex";
        document.querySelector(".playground").style.display = "none";
    } else {
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        let selects = document.querySelectorAll(".selects .select");
        for (let i = 0; i < selects.length; i++) {
            const select  = selects[i];
            select.textContent = `${i + 1}. ${quiz_array[number].selects[i]}`
        };
        document.getElementById("question").textContent = quiz_array[number].main
        document.getElementById("user_answer").textContent = "解答";
        document.getElementById("correct_answer").textContent = "正答";
        document.getElementById("result_area").setAttribute("class", "results hidden-result");
    }
    
};

generateQuestionConsole(question_number, questions)

socket.on("response", (data) => {
    document.getElementById("result_area").setAttribute("class", "results");
    document.getElementById("user_answer").textContent = `解答:${data.answer}`;
    document.getElementById("correct_answer").textContent = `正答:${questions[question_number].answer}`;
    if (data.answer == questions[question_number].answer) {
        correct_answer_count  += 1
        answer_show(true, room_id);
    } else {
        answer_show(false, room_id);
    }
});

socket.on("next", (data) => {
    question_number += 1;
    document.getElementById("answer_view").style.display = "none";
    generateQuestionConsole(question_number, questions)
});