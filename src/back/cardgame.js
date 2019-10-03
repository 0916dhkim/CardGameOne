function createCard (suit, rank) {
  return { suit: suit, rank: rank }
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
  ret.push(createCard('jocker'))
  ret.push(createCard('jocker'))
  ret = ret.concat(createSuit('hearts'), createSuit('diamonds'), createSuit('clubs'), createSuit('spades'))

  return ret
}

function rankToInt (rank) {
  switch (rank) {
    case '2':
      return 2
    case '3':
      return 3
    case '4':
      return 4
    case '5':
      return 5
    case '6':
      return 6
    case '7':
      return 7
    case '8':
      return 8
    case '9':
      return 9
    case '10':
      return 10
    case 'J':
      return 11
    case 'Q':
      return 12
    case 'K':
      return 13
    case 'A':
      return 14
    default:
      // Should not be reachable
      return -1
  }
}

exports.getNextPlayer = function (game) {
  var playerNames = game.players.keys()
  var currentPlayerIndex = playerNames.indexOf(game.currentPlayer)
  if (currentPlayerIndex === -1) {
    // If the current player is not found,
    // return the first in the player array
    return playerNames[0]
  } else {
    return playerNames[(currentPlayerIndex + 1) % playerNames.length]
  }
}

exports.addPlayer = function (game, playerId) {
  game.players[playerId] = {
    hand: [],
    laidTop: [],
    laidBottom: []
  }
}

exports.createGame = function () {
  var ret = {}
  ret.deck = createDeck()
  ret.stack = []

  // Players object holds player id as key and corresponding hand as value.
  ret.players = {}
  ret.currentPlayer = ''

  return ret
}

exports.beginGame = function (game) {
  var i
  // Shuffle deck.
  const numShuffle = 200
  for (i = 0; i < numShuffle; i++) {
    var num1 = Math.floor(Math.random() * game.deck.length)
    var num2 = Math.floor(Math.random() * game.deck.length)

    var temp = game.deck[num1]
    game.deck[num1] = game.deck[num2]
    game.deck[num2] = temp
  }

  for (var player in game.players) {
    // Lay down bottom layer.
    for (i = 0; i < 3; i++) {
      game.players[player].laidBottom.push(game.deck.pop())
    }

    // Deal hands
    for (i = 0; i < 10; i++) {
      game.players[player].hand.push(game.deck.pop())
    }
  }
  // TODO Determine initial player
}

// Attempt to place cardsToPlay on top of the stack.
// If the move is valid, remove cards from the current player's hand
// and push cards to the stack.
// Return true if the move was successful.
// Return false otherwise.
exports.playTurn = function (game, cardsToPlay, jockerAs) {
  var c

  // Update jocker ranks
  for (c in cardsToPlay) {
    if (c.suit === 'jocker') {
      c.rank = jockerAs
    }
  }

  // Check if the cards to play have the same rank.
  var rank
  for (c in cardsToPlay) {
    if (rank === undefined) {
      rank = c.rank
    } else if (rank !== c.rank) {
      // Cannot play the given cards
      // because they are not of a kind
      // nor jocker.
      return false
    }
  }

  // Check if the current player actually has the cards.
  for (c in cardsToPlay) {
    if (!game.players[game.currentPlayer].hand.includes(c)) {
      // Player does not have one of the cards.
      return false
    }
  }

  // Check if the cards can be placed on top of stack
  // according to the rules
  var topCardInt = rankToInt(game.stack[game.stack.length - 1].rank)
  if (topCardInt === 7) {
    if (topCardInt < rankToInt(cardsToPlay[0].rank)) {
      // Only cards with rank lower than or equal to 7
      // can be placed on top of 7
      return false
    }
  } else {
    if (topCardInt > rankToInt(cardsToPlay[0].rank)) {
      // If the top card of the stack is not 7,
      // only cards with rank higher than or equal to
      // the top card's rank can be placed.
      return false
    }
  }

  // At this point, cards can be played.

  // Remove cards from the players hand.
  game.players[game.currentPlayer].hand.filter((card) => !cardsToPlay.includes(card))
  // Push cards on top of the stack.
  for (c in cardsToPlay) {
    game.stack.push(c)
  }

  // If the played cards were 10s,
  // discard the stack
  game.stack = []

  return true
}

exports.getClientGame = function (game, playerId) {
  var ret = {}
  ret.stack = game.stack

  // Only reveal number of cards in opponents' hand to client
  ret.players = {}
  for (var player in game.players) {
    ret.players[player] = {
      numHand: game.players[player].hand.length,
      hasLaidTop: !(game.players[player].laidTop.length === 0),
      numLaidBottom: game.players[player].laidBottom.length
    }
  }

  ret.currentPlayerIndex = game.currentPlayerIndex

  return ret
}
