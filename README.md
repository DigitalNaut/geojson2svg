# How to Convert GeoJSON file to SVG using geojson2svg

This repo demonstrates how to use the [geojson2svg](https://github.com/gagan-bansal/geojson2svg/) library to convert a GeoJSON file to SVG. It also uses [SVGO](https://github.com/svg/svgo) to compress the files to a minimum size.

It uses [Yargs](https://yargs.js.org/) for handling command line arguments.

## Background

The GeoJSON file is a standard format for storing geographic data and the SVG file is a standard format for storing vector graphics. The SVG file can be used to create a map of the geographic data, as in my case, to display using [React Leaflet](https://react-leaflet.js.org/).

The advantage of using an SVG instead of a GeoJSON file:

- Compactness: taking up almost half the size of an average GeoJSON file
- Ease of use: SVG files also easier to work with, as it is a standard format for storing vector graphics and can be manipulated on the fly using HTML, JSX or plain JS

This conversion is ideal for taking geographic data from [Natural Earth](https://www.naturalearthdata.com/), processing the `.shp` files with [QGIS](https://qgis.org/) and converting it to an SVG file for use in a React project.

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
  -w, --width                    Width of the output SVG [number] [default: 512]
  -h, --height                   Height of the output SVG[number] [default: 250]
  -t, --top                      Top extent of the map    [number] [default: 90]
  -b, --bottom                   Bottom extent of the map[number] [default: -90]
  -l, --left                     Left extent of the map [number] [default: -180]
  -r, --right                    Right extent of the map [number] [default: 180]
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

```bash
pnpm start -i map.geojson -o map.svg -w 512 -h 250 -t 90 -b "-90" -l "-180" -r 180 --stroke-color "#ffffff" --stroke-weight 0.1 --fill-color "#7c7c7c" --fit-to height --optimize true -a "properties.ADMIN" "properties.ADM0_A3 A3"
```

> Note that the input and output files are placed in the `in` and `out` directories respectively at the root of the project.

This will transform:

```jsonc
// ./in/map.geojson
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
  ]
}
```

to:

```jsx
// ./out/map.svg
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
  <path d="m300.498 159.86-..." A3="ZWE" ADMIN="Zimbabwe" />
</svg>
```

## Disclosure

This project was created in part using Copilot, particularly the handling of command line arguments and part of this documentation.

## Disclaimer

This project is provided as-is and is not meant to be used in production. It is only meant to be used for personal projects and for learning purposes. However, improvements are welcome.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license. Feel free to use it however you like.
