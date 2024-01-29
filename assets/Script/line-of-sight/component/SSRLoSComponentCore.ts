import { Enum, Component, _decorator } from "cc";
import { ssr } from "../namespace/SSRLoSNamespace";
const { property, ccclass } = _decorator;
// import * as ssr from '../namespace/SSRLoSNamespace';

export enum LOS_SIGHT_MODE {
    UNKNOWN,
    UNLIMITED_RANGE,
    FULL_ANGLE,
    REFLEX_ANGLE,
    NON_REFLEX_ANGLE,
}
@ccclass("SSRLoSCoreComponent")
export class SSRLoSCoreComponent extends Component {
    private _loSCore: any;
    @property(Number)
    radius: number = 0;
    @property(Number)
    centralAngle: number = 0;
    // @property({ type: Enum(LOS_SIGHT_MODE) })
    mode: LOS_SIGHT_MODE = LOS_SIGHT_MODE.FULL_ANGLE;
    constructor() {
        super();
    }
    protected start(): void {
        this._loSCore = new ssr.LoS.Core(this.node);

    }
    updateMode() {
        if (this.radius === -1) {
            this.mode = LOS_SIGHT_MODE.UNLIMITED_RANGE;
        } else {
            if (this.centralAngle > 0 && this.centralAngle <= 180) {
                this.mode = LOS_SIGHT_MODE.REFLEX_ANGLE;
            } else if (this.centralAngle > 180 && this.centralAngle <= 360) {
                this.mode = LOS_SIGHT_MODE.NON_REFLEX_ANGLE;
            } else {
                this.mode = LOS_SIGHT_MODE.FULL_ANGLE;
            }
        }
    }

    onLoad() {
        if (this.radius > 0) {
            this._loSCore.setRadius(this.radius);
        }
        if (this.centralAngle > 0) {
            this._loSCore.setCentralAngle(this.centralAngle);
        }
    }

    updateSightNode() {
        this._loSCore.angle = this.node.angle;
        return this._loSCore.update();
    }

    getLoSCore() {
        return this._loSCore;
    }
}