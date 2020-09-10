import { useRouter } from "vue-router";
import { Menu } from "./types";
import router from "@/router/index";

/**
 * 创建标签随机颜色
 * @param opacity
 * @param start
 * @param end
 */
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

/**
 * 打开页面
 * @param item
 */
export function showPage(item: Menu): void {
	if (!item.url) {
		return;
	}
	//TODO 执行跳转,过滤类型
	switch (item.target_type) {
		case "content-page":
			router.push(item.url);
			break;
		case "layer-win":
			break;
		case "_blank":
		default:
			{
				let blankRouter = router.resolve({
					path: item.url,
				});
				window.open(blankRouter.href, "_blank");
			}
			break;
	}
}
