import fs from "fs";
import path from "path";
import yargs from "yargs";

interface Options {
  input: string;
  output: string;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  strokeColor: string;
  strokeWeight: number;
  fillColor: string;
  fitTo: "width" | "height";
  optimize: boolean;
}

const argv = yargs
  .option("input", {
    alias: "i",
    describe: "Input file path",
    default: "map.geojson",
    type: "string",
  })
  .option("output", {
    alias: "o",
    describe: "Output file path",
    default: "map.svg",
    type: "string",
  })
  .option("width", {
    alias: "w",
    describe: "Width of the output SVG",
    default: 512,
    type: "number",
  })
  .option("height", {
    alias: "h",
    describe: "Height of the output SVG",
    default: 250,
    type: "number",
  })
  .option("top", {
    describe: "Top extent of the map",
    default: 90,
    type: "number",
  })
  .option("bottom", {
    describe: "Bottom extent of the map",
    default: -90,
    type: "number",
  })
  .option("left", {
    describe: "Left extent of the map",
    default: -180,
    type: "number",
  })
  .option("right", {
    describe: "Right extent of the map",
    default: 180,
    type: "number",
  })
  .option("stroke-color", {
    describe: "Color of the stroke",
    default: "#ffffff",
    type: "string",
  })
  .option("stroke-weight", {
    describe: "Weight of the stroke",
    default: 0.1,
    type: "number",
  })
  .option("fill-color", {
    describe: "Color of the fill",
    default: "#7c7c7c",
    type: "string",
  })
  .option("fit-to", {
    describe: "Fit the map to width or height",
    default: "height",
    choices: ["width", "height"],
    type: "string",
  })
  .option("optimize", {
    describe: "Optimize the output SVG",
    default: true,
    type: "boolean",
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
      throw new Error(
        "Invalid 'fill-color' value. Expected format: #000 or #000000"
      );
    }

    if (!validateColor.test(argv["stroke-color"])) {
      throw new Error(
        "Invalid 'stroke-color' value. Expected format: #000 or #000000"
      );
    }

    if (argv["fit-to"] !== "width" && argv["fit-to"] !== "height") {
      throw new Error("Invalid 'fit-to' value. Expected: 'width' or 'height'");
    }

    return true;
  })
  .parseSync() as Options;

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
} = argv;

const viewBox = `0 0 ${width} ${height}`;
const mapExtent = {
  left: argv.left,
  bottom: argv.bottom,
  right: argv.right,
  top: argv.top,
};

const inFilePath = path.resolve(__dirname, "../in", inputFilePath);
const outFilePath = path.resolve(__dirname, "../out", outputFilePath);

if (!fs.existsSync(inFilePath)) {
  throw new Error(`File not found: ${inFilePath}`);
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
};
