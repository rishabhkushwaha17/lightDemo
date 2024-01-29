import { _decorator, Component, Graphics, Input, UITransform, Vec2, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class FreeDrawingComponent extends Component {
    @property(Graphics)
    render: Graphics = null;

    private _vertexArray: Vec3[] = [];

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event) {
        const location = this.node.getComponent(UITransform).convertToNodeSpaceAR(event.getLocation());
        this._vertexArray = [location];
        this.render.clear();
        this.render.moveTo(location.x, location.y);
        this._vertexArray.push(location);
        this.node.emit('FreeDrawingComponent_onTouchStart', this._vertexArray);
    }

    onTouchMove(event) {
        const location = this.node.getComponent(UITransform).convertToNodeSpaceAR(event.getLocation());
        const prePosition = this._vertexArray[this._vertexArray.length - 1];

        if (prePosition.subtract(location).length() < 10) {
            return;
        }

        this.render.lineTo(location.x, location.y);
        this.render.stroke();
        this._vertexArray.push(location);
        this.node.emit('FreeDrawingComponent_onTouchMove', this._vertexArray);
    }

    onTouchEnd(event) {
        const location = event.getLocation();
        const convertedLocation = this.node.getComponent(UITransform).convertToNodeSpaceAR(location);
        this.render.lineTo(convertedLocation.x, convertedLocation.y);
        this.node.emit('FreeDrawingComponent_onTouchEnd', this._vertexArray);
    }
}
