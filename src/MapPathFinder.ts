import Map from './Map';
import * as PF from 'pathfinding';
import Vector2 from './system/Vector2';

export default class MapPathFinder {

  public pfGrid: any;

  constructor(public map: Map, public w: number, public h: number) {
    this.pfGrid = {
      floor: new PF.Grid(this.w, this.h),
      air: new PF.Grid(this.w, this.h)
    };
  }

  findWay = function (a: Vector2, b: Vector2, level: string) {
    var finder = new PF.AStarFinder();
    var grid = this.pfGrid[level].clone();
    var path = finder.findPath(a.x, a.y, b.x, b.y, grid);
    if (path.length > 0)
      return path;
    else return false;
  }


  setWalkableAt = function (x: number, y: number, level: string, type: boolean) {
    if (typeof type === "undefined") type = false;
    this.pfGrid[level].setWalkableAt(x, y, type);
  }

  draw(level: number): void {
    /*
    for(var i = 0; i < this.w; i++)
    {
      for(var j = 0; j < this.h; j++)
      {
        if (this.pfGrid[level].isWalkableAt(i,j))
          canvas.drawRectangle(this.parent.x + i * Tile.size.width, this.parent.y + j * Tile.size.height, Tile.size.width, Tile.size.height, "yellow");
      }
    }

    var path = this.findWay(new Vector2(1,1), new Vector2(17,9), level);
    if (path) for (var v in path)
      {
        canvas.drawRectangle(this.parent.x + path[v][0] * Tile.size.width, this.parent.y + path[v][1] * Tile.size.height, Tile.size.width, Tile.size.height, "rgba(255,0,0,0.5)");
      }
    */
  }

}