// src/utils/shuffle.js
/**
 * Fisher–Yates (Durstenfeld) shuffle - pure function.
 * Returns a new array shuffled from the input.
 *
 * Important: does not mutate the original array.
 */
export function shuffle(array) {
  const arr = array.slice(); // copy
  for (let i = arr.length - 1; i > 0; i--) {
    // Pick a random index from 0..i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
