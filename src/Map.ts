import Game from "./Game";
import levels from "./Levels";
import Tile from "./Tile";
import GridGrass from "./grids/GridGrass";
import GridWalls from "./grids/GridWalls";
import MapPathFinder from "./MapPathFinder";
import GridSteel from "./grids/GridSteel";
import GridBricks from "./grids/GridBricks";
import myHelper from "./system/myHelper";
import MapTimer from "./MapTimer";
import PointsList from "./PointsList";
import Vector2 from "./system/Vector2";
import Enemies from "./Enemies";
import Enemy from "./Enemy";
import iMoveableObject from "./system/interfaces/iMoveableObject";
import GridBonus from "./grids/GridBonus";
import Player from "./Player";
import GridBombs from "./grids/GridBombs";
import sounds from "./system/Sounds";

export default class Map {

  public stage: number = 1;
  public width: number;
  public height: number;
  public grid: any = {};
  public level = levels[0].map;
  public exitWasJustExploded: boolean = false;
  public mapBigerThenCanvas: any;
  public black: number = 1;
  public x: number = 0;
  public y: number = 0;
  public timer: MapTimer;
  public pfGrid: any;
  public player: Player;


  public enemies: Enemies = new Enemies(this.game);
  public pointsList: PointsList = new PointsList(this.game);


  constructor(public w: number, public h: number, public bricksCount: number, public enemiesList: Enemy[], public game: Game) {
    if (this.w % 2 === 0) {
      this.w++;
    }
    if (this.h % 2 === 0) {
      this.h++;
    }
    this.grid.size = {
      width: this.w,
      height: this.h
    };

    this.width = this.grid.size.width * Tile.size.width;
    this.height = this.grid.size.height * Tile.size.height;

    this.mapBigerThenCanvas = {
      x: this.width > this.game.canvas.width,
      y: this.height > this.game.canvas.height - 70
    };
  }


  init(): void {
    this.timer = new MapTimer(this.game.gamePlayer.time, this);
    this.makePFs();
    this.makeGrass();
    this.makeWalls();
    this.makeBonus();
    this.makeBombs();
    this.makeSteel();
    this.makeBrick(this.bricksCount);
    this.makePlayer();
    this.makeEnemies();
    this.timer.init();
  };

  makePFs(): void {
    this.pfGrid = new MapPathFinder(this, this.w, this.h);
  };

  makeGrass(): void {
    this.grid.grass = new GridGrass(this.game, this.grid.size.width, this.grid.size.height);
    this.grid.grass.fill();
  };

  makeWalls(): void {
    this.grid.walls = new GridWalls(this.game, this.grid.size.width, this.grid.size.height);
    this.grid.walls.fill();
  };

  makeBonus(): void {
    this.grid.bonus = new GridBonus(this.game, this.grid.size.width, this.grid.size.height);
  };

  makeBombs(): void {
    this.grid.bombs = new GridBombs(this.game, this.grid.size.width, this.grid.size.height);
  };

  makeSteel(): void {
    this.grid.steel = new GridSteel(this.game, this.grid.size.width, this.grid.size.height);
    this.grid.steel.fill();
  };

  makeBrick(count: number): void {
    this.grid.brick = new GridBricks(this.game, this.grid.size.width, this.grid.size.height);
    let x = 0;
    let y = 0;
    if (count < this.game.bonus.left) count = this.game.bonus.left;
    while (this.grid.brick.count < count) {
      x = myHelper.getRandomInt(1, this.grid.size.width - 2);
      y = myHelper.getRandomInt(1, this.grid.size.height - 2);
      if (!this.isSolid(x, y) && x + y > 3) {
        let gameobject = this.grid.brick.add(x, y);
        let bonus = this.game.bonus.getOne();
        if (bonus) {
          this.grid.bonus.addBonus(x,y,2,bonus);
          gameobject.onBonus = true;
          if (bonus === 'exit') gameobject.onExit = true;
        }
      }
    }

  }

  die(type: string): void {
    this.game.restartMap(type);
  };

  makePlayer() {
    this.player = new Player(new Vector2(1,1), this.game, this.game.gamePlayer);
  };

