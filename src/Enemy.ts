import Tile from "./Tile";
import Game from "./Game";
import myHelper from "./system/myHelper";
import Vector2 from "./system/Vector2";
import sprites from "./system/Sprites";
import Animation from "./system/Animation";
import Enemies from "./Enemies";
import iMoveableObject from "./system/interfaces/iMoveableObject";

export default class Enemy implements iMoveableObject {

  private startTile: Vector2;
  private direction: number;
  public speed: number;
  private width: number;
  private height: number;
  private velocity: Vector2;
  private stage: string;
  public tilePosition: any;
  private delayedWannaEatPlayer: boolean;
  private delayedWannaEatPlayerDelay: number;
  private delayedWannaEatPlayerDefault: number;
  private animations: any;
  public position: Vector2;
  public origin: Vector2;
  private canvasPosition: Vector2;

  public bonus: iEnemyBonus;

  constructor(private tile: Vector2, private game: Game, private parent: Enemies, private type: any) {
    this.startTile = tile;

    this.direction = myHelper.getRandomInt(0, 3);

    this.speed = Enemy.types[type].speed;
    this.bonus = Enemy.types[type].bonus;

    this.width = 48;
    this.height = 48;
    this.stage = 'playing';

    this.tilePosition = {
      xTile: this.startTile.x,
      yTile: this.startTile.y
    };

    this.delayedWannaEatPlayer = false;
    this.delayedWannaEatPlayerDelay = this.delayedWannaEatPlayerDefault = 5;

    this.velocity = Vector2.zero;
    this.reset();

    this.animations = {};

    this.animations.playing = new Animation(
      this.game, 
      this,
      sprites.getSprite('enemy', this.type),
      true, 
      0.2,
      false,
      null,
      null);

    this.animations.die = new Animation(
      this.game, 
      this, 
      sprites.getSprite('enemy', this.type, true), 
      false, 
      0.3,
      false,
      null,
      null);
  }

