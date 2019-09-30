import Tile from "../Tile";
import Game from "../Game";
import Vector2 from "../system/Vector2";
import sprites from "../system/Sprites";
import Animation from '../system/Animation';
import GridBonus from "../grids/GridBonus";

export default class TileBonus extends Tile {

  public exploded: boolean = false;
  public activ: boolean = false;
  public stage: string = "playing";

  constructor(
    public game: Game,
    public grid: GridBonus,
    public type: string,
    public position: Vector2,
    public coordinates: Vector2,
    public frame: number = 0,
    public bonus: string = null
  ) {
    super(game, type, position, coordinates, frame);
    this.animations.playing = new Animation(this.game, this, sprites.getSprite(this.bonus), true, 0.2, true, 0);
    this.animations.activ = new Animation(this.game, this, sprites.getSprite(this.bonus), true, 0.2);
    this.animations.explosion = new Animation(this.game, this, sprites.getSprite('explosion'), false, 0.05);
  }

  update(delta: number) {
    this.animations[this.stage].update(delta, this.position);
    if (this.activ) this.stage = 'activ';
    if (this.exploded) this.stage = 'explosion';
    if (this.animations[this.stage].isEnded) {
      this.grid.remove(this.coordinates.x, this.coordinates.y);
    }

  };

  explode() {
    this.exploded = true;
  };

  trigger() {
    if (!this.exploded) this.explode();
  };

}
