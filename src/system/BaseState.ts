import Game from "../Game";

export default abstract class {
  initialize(): void {};
  handleInput(delta: number): void {};
  update(delta: number): void {};
  draw(): void {};
  reset(): void {};
  type: string;

  constructor(public game: Game) {
  }

}