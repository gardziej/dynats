import Vector2 from "./Vector2";

export default class myHelper {

  static getRandomBin(): number {
    if (Math.random() > .5) return 1;
    return -1;
  }

  static getRandomInt(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static shuffleArray(o: any): any {
    for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  static pickRandomProperty(obj: Object): any {
    let result;
    let count = 0;
    for (let prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
    return result;
  }

  static distanceBetweenPoints(p1: Vector2, p2: Vector2): number {
    let dist, dx, dy;
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
    dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
  }

  static deg2rad(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  static rad2deg(radians: number): number {
    return radians * 180 / Math.PI;
  }

}
