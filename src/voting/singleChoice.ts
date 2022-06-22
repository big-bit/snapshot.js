import { SingleChoiceVote, Strategy } from './types';

export function isChoiceValid(
  vote: SingleChoiceVote,
  choices: string[]
): boolean {
  return (
    typeof vote.choice === 'number' && choices?.[vote.choice - 1] !== undefined
  );
}

export default class SingleChoiceVoting {
  proposal: { choices: string[] };
  votes: SingleChoiceVote[];
  strategies: Strategy[];
  selected: number;

  constructor(
    proposal: { choices: string[] },
    votes: SingleChoiceVote[],
    strategies: Strategy[],
    selected: number
  ) {
    this.proposal = proposal;
    this.votes = votes;
    this.strategies = strategies;
    this.selected = selected;
  }

  getValidatedVotes(): SingleChoiceVote[] {
    return this.votes.filter((vote) =>
      isChoiceValid(vote, this.proposal.choices)
    );
  }

  getScores(): number[] {
    return this.proposal.choices.map((choice, i) => {
      const votes = this.getValidatedVotes().filter(
        (vote) => vote.choice === i + 1
      );
      const balanceSum = votes.reduce((a, b) => a + b.balance, 0);
      return balanceSum;
    });
  }

  getScoresByStrategy(): number[][] {
    return this.proposal.choices.map((choice, i) => {
      const scores = this.strategies.map((strategy, sI) => {
        const votes = this.getValidatedVotes().filter(
          (vote) => vote.choice === i + 1
        );
        const scoreSum = votes.reduce((a, b) => a + b.scores[sI], 0);
        return scoreSum;
      });
      return scores;
    });
  }

  getScoresTotal(): number {
    return this.getValidatedVotes().reduce((a, b) => a + b.balance, 0);
  }

  getChoiceString(): string {
    return this.proposal.choices[this.selected - 1];
  }
}
