$(document).ready(function() {
    console.log('hi from cards.js');
    var cardsDiv = $('<div>').attr('id', 'cards').appendTo('body');

    var baseUrl = 'http://deckofcardsapi.com/api/deck';
    var deckId;

    var twoCards = [];

    async function getDeck() {
        try {
            var response = await axios.get(baseUrl + '/new/shuffle/');
            deckId = response.data.deck_id;
     
        var response = await axios.get(baseUrl + '/new/shuffle/');
        deckId = response.data.deck_id;
        var response2 = await axios.get(baseUrl + '/' + deckId + '/draw/?count=1');

        twoCards.push(response2.data.cards[0]);
        var response3 = await axios.get(baseUrl + '/' + deckId + '/draw/?count=1');

        twoCards.push(response3.data.cards[0]);
        twoCards.forEach(function(card){
            console.log(card.code, card.suit, card.value);
        });
        $('<h2>').text('Two Cards').appendTo(cardsDiv);
        twoCards.forEach(function(card) {
            $('<img>').attr('src', card.image).appendTo(cardsDiv);
        });
    } catch (err) {
        console.log(err);
    }
    }

    getDeck();


    var drawBtn = $('<button>').text('Draw').appendTo(cardsDiv);

    drawBtn.click(function() {
        drawCard();
    });

    async function drawCard() {
        try {
            var response = await axios.get(baseUrl + '/' + deckId + '/draw/?count=1');
            var card = response.data.cards[0];
            $('<img class="drawn-card">').attr('src', card.image).appendTo(cardsDiv);
        } catch (err) {
            console.log(err);
        }
    }



});