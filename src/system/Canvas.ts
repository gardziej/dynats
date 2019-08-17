import Vector2 from "./Vector2";
import Color from "./Color";

export default class Canvas {
  div: HTMLElement;
  canvasOffset: Vector2;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(private id: string, private divId: string) {
    this.id = id;
    this.div = document.getElementById(divId);
    this.resize();
  }

  get offset() {
    return this.canvasOffset;
  }

  get cursor() {
    return this.canvas.style.cursor;
  }

  setCursor(type: string) {
    if (this.canvas.style.cursor !== type) {
      this.canvas.style.cursor = type;
    }
  }

  resize() {
    this.canvasOffset = Vector2.zero;

    if (typeof this.canvas === 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.setAttribute('id', this.id);
      this.div.appendChild(this.canvas);
    }

    this.canvas.width = +this.div.getAttribute('width');
    this.canvas.height = +this.div.getAttribute('height');

    this.canvasOffset.x = this.canvas.offsetLeft;
    this.canvasOffset.y = this.canvas.offsetTop;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.canvas.style.cursor = 'default';
  };

  setSize(x: number, y: number) {
    this.width = this.canvas.width = x;
    this.height = this.canvas.height = y;
  };

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  getImageData(a: number, b: number, c: number, d: number) {
    return this.ctx.getImageData(a, b, c, d);
  };

  drawText(
    text: string, 
    position: Vector2 = Vector2.zero, 
    origin: Vector2 = Vector2.zero, 
    color: string = Color.black, 
    textAlign: CanvasTextAlign = 'start', 
    fontname: string = 'Courier New', 
    fontsize: string = '20px'
    ) {

    this.ctx.save();
    this.ctx.translate(position.x - origin.x, position.y - origin.y);
    this.ctx.textBaseline = 'top';
    this.ctx.font = fontsize + ' ' + fontname;
    this.ctx.fillStyle = color.toString();
    this.ctx.textAlign = textAlign;
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
  };

}
