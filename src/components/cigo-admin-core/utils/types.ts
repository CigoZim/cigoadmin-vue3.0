/**
 * 系统状态
 */
export interface SystemState {
	sideMenuOpen: boolean;
	rightPanelOpen: boolean;
	leftMenuContainerWidth: string;
	currComponent: string;
}

/**
 * 非缓存状态
 */
export interface NoCachedState {
	modeForMenuExpand: ModeFormMenuExpand;
}

/**
 * 菜单类型
 */
export interface Menu {
	// 默认属性
	id: number;
	title: string;
	icon?: string;
	subList?: Menu[];
	summary?: string;
	target_type?: string;
	url?: string;
	component_name?: string;
	can_not_close_opentab?: boolean;
	can_not_record_opentab?: boolean;
	can_not_cache?: boolean;
	path?: string;
	pid?: number;
	group?: string;
	group_sort?: number;
	module?: string;
	opt_rate?: number;
	sort?: number;
	status?: number;
	type?: number; // 节点类型（0-系统菜单；1-权限节点非菜单；2-按钮）

	//后端动态添加
	group_flag?: string;
	// 前端动态添加
	level?: number;
	last?: boolean;
	color?: string;
}

/**
 * 角色分组
 */
export interface AuthGroup {
	id: number;
	title: string;
	pid: number;
	path: string;
	rules: number[];
	subList?: AuthGroup[];
	module?: string;
	sort?: number;
	status?: number;

	//前端动态添加
	level?: number;
}

/**
 * 用户
 */
export interface User {
	id: number;
	role_flag?: number;
	img?: number;
	img_info?: Object;
	status?: number;
	sex?: number;
	auth_group?: [];
	username?: string;
	realname?: string;
	nickname?: string;
	phone?: string;
	email?: string;
	token?: string;
	create_time?: number;

	//前端动态添加
	isLogin?: boolean;
}

/**
 * 菜单展开形式
 */
export enum ModeFormMenuExpand {
	NONE = "none",
	CLICK_MENU = "click_menu",
	NOW_ROUTER = "now_router",
}
