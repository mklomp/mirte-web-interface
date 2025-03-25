import { default as UrdfVisual } from './UrdfVisual.js';
/**
 * A Link element in a URDF.
 */
export default class UrdfLink {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    name: string | null;
    visuals: UrdfVisual[];
}
