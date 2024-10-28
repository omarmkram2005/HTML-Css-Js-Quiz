// define variables
let currentQuestion = 0;
let correctAnswers = 0;
let timeUp = false;
let remainingTime = 0;
let jsonFile = "";

// add the  option menu on page load
window.onload = function () {
  document.querySelector(".container").style.display = "none";

  // make all the menu elements and add classes, innerText and children

  let main = document.createElement("div");
  main.className = "main";
  let heading = document.createElement("h3");
  heading.className = "heading";
  heading.innerText = "Quiz On...";
  main.appendChild(heading);

  let sPARENT = document.createElement("div");
  sPARENT.className = "sPARENT";

  let sHTML = document.createElement("div");
  sHTML.className = "sHTML";
  sHTML.innerHTML = `<i class="fa-brands fa-html5"></i><span class="name">Html</span>`;
  sPARENT.appendChild(sHTML);

  let sCSS = document.createElement("div");
  sCSS.className = "sCSS";
  sCSS.innerHTML = `<i class="fa-brands fa-css3-alt"></i><span class="name">Css</span>`;
  sPARENT.appendChild(sCSS);

  let sJS = document.createElement("div");
  sJS.className = "sJS";

  sJS.innerHTML = `<i class="fa-brands fa-square-js"></i><span class="name">Js</span>`;
  sPARENT.appendChild(sJS);

  main.appendChild(sPARENT);

  let sTimer = document.createElement("h3");
  sTimer.className = "sTimer";
  sTimer.innerHTML = `Set A Timer <span>For 10 Questions.</span>`;
  main.appendChild(sTimer);

  let sTimerInput = document.createElement("select");
  sTimerInput.id = "sTimerInput";
  sTimerInput.setAttribute("type", "number");
  sTimerInput.innerHTML = `<option class="aa" value="60">60 Seconds</option><option value="120">120 Seconds</option><option value="180">180 Seconds</option><option value="999">999 Seconds</option>`;
  main.appendChild(sTimerInput);

  let start = document.createElement("button");
  start.id = "start";
  start.innerText = "Start";
  main.appendChild(start);

  document.body.appendChild(main);

  // make click event on the language selection divs

  [sCSS, sHTML, sJS].forEach((lang) => {
    lang.onclick = function () {
      // check the clicked div class and add the correct json file
      switch (lang.className) {
        case "sCSS":
          jsonFile = "css_questions.json";
          break;
        case "sHTML":
          jsonFile = "html_questions.json";
          break;
        case "sJS":
          jsonFile = "js_questions.json";
          break;

        default:
          break;
      }
      // remove choosed class  from all divs and add it to the clicked one
      [sCSS, sHTML, sJS].forEach((lang) => {
        lang.classList.remove("choosed");
      });
      this.classList.add("choosed");
    };
  });
  // all onclick event on start  and check if the user choosed a lang
  start.onclick = function () {
    // if the user choosed a lang hide options menu and show main container
    if (jsonFile != "") {
      main.style.display = "none";
      document.querySelector(".container").style.display = "block";
      // set timer
      remainingTime = sTimerInput.value;
      // start main functions
      allStart();
      // if the user did not choose a lang show error msg
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You must select a language. Please try again.",
        confirmButtonText: "Try Again",
      });
    }
  };
};

function allStart() {
  // call the json file and get the data
  fetch(jsonFile)
    .then((response) => response.json())
    .then((response) => {
      // start the timer
      let interval = setInterval(() => {
        document.getElementById("timer").innerText = remainingTime;
        if (remainingTime < 10) {
          document.getElementById("timer").style.color = `red`;
        }
        if (remainingTime > 0) {
          remainingTime -= 1;
        } else {
          // if timer ends  close the quiz
          clearInterval(interval);
          timeUp = true;
          document.querySelector(".container").innerHTML =
            `<span class="timeUp">TIME UP </span> -you have ` +
            correctAnswers +
            " correct Answers out of 10";
        }
      }, 1000);

      // check if the questions just started
      if (currentQuestion === 0) {
        createQuestion();
      }
      // make main func to add the question
      function createQuestion() {
        // check if the questions ended
        if (currentQuestion <= 9) {
          // call change Bullits Class function
          currentQuestion += 1;
          changeBullitsClass();
          // clear the old question
          document.querySelector(".question").innerHTML = "";

          // call a random question
          let question =
            response.questions[
              Math.floor(Math.random() * response.questions.length)
            ];

          // call the h3 element and add the question to it
          let text = document.createTextNode(question.question);
          document.querySelector(".question").appendChild(text);
          // call addAnswers function
          addAnswers(question);
        } else {
          // show quiz result
          document.querySelector(".container").innerHTML =
            "you have " + correctAnswers + " correct Answers out of 10";
          timeUp == true;
          clearInterval(interval);
        }

        function addAnswers(question) {
          // declare vars
          let options = randomArray(question.options);

          let idGetter = 1;
          // make a loop on all the options and add one to each lable
          options.forEach((option) => {
            let raideo = document.getElementById(`ans${idGetter}`);
            // make a click event on all raideos
            raideo.onclick = function () {
              if (this.innerText == question.answer) {
                correctAnswers += 1;
              }
              setTimeout(() => {
                createQuestion();
              }, 300);
            };
            raideo.innerText = option;
            idGetter++;
          });
        }
      }
    });
}
function changeBullitsClass() {
  // select all lis
  let selecBullits = document.querySelectorAll("ul > li");
  // loop on all lis
  selecBullits.forEach((bullit) => {
    bullit.classList.remove("active");
    if (bullit.getAttribute("num") == currentQuestion) {
      bullit.classList.add("active");
    }
  });
}
// make the options order random
function randomArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
