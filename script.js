import {
  QUESTIONS,
  TOTAL_QUESTIONS,
  PASS_THRESHOLD,
  FEEDBACK_DELAY,
  TIMER_DURATION,
  statoQuiz,
  creaElemento,
  shuffleArray,
  stopTimer,
  startTimer,
  manageClick,
  handleTimeUp,
} from "./funzioni.js";

//dichiariamo app

const app = document.querySelector("#app");

// render(): capire come scegliere la schermata da mostrare.

// Funzione render:
// 1. Controlla il valore importato di statoQuiz.currentScreen
// 2. Se è "welcome", mostra la schermata iniziale
// 3. Se è "quiz", mostra la schermata del quiz
// 4. Se è "results", mostra la schermata finale

function render() {
  // Svuoto il contenitore della pagina.

  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  // Scelgo quale schermata mostrare.

  switch (statoQuiz.currentScreen) {
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
  const header = creaElemento("h1", "headers", "Benvenuto al tuo esame", "headerWelcome", app);

  // Paragrafo
  const paragraph = creaElemento("p", "paragraph",
    "Una serie di 10 domande sul mondo dell'informatica e del web. Per ogni domanda hai 20 secondi di tempo.",
    "paragraphWelcome",
    app
  );

  // Lista
  const list = creaElemento("ul", "list", "", "listWelcome", app);

  // Elementi della lista
  const element1 = creaElemento("li", "", "Ogni domanda è a tempo e può ricevere una sola risposta.", "", list);

  const element2 = creaElemento("li", "", "Una volta cliccata una risposta, la domanda è chiusa.", "", list);

  const element3 = creaElemento("li", "", "Il quiz dura circa 3 minuti.", "", list);

  // Pulsante Inizia
  const button = creaElemento("button", "button", "L'accendiamo?", "buttonIdWelcome", app);
  button.type = "button";

  // Gestione del click del pulsante iniza
  button.addEventListener("click", () => {
    statoQuiz.shuffledQuestions = shuffleArray(QUESTIONS);
    statoQuiz.currentQuestion = 0;
    statoQuiz.score = 0;
    statoQuiz.risposteSbagliate = [];
    statoQuiz.rispostaSelezionata = false;
    statoQuiz.currentScreen = "quiz";
    render();
  });
}

// Mostrare la prima domanda: recuperarla dall'array e inserirla nel DOM.
// renderQuiz

function renderQuiz() {

  const domanda = statoQuiz.shuffledQuestions[statoQuiz.currentQuestion];

  // Contenitore principale
  const schermata = creaElemento("section", "gameScreen quiz", "", "", app);

  // Intestazione
  const intestazione = creaElemento("div", "quizTop", "", "", schermata);

  const contatore = creaElemento("div", "quizRound",
    `Domanda ${statoQuiz.currentQuestion + 1} di ${TOTAL_QUESTIONS}`,
    "",
    intestazione
  );

  const punteggio = creaElemento(
    "div",
    "score-box",
    `Risposte corrette: ${statoQuiz.score}`,
    "",
    intestazione
  );

  // Barra di avanzamento 
  const barra = creaElemento("div", "progressTrack", "", "", schermata);
  const riempimento = creaElemento("div", "progressFill", "", "", barra);

  riempimento.style.width = `${((statoQuiz.currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%`;

  // Riquadro della domanda
  const riquadroDomanda = creaElemento("div", "questionBox", "", "", schermata);
  const testoDomanda = creaElemento("h2", "questionText", domanda.question, "", riquadroDomanda);

  // Area delle risposte
  const areaRisposte = creaElemento("div", "answersArea", "", "", schermata);

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

    bottone.addEventListener("click", () => {
      manageClick(bottone, risposta, domanda, advance);
    });
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
  const messaggio = creaElemento("p", "feedback", "L'accendiamo?", "", schermata);

  //parte il timer
  startTimer(advance);
}

// Incrementa il numero della domanda e resetta la selezione della risposta.
// Se tutte le domande sono state completate, passa alla schermata dei risultati;
// altrimenti mostra la domanda successiva.
// Infine richiama render() per aggiornare la schermata del quiz.

function advance() {
  statoQuiz.currentQuestion++;

  statoQuiz.rispostaSelezionata = false;

  if (statoQuiz.currentQuestion === TOTAL_QUESTIONS) {
    statoQuiz.currentScreen = "results";
  } else {
    statoQuiz.currentScreen = "quiz";
  }

  render();
}

//pagina risultato.


// servE il n.ro di doamande-totali(TOTAL_QUESTIONS) e quello del punteggio realizzato(score).
//  le risposte sbagliate me le calcolo sottraendo TOTAL_QUESTIONS - score

function renderResults() {

  const title = creaElemento("h1", "titlewelcome", "risultato", "", app);

  const incorrect = TOTAL_QUESTIONS - statoQuiz.score;
  const displayScore = Math.round((statoQuiz.score / TOTAL_QUESTIONS) * 100);
  const displayResult = creaElemento("p", "score", `${displayScore}%`, "", app);
  const subTitle = creaElemento("h4", "subTitleResults", "hai completato il quiz", "", app);

  //controllo il risultato del quiz 

  if (displayScore >= PASS_THRESHOLD) {
    const promoted = creaElemento("p", "promoted", "Promosso", "", app);

  } else {
    const failed = creaElemento("p", "failed", "Bocciato", "", app);
  }

  //aggiorna stato barre s.crea
  const trueDescription = creaElemento("p", "description", "Corrette :", "", app);
  const containerbar = creaElemento("div", "container", "", "", app);
  const wrongDescription = creaElemento("p", "description", "Sbagliate :", "", app);
  const containerbar2 = creaElemento("div", "container", "", "", app);
  const correctBar = creaElemento("div", "correctBar", "", "", containerbar); //creo il div progressBar delle risposte corrette
  const incorrectBar = creaElemento("div", "incorrectBar", "", "", containerbar2); //creo il div progressBar delle risposte sbagliaste
  correctBar.style.width = (statoQuiz.score / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette
  incorrectBar.style.width = (incorrect / TOTAL_QUESTIONS) * 100 + `%`; //calcolo la lunghezza in % della barra delle risposte corrette

  //a fianco delle progressbar metto a schermo il numero di errori/risposte giuste

  const correctNumb = creaElemento("span", "correct", `${statoQuiz.score}/${TOTAL_QUESTIONS}`, "", containerbar);
  const incorrectNumb = creaElemento("span", "wrong", `${incorrect}/${TOTAL_QUESTIONS}`, "", containerbar2);

  // Sezione correzioni
  const sezioneCorrezioni = creaElemento("section", "correzioni", "", "", app);

  creaElemento("h2", "titoloCorrezioni", "Correzioni", "", sezioneCorrezioni);

  // Se non ci sono risposte sbagliate
  if (statoQuiz.risposteSbagliate.length === 0) {
    creaElemento("p", "nessunErrore", "Complimenti, nessun errore!", "", sezioneCorrezioni);
  } else {

    // Crea una card per ogni risposta sbagliata
    statoQuiz.risposteSbagliate.forEach((errore, indice) => {

      const card = creaElemento("article", "correctionCard", "", "", sezioneCorrezioni);

      // Domanda
      creaElemento("h3", "correctionQuestion", `${indice + 1}. ${errore.domanda}`, "", card);

      // Contenitore delle risposte
      const risposte = creaElemento("div", "correctionAnswers", "", "", card);

      // Risposta data dall'utente
      creaElemento("p", "wrongAnswer", `La tua risposta: ${errore.rispostaData}`, "", risposte);

      // Risposta corretta
      creaElemento("p", "correctAnswer", `Risposta corretta: ${errore.rispostaCorretta}`, "", risposte);
    });
  }

  //passo al button per il reset del quiz
  const reset = creaElemento("button", "button", "Ricomincia", "reset", app); //creo il button per il reset del quiz

  //aggiungo evento al suo click 
  reset.addEventListener("click", function () {
    statoQuiz.currentScreen = "welcome";
    statoQuiz.currentQuestion = 0;
    statoQuiz.score = 0;
    statoQuiz.risposteSbagliate = [];
    statoQuiz.rispostaSelezionata = false;

    stopTimer();
    render();
  });

}

////fine pagina risultato.

render();

