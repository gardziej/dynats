import Vector2 from "./system/Vector2";
import sprites from "./system/Sprites";
import Game from "./Game";
import iSpriteData from "./system/interfaces/iSpriteData";

export default class DashBoard {

  blink: boolean = false;
  blinkCounter: number = 0;

  constructor(private game: Game) {
  }

  drawSteadyText(val: string, position: Vector2): void {
    this.game.canvas.drawText(val, position, Vector2.zero, "white", "right", "'Press Start 2P'", "20px");
  };

  drawBlinkingText(val: string, position: Vector2): void {
    if (this.blink) {
      this.game.canvas.drawText(val, position, Vector2.zero, "white", "right", "'Press Start 2P'", "20px");
    }
  };

  update(delta: number): void {
    this.blinkCounter += delta;
    if (this.blinkCounter > 0.2) {
      this.blink = !this.blink;
      this.blinkCounter = 0;
    }
  }

  draw(time: string, hiscore: string, score: string, lives: string, ending: boolean): void {
    this.game.canvas.drawImage(sprites.getSprite('dashboard'), Vector2.zero);
    this.drawSteadyText(score, new Vector2(300, 25));
    if (ending) {
      this.drawBlinkingText(time, new Vector2(470, 25));
    }
    else {
      this.drawSteadyText(time, new Vector2(470, 25));
    }
    this.drawSteadyText(lives, new Vector2(560, 25));
    this.drawSteadyText(hiscore, new Vector2(867, 25));
  }

}
