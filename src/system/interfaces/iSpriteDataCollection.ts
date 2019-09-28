import iSpriteData from "./iSpriteData";

export default interface iSpriteDataCollection {
  [index: string]: iSpriteData | iSpriteDataCollection;
}