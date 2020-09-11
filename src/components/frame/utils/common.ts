import { Menu } from "./types";
import router from "@/router/index";
import lodash from "lodash";

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
	//执行跳转,过滤类型
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

/**
 * 全屏切换
 * @param target
 */
export function toggleFullScreen() {
	if (isFullScreen()) {
		let doc = document as any;
		let existFunc =
			doc.exitFullscreen ||
			doc.mozCancelFullScreen ||
			doc.webkitCancelFullScreen ||
			doc.msExitFullscreen;
		if (typeof existFunc != "undefined" && existFunc) {
			existFunc.call(doc);
		}
	} else {
		let body = document.body as any;
		let existFunc =
			body.requestFullScreen ||
			body.webkitRequestFullScreen ||
			body.mozRequestFullScreen ||
			body.msRequestFullscreen;
		if (typeof existFunc != "undefined" && existFunc) {
			existFunc.call(body);
		}
	}
}

/**
 * 判断是否全屏
 */
export function isFullScreen() {
	let body = document as any;
	return body.isFullScreen || body.mozIsFullScreen || body.webkitIsFullScreen;
}