  makeEnemies() {
    this.enemies = new Enemies(this.game);
    let x = 0;
    let y = 0;
    while (this.enemies.count < this.enemiesList.length) {
      x = myHelper.getRandomInt(1, this.grid.size.width - 2);
      y = myHelper.getRandomInt(1, this.grid.size.height - 2);
      if (!this.isSolid(x, y) && x + y > 6) {
        this.enemies.add(new Enemy(new Vector2(x, y), this.game, this.enemies, this.enemiesList[0]));
        this.enemiesList.shift();
      }
    }
  };

  addBomb(x: number, y: number, player: Player, life: number, area: number) {
    if (!this.isSolid(x,y))
    {
      this.grid.bombs.addBomb(x,y, player, life, area);
    }
  };

  addPoints(position: Vector2, val: number) {
    position = new Vector2(
      position.x + Tile.size.width / 2,
      position.y + Tile.size.height / 2 - 10
    );
    this.game.gamePlayer.updateScore(val);
    this.pointsList.addPoint(position, val, this);
  };

  tileInMap(x: number, y: number): boolean {
    return x > 0 && y > 0 && x < this.grid.size.width && y < this.grid.size.height;
  }

  isSolid(x: number, y: number): boolean {
    return !this.tileInMap(x, y) ||
      this.grid.walls.check(x, y) ||
      this.grid.steel.check(x, y) ||
      this.grid.brick.check(x, y) ||
      this.grid.bombs.check(x,y);
  };

  checkTile(x: number, y: number) {
    const test: any = {
      walls: this.grid.walls.check(x, y) || false,
      steel: this.grid.steel.check(x, y),
      brick: this.grid.brick.check(x, y),
      bomb: this.grid.bombs.check(x, y),
      bonus: this.grid.bonus.check(x, y),
      bonusType: null,
      bonusActiv: null,
      isSolid: false
    };
    if (test.bonus) {
      test.bonusType = this.grid.bonus.typeOfBonus(x,y);
      test.bonusActiv = this.grid.bonus.bonusActiv(x,y);
    }
    if (test.walls || test.steel || test.brick || test.bomb) test.isSolid = true;
    return test;
  };

  checkForEnemies(x: number, y: number)
  {
    if (this.enemies.isOnTile(x,y) && this.player.stage === "playing")
    {
      this.stage = 9;
      this.player.die();
    }
  };

  findRoadtoTarget(moveableObject: iMoveableObject, x: number, y: number, level: string) {
    let road = {
      arr: this.pfGrid.findWay(new Vector2(x, y),
        new Vector2(moveableObject.tilePosition.xTile, moveableObject.tilePosition.yTile), level),
      inLine: false,
      inView: false
    };

    if (x === moveableObject.tilePosition.xTile || y === moveableObject.tilePosition.yTile)
      road.inLine = true;
    let test = { x: true, y: true };
    for (let i = 1, j = road.arr.length; i < j; i++) {
      if (road.arr[i][0] != road.arr[i - 1][0]) test.x = false;
      if (road.arr[i][1] != road.arr[i - 1][1]) test.y = false;
    }
    if (test.x || test.y) road.inView = true;
    return road;
  };

  checkBonus(x: number, y: number) {
    let checkTile = this.checkTile(x,y);
    if (checkTile.bonus && checkTile.bonusActiv && !checkTile.brick)
      {
        switch (checkTile.bonusType) {
          case "bomb":
            this.player.increaseNrOfBombs();
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            break;
          case "flames":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.increaseFlames();
            break;
          case "speed":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.increaseSpeed();
            break;
          case "detonator":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.activateDetonator();
            break;
          case "extra_life":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.increaseLives();
            this.game.gamePlayer.setLives(this.player.lives);
            break;
          case "bomb_pass":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.activateBombPass();
            break;
          case "brick_pass":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.activateBrickPass();
            break;
          case "vest":
            sounds.play('bonus');
            this.grid.bonus.remove(x,y);
            this.player.activateVest();
            break;
          case "exit":
            this.player.win();
            this.stage = 9;
            break;
          default:
            break;
        }
      }
  };

  timeIsOver(): void {
    let enemyPoints = [new Vector2(1, 1), new Vector2(this.w - 2, 1), new Vector2(1, this.h - 2), new Vector2(this.w - 2, this.h - 2)];
    let i = enemyPoints.length;
    while(i--)
      {
        let enemy = new Enemy(enemyPoints[i], this.game, this.enemies, 'diamond');
        this.enemies.add(enemy);
        enemy.bonus.goForPlayer = true;
      }
  };

