# How to Convert GeoJSON file to SVG using geojson2svg

![World Map](/images/world_map.svg "A detailed world map in only 92.6 KB!")

This repo demonstrates how to use the [geojson2svg](https://github.com/gagan-bansal/geojson2svg/) library by @gagan-bansal to convert a GeoJSON file to SVG. It also uses [SVGO](https://github.com/svg/svgo) to compress the files to a minimum size.

## Background

The GeoJSON file is a standard format for storing geographic data and the SVG file is a standard format for storing vector graphics. The SVG file can be used to create a map of the geographic data, as in my case, to display using [React Leaflet](https://react-leaflet.js.org/).

The advantage of using an SVG instead of a GeoJSON file:

- **Compactness:** They take up almost half the size of an average GeoJSON file.
- **Ease of use:** I find the SVG files easier to work with, as it is a standard format for storing vector graphics that can be manipulated on the fly using HTML, JSX or plain JS.

This conversion is ideal for taking geographic data from [Natural Earth](https://www.naturalearthdata.com/) after processing the `.shp` files with [QGIS](https://qgis.org/). You can then use the SVG file directly in an HTML file or in a React project.

To learn how to use QGIS, see this wonderful [YouTube playlist](https://www.youtube.com/playlist?list=PL7HotvlLKHCs9nD1fFUjSOsZrsnctyV2R) by [Steven Bernard](https://www.youtube.com/@stevenbernard3505).

## Installation

This project uses [pnpm](https://pnpm.io/) as the package manager.

To install the dependencies, run:

```bash
pnpm i
```

## Usage

```bash
pnpm start
```

Default command line arguments:

```bash
Options:
      --help                     Show help                             [boolean]
      --version                  Show version number                   [boolean]
  -i, --input                    Input file path
                                               [string] [default: "map.geojson"]
  -o, --output                   Output file path  [string] [default: "map.svg"]
  -w, --width                    Width of the output SVG [number] [default: 250]
  -h, --height                   Height of the output SVG[number] [default: 250]
  -t, -N, --top, --north         Top extent of the map
                                          [number] [default: 20037508.342789244]
  -b, -S, --bottom, --south      Bottom extent of the map
                                         [number] [default: -20037508.342789244]
  -l, -W, --left, --west         Left extent of the map
                                         [number] [default: -20037508.342789244]
  -r, -E, --right, --east        Right extent of the map
                                          [number] [default: 20037508.342789244]
      --stroke-color, --stroke   Color of the stroke
                                                   [string] [default: "#ffffff"]
      --stroke-weight, --weight  Weight of the stroke    [number] [default: 0.1]
      --fill-color, --fill       Color of the fill [string] [default: "#7c7c7c"]
      --fit-to, --fit            Fit the map to width or height
                       [string] [choices: "width", "height"] [default: "height"]
      --optimize, --opt          Optimize the output SVG
                                                       [boolean] [default: true]
  -a, --attributes               To include an attribute use 'name', and 'name
                                 newName' to replace       [array] [default: []]
```

This list is available using `pnpm start --help`.

For `npm` or `yarn`:

```bash
npm start -- --help
```

```bash
yarn start -- --help
```

### Example

To process a GeoJSON file named `map.geojson` in the `in` directory and output it as an SVG file named `map.svg` in the `out` directory, run:

```bash
pnpm start
```

I've included a GeoJSON file of Mexico in the `in` directory: [mexico.geojson](/in/mexico.geojson).

To convert it to an SVG file, run:

```bash
pnpm start -i mexico.geojson -o mexico.svg`
```

> Note: The input and output files are placed in the `in` and `out` directories respectively at the root of the project.

---

A full example with all the command line arguments would be:

```bash
pnpm start -i world-map.geojson -o world-map.svg -w 512 -h 250 -N 20037508.342789244 -S "-20037508.342789244" -W "-20037508.342789244" -E 20037508.342789244 --stroke-color "#ffffff" --stroke-weight 0.1 --fill-color "#7c7c7c" --fit-to height --optimize true -a "properties.ADMIN" "properties.ADM0_A3 A3"
```

This will transform:

```jsonc
// ./in/world-map.geojson
{
  "type": "FeatureCollection",
  "name": "simplified_map",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  "features": [
    {
      "type": "Feature",

      "properties": {
        "ADMIN": "Zimbabwe",
        "ADM0_ISO": "ZWE"
        // ...
      },

      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [31.287890625000017, -22.402050781250011],
              [30.916113281250006, -22.290722656250011]
              // ...
            ]
          ]
        ]
      }
    }

    // Other countries...
  ]
}
```

into:

```jsx
// ./out/world-map.svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="512"
  height="250"
  fill="#7c7c7c"
  stroke="#fff"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width=".1"
  baseprofile="tiny"
  version="1.2"
  viewbox="0 0 512 250"
>
  <path d="m300.498 159.86- ..." A3="ZWE" ADMIN="Zimbabwe" /> // <- attributes copied over from GeoJSON
  // Other countries...
</svg>
```

> Note: The image may not be centered on the SVG. See [below](#troubleshooting).

## Troubleshooting

**Problem:** Sometimes the bounds of the data are different from those of the map.

**Solution:** This can be fixed by using the `--north`, `--south`, `--east` and `--west` command line arguments.

1. In QGIS, select the layer you want to export, then right-click, select `Export` > `Save Feature As...` and in the dialog box under `Extent (current: none)`, check the checkbox and click `Current Layer Extent`. Write down the values and export it as a GeoJSON file to the `./in` folder.

2. Run the command with the values you wrote down: `pnpm start -i mexico.geojson -o mexico.svg -N 32.715332031 -W "-118.401367188" -S 14.545410156 -E "-86.696289063" -w 460 -h 250 --fill "#006b17"`. This will center the paths on the SVG:

This may require trial and error.

![Mexico](/out/mexico.svg)

## Disclaimer

This project is provided as-is and is not meant to be used in production. It is only meant to be used for personal projects and for learning purposes. However, improvements are welcome.

## Disclosure

This project was created in part using Copilot, particularly the handling of command line arguments and part of this documentation.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license. Feel free to use it however you like.
