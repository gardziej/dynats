import Grid from "../Grid";
import Vector2 from "../system/Vector2";
import TileBrick from "../tiles/TileBrick";

export default class GridBricks extends Grid {

  public level: number = 1;
  public type: string = 'brick';
  public tiles: TileBrick[] = [];

  makeSparky() {
    for (var i in this.tiles) {
      if (this.tiles[i].onBonus) {
        if (!this.tiles[i].onExit)
          this.tiles[i].sparky = true;
      }
    }
  };

  add(x: number, y: number) {
    var gameobject = null;
    if (!this.check(x, y)) {
      gameobject = new TileBrick(this.game, this, this.type, this.calculateTilePosition(x, y), new Vector2(x, y));
      this.grid[y * this.cols + x] = 1;
      this.tiles[y * this.cols + x] = gameobject;
      this.count++;
    }
    this.addToPfGrid(x, y);
    return gameobject;
  };

  explode = function (x: number, y: number) {
    this.tiles[y * this.cols + x].trigger();
  };

}
