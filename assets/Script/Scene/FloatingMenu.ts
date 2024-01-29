import { Component, Node, ScrollView, _decorator } from "cc";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;
import * as ssr from '../line-of-sight/namespace/SSRLoSNamespace';

@ccclass("FloatingMenu")
export default class FloatingMenu extends Component {

    @property(Node)
    robot: Node = null;

    @property(Node)
    obstaclesGroup: Node = null;

    @property(Node)
    lightsGroup: Node = null;

    private _obstacleCount: number = 10;
    private _lightsCount: number = 0;
    private losRenderLayer: any; // replace with the actual type
    private performance: any; // replace with the actual type

    private robotObject: any; // replace with the actual type
    private robotLoSComponent: any; // replace with the actual type
    private robotLoSCore: any; // replace with the actual type

    private _floatingMenu: ScrollView;
    private _losMaskRenderMenuPanelItem: Node;
    private _sightAreaRenderMenuPanelItem: Node;
    // ... other properties ...

    onLoad() {
        this._obstacleCount = 10;
        this._lightsCount = 0;
        this.losRenderLayer = this.node.getComponent("LoSRenderLayer");
        this.performance = this.node.getComponent("Performance");

        this.robotObject = this.robot.getComponent("Robot");
        this.robotLoSComponent = this.robot.getComponent("SSRLoSComponentCore");
        this.robotLoSCore = this.robotLoSComponent.getLoSCore();
        this._initFloatingMenu();
        this._initDebugDraw();
    }

    private _initFloatingMenu() {
        // ... implementation ...
    }

    private _initDebugDraw() {
        // ... implementation ...
    }

    // ... other methods ...

    // Note: Replace any with the actual types
    private enableLoSMask() {
        this.robotObject.isForceLoSUpdate = true;
        this.losRenderLayer._losMaskNode.node.active = true;
    }

    // ... other methods ...

    updateDebugDraw() {
        // ... implementation ...
    }
}
