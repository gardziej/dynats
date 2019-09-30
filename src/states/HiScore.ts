import BaseState from "../system/BaseState";
import Vector2 from "../system/Vector2";

export default class HiScore extends BaseState {

  private hiscores: any;

  draw() {
    this.game.canvas.drawRectangle(0, 0, this.game.canvas.width, this.game.canvas.height, "black");
    this.game.canvas.drawText("hiscore", new Vector2(this.game.canvas.width / 2, 50), Vector2.zero, "white", "center", "'Press Start 2P'", "30px");
    this.game.canvas.drawText("(press ESC to exit)", new Vector2(this.game.canvas.width / 2, 90), Vector2.zero, "white", "center", "Verdana", "10px");

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
    this.hiscores = JSON.parse(fakeJSON);
  };

}


const fakeJSON = '[{"id":"337","gra":"dyna","mapa":"15","gracz":"GARDZIEJ","punkty":"321700","ip":"81.190.178.71","dodano":"2016-04-30"},{"id":"203","gra":"dyna","mapa":"10","gracz":" ANIA ","punkty":"179500","ip":"83.20.136.174","dodano":"2015-09-07"},{"id":"339","gra":"dyna","mapa":"10","gracz":"GARDZIEJ","punkty":"147300","ip":"81.190.174.33","dodano":"2017-03-10"},{"id":"198","gra":"dyna","mapa":"10","gracz":" ANIA ","punkty":"131400","ip":"83.11.197.10","dodano":"2015-09-06"},{"id":"23","gra":"dyna","mapa":"11","gracz":"GARDZIEJ","punkty":"127900","ip":"81.190.168.150","dodano":"2015-07-11"},{"id":"155","gra":"dyna","mapa":"9","gracz":" ANIA","punkty":"123800","ip":"79.184.89.72","dodano":"2015-08-22"},{"id":"13","gra":"dyna","mapa":"9","gracz":"GARDZIEJ","punkty":"121300","ip":"81.190.169.205","dodano":"2015-07-06"},{"id":"177","gra":"dyna","mapa":"9","gracz":" ANIAQ","punkty":"111400","ip":"79.184.207.185","dodano":"2015-09-02"},{"id":"157","gra":"dyna","mapa":"7","gracz":" ANIA","punkty":"105500","ip":"79.184.213.34","dodano":"2015-08-23"},{"id":"342","gra":"dyna","mapa":"10","gracz":"GARDZIEJ","punkty":"105100","ip":"81.190.174.33","dodano":"2017-05-03"}]';