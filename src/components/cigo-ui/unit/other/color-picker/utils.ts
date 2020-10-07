export const revertHsvToRGBA = (
	rgbaProxy: any,
	hue: number,
	saturation: number,
	value: number
) => {
	let h = bound01(hue * 2, 360) * 6;
	let s = bound01(saturation * 100, 100);
	let v = bound01(value * 100, 100);

	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	const mod = i % 6;
	const r = [v, q, p, p, t, v][mod];
	const g = [t, v, v, q, p, p][mod];
	const b = [p, p, t, v, v, q][mod];

	rgbaProxy.r = Math.round(r * 255);
	rgbaProxy.g = Math.round(g * 255);
	rgbaProxy.b = Math.round(b * 255);
};

const bound01 = function(value: any, max: any) {
	if (isOnePointZero(value)) value = "100%";
	const processPercent = isPercentage(value);
	value = Math.min(max, Math.max(0, parseFloat(value)));
	if (processPercent) {
		value = parseInt(value * max + "", 10) / 100;
	}
	if (Math.abs(value - max) < 0.000001) {
		return 1;
	}
	return (value % max) / parseFloat(max);
};

const isOnePointZero = function(n: any) {
	return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
};

const isPercentage = function(n: any) {
	return typeof n === "string" && n.indexOf("%") !== -1;
};

const INT_HEX_MAP = new Map([
	[10, "A"],
	[11, "B"],
	[12, "C"],
	[13, "D"],
	[14, "E"],
	[15, "F"],
]);

export const toRgbFunc = (rgba: any) => {
	return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")";
};
export const toRgbaFunc = (rgba: any) => {
	return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
};
export const toRgbHex = (rgba: any) => {
	if (isNaN(rgba.r) || isNaN(rgba.g) || isNaN(rgba.b)) return "";
	return "#" + hexOne(rgba.r) + hexOne(rgba.g) + hexOne(rgba.b);
};
export const toRgbaHex = (rgba: any) => {
	if (isNaN(rgba.r) || isNaN(rgba.g) || isNaN(rgba.b) || isNaN(rgba.a))
		return "";
	return (
		"#" +
		hexOne(rgba.r) +
		hexOne(rgba.g) +
		hexOne(rgba.b) +
		hexOne(Math.round(rgba.a * 255))
	);
};

const hexOne = function(value: number) {
	value = Math.min(Math.round(value), 255);
	const high = Math.floor(value / 16);
	const low = value % 16;
	return "" + (INT_HEX_MAP.get(high) || high) + (INT_HEX_MAP.get(low) || low);
};
