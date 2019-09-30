import BaseState from "../system/BaseState";
import Key from "../system/Key";
import Vector2 from "../system/Vector2";
import sprites from "../system/Sprites";
import Rectangle from "../system/Rectangle";

export default class GameOverState extends BaseState {

  handleInput(delta: number) {
    if (this.game.keyboard.pressed(Key.enter)) {
      this.game.gamePlayer.saveUserName();
      this.game.gamePlayer.sendScore();
      if (this.game.gamePlayer.lives > 0) this.game.gamePlayer.saveGame();
      this.game.gameStateManager.switchTo('game_title_page').reset();
    }

    if (this.game.gamePlayer.name.length < 16) {
      const code: number = this.game.keyboard.getA();
      if (typeof code !== "undefined")
        this.game.gamePlayer.name = this.game.gamePlayer.name + String.fromCharCode(code);
    }

    if (this.game.gamePlayer.name.length > 0 && this.game.keyboard.pressed(Key.back)) {
      this.game.gamePlayer.name = this.game.gamePlayer.name.slice(0, - 1);
    }

  };

  draw() {
    this.game.canvas.drawImage(sprites.getSprite('game_over'), Vector2.zero, 0, Vector2.zero, new Rectangle(0, 0, this.game.canvas.width, this.game.canvas.height));
    this.game.canvas.drawText("enter your name and press enter", new Vector2(this.game.canvas.width / 2, 100), Vector2.zero, "yellow", "center", "'Press Start 2P'", "30px");
    this.game.canvas.drawText(this.game.gamePlayer.name, new Vector2(this.game.canvas.width / 2, 150), Vector2.zero, "yellow", "center", "'Press Start 2P'", "30px");
    this.game.canvas.drawRectangle(263, 183, 370, 2, "yellow");
    this.game.canvas.drawText("your score: " + this.game.gamePlayer.score, new Vector2(100, 470), Vector2.zero, "white", "left", "'Press Start 2P'", "30px");
    this.game.canvas.drawText("your best score: " + this.game.gamePlayer.hiscore, new Vector2(100, 520), Vector2.zero, "white", "left", "'Press Start 2P'", "30px");
  };

  reset() {
    this.game.keyboard.reset();
  };

}
