//https://opentdb.com/api.php?amount=10


const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _platAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;


//event listeners
function eventListeners(){

    _checkBtn.addEventListener('click', checkAnswer);
    _platAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _correctScore.textContent = correctScore;
    _totalQuestion.textContent = totalQuestion;
});

async function loadQuestion(){

    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(APIUrl);
    const data = await result.json();
    showQuestion(data.results[0]);
    _result.innerHTML = "";
}

//display options and question
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionList = incorrectAnswer;
    // Inserting correct Answer in a random position
    optionList.splice(Math.floor(Math.random() * (incorrectAnswer + 1)), 0, correctAnswer);
    
    question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;

    options.innerHTML = `
        ${optionList.map( (option, index) => `
            <li> ${index + 1}. <span> ${option} </span> </li>
        `).join('')}
    `;
    selectOption();
    console.log(correctAnswer);
}

//option selection
function selectOption(){

    options.querySelectorAll('li').forEach( (option) => {

        option.addEventListener('click', () => {

            if(options.querySelector('.selected')){

                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }

            option.classList.add('selected');
        });
    });
}

//answer checking
function checkAnswer(){

    _checkBtn.disabled = true;
    if(options.querySelector('.selected')){

        const selectedAnswer = options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() === HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p> <i class=" fas fa-check"></i>Correct Answer! <p>`;
        }
        else{
            
            _result.innerHTML = `<p> <i class="fas fa-times"></i>Incorrect Answer!</p> <p> <small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    }
    else{
        _result.innerHTML = `<p> <i class="fas fa-question"></i>Please select an option</p>`;
        _checkBtn.disabled = false
    }
}

//to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textstring){

    let doc = new DOMParser().parseFromString(textstring, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){

    setCount();
    if(askedCount === totalQuestion){
        _result.innerHTML += `<p> Your score is ${correctScore}.</p>`;
        _platAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    }
    else{
        setTimeout( () => {
            loadQuestion();
        }, 300);
    }
}
function setCount(){

    _correctScore.textContent = correctScore;
    _totalQuestion.textContent = totalQuestion;
}

function restartQuiz(){

    correctScore = askedCount = 0;
    _platAgainBtn.style.display = "none";
    _checkBtn.style.display ="block";
    _checkBtn.disabled = true;
    setCount();
    loadQuestion();
}