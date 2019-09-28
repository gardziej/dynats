import Vector2 from "./system/Vector2";
import sprites from "./system/Sprites";
import iSpriteData from "./system/interfaces/iSpriteData";
import Animation from './system/Animation';
import Game from "./Game";
import iSpriteDataCollection from "./system/interfaces/iSpriteDataCollection";

export default class Tile {

  static size: any = {
    width: 48,
    height: 48
  };

  public animations: any = {};
  public stage: string = "playing";
  public exploded: boolean = false;
  
  constructor(
    public game: Game,
    public type: string, 
    public position: Vector2, 
    public coordinates: Vector2, 
    public frame: number = 0
    ) {
    this.animations.playing = new Animation(this.game, this, (<iSpriteDataCollection>sprites.data.tiles)[this.type] as iSpriteData, false, 0.2, true, this.frame, null);
  }

  update(delta: number): void {
    this.animations[this.stage].update(delta, this.position);
  };

  draw(delta: number): void {
    this.animations[this.stage].draw(delta);
  };

}
