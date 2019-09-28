import myHelper from "./system/myHelper";
import GamePlayer from "./GamePlayer";

export default class Bonus {

  public bonuses = [
    { name: "bomb", count: 1, minMap: 1, max: 7 },
    { name: "bomb_pass", count: 1, minMap: 7, max: 1 },
    { name: "detonator", count: 1, minMap: 3, max: 1 },
    { name: "extra_life", count: 1, minMap: 1, max: 1 },
    { name: "flames", count: 1, minMap: 1, max: 7 },
    { name: "brick_pass", count: 1, minMap: 4, max: 1 }
  ];

  public bonusesOut: any = [];

  constructor(public gamePlayer: GamePlayer, public needed: number = 0) {
    while (this.needed--)
      this.addRandom();

    this.init();
  }

  addRandom(): void {
    let added = false;
    while (added === false) {
      const rand = myHelper.getRandomInt(0, this.bonuses.length - 1);
      if (this.bonuses[rand].minMap <= this.gamePlayer.map && this.count(this.bonuses[rand].name) < this.bonuses[rand].max) {
        if (!(this.bonuses[rand].name === 'detonator' && this.gamePlayer.bonus.detonator) &&
          !(this.bonuses[rand].name === 'brick_pass' && this.gamePlayer.bonus.brick_pass) &&
          !(this.bonuses[rand].name === 'bomb_pass' && this.gamePlayer.bonus.bomb_pass) &&
          !(this.bonuses[rand].name === 'extra_life' && this.gamePlayer.lives > 8)
        ) {
          this.bonusesOut.push(this.bonuses[rand].name);
          added = true;
        }
      }
    }
  };

  getOne() {
    if (this.bonusesOut.length > 0)
      return this.bonusesOut.pop();
    else return false;
  };

  get left() {
    return this.bonusesOut.length;
  }

  count(name: string) {
    let count = 0;
    for (let i in this.bonusesOut) {
      if (this.bonusesOut[i] === name) count++;
    }
    return count;
  };


  init() {
    if (this.gamePlayer.map % 5 === 0) this.bonusesOut.push('speed');
    this.bonusesOut.push('exit');
    this.bonusesOut = myHelper.shuffleArray(this.bonusesOut);
  };

}
