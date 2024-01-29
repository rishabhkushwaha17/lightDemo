// Import required modules
import ssr from '../namespace/SSRLoSNamespace';

// Class representing LoS configuration
class LoSConfig {
    // Define modules to be activated in Native if JSBinding is available
    static Modules = [
        "Core", 
        "Util", 
        // "Obstacle", 
        // "Mask",
        // "RenderBase",
        // "RenderBlockingEdge",
        // "RenderHitPoint",
        // "RenderPotentialBlockingEdge",
        // "RenderRay",
        // "RenderSightArea",
        // "RenderSightLight",
        // "RenderSightRange",
        // "RenderSightVert",
        // "RenderVisibleEdge",
        // "RenderSightLight",
    ];

    /**
     * Check if the module is available in JSBinding.
     * @param {String} moduleName - The module name.
     * @return {Boolean} - True for available, false for not.
     */
    static isModuleNativeImplemented(moduleName) {
        if(cc.sys.isNative) {
            const moduleNativeName = moduleName + "Native";
            return ssr.LoS.Component[moduleNativeName] || ssr.LoS.Data[moduleNativeName];
        } else {
            return false;
        }
    }

    /**
     * Enable the module in JSBinding.
     * @param {String} moduleName - The module name.
     */
    static enableModuleNativeImplementation(moduleName) {
        if(cc.sys.isNative) {
            const moduleNativeName = moduleName;
            if (ssr.LoS.Component[moduleName]) {
                ssr.LoS.Component[moduleName] = ssr.LoS.Component[moduleNativeName];
            }
            if (ssr.LoS.Data[moduleName]) {
                ssr.LoS.Data[moduleName] = ssr.LoS.Data[moduleNativeName];
            }
            if (ssr.LoS[moduleName]) {
                ssr.LoS[moduleName] = ssr.LoS[moduleNativeName];
            }
        }
    }

    /**
     * Try to enable all the modules in JSBinding in Native. This will be called on boot.
     */
    static initModules() {
        if(cc.sys.isNative) {
            for (const moduleName of LoSConfig.Modules) {
                if (LoSConfig.isModuleNativeImplemented(moduleName)) {
                    LoSConfig.enableModuleNativeImplementation(moduleName);
                    console.log("isModuleNativeImplemented ok:", moduleName);
                } else {
                    console.log("isModuleNativeImplemented na:", moduleName);
                }
            }
        }
    }
}

// Call the initModules function on boot
LoSConfig.initModules();
