import GameObjectList from "./system/GameObjectList";
import Vector2 from "./system/Vector2";
import Game from "./Game";
import myHelper from "./system/myHelper";
import Enemy from "./Enemy";


export default class Enemies extends GameObjectList {

  private exitExplodedTrigger: number = .6;
  private exitExplodedTriggerTime: number = .6;
  private makeExitExploded: boolean = false;
  private exitPosition: Vector2 = Vector2.zero;

  constructor(protected game: Game) {
    super();
    this.exitPosition = null;
  }

  isOnTile(x: number, y: number) {
    for (var i in this.gameObjects) {
      if (typeof this.gameObjects[i] !== "undefined" && this.gameObjects[i].checkImpact(x, y) && this.gameObjects[i].stage === 'playing') {
        return true;
      }
    }
    return false;
  }

  exitExploded(exitPosition: Vector2) {
    this.exitPosition = exitPosition;
    this.makeExitExploded = true;
  };

  exitExplodedMake() {
    var i = 12;
    while (i) {
      var x = this.exitPosition.x;
      var y = this.exitPosition.y;
      var newPosition = new Vector2 (
        myHelper.getRandomInt(this.exitPosition.x - 3, this.exitPosition.x + 3),
        myHelper.getRandomInt(this.exitPosition.y - 3, this.exitPosition.y + 3)
      );
      if (!this.game.map.isSolid(newPosition.x, newPosition.y)) {
        var enemy = new Enemy(newPosition, this.game, this, 'fire');
        enemy.bonus.goForPlayer = false;
        enemy.delayedGoForPlayer(5);
        enemy.speed = 6;
        this.add(enemy);
        i--;
      }
    }
    this.exitExplodedTrigger = this.exitExplodedTriggerTime;
    this.makeExitExploded = false;
  };

  update(delta: number) {
    if (this.makeExitExploded) {
      this.exitExplodedTrigger -= delta;
    }

    if (this.exitExplodedTrigger <= 0) {
      this.exitExplodedMake();
    }

    for (var i in this.gameObjects) {
      this.gameObjects[i].update(delta);
    }
  };

  get countAlive() {
    var alives = 0;
    for (var i in this.gameObjects) {
      if (this.gameObjects[i].stage === 'playing') alives++;
    }
    return alives;
  }

  checkImpact(x: number, y: number) {
    for (var i in this.gameObjects) {
      if (typeof this.gameObjects[i] !== "undefined" && this.gameObjects[i].checkImpact(x, y) && this.gameObjects[i].stage === 'playing') {
        this.gameObjects[i].die();
      }
    }
  }

}
