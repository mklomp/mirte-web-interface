import { default as UrdfColor } from './UrdfColor.js';
/**
 * A Material element in a URDF.
 */
export default class UrdfMaterial {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    /** @type {string | null} */
    textureFilename: string | null;
    /** @type {UrdfColor | null} */
    color: UrdfColor | null;
    name: string | null;
    isLink(): boolean;
    assign(obj: any): any;
}
