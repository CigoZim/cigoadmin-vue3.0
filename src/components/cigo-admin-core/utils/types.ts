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

/**
 * 登录用户信息
 */
export interface LoginUserInfo {
	isLogin: boolean;
	id?: number;
	token?: string;
	phone?: string;
	username?: string;
	real_name?: string;
	nickname?: string;
	email?: string;
	role_flag?: number;
}
/**
 * 菜单类型
 */
export interface Menu {
	// 默认属性
	id?: number;
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
	color?: string;
}

/**
 * 菜单展开形式
 */
export const enum ModeFormMenuExpand {
	NONE = "none",
	CLICK_MENU = "click_menu",
	NOW_ROUTER = "now_router",
}
