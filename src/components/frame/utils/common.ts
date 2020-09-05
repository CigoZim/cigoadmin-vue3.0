/** 创建标签随机颜色 */
export function makeRandomColor(
	opacity: number,
	start: number,
	end: number
): string {
	return (
		"rgba(" +
		(start + Math.ceil(Math.random() * (end - start))) +
		"," +
		(start + Math.ceil(Math.random() * (end - start))) +
		"," +
		(start + Math.ceil(Math.random() * (end - start))) +
		"," +
		opacity +
		")"
	);
}
