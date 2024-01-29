import { Component, Mask, Node, error, log, _decorator } from "cc";
const { property, ccclass } = _decorator;
import { ssr } from '../namespace/SSRLoSNamespace';
@ccclass("SSRLoSMaskComponent")
export class SSRLoSMaskComponent extends Component {
    @property({ type: Node })
    targets: Node[] = [];
    _losMaskNode: any;
    mask: any;
    constructor() {
        super();
        this.targets = [];
        this._losMaskNode = null;
    }

    onLoad() {
    }

    start() {
        if (!this.mask) {
            this.mask = this.node.getComponent(Mask);
        }
        if (!this.mask) {
            error("Component Mask is needed for rendering!");
            return;
        }

        this._losMaskNode = new ssr.LoS.Mask(this.mask);

        for (let i = 0; i < this.targets.length; i++) {
            const target = this.targets[i];
            if (target.getComponent("SSRLoSComponentCore")) {
                this._losMaskNode.addTarget(target);
            } else {
                log("No LoSCore component found on the target!");
            }
        }
    }

    updateSightNode(isForceLoSUpdate) {
        if (!this.mask || !this.node.active) {
            return;
        }

        if (this._losMaskNode.isNeedUpdate() || isForceLoSUpdate) {
            this._losMaskNode.updateTargets();
        }
    }
}