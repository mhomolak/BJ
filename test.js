$(function() {

  var playerHand = [];
  var dealerHand = [];

  $.getJSON('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(data) {
  var deckId = data.deck_id;
  var handScores = {"dealerHandValue": 0, "playerHandValue": 0};
  var cardValues = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "JACK": 10,
    "QUEEN": 10,
    "KING": 10,
    "ACE": 11,
  }

  var showPlayerCard = function (card) {
    console.log('showPlayercard', card);
    $('.Player').append('<img src="' + card.image + '"/>');
  }

  var showDealerCard = function (card) {
    console.log('showDealercard', card);
    $('.Dealer').append('<img src="' + card.image + '"/>');
  }

  var draw = {
    cards: function (cardQuantity) {
      console.log('cardQuantity', cardQuantity);
      return $.getJSON('http://deckofcardsapi.com/api/deck/'+ deckId +'/draw/?count=' + cardQuantity).then(function (data) {
        return data.cards;
      });
    }
  }

  function updateHandValue(currentHand, whichHand){
    handScores[whichHand] = 0;

    currentHand.forEach(function (card) {
      // TODO Add logic for Ace valuation based on the hand score
      // You might want to use the array.sort() method to rearrange the array and look at the ace value last.
      if(handScores['playerHandValue'] > 21) {
        cardValues['ACE'] -= 10;
      }

      handScores[whichHand] += cardValues[card.value];
    })
  }

    $('.hitButton').on('click', function() {
      draw.cards(1).done(function (newCard) {
        playerHand.push(newCard[0]);
        updateHandValue(playerHand, "playerHandValue");
        showPlayerCard(newCard[0]);
        $('.playerScore').text(handScores['playerHandValue']);
        if(handScores["playerHandValue"] > 21) {
          $('.winner').text("Dealer Wins!");
          $('.hitButton').hide();
          $('.newGame').show();
        }
      });
    });

    $('.standButton').on('click', function() {
      console.log('dh in click', dealerHand);
      playAsDealer(dealerHand, true);
      $('.hitButton').hide();
      $('.newGame').show();
    });
  var playAsDealer = function(dealerHand, check) {
    console.log(handScores['dealerHandValue']);

    if(handScores['dealerHandValue'] < 17) {
      dealerHit()
    }
    else {
      declareWinner();
    }
  }

  var dealerHit = function() {
    draw.cards(1).done(function (newCard) {
      dealerHand.push(newCard[0]);
      updateHandValue(dealerHand, "dealerHandValue");
      showDealerCard(newCard[0]);
      $('.dealerScore').text(handScores['dealerHandValue']);
      playAsDealer();
    });
  };
  function declareWinner() {
    var p = handScores['playerHandValue'];
    var d = handScores['dealerHandValue'];
    if (p === d) {
      $('.winner').text("PUSH!");
    } else if (p > 21) {
      $('.winner').text("Dealer Wins!");
    } else if (p < d && d <= 21) {
      $('.winner').text("Dealer Wins!");
    } else {
      $('.winner').text("Player Wins!");
    }
  };
  $('.newGame').on('click', function() {
    $('.winner').text("Good Luck!");
    $('.newGame').hide();
    $('.hitButton').show();
    playGame();
  })

  function playGame() {
    playerHand = [];
    dealerHand = [];
    $('.dealerScore').text(0);

    $('img').remove();
    draw.cards(3).done(function (cards) {
      playerHand.push(cards[0], cards[1]);
      updateHandValue(playerHand, "playerHandValue");
      $('.playerScore').text(handScores['playerHandValue']);
      showPlayerCard(cards[0]);
      showPlayerCard(cards[1]);
      dealerHand.push(cards[2]);
      updateHandValue(dealerHand, "dealerHandValue");
      $('.dealerScore').text(handScores['dealerHandValue']);
      showDealerCard(cards[2]);
    });
  };
})
})