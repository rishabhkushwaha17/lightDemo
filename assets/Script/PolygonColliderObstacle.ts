import { _decorator, Component, Graphics, Vec2, v2, PolygonCollider2D } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class PolygonColliderObstacle extends Component {
    render: any = null;
    polygonCollider: PolygonCollider2D = null;

    onLoad() {
        this.render = this.node.getComponent(Graphics);
        this.polygonCollider = this.node.getComponent(PolygonCollider2D);
        this.plot();
    }

    plot() {
        this.render.clear();
        for (let i = 0; i < this.polygonCollider.points.length; i++) {
            const pt = this.polygonCollider.points[i];
            if (i === 0) {
                this.render.moveTo(pt.x + this.polygonCollider.offset.x, pt.y + this.polygonCollider.offset.y);
            } else {
                this.render.lineTo(pt.x + this.polygonCollider.offset.x, pt.y + this.polygonCollider.offset.y);
            }
        }
        this.render.fill();
    }

    updateVertexArray(points: Vec2[]) {
        this.polygonCollider.points = points;
        this.plot();
    }

    getVertexArray(): Vec2[] {
        const vertexArray: Vec2[] = [];
        for (let j = 0; j < this.polygonCollider.points.length; j++) {
            const point = this.polygonCollider.points[j];
            const point2 = point.rotate(this.node.angle * Math.PI / 180);
            vertexArray.push(v2(point2.x + this.node.position.x + this.polygonCollider.offset.x, point2.y + this.node.position.y + this.polygonCollider.offset.y));
        }
        return vertexArray;
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
