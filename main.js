$(function() {
  // $.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',[deck_count]);

  var suits = ["\u2660", "\u2663", "\u2665", "\u2666"];
  var cards = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

  var deck = [];

  var resetDeck = function() {
    for (i = 0; i < 52; i++) {
      deck[i] = false;
    }
  };

  function Card(cardNum) {
    var suit = Math.floor(cardNum / 13);
    var number = cardNum % 13;
    var index = cardNum;
    this.getSuit = function() {
      return suits[suit];
    };
    this.getCard = function() {
      return cards[number];
    };
    this.getName = function() {
      return this.getCard() + " of " + this.getSuit();
    };
    this.getIndex = function() {
      return index;
    };
    this.getValue = function() {
      if (number === 0) {
        return 11;
      } else if (number > 9) {
        return 10;
      } else {
        return number + 1;
      }
    };
  }

  var deal = function() {
    var used = true;
    var cardNum;
    while (used === true) {
      cardNum = Math.floor(Math.random() * 52);
      used = deck[cardNum];
    }
    var myCard = new Card(cardNum);
    deck[cardNum] = true;
    return myCard;
  };

  function Hand() {
    var cards = [];
    cards[0] = deal();
    cards[1] = deal();
    this.score = function() {
      var aces = 0,
        temp = 0;
      for (var i = 0; i < cards.length; i++) {
        aces += (cards[i].getCard() === "Ace") ? 1 : 0;
        temp += cards[i].getValue();
      }
      while (temp > 21 && aces > 0) {
        temp -= 10;
        aces--;
      }
      return temp;
    };
    this.printHand = function() {
      var handString = "",
        rx, sx;
      for (var i = 0; i < cards.length; i++) {
        if (i > 0) {
          handString += ", ";
        }
        handString += cards[i].getName();
      }
      return handString;
    };
    this.hitMe = function() {
      if (this.score() < 21) {
        cards.push(deal());
      }
    };
  }
  var playAsUser = function() {
    var userHand = new Hand();
    var hit = userHand.score() < 21;
    while (hit && userHand.score() < 21) {
      hit = confirm(userHand.printHand() + " Hit or stand?");
      if (hit) {
        userHand.hitMe();
      }
    }
    return userHand;
  };
  var playAsDealer = function() {
    var dealerHand = new Hand();
    while (dealerHand.score() < 17) {
      dealerHand.hitMe();
    }
    return dealerHand;
  };
  var declareWinner = function(userHand, dealerHand) {
    var u = userHand.score();
    var d = dealerHand.score();
    console.log("Player: " + u + "\nDealer: " + d);
    if (u === d) {
      return "You pushed!";
    } else if (u > 21 || (u < d && d <= 21)) {
      return "You lose!";
    } else {
      return "You win!";
    }
  };
  var player, dealer, ready;
  var playGame = function() {
    resetDeck();
    player = playAsUser();
    dealer = playAsDealer();
    console.log("Player: " + player.printHand() + "\nDealer: " + dealer.printHand());
    console.log(declareWinner(player, dealer));
  };
  do {
    ready = confirm("Ready?");
    if (ready) {
      playGame();
    }
  } while (ready);
})
