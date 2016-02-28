$(function() {
  function Card(s, n){
     var suit = s;
     this.getSuit = function(){
         if(suit === 1){
             return "Hearts";
         }
         if(suit === 2){
             return "Clubs";
         }
         if(suit === 3){
             return "Diamonds";
         }
         if(suit === 4){
             return "Spades"
         }
     };
     var number = n;
     this.getNumber = function(){
         switch(n){
             case 11:
             actualCard = "Jack";
             break;

             case 12:
             actualCard = "Queen";
             break;

             case 13:
             actualCard = "King";
             break;

             case 1:
             actualCard = "Ace";
             break;

             default:
             actualCard = n;
             break;
         }
         //console.log("number is " + n);
         return actualCard;
     };
     this.getValue = function(){
         if (number > 10){
             return 10;
         }
         else if (number === 1){
             return 11;
         }
         else {
         return number;
         }
     };
  }

  function deal(){
     suit = Math.floor(Math.random()*4+1);
     number = Math.floor(Math.random()*13+1);
     return new Card(suit, number);
  }

  function Hand(){
     var holding = [];
     holding[0] = deal();
     holding[1] = deal();
     this.getHand = function(){
         //console.log(holding);
         return holding;
     };
     this.score = function(){
         var sum = 0;
         var ace = 0;
         for (i=0; i<holding.length; i++){
            sum += holding[i].getValue();
            if(holding[i].getValue() === 11)
              ace++;
            while(sum > 21 && ace > 0) {
                sum -= 10;
                ace--;
            }
         }
         //console.log("sum = " + sum);
         return sum;
     };
     this.printHand = function(){
         var pHand = "";
         for(i=0; i< holding.length; i++){
             pHand += holding[i].getNumber() + " of " + holding[i].getSuit() +", ";
         }
         return pHand;
     };
     this.hitMe = function(){
         card = deal();
         holding.push(card);
         /*console.log("Your hand is now "+ this.printHand() +
         " and your score is now " + this.score());*/
     }
  }
}
var newDeal = new Hand();
console.log("Your hand is " + newDeal.printHand());
console.log("Your score is " + newDeal.score());
newDeal.hitMe();
console.log("Your hand is now "+ newDeal.printHand() +
         " and your score is now " + newDeal.score());
