import sounds from "./system/Sounds";

export default class GamePlayer {

  public pref = "dyna_";
  public speedLevels = [3, 4, 6, 8];
  public name: string;
  public map: number;
  public score: number;
  public hiscore: number;
  public time: number;
  public lives: number;
  public speed: number;
  public bonus: any;
  public bombs: any;

  constructor() {
    this.init();
  }

  get playerSpeed() {
    return this.speedLevels[this.speed];
  }

  saveUserName() {
    localStorage.setItem(this.pref + "name", this.name);
  };

  sendScore() {
    // $.ajax({
    //   url: '../server/json.php',
    //   data: {
    //       callback : "?",
    //       savePoints : "true",
    //       gra : "dyna",
    // mapa : this.map,
    //       gracz : this.name,
    //       punkty : this.score
    //    }
    // });
  };

  clearSaveGame() {
    localStorage.removeItem(this.pref + "savedGame");
  };

  saveGame() {
    const obj = {
      map: this.map,
      score: this.score,
      lives: this.lives,
      speed: this.speed,
      bonus: this.bonus,
      bombs: this.bombs
    };
    localStorage.setItem(this.pref + "savedGame", JSON.stringify(obj));
  };

  startValues() {
    this.map = 1;
    this.hiscore = 0;
    this.score = 0;
    this.lives = 3;
    this.speed = 0;
    this.time = 240;
    this.bonus = {
      brick_pass: false,
      bomb_pass: false,
      detonator: false,
      vest: false
    };
    this.bombs = {
      area: 2,
      count: 2,
      life: 60
    };
  };

  loadSave() {
    // const save = localStorage.getItem(this.pref + "savedGame");
    // if (save) {
    //   const obj = JSON.parse(save);
    //   if (obj instanceof Object && obj.lives > 0) {
    //     for (let i in obj) {
    //       this[i] = obj[i];
    //     }
    //     this.bonus.vest = false;
    //     return true;
    //   }
    // }
    return false;
  };

  init() {

    this.startValues();

    this.hiscore = +localStorage.getItem(this.pref + "hiscore") || 0;
    this.name = localStorage.getItem(this.pref + "name") || "";
    let soundsOn = localStorage.getItem(this.pref + "soundsOn") || true;
    soundsOn = soundsOn === "false" ? soundsOn = false : soundsOn = true;
    sounds.soundsSet(soundsOn);
  };

  speedUp() {
    if (this.speed < this.speedLevels.length - 1) {
      this.speed++;
    }
  };

  setLives(val: number): void {
    this.lives = val;
  };

  updateSounds() {
    localStorage.setItem(this.pref + "soundsOn", String(sounds.soundsOn));
  };

  updateScore(score: number): void {
    this.score += score;
    if (this.score > this.hiscore) this.hiscore = this.score;
    localStorage.setItem(this.pref + "hiscore", String(this.hiscore));
  };

  resetForDie(score: number): void {
    this.lives--;

    this.bonus = {
      brick_pass: false,
      bomb_pass: false,
      detonator: false
    };

    this.bombs.area--;
    if (this.bombs.area < 2) this.bombs.area = 2;
    this.bombs.count--;
    if (this.bombs.count < 1) this.bombs.count = 1;
    this.speed--;
    if (this.speed < 0) this.speed = 0;
  };

}
