import Vector2 from "../Vector2";
import iTilePosition from "./iTilePosition";

export default interface iMoveableObject {
  position: Vector2;
  origin: Vector2;
  tilePosition: iTilePosition;
}