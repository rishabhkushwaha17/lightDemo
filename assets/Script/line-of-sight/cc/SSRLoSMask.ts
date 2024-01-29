import { ssr } from '../namespace/SSRLoSNamespace';

class SSRLoSMask {
    private _mask: any;
    private _targets: any[];
    /**
     * The constructor
     * @param {cc.Node} mask
     */
    constructor(mask) {
        this._mask = mask;
        this._targets = [];
    }

    /**
     * Add a target whose sight area will be rendered for mask effect.
     * @param {cc.Node} node - The target to be added.
     * @param {losComponentCoreProvider} losComponentCoreProvider - Function for providing ssr.LoS.Component.Core instance for the target node.
     */
    addTarget(node, losComponentCoreProvider) {
        const result = this.findTarget(node);
        if (result !== -1) {
            console.log("SSRLoSMask addTarget: Node already added");
        } else {
            this._targets.push(node);
        }
    }

    /**
     * Remove a target.
     * @param {cc.Node} node - The target to be removed.
     * @return {Boolean} - True for removed, false for target not found.
     */
    removeTarget(node) {
        const index = this.findTarget(node);
        if (index !== -1) {
            this._targets.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Remove all the given targets.
     * @param {Array.<cc.Node>} nodes - The targets to be removed.
     */
    removeTargets(nodes) {
        nodes.forEach((node) => this.removeTarget(node));
    }

    /**
     * Remove all the targets.
     */
    removeAllTargets() {
        this._targets.forEach((node) => this.removeTarget(node));
        this._targets = [];
    }

    /**
     * Find if the given target is already added.
     * @param {cc.Node} node - The target to be checked.
     * @return {Number} - Index of the node. -1 for not found.
     */
    findTarget(node) {
        return this._targets.findIndex((target) => target === node);
    }

    /**
     * Update the target's sight area mask effect.
     * @param {cc.Node} node - The target whose sight area to be updated.
     * @param {Boolean} [needForceUpdate=false] - If need to update the target's sight area no matter it is changed or not.
     */
    updateTarget(node, needForceUpdate = false) {
        const nodeIndex = this.findTarget(node);
        if (nodeIndex === -1) {
            console.log("SSRLoSMask updateTarget: Node is not added!");
            return;
        }

        const losCore = node.getComponent("SSRLoSComponentCore").getLoSCore();
        ssr.LoS.Render.Util.renderSightArea(losCore, this._mask._graphics);
    }

    /**
     * Update the targets' sight area mask effect.
     * @param {Array.<cc.Node>} [nodes] - The targets whose sight area to be updated. If not provided, update all targets.
     * @param {Boolean} [needForceUpdate=false] - If need to update the target's sight area no matter it is changed or not.
     */
    updateTargets(nodes = this._targets, needForceUpdate = false) {
        this._mask._graphics.clear();
        nodes.forEach((node) => this.updateTarget(node, needForceUpdate));
    }

    /**
     * Check if any of the specified targets need an update.
     * @param {Array.<cc.Node>} [nodes] - The targets to check for an update. If not provided, check all targets.
     * @return {Boolean} - True if any target needs an update, false otherwise.
     */
    isNeedUpdate(nodes = this._targets) {
        return nodes.some((node) => {
            const nodeIndex = this.findTarget(node);
            if (nodeIndex === -1) {
                return false;
            }
            const losCore = node.getComponent("SSRLoSComponentCore").getLoSCore();
            return losCore.isUpdated();
        });
    }
}

ssr.LoS.Mask = SSRLoSMask;
