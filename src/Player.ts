import Vector2 from "./system/Vector2";
import Map from './Map';
import GamePlayer from "./GamePlayer";
import Animation from "./system/Animation";

import iTilePosition from "./system/interfaces/iTilePosition";
import sprites from "./system/Sprites";
import Tile from "./Tile";
import sounds from "./system/Sounds";
import Key from "./system/Key";
import Game from "./Game";

export default class Player {

  public tilePosition: iTilePosition = { xTile: 1, yTile: 1 };
  public leaveTilePosition: iTilePosition = { xTile: 1, yTile: 1 };
  private width: number = 52;
  private height: number = 63;
  private direction: number = 2;
  public stage: string = 'playing';
  private moving: boolean = false;
  private lastMoveH: boolean = true;
  private velocity: Vector2 = Vector2.zero;
  private animations: any = {};
  public position: Vector2;
  public origin: Vector2;
  public canvasPosition: Vector2;
  public vestTimer: number;
  public vestTimerMax: number;
  public winCutPosition: number;
  public speed: number = 0;
  public lives: number = 0;
  private currentAnimation: string;
  public bonus: any;
  public bombs: any;

  constructor(public startTile: Vector2, public game: Game, public gamePlayer: GamePlayer) {

    this.updateFromGamePlayer();

    this.reset();

    this.animations.idleUp = new Animation(this.game, this, sprites.getSprite('player', 'idle'), false, 0.2, true, 0);
    this.animations.idleRight = new Animation(this.game, this, sprites.getSprite('player', 'idle'), false, 0.2, true, 1);
    this.animations.idleDown = new Animation(this.game, this, sprites.getSprite('player', 'idle'), false, 0.2, true, 2);
    this.animations.idleLeft = new Animation(this.game, this, sprites.getSprite('player', 'idle'), false, 0.2, true, 3);

    this.animations.whiteUp = new Animation(this.game, this, sprites.getSprite('player', 'white'), false, 0.2, true, 0);
    this.animations.whiteRight = new Animation(this.game, this, sprites.getSprite('player', 'white'), false, 0.2, true, 1);
    this.animations.whiteDown = new Animation(this.game, this, sprites.getSprite('player', 'white'), false, 0.2, true, 2);
    this.animations.whiteLeft = new Animation(this.game, this, sprites.getSprite('player', 'white'), false, 0.2, true, 3);

    this.animations.walkingUp = new Animation(this.game, this, sprites.getSprite('player', 'walking'), true, 0.1, false, null, [0, 3]);
    this.animations.walkingRight = new Animation(this.game, this, sprites.getSprite('player', 'walking'), true, 0.1, false, null, [4, 7]);
    this.animations.walkingDown = new Animation(this.game, this, sprites.getSprite('player', 'walking'), true, 0.1, false, null, [8, 11]);
    this.animations.walkingLeft = new Animation(this.game, this, sprites.getSprite('player', 'walking'), true, 0.1, false, null, [12, 15]);

    this.animations.die = new Animation(this.game, this, sprites.getSprite('player', 'die'), false, 0.15, false);
    this.animations.win = new Animation(this.game, this, sprites.getSprite('player', 'idle'), true, 0.15, false);
    this.animations.stars = new Animation(this.game, this, sprites.getSprite('player', 'stars'), true, 0.15, false);

    this.winCutPosition = 0;
    this.vestTimer = 0;
    this.vestTimerMax = 10;

    this.currentAnimation = 'idleDown';

    this.reset();

  }

  updateFromGamePlayer() {
    this.speed = this.gamePlayer.playerSpeed;
    this.lives = this.gamePlayer.lives;
    this.bombs = {
      area: this.gamePlayer.bombs.area,
      count: this.gamePlayer.bombs.count,
      life: this.gamePlayer.bombs.life
    };
    this.bonus = this.gamePlayer.bonus;
    this.bombs.left = this.bombs.count;
    this.bombs.life = this.bombs.life + this.bombs.area * 10;
    if (this.bonus.detonator) this.bombs.life = Infinity;
  };

  activateBrickPass() {
    this.gamePlayer.bonus.brick_pass = true;
    this.updateFromGamePlayer();
  };

  activateBombPass() {
    this.gamePlayer.bonus.bomb_pass = true;
    this.updateFromGamePlayer();
  };

  activateDetonator() {
    this.gamePlayer.bonus.detonator = true;
    this.updateFromGamePlayer();
  };

  activateVest() {
    this.gamePlayer.bonus.vest = true;
    this.vestTimer = this.vestTimerMax;
    this.updateFromGamePlayer();
  };

  increaseNrOfBombs() {
    this.gamePlayer.bombs.count++;
    this.updateFromGamePlayer();
  };

  increaseFlames() {
    this.gamePlayer.bombs.area++;
    this.updateFromGamePlayer();
  };

  increaseSpeed() {
    this.gamePlayer.speedUp();
    this.adjustPlayerPosition();
    this.updateFromGamePlayer();
    return this.speed;
  };

