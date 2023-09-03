let question_number = 0;
let mode = "easy";
function generateQuestion(number, quiz_array) {

    if (quiz_array.length < number + 1) {
        document.getElementById("finished").style.display = "flex";
        document.querySelector(".playground").style.display = "none";
    } else {
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        document.getElementById("answer_field").value = "";
        let buttons = document.querySelectorAll(".selects button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.setAttribute("class", "");
            button.textContent = quiz_array[number].selects[i];
        };
        document.getElementById("answer").setAttribute("disabled", true);
    }
};

function selectMode(modeValue) {
    mode = modeValue;
    // ボタンのdisabledを変更
    let elements = document.querySelectorAll(".decide_mode");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.getAttribute("value") === modeValue) {
            element.setAttribute("disabled", true);
        } else {
            element.removeAttribute("disabled");
        }
    }
    // ボタンのテキストを変更
    document.querySelector(".select_mode_button").textContent=modeName[modeValue]
}

function modeSelectionModal(flag) {
    const modal = document.getElementById("select_mode_modal");
    if (flag) {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

generateQuestion(question_number, questions)

function answerBtn(element) {
    document.getElementById("answer_field").value = element.textContent;
    let buttons = document.querySelectorAll(".selects button");
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.setAttribute("class", "");
    };
    element.setAttribute("class", "selected")
    document.getElementById("answer").removeAttribute("disabled")
}

document.getElementById("answer").addEventListener("click", () => {
    socket.emit("answer", { id: room_id, q_number: question_number, answer: document.getElementById("answer_field").value });
});

socket.on("response", (data) => {
    if (data.answer == questions[question_number].answer) {
        answer_show(true, false);
    } else {
        answer_show(false, false);
    }
});

socket.on("next", (data) => {
    setTimeout(() => {
        question_number += 1;
        document.getElementById("answer_view").style.display = "none";
        generateQuestion(question_number, questions)
    }, 3000);
});