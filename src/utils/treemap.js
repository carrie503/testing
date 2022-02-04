import { PowerSet } from "js-combinatorics";

const reducer = (previousValue, currentValue) =>
  previousValue + currentValue.weight;

export function generateTreemap(parsedJson, parsedRowNumber) {
  let numSum = 0;

  for (const node of parsedJson) {
    numSum += node.weight;
  }

  let weightJson = [...parsedJson];

  const treemap = [];

  for (let i = 0; i < parsedRowNumber; i++) {
    treemap[i] = [];
  }
  treemap[0].push(weightJson.shift());

  while (
    treemap[0].reduce(reducer, 0) * parsedRowNumber < numSum &&
    weightJson.length > 0
  ) {
    const lastItem = weightJson.pop();
    treemap[0].push(lastItem);
  }

  const widthWeight = treemap[0].reduce(reducer, 0);

  for (let i = 1; i < parsedRowNumber; i++) {
    const powerset = new PowerSet(weightJson);
    const combinations = [...powerset].filter(c => c.length > 0);
    const scores = {};
    for (const c of combinations) {
      let score = (c.reduce(reducer, 0) / widthWeight) * 100;
      if (score > 100) {
        score = 0;
      }
      if (!scores[score]) {
        scores[score] = [];
      }
      scores[score].push(c);
    }

    let highestScore = 0;
    for (const s in scores) {
      const currentScore = parseFloat(s);
      if (currentScore > highestScore) {
        highestScore = currentScore;
      }
    }

    if (scores[highestScore].length > 0 && highestScore > 0) {
      treemap[i] = scores[highestScore][0];

      for (const node of scores[highestScore][0]) {
        weightJson = weightJson.filter(w => w.name !== node.name);
      }
    }
  }

  return {
    widthWeight,
    treemap
  };
}
