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

//creo una variabile che contiene l'audio con il volume al 90%

const audio = new Audio("./assets/audio/soundtrack.mp3");
audio.loop = true;
audio.volume = 0.9;

// Audio della promozione
const audioPromosso = new Audio("./assets/audio/Gerry Scotti Dancin.mp3");
audioPromosso.volume = 0.9;
audioPromosso.loop = true;

// Creo l'audio della bocciatura
const audioBocciato = new Audio("./assets/audio/Frolic.mp3");
audioBocciato.volume = 0.9;
audioBocciato.loop = true;

// Controllo generale dell'audio
let audioAttivo = true;

// Creo il pulsante per attivare e disattivare l'audio
const pulsanteAudio = creaElemento("button", "", "🔊", "audioToggle", document.body);
pulsanteAudio.type = "button";
pulsanteAudio.title = "Disattiva audio";

// Gestisco il click sul pulsante audio
pulsanteAudio.addEventListener("click", () => {

  audioAttivo = !audioAttivo;

  audio.muted = !audioAttivo;
  audioPromosso.muted = !audioAttivo;
  audioBocciato.muted = !audioAttivo;

  if (audioAttivo) {
    pulsanteAudio.textContent = "🔊";
    pulsanteAudio.title = "Disattiva audio";
  } else {
    pulsanteAudio.textContent = "🔇";
    pulsanteAudio.title = "Attiva audio";
  }

});

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
  const eyebrow = creaElemento("p", "screenEyebrow", "Final Quiz", "", app);
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

  const element2 = creaElemento("li", "", "Una volta cliccata una risposta, non potrai cambiarla.", "", list);

  const element3 = creaElemento("li", "", "Alla fine vedrai il tuo risultato e la correzione delle risposte sbagliate.", "", list);

  // Pulsante Inizia
  const button = creaElemento("button", "button", "Inizia", "buttonIdWelcome", app);
  button.type = "button";

  // Gestione del click del pulsante iniza
  button.addEventListener("click", () => {
    statoQuiz.shuffledQuestions = shuffleArray(QUESTIONS);
    statoQuiz.currentQuestion = 0;
    statoQuiz.score = 0;
    statoQuiz.risposteSbagliate = [];
    statoQuiz.rispostaSelezionata = false;
    statoQuiz.currentScreen = "quiz";
    // Avvio la musica quando inizia il quiz
    audio.play();

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

  // Se ci sono solo due risposte, adatto la disposizione
  if (risposte.length === 2) {
    areaRisposte.classList.add("dueRisposte");
  }

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

  // Messaggio sotto le risposte
  const messaggio = creaElemento("p", "feedback", "L'accendiamo?", "", schermata);

  // Timer centrale inserito nell'area risposte
  areaRisposte.appendChild(timer);

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

  // Fermo la musica e la riporto all'inizio
  audio.pause();
  audio.currentTime = 0;

  const incorrect = TOTAL_QUESTIONS - statoQuiz.score;
  const displayScore = Math.round((statoQuiz.score / TOTAL_QUESTIONS) * 100);
  const promosso = displayScore >= PASS_THRESHOLD;

  // Controllo dei risultati nella console
  console.log("Punteggio:", statoQuiz.score);
  console.log("Errori registrati:", statoQuiz.risposteSbagliate.length);
  console.log("Elenco errori:", statoQuiz.risposteSbagliate);

  // Contenitore della pagina finale
  const schermata = creaElemento("section", "resultsScreen", "", "", app);
  const title = creaElemento("h1", "tileWelcome", "Risultato", "", schermata);

  // Percentuale e verdetto accanto alla reazione finale
  const sommario = creaElemento("div", "resultsHero", "", "", schermata);
  const verdetto = creaElemento("div", "resultsVerdict", "", "", sommario);
  const displayResult = creaElemento("p", "score", `${displayScore}%`, "", verdetto);

  if (promosso) {
    const promoted = creaElemento("p", "promoted", "Promosso", "", verdetto);
  } else {
    const failed = creaElemento("p", "failed", "Bocciato", "", verdetto);
  }

  const subTitle = creaElemento("h4", "subTitleResults", "Hai completato il quiz", "", verdetto);

  // Riquadro della reazione finale
  const reazione = creaElemento("div", "reactionFrame", "", "", sommario);
  const segnaposto = creaElemento("div", "reactionPlaceholder", "", "", reazione);
  const simbolo = creaElemento("span", "reactionSymbol", "◆", "", segnaposto);
  const etichetta = creaElemento("p", "reactionLabel", "Reazione finale", "", segnaposto);

  if (promosso) {
    // Adatto il contenitore
    reazione.classList.add("reactionPromosso");

    // GIF di Gerry Scotti quando il giocatore viene promosso
    const descrizione = creaElemento("p", "reactionHint", "Caricamento della reazione finale...", "", segnaposto);

    const gif = document.createElement("img");
    gif.alt = "Gerry Scotti festeggia";

    gif.addEventListener("load", () => {
      reazione.replaceChildren(gif);

      // Avvio l'audio insieme alla GIF
      audioPromosso.play().catch((errore) => {
        console.log("Impossibile riprodurre l'audio:", errore);
      });
    });

    gif.src = "https://media1.tenor.com/m/BhGvFMSGuHkAAAAd/gerry-scotti-dance.gif";
  } else {
    // GIF di Gerry Scotti quando il giocatore viene bocciato
    const descrizione = creaElemento("p", "reactionHint", "Caricamento della reazione finale...", "", segnaposto);

    const gif = document.createElement("img");
    gif.alt = "Gerry Scotti ride";

    gif.addEventListener("load", () => {
      reazione.replaceChildren(gif);

      // Avvio la musica della bocciatura insieme alla GIF
      audioBocciato.currentTime = 0;

      audioBocciato.play().catch((errore) => {
        console.log("Impossibile riprodurre l'audio:", errore);
      });
    });

    gif.src = "https://media1.tenor.com/m/eH1yWjkNokAAAAAd/gif-gerry-scotti-gif-la-ruota-della-fortuna.gif";
  }

  // Barre delle risposte corrette e sbagliate
  const riepilogo = creaElemento("div", "summaryBars", "", "", schermata);

  const rigaCorrette = creaElemento("div", "summaryRow", "", "", riepilogo);
  const trueDescription = creaElemento("p", "summaryLabel", "Risposte corrette", "", rigaCorrette);
  const containerbar = creaElemento("div", "container", "", "", rigaCorrette);
  const correctBar = creaElemento("div", "correctBar", "", "", containerbar);
  correctBar.style.width = (statoQuiz.score / TOTAL_QUESTIONS) * 100 + `%`;
  const correctNumb = creaElemento("span", "summaryValue", `${statoQuiz.score}/${TOTAL_QUESTIONS}`, "", containerbar);

  const rigaSbagliate = creaElemento("div", "summaryRow", "", "", riepilogo);
  const wrongDescription = creaElemento("p", "summaryLabel", "Risposte sbagliate", "", rigaSbagliate);
  const containerbar2 = creaElemento("div", "container", "", "", rigaSbagliate);
  const incorrectBar = creaElemento("div", "incorrectBar", "", "", containerbar2);
  incorrectBar.style.width = (incorrect / TOTAL_QUESTIONS) * 100 + `%`;
  const incorrectNumb = creaElemento("span", "summaryValue", `${incorrect}/${TOTAL_QUESTIONS}`, "", containerbar2);

  // Elenco a tendina delle risposte sbagliate
  const titoloCorrezioni = creaElemento("h3", "correctionsTitle", "Correzione delle risposte sbagliate", "", schermata);
  const listaErrori = creaElemento("div", "errorList", "", "", schermata);

  if (statoQuiz.score === TOTAL_QUESTIONS) {
    const nessunErrore = creaElemento("p", "allCorrect", "Perfetto! Hai risposto correttamente a tutte le domande.", "", listaErrori);
  } else {
    statoQuiz.risposteSbagliate.forEach((errore, indice) => {
      const dettaglio = creaElemento("details", "errorCard", "", "", listaErrori);
      const domanda = creaElemento("summary", "errorQuestion", `${indice + 1}. ${errore.domanda}`, "", dettaglio);
      const rispostaData = creaElemento("p", "errorGiven", `La tua risposta: ${errore.rispostaData}`, "", dettaglio);
      const rispostaGiusta = creaElemento("p", "errorRight", `Risposta corretta: ${errore.rispostaCorretta}`, "", dettaglio);
    });
  }

  //passo al button per il reset del quiz
  const reset = creaElemento("button", "button", "Ricomincia", "reset", schermata);

  //aggiungo evento al suo click
  reset.addEventListener("click", function () {
    audioPromosso.pause();
    audioPromosso.currentTime = 0;
    audioBocciato.pause();
    audioBocciato.currentTime = 0;
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