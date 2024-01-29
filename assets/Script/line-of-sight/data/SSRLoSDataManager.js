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
 * @classdesc Common data manager class which support object pool feature.
 * @class
 * @extends cc.Class
 * @prop {Boolean}                         isPoolEnabled                      - If object pool is enabled.
 */
ssr.LoS.Data.Manager = cc.Class( /** @lends ssr.LoS.Data.Manager# */ {
    name: "ssr.LoS.Data.Manager",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     */
    ctor:function() {  
        this._isPoolEnabled = false;
    },
    /**
     * Enable object pool feature.
     * @function
     */
    enablePool:function() {
        this._isPoolEnabled = true;
    },
    /**
     * Disable object pool feature.
     * @function
     */
    disablePool:function() {
        this._isPoolEnabled = false;
    },
    /**
     * Create a instance of given class.
     * @function
     * @param {cc.Class} cls
     */
    create:function(cls) {
        var instance = null;
        if (this._isPoolEnabled) {
            instance = ssr.LoS.Data.Pool.get(cls);
        }
        if (!instance) {
            instance = new cls();
        }
        return instance;
    },
    /**
     * Free the given object.
     * @function
     * @param {Object} obj
     */
    free:function(obj) {
        if (this._isPoolEnabled) {
            ssr.LoS.Data.Pool.put(obj);
        }
        else {
            obj = null;
        }
    }
});

ssr.LoS.Data.Manager.instance = null;
ssr.LoS.Data.Manager.firstUseDirector = true;

/**
 * Singleton for ssr.LoS.Data.Manager
 * @function
 * @return {ssr.LoS.Data.Manager}
 */
ssr.LoS.Data.Manager.getInstance = function () {
    if (ssr.LoS.Data.Manager.firstUseDirector) {
        ssr.LoS.Data.Manager.firstUseDirector = false;
        ssr.LoS.Data.Manager.instance = new ssr.LoS.Data.Manager;
    }
    return ssr.LoS.Data.Manager.instance;
};

