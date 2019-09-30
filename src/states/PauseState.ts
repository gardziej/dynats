import Vector2 from "../system/Vector2";
import BaseState from "../system/BaseState";
import Rectangle from "../system/Rectangle";
import sprites from "../system/Sprites";

export default class extends BaseState {

  public time: number = 2;
  public duration: number = 2;

  draw() {
    this.game.canvas.drawRectangle(0, 0, this.game.canvas.width, this.game.canvas.height, "black");
    this.game.canvas.drawText("pause", new Vector2(this.game.canvas.width / 2, 200), Vector2.zero, "white", "center", "'Press Start 2P'", "30px");
    this.game.canvas.drawText("(press ESC to exit)", new Vector2(this.game.canvas.width / 2, 90), Vector2.zero, "yellow", "center", "Verdana", "10px");
    this.game.canvas.drawImage(sprites.getSprite('keyboard'), Vector2.zero, 0, Vector2.zero, new Rectangle(0, 0, this.game.canvas.width, this.game.canvas.height));
  };

}
