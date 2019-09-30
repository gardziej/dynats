import ButtonState from "./ButtonState";

export default class Keyboard {

  public keyStates: ButtonState[] = [];

  constructor() {
    for (let i = 0; i < 256; ++i) {
      this.keyStates.push(new ButtonState());
    }
    window.addEventListener("keydown", event => this.handleKeyDown(event));
    window.addEventListener("keyup", event => this.handleKeyUp(event));
  }

  handleKeyDown(event: KeyboardEvent): void {
    const code: number = event.keyCode;
    if (code < 100) {
      event.preventDefault();
    }
    if (code < 0 || code > 255) {
      return;
    }
    if (!this.keyStates[code].down) {
      this.keyStates[code].pressed = true;
    }
    this.keyStates[code].down = true;
  };

  handleKeyUp(event: KeyboardEvent): void {
    const code: number = event.keyCode;
    if (code < 0 || code > 255) {
      return;
    }
    this.keyStates[code].down = false;
  };

  reset(): void {
    for (let i = 0; i < 256; ++i) {
      this.keyStates[i].pressed = false;
    }
  };

  getA(): number {
    return this.keyStates.findIndex((key: ButtonState, index: number) => key.pressed && this.isAllowed(index));
  };

  isAllowed(code: number) {
    return ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code == 32));
  };

  pressed(key: number): boolean {
    return this.keyStates[key].pressed;
  }

  down(key: number): boolean {
    return this.keyStates[key].down;
  }

}