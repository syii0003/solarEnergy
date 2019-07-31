//initialising the variables
var currentQuestion = 0;
var score = 0;
var totQuestions = questions.length;

var container = document.getElementById('quizContainer');
var questionEl = document.getElementById('question');
var opt1  = document.getElementById('opt1');
var opt2  = document.getElementById('opt2');
var opt3  = document.getElementById('opt3');
var opt4  = document.getElementById('opt4');

var nextButton = document.getElementById('next');
var resultCont = document.getElementById('result');
// var hint = document.getElementById('hint');
var allAnswers = document.getElementById('showAnswers');
var retryButton = document.getElementById('retry');

var answerCont = document.getElementById('answerCont');
var row = document.getElementsByClassName('123');
var uAnswer = document.getElementsByClassName('uAnswer');
var tquestion = document.getElementsByClassName('tquestion');
var cAnswer = document.getElementsByClassName('cAnswer');

//function to load the question in sequence
function loadQuestion (questionIndex) {
  var q = questions[questionIndex];
  questionEl.textContent = (questionIndex + 1) + '.' + q.question;
  opt1.textContent = q.option1;
  opt2.textContent = q.option2;
  opt3.textContent = q.option3;
  opt4.textContent = q.option4;
}

//function to display the answers
function showAnswers() {
  answerCont.style.display = '';
}

//function to retry the quiz
function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  container.style.display = '';
  resultCont.style.display = 'none';
  retryButton.style.display = 'none';
  answerCont.style.display = 'none';
  allAnswers.style.display = 'none';
  nextButton.textContent = 'Next';
  loadQuestion(currentQuestion);
}

//function to load the subsequent questions
function loadNextQuestion () {
  var selectedOption = document.querySelector('input[type=radio]:checked');
  if(!selectedOption) {
    alert('Please select your answer');
    return;
  }
  var answer = selectedOption.value;

  uAnswer[currentQuestion].innerHTML = answer;
  tquestion[currentQuestion].innerHTML = questions[currentQuestion].question;

  if (questions[currentQuestion].answer == answer) {
    score += 20;
    row[currentQuestion].style.color = 'green';
  } else{
    row[currentQuestion].style.color = 'red';
  }

  selectedOption.checked = false;
  currentQuestion++;
  if(currentQuestion == totQuestions - 1) {
    nextButton.textContent='Finish';
  }
  if(currentQuestion == totQuestions) {
    container.style.display = 'none';
    resultCont.style.display = '';
    resultCont.textContent = 'Your score is: ' + score;
    retryButton.style.display = '';
    allAnswers.style.display = '';
  }
  loadQuestion(currentQuestion);
}
// load the first question when the page is loaded
loadQuestion(currentQuestion);
