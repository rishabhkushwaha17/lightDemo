import { Component, macro, Graphics, loader, EffectAsset, Material, gfx, view, v2, _decorator, Node, Enum, Macro, UITransform, v3 } from "cc";
const { property, ccclass } = _decorator;
import { ssr } from '../namespace/SSRLoSNamespace';
import { SSRLoSCoreComponent } from "./SSRLoSComponentCore";
export enum LOS_RENDER_TYPE {
    "SIGHT_AREA",
    "SIGHT_VERT",
    "BLOCKING_EDGE",
    "POTENTIAL_BLOCKING_EDGE",
    "VISIBLE_EDGE",
    "HIT_POINT",
    "RAY",
    "SIGHT_RANGE",
    "SIGHT_LIGHT",
}
@ccclass("SSRLoSRenderComponent ")
export class SSRLoSRenderComponent extends Component {
    @property(Node)
    target: Node;
    @property(Graphics)
    render: Graphics;
    @property({ type: Enum(LOS_RENDER_TYPE) })
    mode: LOS_RENDER_TYPE = LOS_RENDER_TYPE.SIGHT_LIGHT;
    @property({ type: Boolean })
    isIgnoreSourcePosition: Boolean = false;
    @property({ type: EffectAsset })
    _lightEffectAsset: EffectAsset;
    _srcBlendFactor = 771;
    _dstBlendFactor = 771;
    _losCore = null;
    constructor() {
        super();
    }

    onLoad() {
    }

    start() {
        if (this.mode === LOS_RENDER_TYPE.SIGHT_LIGHT) {
            this._loadLightEffect();
        }

        const losCoreComponent = this.target ? this.target.getComponent(SSRLoSCoreComponent) : null;
        if (losCoreComponent) {
            this._losCore = losCoreComponent.getLoSCore();
        }

        if (!this.render) {
            this.render = this.node.getComponent(Graphics);
        }
    }

    update(dt) {
        if (!this.render || !this._losCore) {
            return;
        }

        const isUpdated = this._losCore.isUpdated();
        if (isUpdated || this._lightEffectAsset) {
            this.plot();
        }
    }

    clear() {
        this.render.clear();
    }

    plot() {
        if (!this.node.active) {
            return;
        }

        this.render.clear();

        if (this.mode === LOS_RENDER_TYPE.SIGHT_AREA) {
            ssr.LoS.Render.Util.renderSightArea(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.SIGHT_VERT) {
            ssr.LoS.Render.Util.renderSightVert(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.BLOCKING_EDGE) {
            ssr.LoS.Render.Util.renderBlockingEdge(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.POTENTIAL_BLOCKING_EDGE) {
            ssr.LoS.Render.Util.renderPotentialBlockingEdge(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.VISIBLE_EDGE) {
            ssr.LoS.Render.Util.renderVisibleEdge(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.HIT_POINT) {
            ssr.LoS.Render.Util.renderHitPoint(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.RAY) {
            ssr.LoS.Render.Util.renderRay(this._losCore, this.render, this.isIgnoreSourcePosition, this.target);
        } else if (this.mode === LOS_RENDER_TYPE.SIGHT_RANGE) {
            ssr.LoS.Render.Util.renderSightRange(this._losCore, this.render, this.isIgnoreSourcePosition);
        } else if (this.mode === LOS_RENDER_TYPE.SIGHT_LIGHT) {
            if (this._lightEffectAsset) {
                this._updateLightEffect();
                ssr.LoS.Render.Util.renderSightArea(this._losCore, this.render, this.isIgnoreSourcePosition);
            }
        }
    }

    _loadLightEffect() {
        const self = this;
        loader.loadRes("line-of-sight/shader/light", EffectAsset, null, function (error, asset) {
            self._lightEffectAsset = asset;
            self._applyLightEffect();
            ssr.LoS.Render.Util.renderSightArea(self._losCore, self.render);
        });
    }

    _applyLightEffect() {
        if (!this.render) {
            this.render = this.node.getComponent(Graphics);
        }
        const material: Material = new Material();
        material.initialize({ effectAsset: this._lightEffectAsset });
        material.name = "light";
        this.render.setMaterial(material, 0);
        material.setProperty('u_srcBlend', gfx.BlendFactor.SRC_COLOR);
        material.setProperty('u_dstBlend', gfx.BlendFactor.ONE_MINUS_SRC_COLOR);
        material.setProperty('u_dstBlend', gfx.BlendFactor.SRC_ALPHA);
        material.setProperty('u_dstBlend', gfx.BlendFactor.ONE_MINUS_SRC_ALPHA);
        this._updateLightEffect();
    }

    _updateLightEffect() {
        if (!this.render) {
            this.render = this.node.getComponent(Graphics);
        }

        const material = this.render.getMaterial(0);
        const frameSize = view.getFrameSize();
        const visibleSize = view.getVisibleSize();
        const retinaFactor = view.getDevicePixelRatio();
        const position = this.target.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0));
        const centerx = position.x * frameSize.width / visibleSize.width * retinaFactor;
        const centery = position.y * frameSize.height / visibleSize.height * retinaFactor;

        material.setProperty("center", [centerx, centery]);

        let radius = this._losCore.getRadius();

        if (radius === -1) {
            const rect = this._losCore.getSightRect();

            radius = Math.sqrt(rect.width * rect.width, rect.height * rect.height);
            material.setProperty("radius", radius);
            material.setProperty("sourceRadius", 10);
            material.setProperty("intensity", 0.8);
        } else {
            material.setProperty("radius", radius * 2);
            material.setProperty("sourceRadius", radius * 0.1);
            material.setProperty("intensity", 0.8);
        }
    }

    getRender() {
        return this.render;
    }
}

// SSRLoSRenderComponent.schema = {
//     target: {
//         default: null,
//         type: Node,
//     },
//     render: {
//         default: null,
//         type: Graphics,
//     },
//     mode: {
//         default: LOS_RENDER_TYPE.SIGHT_AREA,
//         type: LOS_RENDER_TYPE,
//     },
//     isIgnoreSourcePosition: {
//         default: false,
//     },
//     srcBlendFactor: {
//         get() {
//             return this._srcBlendFactor;
//         },
//         set(value) {
//             if (this._srcBlendFactor === value) return;
//             this._srcBlendFactor = value;
//         },
//     },
//     dstBlendFactor: {
//         get() {
//             return this._dstBlendFactor;
//         },
//         set(value) {
//             if (this._dstBlendFactor === value) return;
//             this._dstBlendFactor = value;
//         },
//     },
// };

// ssr.LoS.Component.Render = Class(SSRLoSRenderComponent);
