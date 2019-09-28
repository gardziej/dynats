import Map from './Map';
import sounds from './system/Sounds';

export default class MapTimer {

  public leftTime: number;
  public working: boolean = false;
  public alerts: { [index: string]: boolean } = {
    hurryup: false,
    time_out: false
  };

  constructor(public time: number, public map: Map) {
    this.leftTime = time;

  }

  init(): void {
    this.working = true;
  };

  get ending() {
    return this.leftTime <= 10;
  }

  toString(): string {
    if (this.leftTime >= 0) {
      let minutes = Math.floor(this.leftTime / 60);
      let seconds = Math.floor(this.leftTime % 60);
      return (minutes + ":" + (seconds < 10) ? String(seconds) : "0" + seconds);
    }
    else {
      return "0:00";
    }
  };

  playSound(sound: string): void {
    if (!this.alerts[sound]) {
      sounds.play(sound);
      this.alerts[sound] = !this.alerts[sound];
    }
  }

  update(delta: number): void {
    this.leftTime -= delta;

    if (this.working && Math.floor(this.leftTime) === 10) {
      this.playSound('time_out');
    }

    if (this.working && Math.floor(this.leftTime) === 0) {
      this.working = false;
      this.map.timeIsOver();
      this.playSound('hurryup');
    }

  }

}
