/***
 * Repo: https://github.com/gagan-bansal/geojson2svg
 * For types discussion see: https://github.com/gagan-bansal/geojson2svg/issues/29
 */
declare module "geojson2svg" {
  import { GeoJSON } from "geojson";

  export interface ScreenDims {
    width: number;
    height: number;
  }

  export interface Origin {
    x: number;
    y: number;
  }

  export interface Extent {
    left: number;
    right: number;
    bottom: number;
    top: number;
  }

  export interface StaticAttribute {
    type: "static";

    /** The output attribute name */
    property: string;

    /** The output attribute value */
    value: string;
  }

  export interface DynamicAttribute {
    type: "dynamic";

    /** The geojson source property name holding the output attribute value
     * ... also used as the output attribute name
     */
    property: string;

    /** Override the output attribute name */
    key?: string;
  }

  export interface ObjectAttributes {
    [key: string]: string;
  }

  export interface Options {
    /** viewportSize is object containing width and height in pixels */
    viewportSize?: ScreenDims;

    /** Coordinates should be in same projection as of geojson. Default maps extent are of Web Mercator projection (EPSG:3857). */
    mapExtent?: Extent;

    /** Output format
     * 'svg' - svg element string is returned like '<path d="M0,0 20,10 106,40"/>'
     * 'path' - path 'd' value is returned 'M0,0 20,10 106,40' a linestring
     */
    output?: "svg" | "path";

    /** Fit output svg map to width or height. */
    fitTo?: "width" | "height";

    /** a number, precision of output svg coordinates. */
    precision?: number;

    /** Should multigeojson be exploded to many svg elements or not. default is false. */
    explode?: boolean;

    /** Attributes which are required to attach as SVG attributes from features can be passed here as list of path in feature or json object for static attributes */
    attributes?:
      | (StaticAttribute | DynamicAttribute | ObjectAttributes | string)[]
      | ObjectAttributes;

    /** Return geojson point objects as SVG circle elements. default is false. */
    pointAsCircle?: boolean;

    /** radius of point svg element */
    r?: number;

    /** function that will be called on every geojson conversion with output string as one input variable */
    callback?: (svgString: string) => void;
  }

  export default class g2svg {
    public constructor(options?: Options);
    public convert(geojson: GeoJSON | any, options?: Options): string;
  }
}
