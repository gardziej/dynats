import Canvas from "./system/Canvas";
import Mouse from "./system/Mouse";
import sounds from "./system/Sounds";
import Keyboard from "./system/Keyboard";

export class Game {

  public canvas: Canvas;
  public mouse: Mouse;
  public keyboard: Keyboard;

  public constructor() {
    this.canvas = new Canvas('canvas', 'gameArea');
    this.mouse = new Mouse(this.canvas);
    this.keyboard = new Keyboard();
    this.loadSounds();
    requestAnimationFrame(() => { this.mainLoop() });
  }

  loadSounds(): void {
    sounds.load('explosion', 0.4, new Audio("assets/sounds/bomb.wav"));
    sounds.load('player_die', 0.8, new Audio("assets/sounds/dying.wav"));
    sounds.load('bonus', 0.6, new Audio("assets/sounds/bonus.wav"));
    sounds.load('hurryup', 1.0, new Audio("assets/sounds/hurryup.wav"));
    sounds.load('stage_start', 0.1, new Audio("assets/sounds/stage_start.wav"));
    sounds.load('player_win', 0.4, new Audio("assets/sounds/win.wav"));
    sounds.load('time_out', 0.4, new Audio("assets/sounds/time_out_10.wav"));
  };


	mainLoop(): void {
		const delta = 1 / 60;
    this.canvas.clear();
    this.keyboard.reset();
		requestAnimationFrame(() => {this.mainLoop()});
	};

}