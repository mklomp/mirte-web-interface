/**
 * A URDF Model can be used to parse a given URDF into the appropriate elements.
 */
export default class UrdfModel {
    /**
     * @param {Object} options
     * @param {Element | null} [options.xml] - The XML element to parse.
     * @param {string} [options.string] - The XML element to parse as a string.
     */
    constructor(options: {
        xml?: Element | null | undefined;
        string?: string | undefined;
    });
    materials: {};
    links: {};
    joints: {};
    name: string | null;
}
