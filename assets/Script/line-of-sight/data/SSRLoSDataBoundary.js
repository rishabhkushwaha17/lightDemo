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
 * ssr.LoS.Data.Boundary
 * @class
 * @extends cc.Class
 * @prop {ssr.LoS.Constant.BOUNDARY_TYPE}               type                         - The boundary type.
 */
ssr.LoS.Data.Boundary = cc.Class( /** @lends ssr.LoS.Data.Boundary# */ {
    name: "ssr.LoS.Data.Boundary",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {ssr.LoS.Constant.BOUNDARY_TYPE} type The boundary type. 
     */
    ctor:function() {
        this._type = arguments[0];
    },
    /**
     * Get the type of the boundary.
     * @function
     * @return {ssr.LoS.Constant.BOUNDARY_TYPE} The boundary type. 
     */
    getType:function() {
        return this._type;
    }
});
