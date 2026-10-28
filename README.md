# Progetto-build-Week-1 · Quiz App

Quiz in stile *Chi vuol essere milionario* realizzato per la **Build Week 1**, con HTML, CSS e JavaScript.
L'interfaccia richiama un quiz televisivo con un timer al centro delle risposte.

## Anteprima

| Welcome |
![Schermata Welcome](docs/welcome.png)

| Quiz |
![Schermata Quiz](docs/quiz.png)

| Results |
![Schermata Results](docs/results(2).png)

## Come Funziona

1. **Welcome:** vengono mostrati il titolo, le regole del quiz e il pulsante "Inizia" che da il via al quiz.

2. **Quiz:** domande di informatica e web, ognuna con 20 secondi di tempo per la risposta. Si può dare una sola risposta per domanda, dopo il click, o allo scadere del tempo, il quiz passa alla domanda successiva.

3. **Results:** Questa schermata mostra la percentuale di risposte corrette, il verdetto se **Promosso** (almeno 60%) o **Bocciato**, due barre di progresso riferite alle risposte giuste/sbagliate e il pulsante "Ricomincia" che permette all'utente di ricominciare il quiz da capo.


## Funzionalità

- Tre schermate (renderWelcome, renderQuiz, renderResults) che si alternano nel `<main>`
- Domande in ordine casuale a ogni partita, sia a 4 risposte sia vero/falso
- Risposte mescolate a ogni domanda e contrassegnate con le lettere A, B, C, D
- Counter "Domanda N di 10" e punteggio parziale sempre visibili
- Timer di 20 secondi che si ferma al click
- Tempo scaduto: messaggio dedicato e passaggio automatico alla domanda successiva
- Feedback immediato dopo la risposta, con colore e messaggio
- Risultato finale con percentuale, verdetto e barre per corrette e sbagliate

## Strumenti utilizzati

- HTML
- CSS
- Java_script
- GitHub

## Funzioni Principali 

| Nome funzione | Cosa fa |
|---|---|
| `render()` | in base al valore di `currentScreen` seleziona la schermata da mettere a schermo |
| `renderWelcome()` | costruisce la schermata iniziale con le linee guida per il quiz |
| `renderQuiz()` | costruisce la schermata del quiz in cui vengono mostrate le domande con le relative risposte |
| `renderResults()` | costruisce la schermata dei risultati che permette all'utente di vedere se lo ha passato meno |
| `shuflleArray()` | permette di rendere randomica la visualizzazione di domande e risposte |
| `startTimer()` , `stopTimer()`  | gestiscono il countdown del timer |
| `manageClick` |  |
| `handleTimeUp()` |  | 
| `advance()` |  |

## Contributi

| Nome | Area di lavoro |
|---|---|
| [ Emanuel Esposito ] | [ Team Leader - JavaScript ] |
| [ Carmine Ruggiero ] | [ HTML - CSS ] |
| [ Laura Ziino ] | [ HTML - CSS ] |
| [ Gabriele Raggi ] | [ HTML - CSS ] |
| [ Louis Anthony Pagliaro ] | [JavaScript] |
| [ Matteo Fratini ] | [GitHub - JavaScript] |


Epicode · Build Week 1 · 2026
