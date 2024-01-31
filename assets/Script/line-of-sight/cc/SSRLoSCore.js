const ssr = require('../namespace/SSRLoSNamespace');
ssr.LoS.Core = cc.Class(
{
    name: "ssr.LoS.Core",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {cc.Node} owner The owner of this component.
     */
    ctor: function () {
        this._initData(arguments[0]);
        this._initStrategies();
        this._updateStrategies();
    },
    /**
     * Initialization all the data.
     * @function
     * @private
     */
    _initData: function (owner) {
        //
        this._radius = ssr.LoS.Constant.UNLIMITED_RANGE;
        this._centralAngle = ssr.LoS.Constant.FULL_ANGLE;
        this._position = null;
        this._sceenPosition = null;
        this._rotation = 0;
        this._direction = cc.v2(1, 0);
        this._mode = ssr.LoS.Constant.MODE.UNLIMITED_RANGE;
        this._owner = owner;
        //
        this._isUpdated = false;
        this._isForceUpdate = false;
        this._isAutoGenerateBoundary = true;
        this._isLockSightBoundary = false;
        this._isNeedCulling = false;
        this._isCulled = false;
        this._sightRect = new cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
        this._sightBoundary = null;
        this._dirtyFlag = ssr.LoS.Constant.DIRTY_FLAGS.NOT_DIRTY;
        //
        this._obstacles = [];
        this._boundaryObstacle = new ssr
            .LoS
            .Data
            .Obstacle(null, [], true, true);
        this._potentialBlockingEdgeMap = {};
        this._potentialBlockingEdgeArray = [];
        this._anglePointArray = [];
        this._rayArray = [];
        this._visibleEdgeArray = [];
        this._blockingEdgeArray = [];
        this._hitPointArray = [];
        this._sightAreaArray = [];
        //
        this._preProcessStrategy = null;
        this._cullingStrategy = null;
        this._processStrategy = null;
        this._postProcessStrategy = null;
        this._toolStrategy = null;
    },
    /**
     * Clear the component data. Need to be called when removing this component.
     * @function
     */
    clear: function () {
        this.clearPotentialBlockingEdgeArray();
        this.clearPotentialBlockingEdgeMap();
        this.clearBlockingEdgeArray();
        this.clearRayArray();
        this.clearVisibleEdgeArray();
        this.clearAnglePointArray();
        this.clearSightArea();
        this.clearHitPointArray();
        this.removeAllObstacles();
        this.removeBoundaryObstacle();
    },
    /**
     * Set the owner of this component.
     * @function
     * @param {cc.Node} owner The owner of this component.
     */
    setOwner: function (owner) {
        if (owner == this._owner) {
            return;
        }
        this._owner = owner;
    },
    /**
     * Get the owner of this component
     * @function
     * @return {cc.Node} The owner.
     */
    getOwner: function () {
        return this._owner;
    },
    /**
     * Get the obstalce object for boundary (should be inner use only).
     * @function
     * @return {ssr.LoS.Data.Obstacle} The obstacle.
     */
    getBoundaryObstacle: function () {
        return this._boundaryObstacle;
    },
    /**
     * Remove the obstacle for boundary.
     * @function
     */
    removeBoundaryObstacle: function () {
        this._boundaryObstacle = null;
    },
    /**
     * Set the current LoS mode.
     * @function
     * @param {ssr.LoS.Constant.MODE} mode The mode that is currently in use.
     */
    setMode: function (mode) {
        this._mode = mode;
        if (mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            this._isLockSightBoundary = false;
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        }
    },
    /**
     * Get the current LoS mode.
     * @function
     * @return {ssr.LoS.Constant.MODE} The mode that is currently in use.
     */
    getMode: function () {
        return this._mode;
    },
    /**
     * Set the dirty flag (bit operation).
     * @function
     * @param {ssr.LoS.Constant.DIRTY_FLAGS} dirtyFlag The dirty flag to set.
     */
    setDirtyFlag: function (dirtyFlag) {
        this._dirtyFlag |= dirtyFlag;
    },
    /**
     * Remove the specified dirty flag (bit operation).
     * @function
     * @param {ssr.LoS.Constant.DIRTY_FLAGS} dirtyFlag The dirty flag to remove.
     */
    removeDirtyFlag: function (dirtyFlag) {
        this._dirtyFlag &= ~ dirtyFlag;
    },
    /**
     * Get the specified dirty flag (bit operation).
     * @function
     * @param {ssr.LoS.Constant.DIRTY_FLAGS} dirtyFlag The dirty flag to get.
     * @return {Boolean} True for on, false for off.
     */
    getDirtyFlag: function (dirtyFlag) {
        return ((this._dirtyFlag & dirtyFlag) != 0
            ? true
            : false);
    },
    /**
     * Remove all the dirty flag (bit operation).
     * @function
     */
    resetDirtyFlag: function () {
        this._dirtyFlag = ssr.LoS.Constant.DIRTY_FLAGS.NOT_DIRTY;
    },
    /**
     * Return the absolute position in screen of the owner
     * @function
     * @private
     * @return {cc.Point} The screen position.
     */
    _getOwnerScreenPosition: function () {
        return this
            .getOwner()
            .parent
            ? this
                .getOwner()
                .parent
                .convertToWorldSpaceAR(this.getOwner().position)
            : this
                .getOwner()
                .position;
    },
    _getCameraScreenPosition: function () {
        return cc
            .Camera
            .findCamera(this.getOwner())
            .getWorldToScreenPoint(this.getOwner().position);
    },
    /**
     * Generate a rectangle represents the current screen area.
     * @function
     * @return {cc.Rect} The screen rectangle.
     */
    generateScreenRect: function () {
        var nodePosition = this
            .getOwner()
            .getPosition();
        var cameraPosition = this._getCameraScreenPosition();
        return cc.rect(nodePosition.x - cc.winSize.width / 2 - cameraPosition.x, nodePosition.y - cc.winSize.height / 2 - cameraPosition.y, cc.winSize.width, cc.winSize.height);
    },
    /**
     * Get the generated visible area (triangulated).
     * @function
     * @return {Array.<Array.<cc.Point>>} The visible area.
     */
    getSightArea: function () {
        return this._sightAreaArray;
    },
    /**
     * Clear the generated visible area.
     * @function
     * @return {Array.<Array.<cc.Point>>} The visible area.
     */
    clearSightArea: function () {
        this._sightAreaArray = [];
    },
    /**
     * Get the blocking edge array.
     * @function
     */
    getBlockingEdgeArray: function () {
        return this._blockingEdgeArray;
    },
    /**
     * Clear the blocking edge array.
     * @function
     */
    clearBlockingEdgeArray: function () {
        this._blockingEdgeArray = [];
    },
    /**
     * Get the ray array.
     * @function
     * @return {Array.<ssr.LoS.Data.Ray>} The ray array.
     */
    getRayArray: function () {
        return this._rayArray;
    },
    /**
     * Clear the blocking edge array.
     * @function
     */
    clearRayArray: function () {
        for (var i = 0, l = this._rayArray.length; i < l; i++) {
            ssr
                .LoS
                .Data
                .Manager
                .getInstance()
                .free(this._rayArray[i]);
        }
        this._rayArray = [];
    },
    /**
     * Get the potential blocking edge array.
     * @function
     * @return {Array.<ssr.LoS.Data.Edge>} The potential blocking edge array.
     */
    getPotentialBlockingEdgeArray: function () {
        return this._potentialBlockingEdgeArray;
    },
    /**
     * Clear potential blocking edge array.
     * @function
     */
    clearPotentialBlockingEdgeArray: function () {
        this._potentialBlockingEdgeArray = [];
    },
    /**
     * Get the potential blocking edge map.
     * @function
     * @return {Object.<Number, ssr.LoS.Data.Edge>} The potential blocking edge map.
     */
    getPotentialBlockingEdgeMap: function () {
        return this._potentialBlockingEdgeMap;
    },
    /**
     * Clear the potential blocking edge map.
     * @function
     */
    clearPotentialBlockingEdgeMap: function () {
        this._potentialBlockingEdgeMap = {};
    },
    /**
     * Get the visible edge array.
     * @function
     * @return {Array.<cc.Point>} The visible edge array.
     */
    getVisibleEdgeArray: function () {
        return this._visibleEdgeArray;
    },
    /**
     * Clear the visible edge array.
     * @function
     */
    clearVisibleEdgeArray: function () {
        this._visibleEdgeArray = [];
    },
    /**
     * Get the hit point array.
     * @function
     * @return {Array.<ssr.LoS.Data.HitPoint>} The hit point array
     */
    getHitPointArray: function () {
        return this._hitPointArray;
    },
    /**
     * clear the hit point array and free the data to pool (if pool is enabled).
     * @function
     */
    clearHitPointArray: function () {
        for (var i = 0, l = this._hitPointArray.length; i < l; i++) {
            ssr
                .LoS
                .Data
                .Manager
                .getInstance()
                .free(this._hitPointArray[i]);
        }
        this._hitPointArray = [];
    },
    /**
     * Get the angle point array.
     * @function
     * @return {Array.<ssr.LoS.Data.AnglePoint>} The angle point array
     */
    getAnglePointArray: function () {
        return this._anglePointArray;
    },
    /**
     * Clear the angle point array.
     * @function
     */
    clearAnglePointArray: function () {
        this._anglePointArray = [];
    },
    /**
     * Set the radius of the sight.
     * @function
     * @param {Number} value The sight radius to set.
     */
    setRadius: function (value) {
        if (this.getRadius() == value) {
            return;
        }
        var updateStrategiesFlag = false;
        if (value == ssr.LoS.Constant.UNLIMITED_RANGE) {
            updateStrategiesFlag = true;
            this.setMode(ssr.LoS.Constant.MODE.UNLIMITED_RANGE);
        } else {
            if (this.getRadius() == ssr.LoS.Constant.UNLIMITED_RANGE) {
                updateStrategiesFlag = true;
                this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_FULL_ANGLE);
            }
        }
        this._radius = value;
        if (updateStrategiesFlag) {
            this._updateStrategies();
        }
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.RADIUS);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING);
    },
    /**
     * Get the radius of the sight.
     * @function
     * @return {Numbder} The sight radius.
     */
    getRadius: function () {
        return this._radius;
    },
    /**
     * Set the central angle of the sight.
     * @function
     * @param {Numbder} value The central angle to set.
     */
    setCentralAngle: function (value) {
        value = ssr
            .LoS
            .Helper
            .angleNormalize(value);
        if (this.getCentralAngle() == value) {
            return;
        }
        var updateStrategiesFlag = false;
        if (value == ssr.LoS.Constant.FULL_ANGLE) {
            updateStrategiesFlag = true;
            this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_FULL_ANGLE);
        } else {
            if (this.getCentralAngle() == ssr.LoS.Constant.FULL_ANGLE) {
                updateStrategiesFlag = true;
                if (value > 0 && value <= 180) {
                    this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_NON_REFLEX_ANGLE);
                } else {
                    this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_REFLEX_ANGLE);
                }
            } else {
                if (this.getCentralAngle() <= 180 && value > 180) {
                    updateStrategiesFlag = true;
                    this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_REFLEX_ANGLE);
                } else if (this.getCentralAngle() > 180 && value <= 180) {
                    updateStrategiesFlag = true;
                    this.setMode(ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_NON_REFLEX_ANGLE);
                }
            }
        }
        this._centralAngle = value;
        if (updateStrategiesFlag) {
            this._updateStrategies();
        }
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.ANGLE);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING);
    },
    /**
     * Get the central angle of the sight.
     * @function
     * @return {Numbder} The central angle of the sight.
     */
    getCentralAngle: function () {
        return this._centralAngle;
    },
    /**
     * Get the position of the sight (in node space).
     * @function
     * @return {cc.Point} The position of the sight (in node space).
     */
    getPosition: function () {
        return this
            .getOwner()
            .getPosition();
    },
    /**
     * Get the rotation of the sight.
     * @function
     * @return {Number} The rotation of the sight.
     */
    getRotation: function () {
        return this._rotation;
    },
    /**
     * Set the direction of the sight.
     * @function
     * @private
     * @param {cc.Point} value The direction to set.
     * @warning This function is called when setRotation is triggered automatically so you do not need to call it directly in general.
     */
    setDirection: function (value) {
        this._direction = value;
    },
    /**
     * Get the direction of the sight.
     * @function
     * @return {cc.Point} The direction of the sight.
     */
    getDirection: function () {
        return this._direction;
    },
    /**
     * Get the sight boundary.
     * @function
     * @return {cc.Rect} The sight boundary.
     */
    getSightBoundary: function () {
        return this._sightBoundary;
    },
    /**
     * Return if the visible area is updated during the last update function call.
     * @function
     * @return {Boolean} True for is updated, false for not updated.
     */
    isUpdated: function () {
        return this._isUpdated;
    },
    /**
     * The initialization of all the strategy class instacne.
     * @function
     * @private
     */
    _initStrategies: function () {
        this._preProcessStrategy = null;
        this._cullingStrategy = null;
        this._processStrategy = null;
        this._postProcessStrategy = null;
        this._toolStrategy = null;
    },
    /**
     * Update the corresponding strategy class instacne according to the current sight mode.
     * @function
     * @private
     */
    _updateStrategies: function () {
        if (this._mode == ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            this._preProcessStrategy = new ssr
                .LoS
                .Strategy
                .PreProcess
                .UnlimitedRange(this);
            this._cullingStrategy = new ssr
                .LoS
                .Strategy
                .Culling
                .UnlimitedRange(this);
            this._processStrategy = new ssr
                .LoS
                .Strategy
                .Process
                .UnlimitedRange(this);
            this._postProcessStrategy = new ssr
                .LoS
                .Strategy
                .PostProcess
                .UnlimitedRange(this);
            this._toolStrategy = new ssr
                .LoS
                .Strategy
                .Tool
                .UnlimitedRange(this);
        } else if (this._mode == ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_FULL_ANGLE) {
            this._preProcessStrategy = new ssr
                .LoS
                .Strategy
                .PreProcess
                .LimitedRangeWithFullAngle(this);
            this._cullingStrategy = new ssr
                .LoS
                .Strategy
                .Culling
                .LimitedRangeWithFullAngle(this);
            this._processStrategy = new ssr
                .LoS
                .Strategy
                .Process
                .LimitedRangeWithFullAngle(this);
            this._postProcessStrategy = new ssr
                .LoS
                .Strategy
                .PostProcess
                .LimitedRangeWithFullAngle(this);
            this._toolStrategy = new ssr
                .LoS
                .Strategy
                .Tool
                .LimitedRangeWithFullAngle(this);
        } else if (this._mode == ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_NON_REFLEX_ANGLE) {
            this._preProcessStrategy = new ssr
                .LoS
                .Strategy
                .PreProcess
                .LimitedRangeWithNonReflexAngle(this);
            this._cullingStrategy = new ssr
                .LoS
                .Strategy
                .Culling
                .LimitedRangeWithNonReflexAngle(this);
            this._processStrategy = new ssr
                .LoS
                .Strategy
                .Process
                .LimitedRangeWithNonReflexAngle(this);
            this._postProcessStrategy = new ssr
                .LoS
                .Strategy
                .PostProcess
                .LimitedRangeWithNonReflexAngle(this);
            this._toolStrategy = new ssr
                .LoS
                .Strategy
                .Tool
                .LimitedRangeWithNonReflexAngle(this);
        } else if (this._mode == ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_REFLEX_ANGLE) {
            this._preProcessStrategy = new ssr
                .LoS
                .Strategy
                .PreProcess
                .LimitedRangeWithReflexAngle(this);
            this._cullingStrategy = new ssr
                .LoS
                .Strategy
                .Culling
                .LimitedRangeWithReflexAngle(this);
            this._processStrategy = new ssr
                .LoS
                .Strategy
                .Process
                .LimitedRangeWithReflexAngle(this);
            this._postProcessStrategy = new ssr
                .LoS
                .Strategy
                .PostProcess
                .LimitedRangeWithReflexAngle(this);
            this._toolStrategy = new ssr
                .LoS
                .Strategy
                .Tool
                .LimitedRangeWithReflexAngle(this);
        }
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.MODE);
    },
    /**
     * The main trigger of the component, call this function to update the sight area when needed.
     * @function
     */
    update: function () {
        this._isUpdated = this._isNeedUpdate();
        if (this._isUpdated) {
            this._process();
        }
        return this._isUpdated;
    },
    /**
     * Check if owner's position changed
     * @function
     * @private
     * @return {Boolean} True for position changed, false for not.
     */
    _checkPosition: function () {
        if (this._position && this._position.equals(this.getOwner().getPosition())) {
            return;
        }
        this._position = this
            .getOwner()
            .getPosition();
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.POSITION);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING);
        if (!this._isLockSightBoundary) {
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        }
    },
    /**
     * Check if owner's position changed
     * @function
     * @private
     * @return {Boolean} True for position changed, false for not.
     */
    _checkScreenPosition: function () {
        var screenPosition = this._getOwnerScreenPosition();
        if (this._sceenPosition && this._sceenPosition.equals(screenPosition)) {
            return;
        }
        this._sceenPosition = screenPosition;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.POSITION);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING);
        if (!this._isLockSightBoundary) {
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        }
    },
    /**
     * Check if owner's rotation changed
     * @function
     * @private
     * @return {Boolean} True for rotation changed, false for not.
     */
    _checkRotation: function () {
        if (this._rotation == this.getOwner().angle) {
            return;
        }
        this._rotation = this
            .getOwner()
            .angle;
        this.setDirection(cc.v2(Math.cos(cc.misc.degreesToRadians(this._rotation)), Math.sin(cc.misc.degreesToRadians(this._rotation))));
        if (this._centralAngle == ssr.LoS.Constant.FULL_ANGLE) {
            return;
        }
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.ROTATION);
        if (this._centralAngle != ssr.LoS.Constant.FULL_ANGLE) {
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING);
        }
    },
    /**
     * Determine if the visible area need to be updated at the current update function call.
     * @function
     * @private
     * @return {Boolean} True for need update, false for do not need update.
     */
    _isNeedUpdate: function () {
        var needUpdate = false;
        if (this.isForceUpdate()) {
            return true;
        }
        //
        if (this._isNeedCulling) {
            var screenRect = this.generateScreenRect();
            var sightRect = cc.rect(this.getOwner().getPosition().x - this._radius, this.getOwner().getPosition().y - this._radius, this._radius * 2, this._radius * 2);
            if (!ssr.LoS.Helper.rectContainsRect(sightRect, screenRect)) {
                this._isCulled = true;
                return false;
            }
        }
        //
        this._checkPosition();
        this._checkScreenPosition();
        this._checkRotation();
        //
        this._isCulled = false;
        if (this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.POSITION)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.ROTATION)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.RADIUS)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.ANGLE)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.MODE)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.OBSTACLE)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING)) {
            needUpdate = true;
        }
        if (!needUpdate && this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY)) {
            needUpdate = true;
        }
        var obstacleDirty = this._processObstacleDirtyDetection();
        return needUpdate || obstacleDirty;
    },
    /**
     * Process the dirty detection procedure for all the obstacles if needed.update function call and determine if the visible area need to be updated at the current update function call.
     * @function
     * @private
     * @return {Boolean} True for need update, false for do not need update.
     */
    _processObstacleDirtyDetection: function () {
        var isAnyObstacleDirty = false;
        for (var i = 0, l = this._obstacles.length; i < l; i++) {
            var obstacle = this._obstacles[i];
            var obstacleDirty = false;
            if (obstacle.isDirtyDetectionOn()) {
                // The dirty detection feature is on
                if (obstacle._vertexArrayProvider) {
                    // The obstacle has a vertexArrayProvider set so use it to do the detection
                    var oldVertexArray = obstacle.getVertexArray();
                    var newVertexArray = obstacle
                        ._vertexArrayProvider
                        .call(obstacle._node);
                    if (!obstacleDirty) {
                        if (oldVertexArray.length != newVertexArray.length) {
                            // the number of verts changes so it must be dirty
                            obstacleDirty = true;
                            isAnyObstacleDirty = true;
                        } else {
                            // the number of verts remains the same so need to do more check
                            for (var m = 0; m < oldVertexArray.length; m++) {
                                var isVertexFound = false;
                                for (var n = 0; n < newVertexArray.length; n++) {
                                    if (oldVertexArray[m].equals(newVertexArray[n])) {
                                        isVertexFound = true;
                                        break;
                                    }
                                }
                                if (!isVertexFound) {
                                    // one of the former vert is not found so it must be dirty, we can break
                                    obstacleDirty = true;
                                    isAnyObstacleDirty = true;
                                    break;
                                }
                            }
                        }
                    }
                    obstacle.setVertexArray(newVertexArray);
                } else {
                    // The obstacle has no vertexArrayProvider set so we do a transfromation
                    // detection on the node position dirty check
                    if (obstacle.__position !== undefined && !obstacle.__position.equals(obstacle._node.getPosition())) {
                        obstacleDirty = true;
                    }
                    obstacle.__position = cc.v2(obstacle._node.getPosition());

                    // rotation dirty check
                    if (!obstacleDirty && obstacle.__rotation !== undefined && obstacle.__rotation != obstacle._node.angle) {
                        obstacleDirty = true;
                    }
                    obstacle.__rotation = obstacle._node.angle;
                    // scale dirty check
                    if (!obstacleDirty && (obstacle.__scaleX !== undefined && obstacle.__scaleX != obstacle._node.scaleX) || (obstacle.__scaleY !== undefined && obstacle.__scaleY != obstacle._node.scaleY)) {
                        obstacleDirty = true;
                    }
                    obstacle.__scaleX = obstacle._node.scaleX;
                    obstacle.__scaleY = obstacle._node.scaleY;
                }
            }
            if (obstacleDirty) {
                // if the obstacle is dirty update it
                this.updateObstacle(obstacle._node);
            }
        }
        return isAnyObstacleDirty;
    },
    /**
     * The main process of the algorithm.
     * @function
     * @private
     */
    _process: function () {
        // clear
        this.clearBlockingEdgeArray();
        this.clearSightArea();
        this.clearVisibleEdgeArray();
        this.clearRayArray();
        this.clearAnglePointArray();
        this.clearPotentialBlockingEdgeArray();
        this.clearPotentialBlockingEdgeMap();
        this.clearHitPointArray();
        // update boundary
        if (!this._sightBoundary || this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY)) {
            this._sightBoundary = this
                ._preProcessStrategy
                .generateBoundary();
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
        }
        if (this.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.CULLING)) {
            this._cleanupAllObstaclesForProcess();
        }
        // main processes start
        this
            ._cullingStrategy
            .process();
        this
            ._processStrategy
            .generateAuxiliaryAnglePoint();
        this
            ._processStrategy
            .packAnglePoints();
        this
            ._processStrategy
            .packPotentialBlockingEdges();
        this
            ._processStrategy
            .sortAnglePointArray();
        this
            ._processStrategy
            .generateRays();
        this
            ._processStrategy
            .castRays();
        this
            ._postProcessStrategy
            .process();
        this.resetDirtyFlag();
    },
    /**
     * Remove all the obstacles.
     * @function
     */
    removeAllObstacles: function () {
        for (var i = 0, l = this._obstacles.length; i < l; i++) {
            this
                ._obstacles[i]
                .cleanup();
        }
        this._obstacles = [];
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.OBSTACLE);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Clean up all the obstacles for process.
     * @function
     * @private
     */
    _cleanupAllObstaclesForProcess: function () {
        for (var i = 0, l = this._obstacles.length; i < l; i++) {
            var obstacle = this._obstacles[i];
            obstacle.cleanupForProcess();
        }
    },
    /**
     * Add an obstacle.
     * @function
     * @param {cc.Node} node The node that represents the obstacle.
     * @param {Array.<cc.Point>|null} vertexArray Obstacle vertex array. If null the boundingbox of the node will be used as the vertex array automaticlly.
     * @param {Boolean} [isPolyogn=true] isPolyogn If the obstacle is a polygon (or polyline).
     * @return {ssr.LoS.Data.Obstacle} The obstacle instance that is added.
     */
    addObstacle: function (node, vertexArray, isPolygon) {
        var obstacle = this.findObstacle(node);
        if (obstacle) {
            cc.log("addObstacle findObstacle true: please use updateObstacle instead !!!");
        } else {
            obstacle = new ssr
                .LoS
                .Data
                .Obstacle(node, vertexArray, isPolygon);
            this
                ._obstacles
                .push(obstacle);
            this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.OBSTACLE);
        }
        return obstacle;
    },
    /**
     * Update an obstacle.
     * @function
     * @param {cc.Node} node The node that represents the obstacle.
     * @param {Array.<cc.Point>|null} vertexArray Obstacle vertex array. If null the boundingbox of the node will be used as the vertex array automaticlly.
     * @return {ssr.LoS.Data.Obstacle} The obstacle instance that is added.
     */
    updateObstacle: function (node, vertexArray) {
        var obstacle = this.findObstacle(node);
        if (!obstacle) {
            cc.log("updateObstacle not found");
            return;
        }
        obstacle.update(vertexArray);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.OBSTACLE);
        return obstacle;
    },
    /**
     * Remove an obstacle.
     * @function
     * @param {cc.Node} node The node that represents the obstacle.
     * @return {Boolean} True for remove succeeded, false for remove failed.
     */
    removeObstacle: function (node) {
        for (var i = 0, l = this._obstacles.length; i < l; i++) {
            if (node === this._obstacles[i].getNode()) {
                this
                    ._obstacles
                    .splice(i, 1);
                this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.OBSTACLE);
                return true;
            }
        }
        cc.log("removeObstacle not found");
        return false;
    },
    /**
     * Remove the given obstacles.
     * @function
     * @param {Array.<cc.Node>} nodes The nodes that represents the obstacles.
     */
    removeObstacles: function (nodes) {
        for (var i = 0, l = nodes.length; i < l; i++) {
            this.removeObstacle(nodes[i]);
        }
    },
    /**
     * Get all the obstacles.
     * @function
     * @return {Array.<ssr.LoS.Data.Obstacle>} The obstacle array.
     */
    getObstacles: function () {
        return this._obstacles;
    },
    /**
     * Find the obstacle that is bind to the cc.Node instance.
     * @function
     * @param {cc.Node} node The node that represents the obstacle.
     * @return {ssr.LoS.Data.Obstacle|null} The obstacle instance that is added.
     */
    findObstacle: function (node) {
        for (var i = 0, l = this._obstacles.length; i < l; i++) {
            if (node === this._obstacles[i].getNode()) {
                return this._obstacles[i];
            }
        }
        return null;
    },
    /**
     * Enable the force update feature.
     * @function
     */
    enableForceUpdate: function () {
        this._isForceUpdate = true;
    },
    /**
     * Disable the force update feature.
     * @function
     */
    disableForceUpdate: function () {
        this._isForceUpdate = false;
    },
    /**
     * Get if the force update feature is enabled.
     * @function
     * @return {Boolean} True for enabled, false for disabled.
     */
    isForceUpdate: function () {
        return this._isForceUpdate;
    },
    /**
     * Enable the auto screen boundary generate feature.
     * @function
     */
    enableAutoGenerateBoundary: function () {
        if (this._isAutoGenerateBoundary || this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            return;
        }
        this._isAutoGenerateBoundary = true;
        this._sightRect = new cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Disable the auto screen boundary generate feature.
     * @function
     */
    disableAutoGenerateBoundary: function () {
        if (!this._isAutoGenerateBoundary || this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            return;
        }
        this._isAutoGenerateBoundary = false;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Get if the auto screen boundary generate feature is enabled.
     * @function
     * @return {Boolean} True for enabled, false for disabled.
     */
    isAutoGenerateBoundary: function () {
        return this._isAutoGenerateBoundary;
    },
    /**
     * Get if sight boundary is locked.
     * @function
     * @return {Boolean} True for locked, false for not.
     */
    isLockSightBoundary: function () {
        return this._isLockSightBoundary;
    },
    /**
     * Lock sight boundary.
     * @function
     */
    lockSightBoundary: function () {
        if (this._isLockSightBoundary || this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            return;
        }
        this._isLockSightBoundary = true;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Unlock sight boundary.
     * @function
     */
    unlockSightBoundary: function () {
        if (!this._isLockSightBoundary || this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            return;
        }
        this._isLockSightBoundary = false;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Get if need to do the light source culling.
     * @function
     * @return {Boolean} True for need, false for not.
     */
    isNeedCulling: function () {
        return this._isNeedCulling;
    },
    /**
     * Get if the light source is culled because of out of the screen rectangle.
     * @function
     * @return {Boolean} True for need, false for not.
     */
    isCulled: function () {
        return this._isCulled;
    },
    /**
     * Enable source culling
     * @function
     */
    enableCulling: function () {
        if (this._mode == ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            cc.log("Culling enabled but will no take effect in current mode: UNLIMITED_RANGE !");
            return;
        }
        this._isNeedCulling = true;
    },
    /**
     * Disable source culling
     * @function
     */
    disableCulling: function () {
        this._isNeedCulling = false;
    },
    /**
     * Set the sight size (only valid for UNLIMITED_RANGE mode).
     * @function
     * @param {Number} width The width of the sight.
     * @param {Number} height The height of the sight.
     */
    setSightSize: function (width, height) {
        if (this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE || (this._sightRect.width === width && this._sightRect.height === height)) {
            return;
        }
        this.disableAutoGenerateBoundary();
        this.unlockSightBoundary();
        this._sightRect.width = width;
        this._sightRect.height = height;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Set the sight rect (only valid for UNLIMITED_RANGE mode).
     * @function
     * @param {cc.Rect} rect The rect of the sight.
     */
    setSightRect: function (rect) {
        if (this._mode != ssr.LoS.Constant.MODE.UNLIMITED_RANGE || (this._sightRect.x === rect.x && this._sightRect.y === rect.y && this._sightRect.width === rect.width && this._sightRect.height === rect.height)) {
            return;
        }
        this.disableAutoGenerateBoundary();
        this.lockSightBoundary();
        this._sightRect = rect;
        this.setDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY);
    },
    /**
     * Get the sight rect.
     * @function
     * @return {cc.Rect} The rect of the sight.
     */
    getSightRect: function () {
        return this._sightRect
    },
    /**
     * Return the count of the sight area vert.
     * @function
     * @return {Number} Sight area vert count.
     */
    getSightAreaVertCount: function () {
        var sightVertCount = 0;
        for (var i = 0, l = this._sightAreaArray.length; i < l; i++) {
            sightVertCount += (this._sightAreaArray[i].length - 1);
        }
        return sightVertCount;
    },
    /**
     * Return the count of the blocking edge.
     * @function
     * @return {Number} Blocking edge count.
     */
    getBlockingEdgeCount: function () {
        return this._blockingEdgeArray.length;
    },
    /**
     * Return the count of the ray.
     * @function
     * @return {Number} Ray count.
     */
    getRayCount: function () {
        return this._rayArray.length;
    },
    /**
     * Return the count of the potential blocking edge.
     * @function
     * @return {Number} Potential blocking edge count.
     */
    getPotentialBlockingEdgeCount: function () {
        return this._potentialBlockingEdgeArray.length;
    },
    /**
     * Return the count of the visible edge.
     * @function
     * @return {Number} Visible edge count.
     */
    getVisibleEdgeCount: function () {
        return this._visibleEdgeArray.length;
    },
    /**
     * Return the count of the hit point.
     * @function
     * @return {Number} Angle hit count.
     */
    getHitPointCount: function () {
        return this._hitPointArray.length;
    },
    /**
     * Return the count of the angle point.
     * @function
     * @return {Number} Angle point count.
     */
    getAnglePointCount: function () {
        return this._anglePointArray.length;
    },
    /**
     * Check if the given point is visible (within the visible area).
     * @function
     * @param {cc.Point} targetPoint The point to check.
     * @return {Boolean} True for visible, false for invisible.
     */
    isPointVisible: function (targetPoint) {
        return this
            ._toolStrategy
            .isPointVisible(targetPoint, this._sourcePosition, this._radius, this._sightBoundary, this._blockingEdgeArray);
    }
});
