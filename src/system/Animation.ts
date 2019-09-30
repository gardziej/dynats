import iSpriteData from "./interfaces/iSpriteData";
import Vector2 from "./Vector2";
import Rectangle from "./Rectangle";
import Game from "../Game";

export default class Animation {

  public position: any = {};
  public frameTime: number;
  public frame: any = {
    start: 0,
    current: 0,
    end: 0
  };
  public frameSize: any = {
  }
  public ended = false;
  public rectCorrect = [0, 0, 0, 0];

  constructor(
    public game: Game,
    public parent: any,
    public sprite: iSpriteData,
    public looping: boolean,
    public frameTimeMax: number = 0.1,
    public onlyOneFrame: boolean = true,
    public oneFrameNumber: number = 1,
    public range: number[] = []
  ) {
    this.frameTime = this.frameTimeMax;
    if (onlyOneFrame) {
      this.frame.start = oneFrameNumber;
      this.frame.end = oneFrameNumber;
    }
    else if (typeof range !== 'undefined' && (range instanceof Array) && range.length > 0) {
      this.frame.start = range[0];
      this.frame.end = range[1];
    }
    else {
      this.frame.start = 0;
      this.frame.end = this.sprite.cols - 1;
    }
    this.frame.current = this.frame.start;

    this.frameSize = {
      width: this.sprite.img.width / this.sprite.cols,
      height: this.sprite.img.height
    };
  }

  update(delta: number, position: Vector2, rectCorrect: number[]) {

    if (typeof position !== 'undefined') {
      this.position = position;
    }

    if (typeof rectCorrect !== 'undefined') {
      this.rectCorrect = rectCorrect;
    }

    if (this.frame.start !== this.frame.end) {
      this.frameTime -= delta;
      if (this.frameTime < 0) {
        this.frame.current++;
        this.frameTime = this.frameTimeMax;
        if (this.frame.current > this.frame.end) {
          if (this.looping) {
            this.frame.current = this.frame.start;
          }
          else {
            this.ended = true;
          }
        }
      }
    }
  };

  get isEnded() {
    return this.ended;
  }

  draw(delta: number): void {
    this.game.canvas.drawImage(this.sprite,
      new Vector2(this.position.x, this.position.y),
      0,
      Vector2.zero,
      new Rectangle(
        this.frame.current * this.frameSize.width + this.rectCorrect[0],
        0 + this.rectCorrect[1],
        this.frameSize.width + this.rectCorrect[2],
        this.frameSize.height + this.rectCorrect[3]
      ));
  };

}
