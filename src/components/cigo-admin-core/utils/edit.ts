import CigoPreviewImg from "@/components/cigo-ui/unit/form/uploader/cigo-preview-img.vue";
import cigoLayer from "@/components/cigo-layer";
import { User } from "./types";

/**
 * 显示头像
 * @param url 
 */
export function showAvatar(url: string): void {
	cigoLayer.window({
		component: CigoPreviewImg,
		backgroundColor: "#00000000",
		maskClose: true,
		windowSize: "max",
		showCtrlBar: false,
		canDragFlag: false,
		layerData: {
			imgList: url ? [url] : [],
		},
	});
}

/**
 * 显示性别
 * @param record 
 */
export function showSex(record: User): string {
	let sex = "";
	switch (record.sex) {
		case 1:
			sex = "男";
			break;
		case 2:
			sex = "女";
			break;
		case 0:
		default:
			sex = "保密";
			break;
	}
	return sex;
}
