//generators
import {
  gameState,
  HAND_SIZE,
  InitialLetters,
  LettersArray,
  letters,
  gameTime,
} from "../types/gameTypes";
import { v6 as uuidv6 } from "uuid";
import { Socket } from "../types/types";
import { generateGuestId } from "./misc";

export const generateGameState = (socket: Socket, _socket: Socket) => {
  const letterPool = generateLetterPool(letters);
  const emptyLetterIds = generateEmptyLetterIdsArray(letterPool);
  const playersStatus = generatePlayersStatus(letterPool);
  const players = [
    {
      hand: playersStatus.players[0],
      username: socket.user?.name || generateGuestId(),
      email: socket.user?.email,
      turn: playersStatus.startingPlayer === 1,
      id: socket.sessionId,
      score: 0,
      closedPassCount: 0,
      timer: gameTime,
    },
    {
      hand: playersStatus.players[1],
      username: _socket.user?.name || generateGuestId(),
      email: _socket.user?.email,
      turn: playersStatus.startingPlayer === 2,
      id: _socket.sessionId,
      score: 0,
      closedPassCount: 0,
      timer: gameTime,
    },
  ];
  const roomId = uuidv6();
  _socket.roomId = roomId;
  socket.roomId = roomId;

  _socket.join(roomId);
  socket.join(roomId);
  console.log("Game found", roomId);
  const state: gameState = {
    status: "playing",
    players,
    undrawnLetterPool: playersStatus.undrawnletterPool,
    roomId,
    passCount: 0,
    emptyLetterIds,
    board: Array.from({ length: 15 }, () => Array(15).fill(null)),
    history: [],
  };
  return state;
};

export const generateEmptyLetterIdsArray = (
  letterPool: LettersArray
): string[] => {
  return letterPool
    .filter((letter) => letter.letter === "") // Find letters with an empty `letter` property
    .map((letter) => letter.id); // Return an array of their `id`s
};

export const generateLetterPool = (array: InitialLetters[]): LettersArray => {
  let newArr: LettersArray = [];

  array.forEach((letter) => {
    for (let i = 0; i < letter.amount; i++) {
      newArr.push({ ...letter, drawn: false, id: uuidv6() });
    }
  });
  return newArr;
};

export const generatePlayersStatus = (letterPool: LettersArray) => {
  const players: LettersArray[] = [[], []]; // Two players

  // Distribute letters, one by one to each player until both have HAND_SIZE tiles
  for (let i = 0; i < HAND_SIZE; i++) {
    players.forEach((player) => {
      let drawn = false;
      while (!drawn) {
        const randomIndex = Math.floor(Math.random() * letterPool.length);
        const letter = letterPool[randomIndex];
        if (!letter.drawn) {
          player.push(letter);
          letterPool[randomIndex].drawn = true;
          drawn = true;
        }
      }
    });
  }

  const undrawnletterPool = letterPool.filter((letter) => !letter.drawn);

  // Function to get the index of the first matching letter in the 'letters' array
  const getLetterIndex = (letter: string) => {
    const index = letters.findIndex((item) => item.letter === letter);
    return index !== -1 ? index : Infinity; // this should never return infinity since each
  };

  const getPlayersClosest = (player: LettersArray) =>
    player.reduce(
      (closest, letter) =>
        getLetterIndex(letter.letter) < getLetterIndex(closest.letter)
          ? letter
          : closest,
      player[0]
    );

  // Get the closest letter to "A" for each player
  const player1Closest = getPlayersClosest(players[0]);

  const player2Closest = getPlayersClosest(players[1]);

  // Determine who starts
  let startingPlayer;
  if (
    getLetterIndex(player1Closest.letter) <
    getLetterIndex(player2Closest.letter)
  ) {
    startingPlayer = 1; // Player 1 starts
  } else if (
    getLetterIndex(player1Closest.letter) >
    getLetterIndex(player2Closest.letter)
  ) {
    startingPlayer = 2; // Player 2 starts
  } else {
    startingPlayer = Math.random() < 0.5 ? 1 : 2; // 50-50 if the closest letters are equal
  }

  return {
    players,
    startingPlayer,
    undrawnletterPool,
  };
};
