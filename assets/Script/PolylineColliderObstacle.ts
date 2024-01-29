import { _decorator, Component, Graphics, Vec2, v2, PolygonCollider2D } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class PolylineColliderObstacle extends Component {
    @property(Graphics)
    render: Graphics = null;

    @property(PolygonCollider2D)
    polylineCollider: PolygonCollider2D = null;

    onLoad() {
        this.render = this.node.getComponent(Graphics);
        this.polylineCollider = this.node.getComponent(PolygonCollider2D);
        this.plot();
    }

    plot() {
        this.render.clear();
        for (let i = 0; i < this.polylineCollider.points.length; i++) {
            const pt = this.polylineCollider.points[i];
            if (i === 0) {
                this.render.moveTo(pt.x, pt.y);
            } else {
                this.render.lineTo(pt.x, pt.y);
            }
        }
        this.render.stroke();
    }

    getVertexArray() {
        const vertexArray: Vec2[] = [];
        for (let j = 0; j < this.polylineCollider.points.length; j++) {
            vertexArray.push(v2(this.polylineCollider.points[j].x + this.node.position.x, this.polylineCollider.points[j].y + this.node.position.y));
        }
        return vertexArray;
    }

    updateVertexArray(points: Vec2[]) {
        this.polylineCollider.points = points;
        this.plot();
    }

    // CC_EDITOR
    @property
    private _resetRender: boolean = true;

    onFocusInEditor() {
        this.plot();
    }

    onLostFocusInEditor() {
        this.plot();
    }

    onEnable() {
        this.plot();
    }

    onDisable() {
        this.plot();
    }

    lateUpdate(delta: number) {
        // engine.repaintInEditMode();
        this.plot();
    }
}
