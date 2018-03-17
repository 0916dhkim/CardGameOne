function createCard (suit, rank) {
  return {suit: suit, rank: rank}
}

function createSuit (suit) {
  var ret = []
  for (var i = 2; i <= 10; i++) {
    ret.push(createCard(suit, i.toString()))
  }
  ret.push(createCard(suit, 'J'))
  ret.push(createCard(suit, 'Q'))
  ret.push(createCard(suit, 'K'))
  ret.push(createCard(suit, 'A'))

  return ret
}
function createDeck () {
  var ret = []
  ret.push(createCard('joker', ''))
  ret.push(createCard('joker', ''))
  ret = ret.concat(createSuit('hearts'), createSuit('diamonds'), createSuit('clubs'), createSuit('spades'))

  return ret
}

export var createGame = function () {
  // TODO create game object and return.
  return {}
}
