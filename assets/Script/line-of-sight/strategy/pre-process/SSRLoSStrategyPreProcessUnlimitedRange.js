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

const ssr = require('../../namespace/SSRLoSNamespace'); 
const PreProcessBase = require('./SSRLoSStrategyPreProcessBase');

/**
 * @classdesc Pre process strategy base class for <b>UNLIMITED_RANGE mode only </b>. <br><br>
 * This mode is a little bit special compared to the other modes since there need to be a boundary for the sight. <br>
 * As for LIMITED_RANGE_WITH_FULL_ANGLE mode, the bounding circle is the implicit boundary for the sight. <br>
 * As for LIMITED_RANGE_WITH_XXX_REFLEX_ANGLE mode, the bounding sector is the implicit boundary for the sight. <br><br>
 * 
 * In this mode (UNLIMITED_RANGE), the users have the following choice related to the boundary: <br>
 * <b>1. Generate the boundary automatically (default) </b> <br>
 *     This is the default feature (enabled automatically) and will generate the boundary based on the cc.winSize for the users. <br>
 * <b>2. Speicify the sight size</b> <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; # Firstly, this will disable the auto generate boundary feature automatically. <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; # Secondly, this will create a boundary (rectangle) around the source position and update it automatically if possible (eg. when the source position updated). <br>
 * <b>3. Speicify the sight rect</b> <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; # Firstly, this will disable the auto generate boundary feature automatically. <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; # Secondly, this will enable the lock boundary feature automatically. <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; # Thirdly, this will create a boundary with the rectangle and it will never be updated. <br><br>
 *
 * @class
 * @extends ssr.LoS.Strategy.PreProcess.Base
 * @prop {ssr.LoS.Component.Core|null}                currentRectangle                - The rectangle that is currently in use.
 *
 */
ssr.LoS.Strategy.PreProcess.UnlimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.PreProcess.UnlimitedRange# */ {
    name: "ssr.LoS.Strategy.PreProcess.UnlimitedRange",
    "extends": PreProcessBase,
    /**
     * The constructor
     * @function
     * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core instance
     */
    ctor:function () {
        this._currentRectangle = null;
    },
    /**
     * Generate the boundary (rectangle). <br><br>
     * The rules for generating boundary rectangle: <br>
     * 1. Generate a rectangle based on the source position with the size of cc.winSize. <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; Condition: <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; (<b> Auto screen boundary generate feature enabled. </b>). <br>
     * 2. Generate a rectangle based on the source position with the specified size. <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; Condition: <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; (<b> Auto screen boundary generate feature disabled. </b>). <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; (<b> Sight size specified. </b>). <br>
     * 3. Generate a fixed rectangle based on the specified rect. <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; Condition: <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; (<b> Auto screen boundary generate feature disabled. </b>). <br>
     * &nbsp;&nbsp;&nbsp;&nbsp; (<b> Sight rect specified. </b>). <br>
     *
     * @function
     * @see ssr.LoS.Component.Core#setSightSize
     * @see ssr.LoS.Component.Core#setSightRect
     * @see ssr.LoS.Component.Core#enableAutoGenerateBoundary
     * @see ssr.LoS.Component.Core#disableAutoGenerateBoundary
     */
    generateBoundary: function() {    
        var rect = null;
        var sightRect = this._losComponentCore.getSightRect();
        var position = this._losComponentCore.getPosition();
        if (this._losComponentCore.isAutoGenerateBoundary()) {
            // auto generate a screen size rect aroud the source position
            rect = this._losComponentCore.generateScreenRect();
        }
        else {
            if (this._losComponentCore.isLockSightBoundary()) {
                // fixed sight rect
                rect = sightRect;
            }
            else {
                // generate a custom size rect aroud the source position
                rect = new cc.rect(
                    position.x - sightRect.width / 2, 
                    position.y - sightRect.height / 2, 
                    sightRect.width, 
                    sightRect.height
                )
            }
        }
        return new ssr.LoS.Data.BoundaryRectangle(rect);
    }
});
