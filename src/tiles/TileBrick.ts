import Tile from "../Tile";
import Game from "../Game";
import Vector2 from "../system/Vector2";
import sprites from "../system/Sprites";
import iSpriteDataCollection from "../system/interfaces/iSpriteDataCollection";
import Animation from '../system/Animation';
import iSpriteData from "../system/interfaces/iSpriteData";
import GridBricks from "../grids/GridBricks";

export default class TileBrick extends Tile {

  public exploded = false;
  public onBonus = false;
  public onExit = false;
  public sparky = false;

  constructor(
    public game: Game,
    public grid: GridBricks,
    public type: string, 
    public position: Vector2, 
    public coordinates: Vector2, 
    public frame: number = 0
    ) {
    super(game, type, position, coordinates, frame);

    this.animations.sparky = new Animation(this.game, this, (sprites.data.tiles as iSpriteDataCollection).brick_sparky as iSpriteData, true, 0.3);
    this.animations.explosion = new Animation(this.game, this, (sprites.data.tiles as iSpriteDataCollection).brick_explosion as iSpriteData, false, 0.05);
  }

  update(delta: number): void {
    this.animations[this.stage].update(delta, this.position);

    if (!this.exploded)
      {
        if (this.sparky)
          {
          this.stage = "sparky";
          }
      }
      else
      {
        this.stage = "explosion";

      }

    if (this.animations[this.stage].isEnded)
      {
        this.grid.remove(this.coordinates.x, this.coordinates.y);
      }
  };

  explode(): void {
    this.exploded = true;
  };

  trigger(): void {
    if (!this.exploded) this.explode();
  };

}
