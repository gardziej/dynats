import Game from "../Game";
import Key from "../system/Key";
import sprites from "../system/Sprites";
import Vector2 from "../system/Vector2";
import Rectangle from "../system/Rectangle";
import iSpriteData from "../system/interfaces/iSpriteData";
import BaseState from "../system/BaseState";
import GamePlayer from "../GamePlayer";

export default class TitlePageState extends BaseState {

  handleInput(delta: number): void {
    if (this.game.keyboard.pressed(Key.space)) {
      this.game.gameStateManager.switchTo('stage_number').reset();
    }
  };

  draw() {
    this.game.canvas.drawImage(sprites.getSprite('start_panel'), Vector2.zero, 0, Vector2.zero, new Rectangle(0, 0, this.game.canvas.width, this.game.canvas.height));
    this.game.canvas.drawImage(sprites.getSprite('keyboard'), Vector2.zero, 0, Vector2.zero, new Rectangle(0, 0, this.game.canvas.width, this.game.canvas.height));
  };

}
