import BaseState from "../system/BaseState";
import Vector2 from "../system/Vector2";
import * as settings from '../settings';

export default class HiScore extends BaseState {

  private hiscores: any;

  draw() {
    this.game.canvas.drawRectangle(0, 0, this.game.canvas.width, this.game.canvas.height, "black");
    this.game.canvas.drawText("hiscore", new Vector2(this.game.canvas.width / 2, 50), Vector2.zero, "white", "center", "'Press Start 2P'", "30px");
    this.game.canvas.drawText("(press ESC to exit)", new Vector2(this.game.canvas.width / 2, 90), Vector2.zero, "yellow", "center", "Verdana", "10px");

    let k = 1;
    let pos = 100;

    this.game.canvas.drawText("lp", new Vector2(pos, 120), Vector2.zero, "yellow", "left", "Verdana", "12px");
    pos += 60;
    this.game.canvas.drawText("player", new Vector2(pos, 120), Vector2.zero, "yellow", "left", "Verdana", "12px");
    pos += 330;
    this.game.canvas.drawText("hiscore", new Vector2(pos, 120), Vector2.zero, "yellow", "right", "Verdana", "12px");
    pos += 100;
    this.game.canvas.drawText("map", new Vector2(pos, 120), Vector2.zero, "yellow", "right", "Verdana", "12px");
    pos += 70;
    this.game.canvas.drawText("date", new Vector2(pos, 120), Vector2.zero, "yellow", "left", "Verdana", "12px");


    if (this.hiscores !== null) {
      for (let index in this.hiscores) {
        const i: number = +index;
        pos = 100;
        this.game.canvas.drawText(k + ".", new Vector2(pos, i * 40 + 150), Vector2.zero, "white", "left", "Verdana", "16px");
        pos += 60;
        this.game.canvas.drawText(this.hiscores[i].gracz, new Vector2(pos, i * 40 + 150), Vector2.zero, "white", "left", "Verdana", "20px");
        pos += 330;
        this.game.canvas.drawText(this.hiscores[i].punkty, new Vector2(pos, i * 40 + 150), Vector2.zero, "yellow", "right", "Verdana", "20px");
        pos += 100;
        this.game.canvas.drawText(this.hiscores[i].mapa, new Vector2(pos, i * 40 + 150), Vector2.zero, "white", "right", "Verdana", "20px");
        pos += 70;
        this.game.canvas.drawText(this.hiscores[i].dodano, new Vector2(pos, i * 40 + 150), Vector2.zero, "white", "left", "Verdana", "20px");
        k++;
      }
    }
  };

  reset = function () {
    fetch(settings.HiScoreURL).then((response: Response) => {
      response.json().then(json => {
        this.hiscores = json;
      });
    });
  };

}