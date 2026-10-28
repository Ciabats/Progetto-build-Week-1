# Progetto-build-Week-1 · Quiz App

Quiz in stile *Chi vuol essere milionario* realizzato per la **Build Week 1**, con HTML, CSS e JavaScript.
L'interfaccia richiama un quiz televisivo con un timer al centro delle risposte.

## Anteprima

| Welcome |
![Schermata Welcome](docs/welcome.png)

| Quiz |
![Schermata Quiz](docs/quiz.png)

| Results |
![Schermata Results](docs/results.png)

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
| `creaElemento(tag, classe, testo)` | Crea un elemento HTML con la classe e il testo e lo restituisce, per non ripetere ogni volta `createElement`. |
| `render()` | in base al valore di `currentScreen` seleziona la schermata da mettere a schermo |
| `renderWelcome()` | costruisce la schermata iniziale con le linee guida per il quiz |
| `renderQuiz()` | costruisce la schermata del quiz in cui vengono mostrate le domande con le relative risposte |
| `renderResults()` | costruisce la schermata dei risultati che permette all'utente di vedere se lo ha passato meno |
| `shuflleArray()` | permette di rendere randomica la visualizzazione di domande e risposte |
| `startTimer()` , `stopTimer()`  | gestiscono il countdown del timer |
| `handleTimeUp()` | Una volta scaduto il tempo rende impossibile il click sulle risposte, mostra “Tempo scaduto!” e salva la domanda come errore senza risposta.| 
| `manageClick` | Gestisce il click su una risposta: blocca i click successivi, ferma il timer, verifica se la risposta è corretta, aggiorna il punteggio e salva eventuali errori. |
| `advance()` |  |
| `renderWrongAnswers` | Mostra una scheda per ogni risposta errata con annessa risposta corretta, oppure un messaggio di complimenti se non ce ne sono. |

## Contributi

| Nome | Area di lavoro | Profilo GitHub |
|---|---|---|
| [ Emanuel Esposito ] | [ Team Leader - JavaScript ] | [@emanuel95esposito-ops](https://github.com/emanuel95esposito-ops) |
| [ Carmine Ruggiero ] | [ HTML - CSS ] | [@Carmine-Ruggiero](https://github.com/Carmine-Ruggiero) |
| [ Laura Ziino ] | [ HTML - CSS ] | [@nikoziino21-ai](https://github.com/nikoziino21-ai) |
| [ Gabriele Raggi ] | [ HTML - CSS ] | [@raggi370-source](https://github.com/raggi370-source) |
| [ Louis Anthony Pagliaro ] | [JavaScript] | [@Lokill0](https://github.com/Lokill0) |
| [ Matteo Fratini ] | [GitHub - JavaScript] | [@Ciabats](https://github.com/Ciabats) |


Epicode · Build Week 1 · 2026