  adjustPlayerPosition() {
    this.calculateOnTile();
    this.velocity = Vector2.zero;
    this.position = new Vector2(
      (this.tilePosition.x) + Tile.size.width / 2 - this.width / 2,
      (this.tilePosition.y) + Tile.size.height / 2 - this.height / 2
    );
    this.origin = new Vector2(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    this.canvasPosition = new Vector2(
      this.position.x,
      this.position.y
    );
  };

  increaseLives() {
    this.gamePlayer.lives++;
    this.updateFromGamePlayer();
  };

  reset() {
    this.position = new Vector2(
      (this.startTile.x) * Tile.size.width + Tile.size.width / 2 - this.width / 2,
      (this.startTile.y) * Tile.size.height + Tile.size.height / 2 - this.height / 2
    );

    this.origin = new Vector2(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    this.canvasPosition = new Vector2(
      this.position.x,
      this.position.y
    );
  };

  checkImpact(xTile: number, yTile: number) {
    if ((xTile === this.tilePosition.xTile && yTile === this.tilePosition.yTile) ||
      (xTile - 1 === this.tilePosition.xTile && yTile === this.tilePosition.yTile && this.tilePosition.rightFrame) ||
      (xTile + 1 === this.tilePosition.xTile && yTile === this.tilePosition.yTile && this.tilePosition.leftFrame) ||
      (xTile === this.tilePosition.xTile && yTile - 1 === this.tilePosition.yTile && this.tilePosition.bottomFrame) ||
      (xTile === this.tilePosition.xTile && yTile + 1 === this.tilePosition.yTile && this.tilePosition.topFrame)) {
      return true;
    }
    return false;
  };

  die() {
    this.stage = 'die';
    sounds.play('player_die');
  };

  win() {
    this.stage = 'win';
    sounds.play('player_win');
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

    if (typeof this.leaveTilePosition === "undefined") {
      this.leaveTilePosition = {
        xTile: this.tilePosition.xTile,
        yTile: this.tilePosition.yTile
      };
    }

  };

  isSolidForPlayer(x: number, y: number) {
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

  update(delta: number) {
    this.calculateOnTile();
    this.velocity = Vector2.zero;

    if (this.stage === "playing")
      this.handleInput();

    this.game.map.checkForEnemies(this.tilePosition.xTile, this.tilePosition.yTile);

    if (this.leaveTilePosition.xTile != this.tilePosition.xTile) {
      this.lastMoveH = true;
      this.game.map.checkBonus(this.tilePosition.xTile, this.tilePosition.yTile);
    }
    else if (this.leaveTilePosition.yTile != this.tilePosition.yTile) {
      this.lastMoveH = false;
      this.game.map.checkBonus(this.tilePosition.xTile, this.tilePosition.yTile);
    }

    if (this.tilePosition.h && this.tilePosition.v) {
      this.lastMoveH = !this.lastMoveH;
    }

    if (this.leaveTilePosition.xTile != this.tilePosition.xTile ||
      this.leaveTilePosition.yTile != this.tilePosition.yTile) {
      this.leaveTilePosition.xTile = this.tilePosition.xTile;
      this.leaveTilePosition.yTile = this.tilePosition.yTile;
    }

    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
      if (this.lastMoveH) {
        this.velocity.y = 0;
      }
      else {
        this.velocity.x = 0;
      }
    }

    if (this.velocity.x > 0) { this.direction = 1; this.moving = true; }
    else if (this.velocity.x < 0) { this.direction = 3; this.moving = true; }
    else if (this.velocity.y > 0) { this.direction = 2; this.moving = true; }
    else if (this.velocity.y < 0) { this.direction = 0; this.moving = true; }
    else { this.moving = false; }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.origin = new Vector2(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    if (this.bonus.vest) {
      if (this.vestTimer >= 0)
        this.vestTimer -= delta;
      if (this.vestTimer < 0)
        this.bonus.vest = false;
    }

    if (this.stage === 'playing') {
      if (this.moving === false) {
        switch (this.direction) {
          case 0:
            this.currentAnimation = 'idleUp';
            break;
          case 1:
            this.currentAnimation = 'idleRight';
            break;
          case 2:
            this.currentAnimation = 'idleDown';
            break;
          case 3:
            this.currentAnimation = 'idleLeft';
            break;
        }
      }
      else {
        switch (this.direction) {
          case 0:
            this.currentAnimation = 'walkingUp';
            break;
          case 1:
            this.currentAnimation = 'walkingRight';
            break;
          case 2:
            this.currentAnimation = 'walkingDown';
            break;
          case 3:
            this.currentAnimation = 'walkingLeft';
            break;
        }
      }

      if (this.vestTimer > 0 && Math.floor(this.vestTimer * 10) % 3 == 0) {
        switch (this.direction) {
          case 0:
            this.currentAnimation = 'whiteUp';
            break;
          case 1:
            this.currentAnimation = 'whiteRight';
            break;
          case 2:
            this.currentAnimation = 'whiteDown';
            break;
          case 3:
            this.currentAnimation = 'whiteLeft';
            break;
        }
      }


      this.animations[this.currentAnimation].update(delta, new Vector2(this.game.map.x + this.position.x, this.game.map.y + this.position.y));
    }
    else if (this.stage === 'win') {
      this.currentAnimation = 'win';
      this.winCutPosition = this.winCutPosition < this.height - 1 ? this.winCutPosition += (delta * 30) : this.height - 2;
      this.animations[this.currentAnimation].update(delta, new Vector2(this.game.map.x + this.position.x, this.game.map.y + this.position.y + this.winCutPosition), [0, this.winCutPosition, 0, -this.winCutPosition]);
      this.animations.stars.update(delta, new Vector2(this.game.map.x + this.position.x - 16, this.game.map.y + this.position.y - 30 + this.winCutPosition));

    }
    else if (this.stage === 'die') {
      this.currentAnimation = 'die';
      if (this.animations[this.currentAnimation].isEnded) {
        this.game.map.die("die");
      }
      this.animations[this.currentAnimation].update(delta, new Vector2(this.game.map.x + this.position.x - 10, this.game.map.y + this.position.y));
    }
  };

  draw() {
    if (this.stage === 'playing') {
      this.animations[this.currentAnimation].draw();
    }
    else if (this.stage === 'win') {
      this.animations[this.currentAnimation].draw();
      this.animations.stars.draw();
    }
    else if (this.stage === 'die') {
      this.animations[this.currentAnimation].draw();
    }

  };



  handleInput() {
    if (this.game.keyboard.down(Key.space)) {
      if (this.bombs.left > 0) {
        this.game.map.addBomb(this.tilePosition.xTile, this.tilePosition.yTile, this, this.bombs.life, this.bombs.area);
      }
    }

    if (this.game.keyboard.down(Key.B) && this.bonus.detonator) {
      this.game.map.activateBombs();
    }

    if (this.game.keyboard.down(Key.left) && !this.game.keyboard.down(Key.right)) {
      if (this.tilePosition.v &&
        ((!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) ||
          (this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) && this.tilePosition.right)))
      ) {
        this.velocity.x = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) && this.tilePosition.bottom) {
        if (this.velocity.y === 0) this.velocity.y = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) && this.tilePosition.top) {
        if (this.velocity.y === 0) this.velocity.y = this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile - 1) && this.tilePosition.top) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) && this.tilePosition.bottom)
      ) {
        if (this.velocity.y === 0) this.velocity.y = -this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile + 1) && this.tilePosition.bottom) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile) && this.tilePosition.top)
      ) {
        if (this.velocity.y === 0) this.velocity.y = this.speed;
      }

    }
    if (this.game.keyboard.down(Key.right) && !this.game.keyboard.down(Key.left)) {
      if (this.tilePosition.v &&
        ((!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) ||
          (this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) && this.tilePosition.left)))
      ) {
        this.velocity.x = this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) && this.tilePosition.bottom) {
        if (this.velocity.y === 0) this.velocity.y = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) && this.tilePosition.top) {
        if (this.velocity.y === 0) this.velocity.y = this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile - 1) && this.tilePosition.top) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) && this.tilePosition.bottom)
      ) {
        if (this.velocity.y === 0) this.velocity.y = -this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile + 1) && this.tilePosition.bottom) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile) && this.tilePosition.top)
      ) {
        if (this.velocity.y === 0) this.velocity.y = this.speed;
      }
    }

    if (this.game.keyboard.down(Key.up) && !this.game.keyboard.down(Key.down)) {
      if (this.tilePosition.h &&
        ((!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) ||
          (this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) && this.tilePosition.bottom)))
      ) {
        this.velocity.y = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) && this.tilePosition.right) {
        if (this.velocity.x === 0) this.velocity.x = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) && this.tilePosition.left) {
        if (this.velocity.x === 0) this.velocity.x = this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile - 1) && this.tilePosition.left) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) && this.tilePosition.right)
      ) {
        if (this.velocity.x === 0) this.velocity.x = -this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile - 1) && this.tilePosition.left) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile - 1) && this.tilePosition.right)
      ) {
        if (this.velocity.x === 0) this.velocity.x = this.speed;
      }
    }
    if (this.game.keyboard.down(Key.down) && !this.game.keyboard.down(Key.up)) {
      if (this.tilePosition.h &&
        ((!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) ||
          (this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) && this.tilePosition.top)))
      ) {
        this.velocity.y = this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) && this.tilePosition.right) {
        if (this.velocity.x === 0) this.velocity.x = -this.speed;
      }
      else if (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) && this.tilePosition.left) {
        if (this.velocity.x === 0) this.velocity.x = this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile - 1, this.tilePosition.yTile + 1) && this.tilePosition.left) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) && this.tilePosition.right)
      ) {
        if (this.velocity.x === 0) this.velocity.x = -this.speed;
      }
      else if (
        (!this.isSolidForPlayer(this.tilePosition.xTile, this.tilePosition.yTile + 1) && this.tilePosition.left) ||
        (!this.isSolidForPlayer(this.tilePosition.xTile + 1, this.tilePosition.yTile + 1) && this.tilePosition.right)
      ) {
        if (this.velocity.x === 0) this.velocity.x = this.speed;
      }
    }
  };

}
