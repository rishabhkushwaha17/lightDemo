import { Camera, Component, Node, Prefab, _decorator, find, instantiate, sys, v2, view } from "cc";
const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

import * as ssr from '../line-of-sight/namespace/SSRLoSNamespace';
import PolygonColliderObstacle from "../PolygonColliderObstacle";
@ccclass("Performance")
class Performance extends Component {

    _obstacles: any[];
    _lightSources: any[];
    camera: Camera;
    robotObject: any;
    @property(Node)
    robot: any;
    robotLoSComponent: any;
    robotLoSCore: any;
    @property(Node)
    obstaclesGroup: any;
    @property(Node)
    lightsGroup: any;
    @property(Prefab)
    hexagonPrefab: any;
    constructor() {
        super();

    }
    protected start(): void {
        this._obstacles = [];
        this._lightSources = [];
        this.camera = find("Main Camera", this.node).getComponent(Camera);
        this.robotObject = this.robot.getComponent("Robot");
        this.robotLoSComponent = this.robot.getComponent("SSRLoSComponentCore");
        this.robotLoSCore = this.robotLoSComponent.getLoSCore();
        this.randomObstacles(10);
    }
    randomObstacles(count) {
        this.obstaclesGroup.removeAllChildren(true);
        this._obstacles = [];
        this.robotLoSCore.removeAllObstacles();

        const w = view.getVisibleSize().width;
        const h = view.getVisibleSize().height;
        const size = count > 100 ? 10 : 12;
        const wCount = count / 10;
        const hCount = 10;

        this._obstacles = [];
        for (let i = 0; i < wCount; i++) {
            for (let j = 0; j < hCount; j++) {
                const hexagonNode: Node = <Node><unknown>instantiate(this.hexagonPrefab);
                hexagonNode.parent = this.obstaclesGroup;
                hexagonNode.setPosition(-w / 2 + size + (w / (wCount + 1)) * (i + 1), -h / 2 + 10 + size + ((h - size) / hCount) * j);
                this._obstacles.push(hexagonNode);

                const hexagonObstacle = hexagonNode.getComponent(PolygonColliderObstacle);
                const obstacle = this.robotLoSCore.addObstacle(hexagonObstacle, hexagonObstacle.getVertexArray());
                obstacle.setVertexArrayProvider(hexagonObstacle.getVertexArray, hexagonObstacle);
            }
        }

        for (let i = 0; i < this._lightSources.length; i++) {
            const lightCore = this._lightSources[i].getComponent("SSRLoSComponentCore").getLoSCore();
            lightCore.removeAllObstacles();

            for (let o = 0; o < this._obstacles.length; o++) {
                const hexagonObstacle = this._obstacles[o].getComponent("PolygonColliderObstacle");
                const obstacle = lightCore.addObstacle(sys.isNative ? this._obstacles[o]._proxy : hexagonObstacle, hexagonObstacle.getVertexArray());
                obstacle.setVertexArrayProvider(hexagonObstacle.getVertexArray, hexagonObstacle);
            }
        }
    }

    randomLights(count) {
        // this.lightsGroup.removeAllChildren(true);
        // this._lightSources = [];

        // const w = view.getVisibleSize().width;
        // const h = view.getVisibleSize().height;
        // const size = 10;
        // const hCount = 10;

        // for (let i = 0; i < count; i++) {
        //     const lightNode:Node = <>instantiate(this.lightPrefab);
        //     lightNode.parent = this.lightsGroup;
        //     lightNode.setPosition(-w / 2 + 20, -h / 2 + 10 + size + ((h - size) / hCount) * i + 30);
        //     lightNode.runAction(
        //         repeatForever(
        //             sequence(
        //                 moveBy(20 + i * 2, v2(w - 10, 0)),
        //                 moveBy(20 + i * 2, v2(-w + 10, 0))
        //             )
        //         )
        //     );

        //     this._lightSources.push(lightNode);

        //     for (let o = 0; o < this._obstacles.length; o++) {
        //         const hexagonObstacle = this._obstacles[o].getComponent("PolygonColliderObstacle");
        //         const obstacle = lightNode.getComponent("SSRLoSComponentCore").getLoSCore().addObstacle(sys.isNative ? this._obstacles[o]._proxy : hexagonObstacle, hexagonObstacle.getVertexArray());
        //         obstacle.setVertexArrayProvider(hexagonObstacle.getVertexArray, hexagonObstacle);
        //     }
        // }
    }
    lightPrefab(lightPrefab: any) {
        throw new Error("Method not implemented.");
    }

    update(dt) {
        if (this.robotObject.useCamera) {
            this.camera.node.position = this.robot.position;
        }

        if (this.robotObject.isForceLoSUpdate) {
            this.robotLoSCore.enableForceUpdate();
        }

        const isUpdated = this.robotLoSComponent.updateSightNode();

        if (isUpdated || this.robotObject.isForceLoSUpdate) {
            this.node.getComponent("LoSRenderLayer").updateRender(this.robotObject.isForceLoSUpdate);
            this.node.getComponent("FloatingMenu").updateDebugDraw();
        }

        this.robotLoSCore.disableForceUpdate();
        this.robotObject.isForceLoSUpdate = false;

        for (let i = 0; i < this._lightSources.length; i++) {
            const isUpdatedLight = this._lightSources[i].getComponent("SSRLoSComponentCore").updateSightNode();
            this._lightSources[i].getChildByName("SightLightRender").getComponent("SSRLoSComponentRender").plot();
        }
    }
}
