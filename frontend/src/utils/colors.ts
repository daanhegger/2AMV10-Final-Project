/**
 * From stackoverflow
 * Convert a number from 0...100 to a color string from red...green
 */
export const numberToColorHsl = (i: number): string => {
  var hue = (i * 1.2) / 360;
  var rgb = hslToRgb(hue, 1, 0.5);
  return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
};

// Helper function for: numberToColorHsl
const hslToRgb = (h: number, s: number, l: number) => {
  var r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};