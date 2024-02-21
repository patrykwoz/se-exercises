$(document).ready(function() {
    console.log('hi from cards.js');
    var cardsDiv = $('<div>').attr('id', 'cards').appendTo('body');

    var baseUrl = 'http://deckofcardsapi.com/api/deck';
    var deckId;

    var twoCards = [];

    var deckPromise = axios.get(baseUrl + '/new/shuffle/');

    deckPromise
        .then(function(response) {
            deckId = response.data.deck_id;
            return axios.get(baseUrl + '/' + deckId + '/draw/?count=1');
        })
        .then(function(response) {
            twoCards.push(response.data.cards[0]);
            return axios.get(baseUrl + '/' + deckId + '/draw/?count=1');
        })
        .then(function(response) {
            twoCards.push(response.data.cards[0]);
            twoCards.forEach(function(card){
                console.log(card.code, card.suit, card.value);
            });
            $('<h2>').text('Two Cards').appendTo(cardsDiv);
            twoCards.forEach(function(card) {
                $('<img>').attr('src', card.image).appendTo(cardsDiv);
            });
            
        })
        .catch(function(err) {
            console.log(err);
        });
    
    var drawBtn = $('<button>').text('Draw').appendTo(cardsDiv);

    drawBtn.click(function() {
        axios
            .get(baseUrl + '/' + deckId + '/draw/?count=1')
            .then(function(response) {
                var card = response.data.cards[0];
                $('<img class="drawn-card">').attr('src', card.image).appendTo(cardsDiv);
            })
            .catch(function(err) {
                console.log(err);
            });
    });



});