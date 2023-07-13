import geojson2svg, { Options } from "geojson2svg";
import fs from "fs/promises";
import { optimize, loadConfig } from "svgo";

import {
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
  optimize as optimizeSvg,
  attributes,
} from "./args";

async function runAsyncCode() {
  console.log(`Reading: ${inFilePath}\n`);

  const geoJson = await fs.readFile(inFilePath, "utf8");

  const converter = new geojson2svg({
    mapExtent,
    attributes,
    fitTo,
  });

  console.log(`Converting...\n`);
  const svgContent = converter.convert(JSON.parse(geoJson));
  const svgImage = `<?xml version="1.0"?>
<svg baseprofile="tiny" fill="${fillColor}" width="${width}" height="${height}" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round"
  stroke-width="${strokeWeight}" version="1.2" viewbox="${viewBox}"  xmlns="http://www.w3.org/2000/svg">
  ${svgContent}
</svg>
`;

  const config = await loadConfig();
  let data = "";

  if (optimizeSvg) {
    const optimizedSvg = optimize(svgImage, config);
    data = optimizedSvg.data;
  } else {
    data = svgImage;
  }

  try {
    await fs.writeFile(outFilePath, data, {
      encoding: "utf8",
      flag: "w",
    });
    console.log(
      `\nSaving ${data.length.toLocaleString()} chars to ${outFilePath}\n`
    );
  } catch (error) {
    console.log(`\nFailed to create ${outFilePath}\nError: ${error}\n`);
    process.exit(1);
  }

  const stats = await fs.stat(outFilePath);
  const fileSizeInKilobytes = (stats.size / 1024) | 0;
  console.log(`\nDone. (${fileSizeInKilobytes.toLocaleString()} Kb)\n`);

  process.exit(0);
}

runAsyncCode();
