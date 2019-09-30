import BaseState from "../system/BaseState";
import sprites from "../system/Sprites";
import iSpriteData from "../system/interfaces/iSpriteData";
import Vector2 from "../system/Vector2";
import Rectangle from "../system/Rectangle";

export default class PlayingState extends BaseState {

  update(delta: number): void {
    this.game.dashboard.update(delta);
    this.game.map.update(delta);
  }

  draw(): void {
    this.game.canvas.drawImage(sprites.getSprite('background'), Vector2.zero, 0, Vector2.zero, new Rectangle(0, 0, this.game.canvas.width, this.game.canvas.height));
    this.game.map.draw();
    this.game.dashboard.draw(
      this.game.map.timer.toString(), 
      String(this.game.gamePlayer.hiscore), 
      String(this.game.gamePlayer.score), 
      String(this.game.gamePlayer.lives), 
      this.game.map.timer.ending
    );
  }


}
