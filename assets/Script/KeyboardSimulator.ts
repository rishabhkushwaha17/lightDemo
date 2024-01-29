// import { Component, Input, System, SystemEvent, _decorator } from "cc";

// const { ccclass, property } = _decorator;

// @ccclass
// export default class KeyboardSimulator extends Component {
//     private allKeys: { [key: number]: boolean } = {};

//     onLoad() {
//         this.allKeys = {};
//         this.node.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
//         this.node.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
//     }

//     onDestroy() {
//         this.node.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
//         this.node.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
//     }

//     onKeyDown(event) {
//         this.allKeys[event.keyCode] = true;
//     }

//     onKeyUp(event) {
//         this.allKeys[event.keyCode] = false;
//     }
// }
