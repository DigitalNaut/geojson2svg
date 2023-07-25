import fs from "fs";
import path from "path";
import yargs from "yargs";

import type { Options, DynamicAttribute, ScreenDims, Extent } from "geojson2svg";

type InputOptions = {
  input: string;
  output: string;
  strokeColor: string;
  strokeWeight: number;
  fillColor: string;
  fitTo: Options["fitTo"];
  optimize: boolean;
  attributes: DynamicAttribute[];
} & ScreenDims &
  Extent;

const argv = yargs
  .option("input", {
    alias: "i",
    describe: "Input file path",
    default: "map.geojson",
    type: "string",
    coerce: (input: string) => {
      const path = Array.isArray(input) ? input[0] : input;
      return path.endsWith(".geojson") ? path : `${path}.geojson`;
    },
  })
  .option("output", {
    alias: "o",
    describe: "Output file path",
    default: "map.svg",
    type: "string",
    coerce: (output: string) => {
      const path = Array.isArray(output) ? output[0] : output;
      return path.endsWith(".svg") ? path : `${path}.svg`;
    },
  })
  .option("width", {
    alias: "w",
    describe: "Width of the output SVG",
    default: 250,
    type: "number",
  })
  .option("height", {
    alias: "h",
    describe: "Height of the output SVG",
    default: 250,
    type: "number",
  })
  .option("top", {
    alias: ["t", "north", "N"],
    describe: "Top extent of the map",
    type: "number",
    default: 20037508.342789244,
  })
  .option("bottom", {
    alias: ["b", "south", "S"],
    describe: "Bottom extent of the map",
    type: "number",
    default: -20037508.342789244,
  })
  .option("left", {
    alias: ["l", "west", "W"],
    describe: "Left extent of the map",
    type: "number",
    default: -20037508.342789244,
  })
  .option("right", {
    alias: ["r", "east", "E"],
    describe: "Right extent of the map",
    type: "number",
    default: 20037508.342789244,
  })
  .option("stroke-color", {
    alias: "stroke",
    describe: "Color of the stroke",
    default: "#ffffff",
    type: "string",
  })
  .option("stroke-weight", {
    alias: "weight",
    describe: "Weight of the stroke",
    default: 0.1,
    type: "number",
  })
  .option("fill-color", {
    alias: "fill",
    describe: "Color of the fill",
    default: "#7c7c7c",
    type: "string",
  })
  .option("fit-to", {
    alias: "fit",
    describe: "Fit the map to width or height",
    default: "height",
    choices: ["width", "height"],
    type: "string",
  })
  .option("optimize", {
    alias: "opt",
    describe: "Optimize the output SVG",
    default: true,
    type: "boolean",
  })
  .option("attributes", {
    alias: "a",
    describe: "To include an attribute use 'name', and 'name newName' to replace",
    type: "array",
    default: [],
    coerce: (attributes: string[]) => {
      return attributes.map((attribute) => {
        const [property, key] = attribute.split(" ");
        return {
          type: "dynamic",
          property,
          key,
        };
      });
    },
  })
  .check((argv) => {
    if (argv.width < 1 || argv.width > 10000) {
      throw new Error("Invalid 'width' value. Expected: 1-10000");
    }

    if (argv.height < 1 || argv.height > 10000) {
      throw new Error("Invalid 'height' value. Expected: 1-10000");
    }

    const validateColor = /^#([0-9a-f]{3}){1,2}$/i;

    if (!validateColor.test(argv["fill-color"])) {
      throw new Error("Invalid 'fill-color' value. Expected format: #000 or #000000");
    }

    if (!validateColor.test(argv["stroke-color"])) {
      throw new Error("Invalid 'stroke-color' value. Expected format: #000 or #000000");
    }

    if (argv["fit-to"] !== "width" && argv["fit-to"] !== "height") {
      throw new Error("Invalid 'fit-to' value. Expected: 'width' or 'height'");
    }

    if (argv["stroke-weight"] < 0.1 || argv["stroke-weight"] > 10) {
      throw new Error("Invalid 'stroke-weight' value. Expected: 0.1-10");
    }

    if (Number.isNaN(argv["top"])) {
      throw new Error("Invalid 'top' value. Expected: number");
    }

    if (Number.isNaN(argv["bottom"])) {
      throw new Error("Invalid 'bottom' value. Expected: number");
    }

    if (Number.isNaN(argv["left"])) {
      throw new Error("Invalid 'left' value. Expected: number");
    }

    if (Number.isNaN(argv["right"])) {
      throw new Error("Invalid 'right' value. Expected: number");
    }

    return true;
  })
  .parseSync() as InputOptions;

const {
  input: inputFilePath,
  output: outputFilePath,
  width,
  height,
  strokeColor,
  strokeWeight,
  fillColor,
  fitTo,
  optimize,
  attributes,
  top,
  bottom,
  left,
  right,
} = argv;

const viewBox = `0 0 ${width} ${height}`;
const mapExtent: Extent = { left, bottom, right, top };

const inFilePath = path.resolve(__dirname, "../in", inputFilePath);
const outFilePath = path.resolve(__dirname, "../out", outputFilePath);

if (!fs.existsSync(inFilePath)) {
  console.log(`\nFailed to find ${inFilePath}\n`);
  process.exit(1);
}

export {
  width,
  height,
  fillColor,
  strokeColor,
  strokeWeight,
  fitTo,
  viewBox,
  inFilePath,
  outFilePath,
  mapExtent,
  optimize,
  attributes,
};
