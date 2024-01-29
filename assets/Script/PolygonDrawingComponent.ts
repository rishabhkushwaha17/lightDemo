import { _decorator, Component, Graphics, Input, UITransform, Vec2, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class PolygonDrawingComponent extends Component {
    @property(Graphics)
    render: Graphics = null;

    private _vertexArray: Vec3[] = [];

    onLoad() {
        this._vertexArray = [];
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(dt: number) {
        // Update logic if needed
    }

    onTouchStart(event) {
        const location = this.node.getComponent(UITransform).convertToNodeSpaceAR(event.getLocation());
        if (this._vertexArray.length === 0) {
            this._vertexArray.push(location);
        }
        this._plot(location);
        this.node.emit('PolygonDrawingComponent_onTouchStart', this._vertexArray);
    }

    onTouchMove(event) {
        const location = this.node.getComponent(UITransform).convertToNodeSpaceAR(event.getLocation());
        if (this._vertexArray.length > 0) {
            this._plot(location);
        }
        this.node.emit('PolygonDrawingComponent_onTouchMove', this._vertexArray);
    }

    onTouchEnd(event) {
        const location = event.getLocation();
        const convertedLocation = this.node.getComponent(UITransform).convertToNodeSpaceAR(location);

        if (this._vertexArray.length > 0) {
            if (convertedLocation.subtract(this._vertexArray[this._vertexArray.length - 1]).length() < 20) {
                this._vertexArray.push(convertedLocation);
                this.node.emit('PolygonDrawingComponent_onTouchEnd', this._vertexArray.slice(), false);
                // polyline
                this.render.clear();
                this._vertexArray = [];
            } else if (convertedLocation.subtract(this._vertexArray[0]).length() < 20) {
                // polygon
                this._vertexArray.push(convertedLocation);
                this.node.emit('PolygonDrawingComponent_onTouchEnd', this._vertexArray.slice(), true);
                this.render.clear();
                this._vertexArray = [];
            } else {
                this._vertexArray.push(convertedLocation);
                this._plot();
            }
        }
    }

    private _plot(position?: Vec3) {
        this.render.clear();

        if (this._vertexArray.length === 1) {
            this.render.moveTo(this._vertexArray[0].x, this._vertexArray[0].y);
            this.render.lineTo(position.x, position.y);
            this.render.stroke();
        } else if (this._vertexArray.length === 2) {
            if (position) {
                this.render.moveTo(this._vertexArray[0].x, this._vertexArray[0].y);
                this.render.lineTo(this._vertexArray[1].x, this._vertexArray[1].y);
                this.render.lineTo(position.x, position.y);
                this.render.stroke();
                this.render.fill();
            } else {
                this.render.moveTo(this._vertexArray[0].x, this._vertexArray[0].y);
                this.render.lineTo(this._vertexArray[1].x, this._vertexArray[1].y);
                this.render.stroke();
            }
        } else {
            const vertexArrayCopy = this._vertexArray.slice();
            if (position) {
                vertexArrayCopy.push(position);
            }

            for (let i = 0; i < vertexArrayCopy.length; i++) {
                if (i === 0) {
                    this.render.moveTo(vertexArrayCopy[i].x, vertexArrayCopy[i].y);
                } else {
                    this.render.lineTo(vertexArrayCopy[i].x, vertexArrayCopy[i].y);
                    if (i === vertexArrayCopy.length - 1) {
                        this.render.lineTo(vertexArrayCopy[0].x, vertexArrayCopy[0].y);
                    }
                }
            }
            this.render.stroke();
            this.render.fill();
        }
    }
}
