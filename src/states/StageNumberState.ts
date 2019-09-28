import BaseState from "../system/BaseState";
import sounds from "../system/Sounds";
import Vector2 from "../system/Vector2";
import Map from '../Map';
import Bonus from "../Bonus";
import DashBoard from "../DashBoard";
import myHelper from "../system/myHelper";
import Enemy from "../Enemy";

export default class StageNumberState extends BaseState {

  duration: number = 2;
  time = this.duration;

  update(delta: number): void {
    this.time -= delta;
    if (this.time < 0) {
      this.game.gameStateManager.switchTo('game_state_playing');
      sounds.play('stage_start');
      this.time = this.duration;
    }
  }

  draw(): void {
    this.game.canvas.drawRectangle(0, 0, this.game.canvas.width, this.game.canvas.height, "black");
    this.game.canvas.drawText("stage: ", new Vector2(this.game.canvas.width / 2, this.game.canvas.height / 2), Vector2.zero, "#f6ed26", "center", "'Press Start 2P'", "20px");
  }

  reset(): void {
    const bonuses = 4;
    const mapSize = {
      x: 10,
      y: 10
    };
    // const mapSize = {
    //   x: 6 + this.game.gamePlayer.map + myHelper.getRandomInt(5, 10),
    //   y: 6 + this.game.gamePlayer.map + myHelper.getRandomInt(0, 5),
    // };

    const enemiesCount: number = mapSize.x * mapSize.y / 15;
    const enemiesList: any = [];

    while (enemiesList.length <= enemiesCount) {
      var chosenEnemy = myHelper.pickRandomProperty(Enemy.types);
      if (Enemy.types[chosenEnemy].minMap <= this.game.gamePlayer.map &&
        ((Enemy.types[chosenEnemy].maxMap >= this.game.gamePlayer.map && Enemy.types[chosenEnemy].maxMap > 0) || Enemy.types[chosenEnemy].maxMap === -1) &&
        myHelper.getRandomInt(0, 9) < Enemy.types[chosenEnemy].prob)
        enemiesList.push(chosenEnemy);
    }

    this.game.gamePlayer.time = mapSize.x * mapSize.y / 2;
    if (this.game.gamePlayer.time > 600) this.game.gamePlayer.time = 599;
    const bricksCount = mapSize.x * mapSize.y / 5;

  //   if (bricksCount < bonuses) bricksCount = bonuses;

    this.game.bonus = new Bonus(this.game.gamePlayer, bonuses);
    this.game.dashboard = new DashBoard(this.game);

    this.game.map = new Map(mapSize.x, mapSize.y, bricksCount, enemiesList, this.game);
    this.game.map.init();

  }

}
