# How to Convert GeoJSON file to SVG using geojson2svg

This repo uses the [geojson2svg](https://github.com/gagan-bansal/geojson2svg/) library to convert a GeoJSON file to SVG. The GeoJSON file is a standard format for storing geographic data and the SVG file is a standard format for storing vector graphics. The SVG file can be used to create a map of the geographic data, as in my case, to display using [React Leaflet](https://react-leaflet.js.org/).

The advantage of using an SVG instead of a GeoJSON file:

- Compactness: taking up almost half the size of an average GeoJSON file
- Ease of use: SVG files also easier to work with, as it is a standard format for storing vector graphics and can be manipulated on the fly using HTML, JSX or plain JS

## Installation

```bash
pnpm i
```

## Usage

```bash
pnpm start
```

## Disclosure

This project was created using Copilot.

## Disclaimer

This project is provided as-is and is not meant to be used in production. It is only meant to be used for personal projects and for learning purposes. However, improvements are welcome.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license. Feel free to use it however you like.
