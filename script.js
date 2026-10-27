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
let score = 0;
let timerId = null;
let shuffledQuestions = []; // variabili mescolate per la partita in corso
let rispostaSelezionata = false;
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

// funziona crea elementi

function creaElemento(tag, classe, testo) {
  const elemento = document.createElement(tag);

  elemento.className = classe;

  if (testo !== undefined) {
    elemento.textContent = testo;
  }

  return elemento;
}

//richiamo il contenitore app

const app = document.querySelector("#app");

// render(): capire come scegliere la schermata da mostrare.

// Funzione render:
// 1. Controlla il valore di currentScreen
// 2. Se è "welcome", mostra la schermata iniziale
// 3. Se è "quiz", mostra la schermata del quiz
// 4. Se è "results", mostra la schermata finale

function render() {

  //svuoto gli elementi e indirizzo la pagina.

  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  switch (currentScreen) {
    case "welcome":
      renderWelcome();
      break;

    case "quiz":
      renderQuiz();
      break;

    default:
      renderResults();
  }
}

// schermata iniziale: far funzionare il pulsante Inizia.

function renderWelcome() {

  // Titolo
  const header = creaElemento(
    "h1",
    "headers",
    "Benvenuto al tuo esame"
  );

  header.id = "headerWelcome";
  app.appendChild(header);

  // Paragrafo
  const paragraph = creaElemento(
    "p",
    "paragraph",
    "Una serie di 10 domande sul mondo dell'informatica e del web. Per ogni domanda hai 20 secondi di tempo."
  );

  paragraph.id = "paragraphWelcome";
  app.appendChild(paragraph);

  // Lista
  const list = creaElemento("ul", "list");

  list.id = "listWelcome";

  // Elementi della lista
  const element1 = creaElemento(
    "li",
    "",
    "Ogni domanda è a tempo e può ricevere una sola risposta."
  );

  list.appendChild(element1);

  const element2 = creaElemento(
    "li",
    "",
    "Una volta cliccata una risposta, la domanda è chiusa."
  );

  list.appendChild(element2);

  const element3 = creaElemento(
    "li",
    "",
    "Il quiz dura circa 3 minuti."
  );

  list.appendChild(element3);

  // Inserisco la lista nel contenitore
  app.appendChild(list);

  // Pulsante Inizia
  const button = creaElemento(
    "button",
    "button",
    "Inizia"
  );

  button.id = "buttonIdWelcome";
  button.type = "button";

  app.appendChild(button);

  // Gestione del click
  button.addEventListener("click", () => {
    shuffledQuestions = shuffleArray(QUESTIONS);
    currentQuestion = 0;
    score = 0;
    currentScreen = "quiz";
    render();
  });
}

// Mostrare la prima domanda: recuperarla dall'array e inserirla nel DOM.
// renderQuiz

function renderQuiz() {

  const domanda = shuffledQuestions[currentQuestion];

  // Contenitore principale
  const schermata = creaElemento("section", "gameScreen quiz");

  // Intestazione
  const intestazione = creaElemento("div", "quizTop");

  const contatore = creaElemento(
    "div",
    "quizRound",
    `Domanda ${currentQuestion + 1} di ${TOTAL_QUESTIONS}`
  );

  const punteggio = creaElemento(
    "div",
    "score-box",
    `Risposte corrette: ${score}`
  );

  intestazione.appendChild(contatore);
  intestazione.appendChild(punteggio);

  // Barra di avanzamento 
  const barra = creaElemento("div", "progressTrack");
  const riempimento = creaElemento("div", "progressFill");

  barra.appendChild(riempimento);

  // Riquadro della domanda
  const riquadroDomanda = creaElemento("div", "questionBox");
  const testoDomanda = creaElemento("h2", "questionText", domanda.question);

  riquadroDomanda.appendChild(testoDomanda);

  // Area delle risposte
  const areaRisposte = creaElemento("div", "answersArea");

  const risposte = shuffleArray([
    domanda.correct_answer,
    ...domanda.incorrect_answers
  ]);

  const lettere = ["A", "B", "C", "D"];

  risposte.forEach((risposta, indice) => {

    const bottone = creaElemento("button", "answer");
    bottone.type = "button";

    const lettera = creaElemento(
      "span",
      "answerLetter",
      lettere[indice]
    );

    const testo = creaElemento("span", "answerText", risposta);

    bottone.appendChild(lettera);
    bottone.appendChild(testo);

    areaRisposte.appendChild(bottone);
  });

  // Timer centrale
  const timer = creaElemento("div", "timer");
  const centroTimer = creaElemento("div", "timerCore");
  const valoreTimer = creaElemento("span", "", "20");

  valoreTimer.id = "timerValue";

  centroTimer.appendChild(valoreTimer);
  timer.appendChild(centroTimer);
  areaRisposte.appendChild(timer);

  // Messaggio sotto le risposte
  const messaggio = creaElemento(
    "p",
    "feedback",
    "Seleziona una risposta."
  );

  // Composizione della schermata
  schermata.appendChild(intestazione);
  schermata.appendChild(barra);
  schermata.appendChild(riquadroDomanda);
  schermata.appendChild(areaRisposte);
  schermata.appendChild(messaggio);

  // Inserisco la nuova schermata
  app.appendChild(schermata);
}

