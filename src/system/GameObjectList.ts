export default class GameObjectList {
  protected gameObjects: any[] = [];

  constructor() {
  }

  get length() {
    return this.gameObjects.length;
  }


  get count() {
    return this.gameObjects.length;
  }

  add(gameobject: any) {
    this.gameObjects.push(gameobject);
    gameobject.parent = this;
  }

  remove(gameobject: any) {
    for (let i = 0, len = this.gameObjects.length; i < len; i++) {
      if (gameobject === this.gameObjects[i]) {
        this.gameObjects.splice(i, 1);
        gameobject.parent = null;
        return;
      }
    };
  }


  at(index: number) {
    if (index < 0 || index >= this.gameObjects.length)
      return null;
    return this.gameObjects[index];
  }

  clear() {
    for (let i = 0, len = this.gameObjects.length; i < len; i++)
      this.gameObjects[i].game = null;
    this.gameObjects = [];
  }

  find(id: number) {
    for (let i = 0, len = this.gameObjects.length; i < len; i++) {
      if (this.gameObjects[i].id === id)
        return this.gameObjects[i];
    }
    return null;
  }

  update(delta: number) {
    for (let i = 0, len = this.gameObjects.length; i < len; i++)
      if (typeof this.gameObjects[i] !== "undefined") this.gameObjects[i].update(delta);
  }

  draw() {
    for (let i = 0, len = this.gameObjects.length; i < len; i++)
      if (typeof this.gameObjects[i] !== "undefined") this.gameObjects[i].draw();
  }

  reset() {
    for (let i = 0, len = this.gameObjects.length; i < len; i++)
      this.gameObjects[i].reset();
  }

}