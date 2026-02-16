/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */
/**
 * A Color element in a URDF.
 */
export default class UrdfColor {
    /**
     * @param {Object} options
     * @param {Element} options.xml - The XML element to parse.
     */
    constructor(options: {
        xml: Element;
    });
    r: number | undefined;
    g: number | undefined;
    b: number | undefined;
    a: number | undefined;
}
