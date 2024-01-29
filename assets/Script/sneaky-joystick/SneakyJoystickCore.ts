// import { Component } from "cc";

// const { ccclass, property } = _decorator;

// @ccclass
// export default class SneakyJoystickCore extends Component {
//     @property(Node)
//     backgroundSprite: Node = null;

//     @property(Node)
//     backgroundPressedSprite: Node = null;

//     @property(Node)
//     thumbSprite: Node = null;

//     @property(Node)
//     thumbPressedSprite: Node = null;

//     @property(Rect)
//     rePositionRect: Rect = new Rect(0, 0, 0, 0);

//     private stickPosition: Vec2 = v2(0, 0);
//     private degrees: number = 0.0;
//     private velocity: Vec2 = v2(0, 0);

//     private joystickRadius: number;
//     private joystickRadiusSq: number;

//     onLoad() {
//         this.node.setContentSize(this.backgroundSprite.getContentSize());
//         this.joystickRadius = this.backgroundSprite.getContentSize().width / 2;
//         this.joystickRadiusSq = this.joystickRadius * this.joystickRadius;

//         this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
//         this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
//         this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
//         this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
//     }

//     update(dt: number) {
//         this.thumbSprite.setPosition(this.stickPosition);
//         this.thumbPressedSprite.setPosition(this.stickPosition);
//     }

//     onTouchStart(event: Event.EventTouch) {
//         let location = event.getLocation();
//         location = this.node.parent.convertToNodeSpaceAR(location);

//         if (this.rePositionRect.contains(location)) {
//             this.node.setPosition(location);
//         }

//         location = this.node.convertToNodeSpaceAR(event.getLocation());
//         this.node.opacity = 150;

//         if (this.JoySneakyTouchBegin(location)) {
//             event.stopPropagation();
//         }
//     }

//     onTouchMove(event: Event.EventTouch) {
//         const location = this.node.convertToNodeSpaceAR(event.getLocation());
//         this.JoySneakyTouchMove(location);
//     }

//     onTouchEnd(event: Event.EventTouch) {
//         const location = this.node.convertToNodeSpaceAR(event.getLocation());
//         this.JoySneakyTouchEnd(location);
//         this.node.opacity = 50;
//     }

//     JoySneakyTouchBegin(location: Vec2): boolean {
//         this.backgroundSprite.active = false;
//         this.backgroundPressedSprite.active = true;
//         this.thumbSprite.active = false;
//         this.thumbPressedSprite.active = true;

//         const dSq = location.x * location.x + location.y * location.y;

//         if (this.joystickRadiusSq > dSq) {
//             this.updateVelocity(location);
//             return true;
//         }

//         return false;
//     }

//     JoySneakyTouchMove(location: Vec2) {
//         this.updateVelocity(location);
//     }

//     JoySneakyTouchEnd(location: Vec2) {
//         this.velocity = v2(0, 0);
//         this.stickPosition = v2(0, 0);

//         this.backgroundSprite.active = true;
//         this.backgroundPressedSprite.active = false;
//         this.thumbSprite.active = false;
//         this.thumbPressedSprite.active = false;
//     }

//     updateVelocity(point: Vec2) {
//         const SJ_PI = 3.14159265359;
//         const SJ_PI_X_2 = 6.28318530718;
//         const SJ_RAD2DEG = 180.0 / SJ_PI;

//         let dx = point.x;
//         let dy = point.y;
//         const dSq = dx * dx + dy * dy;

//         if (dSq <= 0) {
//             this.velocity = v2(0, 0);
//             this.degrees = 0.0;
//             this.stickPosition = point;
//             return;
//         }

//         let angle = Math.atan2(dy, dx);

//         if (angle < 0) {
//             angle += SJ_PI_X_2;
//         }

//         const cosAngle = Math.cos(angle);
//         const sinAngle = Math.sin(angle);

//         if (dSq > this.joystickRadiusSq) {
//             dx = cosAngle * this.joystickRadius;
//             dy = sinAngle * this.joystickRadius;
//         }

//         this.velocity = v2(dx / this.joystickRadius, dy / this.joystickRadius);
//         this.degrees = angle * SJ_RAD2DEG;
//         this.stickPosition = v2(dx, dy);
//     }

//     getVelocity(): Vec2 {
//         return this.velocity;
//     }

//     getDegrees(): number {
//         return this.degrees;
//     }
// }
