import { Component, _decorator } from "cc";
const { ccclass } = _decorator;
@ccclass("Robot")
class Robot extends Component {
    useCamera: boolean;
    isForceLoSUpdate: boolean;
    constructor() {
        super();
        this.useCamera = false;
        this.isForceLoSUpdate = false;
    }

    start() {
        // Your start logic here
    }
}
