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
 * 页面全屏
 */
export function goFullScreen() {
	if (!document) {
		return;
	}
	let el = document.documentElement as any;
	let rfs =
		el.requestFullScreen ||
		el.webkitRequestFullScreen ||
		el.mozRequestFullScreen ||
		el.msRequestFullscreen;
	if (typeof rfs != "undefined" && rfs) {
		rfs.call(el);
	}
	return;
}

/**
 * 页面退出全屏
 */
export function exitFullScreen() {
	let cfs = document as any;
	if (cfs.exitFullscreen) {
		cfs.exitFullscreen();
	} else if (cfs.webkitCancelFullScreen) {
		cfs.webkitCancelFullScreen();
	} else {
		cfs.msExitFullscreen();
	}
}
