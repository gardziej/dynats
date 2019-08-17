import ButtonState from './ButtonState';
import Vector2 from './Vector2';
import Canvas from './Canvas';
import Rectangle from './Rectangle';

export default class Mouse {
  position: Vector2;
  wheel: number;
  left: ButtonState;
  middle: ButtonState;
  right: ButtonState;
  move: boolean;
  button = {
    left: {
      down: false,
      pressed: false
    },
    right: {
      down: false,
      pressed: false
    },
    middle: {
      down: false,
      pressed: false
    },
  };

  constructor(public canvas: Canvas) {
    this.canvas = canvas;
    this.position = Vector2.zero;
    this.wheel = 100;
    this.left = new ButtonState();
    this.middle = new ButtonState();
    this.right = new ButtonState();

    window.addEventListener("wheel", event => this.handleMouseWheel(event));
    window.addEventListener("mousemove", event => this.handleMouseMove(event));
    window.addEventListener("mousedown", event => this.handleMouseDown(event));
    window.addEventListener("mouseup", event => this.handleMouseUp(event));
  }

  handleMouseMove(event: MouseEvent): void {
    if (typeof this.canvas === 'undefined' || typeof this.canvas.offset === 'undefined') {
      return;
    }
    const canvasOffset = this.canvas.offset;
    const mx = (event.pageX - canvasOffset.x);
    const my = (event.pageY - canvasOffset.y);
    this.position = new Vector2(mx, my);
    if (this.button.left.down) {
      this.move = true;
    }
  }

  handleMouseWheel(event: WheelEvent): void {
    this.wheel += event.deltaY;
  }

  handleMouseDown(event: MouseEvent): void {
    this.handleMouseMove(event);
    if (event.which === 1) {
      if (!this.button.left.down) {
        this.button.left.pressed = true;
      }
      this.button.left.down = true;
    } else if (event.which === 2) {
      if (!this.button.middle.down) {
        this.button.middle.pressed = true;
      }
      this.button.middle.down = true;
    } else if (event.which === 3) {
      if (!this.button.right.down) {
        this.button.right.pressed = true;
      }
      this.button.right.down = true;
    }
  }

  handleMouseUp(event: MouseEvent) {
    this.handleMouseMove(event);
    if (event.which === 1) {
      this.button.left.down = false;
    }
    else if (event.which === 2) {
      this.button.middle.down = false;
    }
    else if (event.which === 3) {
      this.button.right.down = false;
    }
    this.move = false;
  }

  reset() {
    this.left.pressed = false;
    this.middle.pressed = false;
    this.right.pressed = false;
  }

  containsMouseDown(rect: Rectangle): boolean {
    return this.left.down && rect.contains(this.position);
  }

  containsMousePress(rect: Rectangle): boolean {
    return this.left.pressed && rect.contains(this.position);
  }

}
