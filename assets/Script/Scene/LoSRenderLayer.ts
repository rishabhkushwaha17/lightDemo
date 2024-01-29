import { CCClass, Component, Node, _decorator } from "cc";

import * as ssr from '../line-of-sight/namespace/SSRLoSNamespace';
const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

@ccclass("LoSRenderLayer")
export default class LoSRenderLayer extends Component {

    @property(Node)
    robot: Node = null;

    private robotLoSComponent: any; // replace with the actual type
    private robotLoSCore: any; // replace with the actual type

    private _losComponentRenderRay: any; // replace with the actual type
    private _losComponentRenderHitPoint: any; // replace with the actual type
    private _losComponentRenderPotentialBlockingEdge: any; // replace with the actual type
    private _losComponentRenderBlockingEdge: any; // replace with the actual type
    private _losComponentRenderVisibleEdge: any; // replace with the actual type
    private _losComponentRenderSightVert: any; // replace with the actual type
    private _losComponentRenderSightRange: any; // replace with the actual type
    private _losComponentRenderSightArea: any; // replace with the actual type
    private _losComponentRenderSightLight: any; // replace with the actual type
    private _losMaskNode: any; // replace with the actual type

    onLoad() {
        this.robotLoSComponent = this.robot.getComponent("SSRLoSComponentCore");
        this.robotLoSCore = this.robotLoSComponent.getLoSCore();
        this._initLoSComponentRender();
    }

    private _initLoSComponentRender() {
        const loSRenderGroup = this.node.getChildByName("LoSRenderGroup");
        this._losComponentRenderRay = loSRenderGroup.getChildByName("RayRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderHitPoint = loSRenderGroup.getChildByName("HitPointRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderPotentialBlockingEdge = loSRenderGroup.getChildByName("PotentialBlockingEdgeRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderBlockingEdge = loSRenderGroup.getChildByName("BlockingEdgeRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderVisibleEdge = loSRenderGroup.getChildByName("VisibleEdgeRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderSightVert = loSRenderGroup.getChildByName("SightVertRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderSightRange = loSRenderGroup.getChildByName("SightRangeRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderSightArea = loSRenderGroup.getChildByName("SightAreaRender").getComponent("SSRLoSComponentRender");
        this._losComponentRenderSightLight = loSRenderGroup.getChildByName("SightLightRender").getComponent("SSRLoSComponentRender");
        this._losMaskNode = loSRenderGroup.getChildByName("MaskRender").getComponent("SSRLoSComponentMask");
    }

    updateRender(isForceLoSUpdate: boolean) {
        this._losComponentRenderSightArea.plot();
        this._losComponentRenderSightRange.plot();
        this._losComponentRenderRay.plot();
        this._losComponentRenderHitPoint.plot();
        this._losComponentRenderSightVert.plot();
        this._losComponentRenderPotentialBlockingEdge.plot();
        this._losComponentRenderBlockingEdge.plot();
        this._losComponentRenderVisibleEdge.plot();
        this._losComponentRenderSightLight.plot();
        this._losMaskNode.updateSightNode(isForceLoSUpdate);
    }
}
