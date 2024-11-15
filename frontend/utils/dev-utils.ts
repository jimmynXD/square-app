import { faker } from '@faker-js/faker';

export function generateRandomPlayers(numCells: number) {
  const players = [];
  let remainingCells = numCells;

  while (remainingCells > 0) {
    const randomName = faker.person.fullName();
    // Assign 1-5 squares to each person, but no more than remaining cells
    const maxCount = Math.min(
      remainingCells,
      Math.floor(Math.random() * 5) + 1
    );

    players.push({
      name: randomName,
      count: maxCount,
    });

    remainingCells -= maxCount;
  }

  return players;
}
