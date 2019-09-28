import { iGameStateCollection } from "./interfaces/iGameStateCollection";
import BaseState from "./BaseState";

export default class GameStateManager {

  gameStates: iGameStateCollection = {};
  currentGameState: BaseState;
  lastGameStateId: string;
  currentGameStateId: string;
  lastMasterStateId: string;

  add(id: string, gamestate: BaseState, master: boolean = false): void {
    this.gameStates[id] = gamestate;
    if (master === true) {
      this.gameStates[id].type = 'master';
    }
    this.currentGameState = gamestate;
    this.currentGameStateId = id;
  }

  switchTo(id: string) {
    if (typeof this.gameStates[id] !== "undefined") {
      this.currentGameState = this.gameStates[id];
      if (this.currentGameStateId !== id) {
        this.lastGameStateId = this.currentGameStateId;
      }
      this.currentGameStateId = id;
      if (this.gameStates[id].type === "master") {
        this.lastMasterStateId = id;
      }
      return this;
    }
  }

  escape(): void {
    if (this.lastMasterStateId !== null)
      this.switchTo(this.lastMasterStateId);
  }

  getCurrentGameStateId(): string {
    if (this.currentGameStateId !== null)
      return this.currentGameStateId;
    return undefined;
  }

  getLastMasterStateId(): string {
    if (this.lastMasterStateId !== null)
      return this.lastMasterStateId;
    return undefined;
  }

  handleInput(delta: number): void {
    if (this.currentGameState !== null)
      this.currentGameState.handleInput(delta);
  }

  update(delta: number): void {
    if (this.currentGameState !== null)
      this.currentGameState.update(delta);
  }

  draw(): void {
    if (this.currentGameState !== null)
      this.currentGameState.draw();
  }

  reset(): void {
    if (this.currentGameState !== null)
      this.currentGameState.reset();
  }

}
