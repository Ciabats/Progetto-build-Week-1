/*
  Array di domande.
  Ogni question è un object con:
   - question: testo della domanda
   - correct_answer: la risposta corretta (string)
   - incorrect_answers: array di risposte sbagliate (string[])
*/
export const QUESTIONS = [
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

// costanti del quiz
export const TOTAL_QUESTIONS = QUESTIONS.length;
export const PASS_THRESHOLD = 60;
export const FEEDBACK_DELAY = 1000;
export const TIMER_DURATION = 20;

//Stato del quiz
export const statoQuiz = {
    currentScreen: "welcome",
    currentQuestion: 0,
    score: 0,
    timerId: null,
    timeLeft: TIMER_DURATION,
    shuffledQuestions: [],
    rispostaSelezionata: false,
    risposteSbagliate: []
};

// Funzione per creare elementi HTML rapidamente, assegnando loro
// un tag, una classe e un ID e un genitore e inserirli direttamente nel DOM.
//ritorna l'elemento creato.

export function creaElemento(tag, classe, testo, id, genitore) {
    const elemento = document.createElement(tag);

    elemento.className = classe;

    if (testo !== undefined) {
        elemento.textContent = testo;
    }

    if (id !== undefined) {
        elemento.id = id;
    }

    if (genitore !== undefined) {
        genitore.appendChild(elemento);
    }

    return elemento;
}

//Funzione per mescolare casualmente gli elementi di un array.
// 1. Crea una copia dell'array originale, per non modificarlo.
// 2. Scorre l'array dalla fine verso l'inizio.
// 3. Per ogni elemento, sceglie casualmente un indice tra 0
// e l'indice corrente.
// 4. Scambia l'elemento corrente con quello scelto a caso.
//5. Restituisce l'array mescolato.

export function shuffleArray(array) {
    const risultato = [...array];

    for (let i = risultato.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temporaneo = risultato[i];
        risultato[i] = risultato[j];
        risultato[j] = temporaneo;
    }
    return risultato;
}

// Funzione stopTimer() per fermare il timer.
// 1. Controlla se esiste un timer attivo.
// 2. Se esiste, lo ferma con clearInterval().
// 3. Riporta timerId a null per indicare che non c'è più un timer attivo.

export function stopTimer() {
    if (statoQuiz.timerId !== null) {
        clearInterval(statoQuiz.timerId);
        statoQuiz.timerId = null;
    }
}

// Funzione startTimer() per avviare il conto alla rovescia.
// 1. Ferma un eventuale timer precedente.
// 2. Imposta il tempo iniziale usando TIMER_DURATION.
// 3. Recupera dal DOM l'elemento che mostra i secondi.
// 4. Mostra il tempo iniziale sullo schermo.
// 5. Ogni secondo diminuisce il tempo e aggiorna il DOM.
// 6. Quando il tempo arriva a zero, ferma il timer e richiama handleTimeUp().

export function startTimer(advance) {
    stopTimer();

    statoQuiz.timeLeft = TIMER_DURATION;

    const valoreTimer = document.querySelector("#timerValue");
    const timer = document.querySelector(".timer");
    valoreTimer.textContent = statoQuiz.timeLeft;
    valoreTimer.classList.remove("warning");
    if (timer) {
        timer.classList.remove("warning");
    }

    statoQuiz.timerId = setInterval(() => {
        statoQuiz.timeLeft--;
        valoreTimer.textContent = statoQuiz.timeLeft;

        if (statoQuiz.timeLeft <= 5) {
            valoreTimer.classList.add("warning");
            if (timer) {
                timer.classList.add("warning");
            }
        }

        if (statoQuiz.timeLeft <= 0) {
            stopTimer();
            handleTimeUp(advance);
        }
    }, 1000);
}

// Funzione manageClick() per gestire la risposta scelta dall'utente.
// 1. Controlla che la domanda non sia già stata risposta.
// 2. Segna la domanda come chiusa e ferma il timer.
// 3. Confronta la risposta scelta con quella corretta.
// 4. Aggiorna il punteggio oppure registra l'errore.
// 5. Dopo una breve pausa, richiama la funzione ricevuta
//    per passare alla domanda successiva.

export function manageClick(button, answer, domanda, advance) {
    if (statoQuiz.rispostaSelezionata) {
        return;
    }

    statoQuiz.rispostaSelezionata = true;
    stopTimer();

    const messaggio = document.querySelector(".feedback");
    const bottoni = document.querySelectorAll(".answer");

    bottoni.forEach((bottone) => {
        bottone.disabled = true;
        const testoRisposta = bottone.querySelector(".answerText");

        if (testoRisposta && testoRisposta.textContent === domanda.correct_answer) {
            bottone.classList.add("correct");
        }
    });

    if (answer === domanda.correct_answer) {
        statoQuiz.score++;
        button.classList.add("correct");
        messaggio.textContent = "Risposta corretta!";
    } else {
        button.classList.add("wrong");
        messaggio.textContent = "Risposta sbagliata!";

        const errore = {
            domanda: domanda.question,
            rispostaData: answer,
            rispostaCorretta: domanda.correct_answer
        };

        statoQuiz.risposteSbagliate.push(errore);
    }

    setTimeout(advance, FEEDBACK_DELAY);
}

// Funzione handleTimeUp() per gestire la scadenza del tempo.
//  1. Controlla che la domanda non sia già stata risposta.
//  2. Segna la domanda come chiusa.
//  3. Mostra un messaggio di tempo scaduto.
//  4. Registra la domanda tra le risposte sbagliate.
//  5. Dopo una breve pausa, richiama advance per passare
//     alla domanda successiva.

export function handleTimeUp(advance) {
    if (statoQuiz.rispostaSelezionata) {
        return;
    }
    stopTimer();
    statoQuiz.rispostaSelezionata = true;

    const messaggio = document.querySelector(".feedback");
    messaggio.textContent = "Tempo scaduto!";

    const domanda = statoQuiz.shuffledQuestions[statoQuiz.currentQuestion];
    const bottoni = document.querySelectorAll(".answer");

    bottoni.forEach((bottone) => {
        bottone.disabled = true;
        const testoRisposta = bottone.querySelector(".answerText");

        if (testoRisposta && testoRisposta.textContent === domanda.correct_answer) {
            bottone.classList.add("correct");
        }
    });

    const errore = {
        domanda: domanda.question,
        rispostaData: "Tempo scaduto",
        rispostaCorretta: domanda.correct_answer
    };

    statoQuiz.risposteSbagliate.push(errore);

    setTimeout(advance, FEEDBACK_DELAY);
}