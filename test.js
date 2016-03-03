$(function() {

  localStorage.PlayerWins = 0;
  localStorage.DealerWins = 0;

  function scoreTally() {
    if ($('.winner').text() === "Player Wins!") {
      localStorage.PlayerWins++;
    } else if ($('.winner').text() === "Dealer Wins!") {
      localStorage.DealerWins++;
    } else {
      console.log("Push!");
    }
  };

  var playerHand = [];
  var dealerHand = [];

  $.getJSON('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6', function(data) {
      var deckId = data.deck_id;
      var handScores = {
        "dealerHandValue": 0,
        "playerHandValue": 0
      };
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

    var showPlayerCard = function(card) {
      console.log('showPlayercard', card);
      $('.Player').append('<img src="' + card.image + '"/>');
    }
    var showDealerCard = function(card) {
      console.log('showDealercard', card);
      $('.Dealer').append('<img src="' + card.image + '"/>');
    }

    var draw = {
      cards: function(cardQuantity) {
        console.log('cardQuantity', cardQuantity);
        return $.getJSON('http://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=' + cardQuantity).then(function(data) {
          return data.cards;
        });
      }
    }

    function updateHandValue(currentHand, whichHand) {
      handScores[whichHand] = 0;
      var aceCount = 0;

      currentHand.forEach(function(card) {
        if(card.value === 'ACE'){
          aceCount++;
        }
        handScores[whichHand] += cardValues[card.value];
      })

      if(aceCount > 0 && handScores[whichHand] > 21) {
        handScores[whichHand] -= 10;
      }
      if(aceCount > 1 && handScores[whichHand] > 21) {
        handScores[whichHand] -= 10;
        aceCount--;
      }
    }

    $('.hitButton').on('click', function() {
      draw.cards(1).done(function(newCard) {
        playerHand.push(newCard[0]);
        updateHandValue(playerHand, "playerHandValue");
        showPlayerCard(newCard[0]);
        $('.playerScore').text(handScores['playerHandValue']);
        if (handScores["playerHandValue"] > 21) {
          $('.winner').text("Dealer Wins!");
          $('.hitButton').hide();
          $('.standButton').hide();
          $('.newGame').show();
        }
      });
    });

    $('.standButton').on('click', function() {
      playAsDealer(dealerHand, true);
      $('.hitButton').hide();
      $('.standButton').hide();
      $('.newGame').show();
    });
    var playAsDealer = function(dealerHand, check) {

      if (handScores['dealerHandValue'] < 17 && handScores['dealerHandValue'] != 21) {
        dealerHit()
      } else {
        declareWinner();
      }
    }

    var dealerHit = function() {
      draw.cards(1).done(function(newCard) {
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
      } else if (p < d && d <= 21) {
        $('.winner').text("Dealer Wins!");
      } else {
        $('.winner').text("Player Wins!");
      }
    };

    $('.newGame').on('click', function() {
      scoreTally();
      $('.winner').text("Good Luck!");
      $('.newGame').hide();
      $('.hitButton').show();
      $('.standButton').show();
      playGame();
    })

    function playGame() {
      playerHand = [];
      dealerHand = [];
      $('.dealerScore').text(0);
      $('img').remove();
      draw.cards(3).done(function(cards) {
        playerHand.push(cards[0], cards[1]);
        updateHandValue(playerHand, "playerHandValue");
        if(handScores['playerHandValue'] === 21) {
          $('.winner').text("Player Wins!");
          $('.hitButton').hide();
          $('.standButton').hide();
          $('.newGame').show();
        }
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
