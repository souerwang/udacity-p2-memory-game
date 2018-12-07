/*
 * Create a list that holds all of your cards
 */
const cardsSample =["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const deck = document.querySelector(".deck");
const decked = [];  /** list for reserving the matched cards */
let countStep = 0;  /** the counter of moving*/
const d = new Date(); /** date for timer */
let timer;
let elapsedTime = 0;

function startTimer() {
    d.setHours(0,0,0,0); 
    timer = setInterval(gameTimer, 1000);
}
/** set up a game timer as locale -12hr style */
function gameTimer() {
    d.setSeconds(d.getSeconds()+1);
    elapsedTime = d.toLocaleTimeString("en-US", {hour12: false});
    document.querySelector(".timer").innerHTML = `elapsed time: ${elapsedTime}`;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    d.setHours(0,0,0,0);  /** the date format is reset while press the reset button */
    elapsedTime = d.toLocaleTimeString("en-US", {hour12: false});
    document.querySelector(".timer").innerHTML = `elapsed time: ${elapsedTime}`;
}

function reset(){
    /**  initial variable and deck content  */
    let cards = shuffle(cardsSample.concat(cardsSample));
    deck.innerHTML = "";
    decked.length = 0;
    countStep = 0;
    /** display the card's symbol */
    for (let card of cards) {
        let cardElement = document.createElement('li');
        cardElement.innerHTML = `<i class="fa fa-${card}"></i>`;
        cardElement.className = "card";
        /** settle the event listener for a card. If a card is clicked */
        cardElement.addEventListener('click', function (e) {
            e.preventDefault();
            if (!timer) {
                startTimer();
            }
            if (!cardElement.classList.contains("open")){
                cardElement.className = "card open show";
                /** criterion: even and unmatching */
                if (decked.length%2 == 1 && decked[decked.length-1]!=card) {
                    unMatching(cardElement);
                } else {
                    decked.push(card); /** if the cards do match */
                }
                countStep++;
                moveCounter(countStep,cards.length);
                if (decked.length == cards.length) {
                    finish(countStep);
                }
            }
        });
        deck.appendChild(cardElement);
    }
    moveCounter(countStep,cards.length); 
    resetTimer();  
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function unMatching(cardElement){
    let lastCardName = decked.pop();
    let lastCardClass = `.open i[class="fa fa-${lastCardName}"]`;
    let lastCard = document.querySelector(lastCardClass);
    //set the effect of unmatching
    cardElement.classList.add("unmatched");
    lastCard.parentElement.classList.add("unmatched");
    //set a timer to keep the time space for finishing the effect of unmatching
    setTimeout(function(){
        cardElement.className = "card";
        lastCard.parentElement.className = "card";
    },600);
}

/** move the counter and do star rate due to the range of counter  */
function moveCounter(countStep,cardsLen) {
    let moves = document.querySelector(".moves");
    moves.textContent = `${countStep} Move${countStep>1?"s":""}`;
    /** 3 stars within double the sum of cards; 
     *  2 stars is in the range from double to third times;
     *  one star is saved at any times
      */
    let stars = document.querySelector(".stars");
    stars.innerHTML ="";
    let starElement = document.createElement('li');
    starElement.innerHTML = `<i class="fa fa-star"></i><i class="fa fa-star${countStep<cardsLen*3?'':'-o'}"></i><i class="fa fa-star${countStep<cardsLen*2?'':'-o'}"></i>`;
    stars.appendChild(starElement);
}

/* display a message with the final score */
function finish(countStep) {
    let allMatchedCards = document.querySelectorAll(".card");
    for (const matchedCard of allMatchedCards){
        matchedCard.classList.toggle("cheers");
    }
    /**
     * the class of board is uesed to display the message with final goal
     * the funcation of reset will be triggered while click the button on board 
     */
    clearInterval(timer);
    let contain = document.querySelector(".deck");
    contain.innerHTML = `<li class="board"><i class="fa fa-check-circle-o"></i><h2>Congratulation!</h2>
    <p>You finish the game within ${countStep} moves; elapsed time: ${elapsedTime} </p><button class="btn" onclick="reset()"><i class="fa fa-repeat">
    </i>&nbsp;Try again</button></li>`;
}

reset();
