let question_number = 0;
let client = true;
let answer;
function unique_random(min, max, number) {
    let result = [];

    while (result.length < number) {
        let random_number = Math.floor(Math.random() * (max - min) + min);
        if (result.includes(random_number) === false) {
            result.push(random_number);
        }
    }
    return result;
}


function selectQuestions(mode) {
    let selected_questions = [
        { level: "", question_ids: [] },
        { level: "", question_ids: [] },
        { level: "", question_ids: [] }
    ];
    if (mode === "easy") {
        selected_questions[0].level = "level1";
        selected_questions[0].question_ids = unique_random(0, questions.level1.length, 5);
        selected_questions[1].level = "level2";
        selected_questions[1].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[2].level = "level3";
        selected_questions[2].question_ids = unique_random(0, questions.level3.length, 5);
    } else if (mode === "normal") {
        selected_questions[0].level = "level2";
        selected_questions[0].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[1].level = "level3";
        selected_questions[1].question_ids = unique_random(0, questions.level3.length, 5);
        selected_questions[2].level = "level4";
        selected_questions[2].question_ids = unique_random(0, questions.level4.length, 5);
    } else if (mode === "hard") {
        selected_questions[0].level = "level3";
        selected_questions[0].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[1].level = "level4";
        selected_questions[1].question_ids = unique_random(0, questions.level4.length, 5);
        selected_questions[2].level = "level5";
        selected_questions[2].question_ids = unique_random(0, questions.level5.length, 5);
    }
    return selected_questions
}


function generateQuestion(number, quiz_array) {
    document.getElementById("answer").removeAttribute("disabled")
    if (number < 10) {
        let k, l;
        if (number <= 3) {
            k = 0;
            l = 0;
        } else if (number <= 7) {
            k = 1;
            l = 4;
        } else if (number <= 10) {
            k = 2;
            l = 8;
        }
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        document.getElementById("answer_field").value = "";
        let buttons = document.querySelectorAll(".selects button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.setAttribute("class", "");
            button.textContent = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].selects[i]
        };
        answer = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].answer
    } else {
        document.querySelector(".playground").style.display = "none";
        document.getElementById("finished").style.display = "flex";
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
    document.getElementById("mode").value = modeValue
    // ボタンのテキストを変更
    document.querySelector(".select_mode_button").textContent = modeName[modeValue]
}

function modeSelectionModal(flag) {
    const modal = document.getElementById("select_mode_modal");
    if (flag) {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}


socket.on("started", (data) => {
    selected_questions = data.question_data;
    generateQuestion(question_number, questions);
    document.querySelector(".waitForStart").style.display = "none";
    document.querySelector(".playground").style.display = "flex";
});

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
    // ここで送信先変える
    if (document.getElementById("answer_field").value === answer) {
        socket.emit("answer", { id: room_id, q_number: question_number, answer: true});
    } else {
        socket.emit("answer", { id: room_id, q_number: question_number, answer: false });

    }
    document.getElementById("answer").setAttribute("disabled",true)
});

socket.on("response", (data) => {
    if (data.answer) {
        answer_show(true, room_id);
    } else {
        answer_show(false, false);
    }
});

socket.on("next", (data) => {
    question_number += 1;
    generateQuestion(question_number, questions)
        
});