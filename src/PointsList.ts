import Game from "./Game";
import Map from "./Map";
import Points from "./Points";
import Vector2 from "./system/Vector2";
import GameObjectList from "./system/GameObjectList";

export default class PointsList extends GameObjectList {
    
  constructor(protected game: Game) {
    super();
  }

  addPoint(position: Vector2, val: number, map: Map) {
      var gameobject = new Points(this, position, val, this.game);
      this.gameObjects.push(gameobject);
      gameobject.parent = this;
  }

}
