import Vector2 from "./system/Vector2";
import Map from "./Map";
import PointsList from "./PointsList";
import Game from "./Game";

export default class Points {
  
  public delay: number = 0;
  public life: number = 2;
  public visible: boolean = false;
  public parent: PointsList;

constructor(
  public pointsList: PointsList, 
  public position: Vector2, 
  public val: number, 
  public game: Game
  ) {

    }

  update(delta: number): void {
    this.delay -= delta;
    if (this.delay <= 0)
      {
      this.life -= delta;
      this.visible = true;
      }
    if (this.life <= 0) { this.pointsList.remove(this); }
  };

  draw(): void {
    if (this.visible)
      this.game.canvas.drawText(String(this.val), new Vector2 (this.game.map.x + this.position.x, this.game.map.y + this.position.y), Vector2.zero, "white", "center", "Verdana", "22px bold");
  };

}
