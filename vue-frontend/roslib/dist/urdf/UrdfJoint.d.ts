import { default as Pose } from '../math/Pose.js';
/**
 * A Joint element in a URDF.
 */
export default class UrdfJoint {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    name: string | null;
    type: string | null;
    parent: string | null | undefined;
    child: string | null | undefined;
    minval: number | undefined;
    maxval: number | undefined;
    origin: Pose;
}
