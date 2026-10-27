/*
  REGOLE
  - Codice in JavaScript moderno: solo const/let, mai var.
  - DOM: usa querySelector / querySelectorAll.
  - Eventi: usa addEventListener (mai onclick inline nell'HTML).
  - Pattern: stato → render → eventi.
*/

/*
  Array di domande.
  Ogni question è un object con:
   - question: testo della domanda
   - correct_answer: la risposta corretta (string)
   - incorrect_answers: array di risposte sbagliate (string[])
*/
const QUESTIONS = [
  {
    question: "Cosa significa l'acronimo CPU?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Unit",
    ],
  },
  {
    question:
      "In Java, quale keyword si usa per impedire che una variabile venga modificata?",
    correct_answer: "final",
    incorrect_answers: ["static", "private", "public"],
  },
  {
    question: "Il logo di Snapchat è una campana.",
    correct_answer: "Falso",
    incorrect_answers: ["Vero"],
  },
  {
    question:
      "I puntatori sono stati introdotti in C++ e non c'erano nel linguaggio C originale.",
    correct_answer: "Falso",
    incorrect_answers: ["Vero"],
  },
  {
    question:
      "Qual è il formato immagine più usato per i loghi nel database di Wikimedia?",
    correct_answer: ".svg",
    incorrect_answers: [".png", ".jpeg", ".gif"],
  },
  {
    question: "Cosa significa l'acronimo CSS?",
    correct_answer: "Cascading Style Sheets",
    incorrect_answers: [
      "Counter Strike: Source",
      "Corrective Style Sheets",
      "Computer Style Sheets",
    ],
  },
  {
    question: "Qual è il nome in codice del sistema operativo Android 7.0?",
    correct_answer: "Nougat",
    incorrect_answers: ["Ice Cream Sandwich", "Jelly Bean", "Marshmallow"],
  },
  {
    question: "Qual era il limite originale di caratteri di un Tweet?",
    correct_answer: "140",
    incorrect_answers: ["120", "160", "100"],
  },
  {
    question: "Linux è stato creato come alternativa a Windows XP.",
    correct_answer: "Falso",
    incorrect_answers: ["Vero"],
  },
  {
    question:
      "Quale linguaggio di programmazione condivide il nome con un'isola dell'Indonesia?",
    correct_answer: "Java",
    incorrect_answers: ["Python", "C", "Jakarta"],
  },
];

/* Costanti del quiz */
const TOTAL_QUESTIONS = QUESTIONS.length;
const PASS_THRESHOLD = 60;     // percentuale minima per "Promosso"
const FEEDBACK_DELAY = 1500;   // ms di attesa dopo risposta prima di avanzare
const TIMER_DURATION = 20;     // secondi per ogni domanda

/* Stato globale */
let currentScreen = "welcome"; // "welcome" | "quiz" | "results"
let currentQuestion = 0;
let score = 4;
let timerId = null;

/* SCRIVI QUI LE TUE FUNZIONI:
   - render() che chiama renderWelcome / renderQuiz / renderResults in base a currentScreen
   - renderWelcome() per la schermata iniziale con button Inizia
   - renderQuiz() per la domanda corrente con i button risposta + counter + timer
   - renderResults() per la schermata finale con percentuale + barre + verdetto
   - startTimer() / stopTimer() per il countdown
   - handleAnswer(button, answer) per il click su una risposta
   - handleTimeUp() per il tempo scaduto
   - advance() per andare alla domanda successiva o ai risultati
*/


function renderResults() {

  const app = document.querySelector(`#app`);
  app.textContent = " ";

  const title = document.createElement(`h1`);
  title.textContent = `Risultato`;
  app.appendChild(title);

  
  const incorrect = TOTAL_QUESTIONS - score;
  const dipslayScore = Math.round((score / TOTAL_QUESTIONS) * 100);
  const displayWrong = Math.round((incorrect / TOTAL_QUESTIONS) * 100); //mi calcolo in percentuale le risposte sbagliate
  const displayResult = document.createElement(`p`); //creo il tag dove visualizzare il risultato
  displayResult.textContent = `${dipslayScore}%`; //
  app.appendChild(displayResult); //metto a schermo il risultato

  const subTitle = document.createElement(`h4`);
  subTitle.textContent = `hai completato il quiz`;
  app.appendChild(subTitle);

  /* servE il n.ro di doamande-totali(TOTAL_QUESTIONS) e quello del punteggio realizzato(score).
  le risposte sbagliate me le calcolo sottraendo TOTAL_QUESTIONS - score */



  //controllo il risultato del quiz 

  if (dipslayScore >= PASS_THRESHOLD) {
    const promoted = document.createElement(`p`);
    promoted.classList.add(`promoted`);  //...se maggiore del 60%
    promoted.textContent = `Promosso`
    displayResult.appendChild(promoted);
  } else {
    const failed = document.createElement(`p`);
    failed.classList.add(`failed`);
    failed.textContent = `Bocciato`; //.... se minore del 60%
    displayResult.appendChild(failed);
  }

  //aggiorna stato barre 
  const containerbar = document.createElement(`div`);
  const containerbar2 = document.createElement(`div`);
  const correctBar = document.createElement(`div`); //creo il div progressBar delle risposte corrette
  const incorrectBar = document.createElement(`div`); //creo il div progressBar delle risposte sbagliaste

  //applico le classi
  correctBar.classList.add(`correctBar`);
  incorrectBar.classList.add(`incorrectBar`);
  containerbar.classList.add(`container`)
  containerbar2.classList.add(`container`)


  correctBar.style.width = (score / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette
  incorrectBar.style.width = (incorrect / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette
  displayResult.appendChild(containerbar);
  containerbar.appendChild(correctBar);
  containerbar2.appendChild(incorrectBar);

  //a fianco delle progressbar metto a schermo il numero di errori/risposte giuste
  const correctNumb = document.createElement(`span`);
  const incorrectNumb = document.createElement(`span`);

  correctNumb.textContent = `${score}/${TOTAL_QUESTIONS}`; //metto a schermo il numero di rispote giuste
  incorrectNumb.textContent = `${incorrect}/${TOTAL_QUESTIONS}`; //metto a schermo il numero di rispote sbagliate
  containerbar.appendChild(correctNumb);
  containerbar2.appendChild(incorrectNumb);


  //passo al button per il reset del quiz
  const reset = document.createElement(`button`) //creo il button per il reset del quiz
  reset.id = "reset"
  app.appendChild(reset);
  reset.addEventListener(`click`, function () {
    currentScreen = "welcome";
    alert(`Quiz resettato, pronto per ricominciare?`)

    render()
  })

}

renderResults();