  reset() {
    this.position = new Vector2 (
      (this.startTile.x) * Tile.size.width,
      (this.startTile.y) * Tile.size.height
    );

    this.origin = new Vector2 (
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    this.canvasPosition = new Vector2 (
      this.position.x,
      this.position.y
    );
  };

  calculateOnTile() {
    let saveMargin = 0.2;

    this.tilePosition = {
      xTile: 0,
      yTile: 0,
      top: false,
      right: false,
      bottom: false,
      left: false,
      v: false,
      h: false,
      center: false,
      topFrame: false,
      rightFrame: false,
      bottomFrame: false,
      leftFrame: false
    };

    let orgX = this.origin.x / Tile.size.width;
    let orgY = this.origin.y / Tile.size.height;

    let xTile = Math.floor(orgX);
    let yTile = Math.floor(orgY);

    this.tilePosition.x = xTile * Tile.size.width;
    this.tilePosition.y = yTile * Tile.size.height;

    this.tilePosition.xTile = xTile;
    this.tilePosition.yTile = yTile;

    if (orgX < xTile + 0.5) this.tilePosition.left = true;
    else if (orgX > xTile + 0.5) this.tilePosition.right = true;
    else this.tilePosition.h = true;

    if (orgY < yTile + 0.5) this.tilePosition.top = true;
    else if (orgY > yTile + 0.5) this.tilePosition.bottom = true;
    else this.tilePosition.v = true;

    if (orgX < xTile + saveMargin) this.tilePosition.leftFrame = true;
    else if (orgX > xTile + 1 - saveMargin) this.tilePosition.rightFrame = true;
    else if (orgY < yTile + saveMargin) this.tilePosition.topFrame = true;
    else if (orgY > yTile + 1 - saveMargin) this.tilePosition.bottomFrame = true;

    if (this.tilePosition.h && this.tilePosition.v) this.tilePosition.center = true;
  };


  checkImpact(x: number, y: number) {
    if ((x === this.tilePosition.xTile && y === this.tilePosition.yTile) ||
      (x - 1 === this.tilePosition.xTile && y === this.tilePosition.yTile && this.tilePosition.rightFrame) ||
      (x + 1 === this.tilePosition.xTile && y === this.tilePosition.yTile && this.tilePosition.leftFrame) ||
      (x === this.tilePosition.xTile && y - 1 === this.tilePosition.yTile && this.tilePosition.bottomFrame) ||
      (x === this.tilePosition.xTile && y + 1 === this.tilePosition.yTile && this.tilePosition.topFrame))
      return true;
    return false;
  };

  die(x: number, y: number) {
    this.stage = 'die';
  };

  isSolidForEnemy(x: number, y: number) {
    let test;
    if (this.bonus.brick_pass === true && this.bonus.bomb_pass === true) {
      test = this.game.map.checkTile(x, y);
      if (test.walls || test.steel) return true;
      else return false;
    }
    else if (this.bonus.brick_pass === true) {
      test = this.game.map.checkTile(x, y);
      if (test.walls || test.steel || test.bomb) return true;
      else return false;
    }
    else if (this.bonus.bomb_pass === true) {
      test = this.game.map.checkTile(x, y);
      if (test.walls || test.steel || test.brick) return true;
      else return false;
    }
    else {
      return this.game.map.isSolid(x, y);
    }
  };

  adjustEnemyPosition() {
    this.calculateOnTile();
    this.velocity = Vector2.zero;
    this.position = new Vector2 (
      (this.tilePosition.x),
      (this.tilePosition.y)
    );
    this.origin = new Vector2 (
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    this.canvasPosition = new Vector2 (
      this.position.x,
      this.position.y
    );
  };

  changeDirection(newDirection: number) {
    this.adjustEnemyPosition();
    this.direction = newDirection;
  };

  checkForCrossRoad() {
    let x = this.tilePosition.xTile;
    let y = this.tilePosition.yTile;
    let roads = [];
    let level;
    let path;
    let directionToPlayer;
    let roadToPlayer;
    if (!this.isSolidForEnemy(x + 1, y)) roads.push(1);
    if (!this.isSolidForEnemy(x - 1, y)) roads.push(3);
    if (!this.isSolidForEnemy(x, y + 1)) roads.push(2);
    if (!this.isSolidForEnemy(x, y - 1)) roads.push(0);

    if (this.bonus.goForPlayer) {
      level = 'floor';
      if (this.bonus.brick_pass) level = 'air';
      path = this.game.map.findRoadtoTarget(this, x, y, level);
      if (path.arr && path.arr.length > 1) {
        directionToPlayer = {
          x: path.arr[1][0],
          y: path.arr[1][1]
        };

        if (directionToPlayer.x < x) roadToPlayer = 3;
        if (directionToPlayer.x > x) roadToPlayer = 1;
        if (directionToPlayer.y > y) roadToPlayer = 2;
        if (directionToPlayer.y < y) roadToPlayer = 0;
        if (roads.indexOf(roadToPlayer) >= 0) {
          return roadToPlayer;
        }
      }
    }
    else if (this.bonus.goForPlayerInView) {
      level = 'floor';
      if (this.bonus.brick_pass) level = 'air';
      path = this.game.map.findRoadtoTarget(this.game.map.player, x, y, level);
      if (path.arr && path.arr.length > 1 && path.inView) {
        directionToPlayer = {
          x: path.arr[1][0],
          y: path.arr[1][1]
        };

        if (directionToPlayer.x < x) roadToPlayer = 3;
        if (directionToPlayer.x > x) roadToPlayer = 1;
        if (directionToPlayer.y > y) roadToPlayer = 2;
        if (directionToPlayer.y < y) roadToPlayer = 0;
        if (roads.indexOf(roadToPlayer) >= 0) {
          return roadToPlayer;
        }
      }
    }
    else {
      if (roads.indexOf(this.direction) >= 0 && roads.length > 1) {
        let wannaChangeDirection = myHelper.getRandomInt(0, 9);
        if (wannaChangeDirection < this.bonus.roadChanging) return this.direction;
      }
    }
    roads = myHelper.shuffleArray(roads);
    return roads[0];
  };

  delayedGoForPlayer(delay: number) {
    this.delayedWannaEatPlayer = true;
    this.delayedWannaEatPlayerDelay = delay;
  };


  moving(delta: number) {
    if (this.delayedWannaEatPlayer) {
      this.delayedWannaEatPlayerDelay -= delta;
      if (this.delayedWannaEatPlayerDelay <= 0) {
        this.delayedWannaEatPlayer = false;
        this.bonus.goForPlayer = true;
        this.delayedWannaEatPlayerDelay = this.delayedWannaEatPlayerDefault;
      }
    }

    this.calculateOnTile();

    this.velocity = Vector2.zero;
    let x = this.tilePosition.xTile;
    let y = this.tilePosition.yTile;


    if (this.tilePosition.center) {
      let crossRoadCheck = this.checkForCrossRoad();
      this.changeDirection(crossRoadCheck);
    }

    if (this.direction === 1) {
      this.velocity.x = this.speed;
    }
    else if (this.direction === 3) {
      this.velocity.x = -this.speed;
    }
    else if (this.direction === 0) {
      this.velocity.y = -this.speed;
    }
    else if (this.direction === 2) {
      this.velocity.y = this.speed;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.origin = new Vector2 (
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
  };

  update(delta: number) {
    if (this.stage === 'playing') this.moving(delta);
    this.animations[this.stage].update(delta, new Vector2(this.game.map.x + this.position.x, this.game.map.y + this.position.y));
    if (this.animations[this.stage].isEnded) {
      this.game.map.addPoints(new Vector2(this.position.x, this.position.y), Enemy.types[this.type].points);
      this.parent.remove(this);
    }
  };

  draw(delta: number) {
    this.animations[this.stage].draw(delta);
  };

  static types: iEnemies = {
    priest: { speed: 1, minMap: 1, maxMap: 20, points: 100, prob: 9, bonus: { roadChanging: 3 } },
    frog: { speed: 2, minMap: 1, maxMap: 40, points: 1000, prob: 5, bonus: { roadChanging: 6 } },
    diamond: { speed: 2, minMap: 8, maxMap: -1, points: 200, prob: 2, bonus: { roadChanging: 9, brick_pass: true } },
    bear: { speed: 3, minMap: 11, maxMap: 70, points: 2000, prob: 4, bonus: { roadChanging: 3, goForPlayer: true } },
    broom: { speed: 2, minMap: 1, maxMap: -1, points: 600, prob: 4, bonus: { roadChanging: 4, goForPlayerInView: true } },
    drop: { speed: 1, minMap: 2, maxMap: 10, points: 400, prob: 3, bonus: { roadChanging: 2 } },
    droplet: { speed: 2, minMap: 3, maxMap: 30, points: 800, prob: 2, bonus: { roadChanging: 6 } },
    fire: { speed: 3, minMap: 9, maxMap: 50, points: 1200, prob: 1, bonus: { roadChanging: 6, brick_pass: true } },
    ghost: { speed: 1, minMap: 1, maxMap: 50, points: 1800, prob: 1, bonus: { roadChanging: 6, brick_pass: true, goForPlayer: true } }
  };
}

interface iEnemies {
  [index: string]: iEnemy;
}

interface iEnemy {
  speed: number;
  minMap: number;
  maxMap: number;
  points: number;
  prob: number;
  bonus: iEnemyBonus;
}

interface iEnemyBonus {
  roadChanging: number;
  brick_pass?: boolean;
  bomb_pass?: boolean;
  goForPlayer?: boolean;
  goForPlayerInView?: boolean;
}