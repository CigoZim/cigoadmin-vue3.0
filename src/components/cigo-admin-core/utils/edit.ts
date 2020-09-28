import CigoPreviewImg from "@/components/cigo-ui/unit/form/uploader/cigo-preview-img.vue";
import cigoLayer from "@/components/cigo-layer";
import { User } from "./types";
import { apiErrorCatch, apiRequest, apiSign } from "@/common/http";
import { convertTreeToMap } from "./common";

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
 * 显示列表关键词
 * @param keywords
 */
export function showKeywords(keywords: []): string {
	return keywords.join("，");
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

/**
 * 显示内容分栏
 * 
 * @param key 
 * @param id 
 * @param groupsMap 
 */
export function showContentGroups(
	key: string,
	id: number,
	groupsMap: Map<string, any>
): string {
	return groupsMap.has(key + "_" + id)
		? groupsMap.get(key + "_" + id).title
		: "";
}

/**
 * 从层级数据转换Map
 *
 * @param mapDesRef
 * @param key
 */
export function prepareGroupsDataList(mapDesRef: any, key: string) {
	let params = {
		status: "1",
	};
	apiRequest.v1
		.post("/groupsList", params, {
			headers: apiSign(params),
		})
		.then((response) => {
			let map = new Map();
			//获取层级数据
			let treeList = [...response.data.data];
			// 转换无层级数据
			convertTreeToMap(treeList, map, key, 0);
			//赋值
			mapDesRef.value = map;
		})
		.catch(apiErrorCatch.v1);
}
