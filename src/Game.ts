import Canvas from "./system/Canvas";
import Mouse from "./system/Mouse";
import sounds from "./system/Sounds";
import Keyboard from "./system/Keyboard";
import * as soundsData from './sounds.json';
import sprites from "./system/Sprites";
import * as spritesData from './sprites.json';
import Vector2 from "./system/Vector2";
import GameStateManager from "./system/GameStateManager";
import TitlePageState from "./states/TitlePageState";
import StageNumberState from "./states/StageNumberState";
import PlayingState from "./states/PlayingState";
import Map from './Map';
import Bonus from "./Bonus";
import GamePlayer from "./GamePlayer";
import DashBoard from "./DashBoard";

export default class Game {

  public canvas: Canvas;
  public mouse: Mouse;
  public keyboard: Keyboard;
  public gameStateManager: GameStateManager;
  public map: Map;
  public bonus: Bonus;
  public gamePlayer: GamePlayer = new GamePlayer();
  public dashboard: DashBoard;

  public constructor() {
    this.canvas = new Canvas('canvas', 'gameArea');
    this.mouse = new Mouse(this.canvas);
    this.keyboard = new Keyboard();
    sounds.loadSounds(soundsData);
    sprites.loadSprites(spritesData);
    this.assetLoadingLoop();
  }


  assetLoadingLoop(): void {
    this.canvas.clear();
    this.canvas.drawText('loading: ' + Math.round((sprites.totalSprites - sprites.spritesStillLoading) /
      sprites.totalSprites * 100) + "%", new Vector2(50, 50));
    if (sprites.spritesStillLoading > 0)
      requestAnimationFrame(() => { this.assetLoadingLoop() });
    else {
      this.initialize();
    }
  }

  initialize(): void {
    this.gameStateManager = new GameStateManager();
    this.gameStateManager.add('game_title_page', new TitlePageState(this), true);
    this.gameStateManager.add('stage_number', new StageNumberState(this));
    this.gameStateManager.add('game_state_playing', new PlayingState(this), true);
    // this.gameStateManager.add('game_over',      new GameOverState(this));
    // this.gameStateManager.add('game_pause',      new PauseState(this));
    // this.gameStateManager.add('hi_score',      new HiScore(this));
    this.gameStateManager.switchTo('game_title_page').reset();
    this.gameStateManager.switchTo('stage_number').reset();
    requestAnimationFrame(() => { this.mainLoop() });
  }

  mainLoop(): void {
    const delta = 1 / 60;
    this.gameStateManager.handleInput(delta);
    this.gameStateManager.update(delta);
    this.canvas.clear();
    this.gameStateManager.draw();
    this.keyboard.reset();
    requestAnimationFrame(() => { this.mainLoop() });
  }

}