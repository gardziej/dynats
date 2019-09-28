import Vector2 from './Vector2';

export default class Rectangle {

  constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) {
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get center() {
    return this.position.addTo(this.size.divideBy(2));
  }

  get position() {
    return new Vector2(this.x, this.y);
  }

  get size() {
    return new Vector2(this.width, this.height);
  }

  contains(v: Vector2): boolean {
    return (v.x >= this.left && v.x <= this.right &&
      v.y >= this.top && v.y <= this.bottom);
  };

  intersects(rect: Rectangle): boolean {
    return (this.left <= rect.right && this.right >= rect.left &&
      this.top <= rect.bottom && this.bottom >= rect.top);
  };

}