//  Funzione per mescolare arrey

function shuffleArray(array) {
  const risultato = [...array];
  for (let i = risultato.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    const temporaneo = risultato[i];
    risultato[i] = risultato[j];
    risultato[j] = temporaneo;
  }
  return risultato;
}


//advance() manageClick() timer ()

function manageClick(button, answer, currentQuestion) {
  //blocchiamo successivi click
  if (rispostaSelezionata) {
    return;
  }
  rispostaSelezionata = true;
  if (answer === currentQuestion.correct_answer) {
    // Risposta corretta
    score++;
    button.classList.add("correct");
  } else {
    // Risposta sbagliata
  }

} 

//pagina risultato.

function renderResults() {

  const app = document.querySelector(`#app`);
  app.textContent = " ";

  const title = document.createElement(`h1`);
  title.classList.add(`tileWelcome`)
  title.textContent = `Risultato`;
  app.appendChild(title);


  const incorrect = TOTAL_QUESTIONS - score;
  const displayScore = Math.round((score / TOTAL_QUESTIONS) * 100);
  const displayResult = document.createElement(`p`); //creo il tag dove visualizzare il risultato
  displayResult.classList.add(`score`)
  displayResult.textContent = `${displayScore}%`; //
  app.appendChild(displayResult); //metto a schermo il risultato

  const subTitle = document.createElement(`h4`);
  subTitle.classList.add(`subTitleResults`);
  subTitle.textContent = `hai completato il quiz`;
  app.appendChild(subTitle);

  /* servE il n.ro di doamande-totali(TOTAL_QUESTIONS) e quello del punteggio realizzato(score).
  le risposte sbagliate me le calcolo sottraendo TOTAL_QUESTIONS - score */


  //controllo il risultato del quiz 

  if (displayScore >= PASS_THRESHOLD) {
    const promoted = document.createElement(`p`);
    promoted.classList.add(`promoted`);  //...se maggiore del 60%
    promoted.textContent = `Promosso`;
    app.appendChild(promoted);
  } else {
    const failed = document.createElement(`p`);
    failed.classList.add(`failed`);
    failed.textContent = `Bocciato`; //.... se minore del 60%
    app.appendChild(failed);
  }

  //aggiorna stato barre 
  const containerbar = document.createElement(`div`);
  const containerbar2 = document.createElement(`div`);
  const correctBar = document.createElement(`div`); //creo il div progressBar delle risposte corrette
  const incorrectBar = document.createElement(`div`); //creo il div progressBar delle risposte sbagliaste

  //applico le classi
  correctBar.classList.add(`correctBar`); //aggiungo classe per successiva stitlizzazione
  incorrectBar.classList.add(`incorrectBar`); //aggiungo classe per successiva stitlizzazione
  containerbar.classList.add(`container`); //aggiungo classe per successiva stitlizzazione
  containerbar2.classList.add(`container`); //aggiungo classe per successiva stitlizzazione


  correctBar.style.width = (score / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette
  incorrectBar.style.width = (incorrect / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette
  app.appendChild(containerbar);
  app.appendChild(containerbar2);
  containerbar.appendChild(correctBar);
  containerbar2.appendChild(incorrectBar);

  //a fianco delle progressbar metto a schermo il numero di errori/risposte giuste
  const correctNumb = document.createElement(`span`);
  const incorrectNumb = document.createElement(`span`);

  correctNumb.textContent = `${score}/${TOTAL_QUESTIONS}`; //metto a schermo il numero di rispote giuste
  incorrectNumb.textContent = `${incorrect}/${TOTAL_QUESTIONS}`; //metto a schermo il numero di rispote sbagliate
  correctNumb.classList.add(`correct`);
  incorrectNumb.classList.add(`wrong`);
  containerbar.appendChild(correctNumb);
  containerbar2.appendChild(incorrectNumb);


  //passo al button per il reset del quiz
  const reset = document.createElement(`button`) //creo il button per il reset del quiz
  reset.id = "reset"; //assegno id 
  reset.textContent = "Ricomincia"; //testo all'interno del button reset
  app.appendChild(reset);
  reset.addEventListener(`click`, function () { //aggiungo evento al suo click 
    currentScreen = "welcome"; //gli faccio cambiare il valore della variabile currentScreen
    alert(`Quiz resettato, pronto per ricominciare?`);
    render();
  })

}

renderResults();