  activateBombs() {
    this.grid.bombs.activateAll();
  };

  makeExploded(x: number, y: number) {
    let checkTile = this.checkTile(x,y);
    if (checkTile.bomb)
      {
      this.grid.bombs.explode(x,y);
      }
    if (checkTile.brick)
      {
      this.grid.brick.explode(x,y);
      if (checkTile.bonusType != 'exit' || this.enemies.countAlive === 0)
        {
          this.grid.bonus.makeActiv(x,y);
        }
      }
  };

  makeFry(x: number, y: number) {
    let checkTile = this.checkTile(x,y);
    if (this.player.checkImpact(x,y) && this.player.stage === "playing"  && !this.player.bonus.vest)
    {
      this.stage = 9;
      this.player.die();
    }
    if (checkTile.bonus && checkTile.bonusType != 'exit' && checkTile.bonusActiv)
      {
        this.grid.bonus.explode(x,y);
      }
    if (checkTile.bonus && checkTile.bonusType === 'exit' && this.player.stage === "playing")
      {
        this.enemies.exitExploded(new Vector2(x,y));
      }
    this.enemies.checkImpact(x,y);
  };

  followTarget(moveableObject: iMoveableObject) {
    if (this.mapBigerThenCanvas.x || this.mapBigerThenCanvas.y) {
      if (moveableObject.origin.x > this.game.canvas.width / 2) {
        this.x = -1 * (moveableObject.origin.x - this.game.canvas.width / 2);
      }
      if (moveableObject.origin.y + 70 > this.game.canvas.height / 2) {
        this.y = -1 * (moveableObject.origin.y - this.game.canvas.height / 2);
      }
      if (moveableObject.origin.x <= this.game.canvas.width / 2) {
        this.x = 0;
      }
      if (moveableObject.origin.y + 70 <= this.game.canvas.height / 2) {
        this.y = 70;
      }
    }
  };

  keepInCanvas(): void {
    if (this.mapBigerThenCanvas.x) {
      if (this.x < -1 * (this.width - this.game.canvas.width)) this.x = -1 * (this.width - this.game.canvas.width);
      if (this.x > 0) this.x = 0;
    }
    else {
      this.x = (this.game.canvas.width - this.width) / 2;
    }
    if (this.mapBigerThenCanvas.y) {
      if (this.y < -1 * (this.height - this.game.canvas.height)) this.y = -1 * (this.height - this.game.canvas.height);
      if (this.y > 70) this.y = 70;
    }
    else {
      this.y = (this.game.canvas.height - this.height) / 2 + 70 / 2;
    }
  };

  update(delta: number): void {
    this.grid.grass.update(delta);
    this.grid.walls.update(delta);
    this.grid.steel.update(delta);
    this.grid.bombs.update(delta);
    this.grid.bonus.update(delta);
    this.grid.brick.update(delta);

    this.enemies.update(delta);
    this.pointsList.update(delta);

    if (this.enemies.countAlive === 0)
      {
        this.grid.bonus.makeAllActiv();
        this.grid.brick.makeSparky();
      }

    this.followTarget(this.enemies.at(0));
    this.keepInCanvas();

    this.player.update(delta);

    this.timer.update(delta);
  };


  draw(): void {
    this.grid.grass.draw();
    this.grid.walls.draw();
    this.grid.steel.draw();
    this.grid.bombs.draw();
    this.grid.bonus.draw();
    this.grid.brick.draw();

    this.player.draw();
    this.enemies.draw();
    this.pointsList.draw();

    if (this.stage === 1)
    {
      this.game.canvas.drawRectangle(0, 70, this.game.canvas.width, this.game.canvas.height, "rgba(0,0,0,"+this.black+")");
      if (this.black > 0)
      {
        this.black -= 0.01;
      }
      else
      {
        this.stage = 5;
      }
    }

    if (this.stage === 9)
    {
      this.game.canvas.drawRectangle(0, 70, this.game.canvas.width, this.game.canvas.height, "rgba(0,0,0,"+this.black+")");
      if (this.black < 1)
        {
          this.black += 0.005;
        }
        else
        {
          this.die("map");
        }
    }
  };

}
