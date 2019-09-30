import Vector2 from "../system/Vector2";
import Tile from "../Tile";
import Game from "../Game";
import GridBombs from "../grids/GridBombs";
import sprites from "../system/Sprites";
import Animation from '../system/Animation';
import sounds from "../system/Sounds";
import Rectangle from "../system/Rectangle";
import Player from "../Player";

export default class TileBomb extends Tile {

  private counter: number = 0;
  private frameTimeExpMax: number = 3;
  private frameExp: number = 3;
  private frameTimeExp: number = 1;
  private allowExp: number[] = [Infinity,Infinity,Infinity,Infinity, Infinity];
  private frameReverse = false;

  constructor(
    public game: Game,
    public grid: GridBombs,
    public type: string, 
    public position: Vector2, 
    public coordinates: Vector2, 
    public frame: number = 0,
    public player: Player, 
    public life: number, 
    public area: number
    ) {
    super(game, type, position, coordinates, frame);

    this.player = player;
    this.position = position;
    this.game.map.player.bombs.left--;
    this.life = life;
    this.area = area;
    this.exploded = false;
    this.animations.playing = new Animation(this.game, this, sprites.getSprite(this.type), true, 0.2);
  }

  draw() {
    Tile.prototype.draw.call(this);

    if (this.life === 0)
    {
      if (!this.exploded)
      {
        sounds.play('explosion');
      }
      this.explode();
    }
    else
    {
    this.life--;
    }
  }

  trigger() {
    if (!this.exploded)
      {
        this.explode();
        sounds.play('explosion');
      }
  }

  explode() {
    this.life = 0;
    this.exploded = true;

    if (this.allowExp[4])
      {
      this.game.map.makeFry(this.coordinates.x, this.coordinates.y);
      this.game.map.makeExploded(this.coordinates.x, this.coordinates.y);
      this.allowExp[4] = 0;
      }
    this.explodeDraw(24, this.grid.calculateTilePosition(this.coordinates.x, this.coordinates.y), this.frameExp);

    for (let i = 1; i <= this.area; i++)
    {
      if (i < this.allowExp[0])
      {
        if (this.game.map.isSolid(this.coordinates.x, this.coordinates.y-i))
        {
          this.game.map.makeExploded(this.coordinates.x, this.coordinates.y-i);
          this.allowExp[0] = i;
        }
        else
        {
          this.game.map.makeFry(this.coordinates.x, this.coordinates.y-i);
          if (i === this.area) this.explodeDraw(0, this.grid.calculateTilePosition(this.coordinates.x, this.coordinates.y-i), this.frameExp);
            else this.explodeDraw(16, this.grid.calculateTilePosition(this.coordinates.x, this.coordinates.y-i), this.frameExp);
        }
      }

      if (i < this.allowExp[1])
      {
        if (this.game.map.isSolid(this.coordinates.x+i, this.coordinates.y))
        {
          this.game.map.makeExploded(this.coordinates.x+i, this.coordinates.y);
          this.allowExp[1] = i;
        }
        else
        {
          this.game.map.makeFry(this.coordinates.x+i, this.coordinates.y);
          if (i === this.area) this.explodeDraw(4, this.grid.calculateTilePosition(this.coordinates.x+i, this.coordinates.y), this.frameExp);
            else this.explodeDraw(20, this.grid.calculateTilePosition(this.coordinates.x+i, this.coordinates.y), this.frameExp);
        }
      }

      if (i < this.allowExp[2])
      {
        if (this.game.map.isSolid(this.coordinates.x, this.coordinates.y+i))
        {
          this.game.map.makeExploded(this.coordinates.x, this.coordinates.y+i);
          this.allowExp[2] = i;
        }
        else
        {
          this.game.map.makeFry(this.coordinates.x, this.coordinates.y+i);
          if (i === this.area) this.explodeDraw(8, this.grid.calculateTilePosition(this.coordinates.x, this.coordinates.y+i), this.frameExp);
            else this.explodeDraw(16, this.grid.calculateTilePosition(this.coordinates.x, this.coordinates.y+i), this.frameExp);
        }
      }

      if (i < this.allowExp[3])
      {
        if (this.game.map.isSolid(this.coordinates.x-i, this.coordinates.y))
        {
          this.game.map.makeExploded(this.coordinates.x-i, this.coordinates.y);
          this.allowExp[3] = i;
        }
        else
        {
          this.game.map.makeFry(this.coordinates.x-i, this.coordinates.y);
          if (i === this.area) this.explodeDraw(12, this.grid.calculateTilePosition(this.coordinates.x-i, this.coordinates.y), this.frameExp);
            else this.explodeDraw(20, this.grid.calculateTilePosition(this.coordinates.x-i, this.coordinates.y), this.frameExp);
        }
      }

    }

    this.frameTimeExp--;
    if (this.frameTimeExp < 0)
      {
      this.frameTimeExp = this.frameTimeExpMax;

      if (this.frameExp <= 0)
        {
        this.frameReverse = true;
        }
      if (!this.frameReverse)
        {
        this.frameExp--;
        }
        else
        {
        this.frameExp++;
        }

      if (this.frameReverse === true && this.frameExp === 3)
        {
        this.grid.remove(this.coordinates.x, this.coordinates.y);
        this.game.map.player.bombs.left++;
        }
      }
  }

  explodeDraw(pos, position, frame) {
    this.game.canvas.drawImage(sprites.getSprite('explosion'), position, 0, Vector2.zero, new Rectangle((pos + frame) * Tile.size.width, 0, Tile.size.width, Tile.size.height));
  }

}
