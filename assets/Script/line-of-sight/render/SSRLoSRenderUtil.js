/****************************************************************************
 Copyright (c) 2017-2018 SuperSuRaccoon
 
 Site: http://www.supersuraccoon-cocos2d.com
 Mail: supersuraccoon@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const ssr = require('../namespace/SSRLoSNamespace');
 
/**
 * Render util class
 * @class
 */
ssr.LoS.Render.Util = function() {};

/**
 * Render the visible area.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderSightArea = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var sightAreaArray = losComponentCore.getSightArea();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = sightAreaArray.length; i < l; i ++) {
        var toDrawPoly = sightAreaArray[i].slice();
        if (losComponentCore.getMode() == ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
            toDrawPoly.push(sourcePosition);
        }
        else if (losComponentCore.getMode() == ssr.LoS.Constant.MODE.LIMITED_RANGE_WITH_FULL_ANGLE) {
            if (l > 1) {
                toDrawPoly.push(sourcePosition);
            }
        }
        else {
            toDrawPoly.push(sourcePosition);
        }
        for (var j = 0, ll = toDrawPoly.length; j < ll; j ++) {
            if (j == 0) {
                if (isIgnoreSourcePosition) {
                    render.moveTo(toDrawPoly[j].x - sourcePosition.x, toDrawPoly[j].y - sourcePosition.y);
                }
                else {
                    render.moveTo(toDrawPoly[j].x, toDrawPoly[j].y);
                }
            }
            else {
                if (isIgnoreSourcePosition) {
                    render.lineTo(toDrawPoly[j].x - sourcePosition.x, toDrawPoly[j].y - sourcePosition.y);
                }
                else {
                    render.lineTo(toDrawPoly[j].x, toDrawPoly[j].y);
                }
            }
        }
    }
    render.fill();
};

/**
 * Render all the verts.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderSightVert = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var sightAreaArray = losComponentCore.getSightArea();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = sightAreaArray.length; i < l; i ++) {
        for (var j = 0; j < sightAreaArray[i].length; j ++) {
            if (isIgnoreSourcePosition) {
                render.circle(sightAreaArray[i][j].x - sourcePosition.x, sightAreaArray[i][j].y - sourcePosition.y, 1);
            }
            else {
                render.circle(sightAreaArray[i][j].x, sightAreaArray[i][j].y, 1);
            }
        }
    }
    render.stroke();
};
/**
 * Render all the blocking edges.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderBlockingEdge = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var blockingEdgeArray = losComponentCore.getBlockingEdgeArray();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = blockingEdgeArray.length; i < l; i ++) {
        if (isIgnoreSourcePosition) {
            render.moveTo(blockingEdgeArray[i].getStartPoint().x - sourcePosition.x, blockingEdgeArray[i].getStartPoint().y - sourcePosition.y);
            render.lineTo(blockingEdgeArray[i].getEndPoint().x - sourcePosition.x, blockingEdgeArray[i].getEndPoint().y - sourcePosition.y);
        }
        else {
            render.moveTo(blockingEdgeArray[i].getStartPoint().x, blockingEdgeArray[i].getStartPoint().y);
            render.lineTo(blockingEdgeArray[i].getEndPoint().x, blockingEdgeArray[i].getEndPoint().y);
        }
    }
    render.stroke();
};
/**
 * Render all the potential blocking edges.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderPotentialBlockingEdge = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var potentialBlockingEdgeArray = losComponentCore.getPotentialBlockingEdgeArray();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = potentialBlockingEdgeArray.length; i < l; i ++) {
        if (isIgnoreSourcePosition) {
            render.moveTo(potentialBlockingEdgeArray[i].getStartPoint().x - sourcePosition.x, potentialBlockingEdgeArray[i].getStartPoint().y - sourcePosition.y);
            render.lineTo(potentialBlockingEdgeArray[i].getEndPoint().x - sourcePosition.x, potentialBlockingEdgeArray[i].getEndPoint().y - sourcePosition.y);
        }
        else {
            render.moveTo(potentialBlockingEdgeArray[i].getStartPoint().x, potentialBlockingEdgeArray[i].getStartPoint().y);
            render.lineTo(potentialBlockingEdgeArray[i].getEndPoint().x, potentialBlockingEdgeArray[i].getEndPoint().y);
        }
    }
    render.stroke();
};
/**
 * Render all the visible edges.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderVisibleEdge = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var visibleEdgeArray = losComponentCore.getVisibleEdgeArray();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = visibleEdgeArray.length; i < l; i ++) {
        if (isIgnoreSourcePosition) {
            render.moveTo(visibleEdgeArray[i][0].x - sourcePosition.x, visibleEdgeArray[i][0].y - sourcePosition.y);
            render.lineTo(visibleEdgeArray[i][1].x - sourcePosition.x, visibleEdgeArray[i][1].y - sourcePosition.y);
        }
        else {
            render.moveTo(visibleEdgeArray[i][0].x, visibleEdgeArray[i][0].y);
            render.lineTo(visibleEdgeArray[i][1].x, visibleEdgeArray[i][1].y);
        }
    }
    render.stroke();
};
/**
 * Render all the hit points.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderHitPoint = function(losComponentCore, render, isIgnoreSourcePosition) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var hitPointArray = losComponentCore.getHitPointArray();
    var sourcePosition = losComponentCore.getPosition();
    for (var i = 0, l = hitPointArray.length; i < l; i ++) {
        var hitPoint = hitPointArray[i].getHitPoint();
        if (isIgnoreSourcePosition) {
            render.circle(hitPoint.x - sourcePosition.x, hitPoint.y - sourcePosition.y, 1);
        }
        else {
            render.circle(hitPoint.x, hitPoint.y, 1);
        }
    }
    render.stroke();
};
/**
 * Render all the rays.
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderRay = function(losComponentCore, render, isIgnoreSourcePosition, node) {
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var hitPointArray = losComponentCore.getHitPointArray();
    var sourcePosition = node.getPosition();
    for (var i = 0, l = hitPointArray.length; i < l; i ++) {
        var hitPoint = hitPointArray[i].getHitPoint();
        if (isIgnoreSourcePosition) {
            render.moveTo(0, 0);
            render.lineTo(hitPoint.x - sourcePosition.x, hitPoint.y - sourcePosition.y);
        }
        else {
            render.moveTo(sourcePosition.x, sourcePosition.y);
            render.lineTo(hitPoint.x, hitPoint.y);
        }
    }
    render.stroke();
};

/**
 * Render the circle of the sight range (except UNLIMITED_RANGE).
 * @function
 * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core.
 * @param {cc.DrawNode} render The target to render in.
 */
ssr.LoS.Render.Util.renderSightRange = function(losComponentCore, render, isIgnoreSourcePosition) { 
    if (losComponentCore.getMode() == ssr.LoS.Constant.MODE.UNLIMITED_RANGE) {
        return;
    }
    isIgnoreSourcePosition = isIgnoreSourcePosition == undefined ? false : isIgnoreSourcePosition;
    var sourcePosition = losComponentCore.getPosition();
    if (isIgnoreSourcePosition) {
        render.circle(0, 0, losComponentCore.getRadius());
    }
    else {
        render.circle(sourcePosition.x, sourcePosition.y, losComponentCore.getRadius());
    }
    render.fill();
};
