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
	id?: number;
	title: string;
	group_flag?: string;
	label_class?: string;
	icon?: string;
	subList?: Menu[];
	summary?: string;
	target_type?: string;
	url?: string;
	component_name?: string;
	component_label?: string;
	can_show_tabs?: boolean;
	can_close_tab?: boolean;
	path?: "0,";
	pid?: 0;

	color?: string;

	// group: ""
	// group_sort: 100
	// module: "admin"
	// opt_rate: 0
	// sort: 100
	// status: 1
	// type: 0
}

/**
 * 菜单展开形式
 */
export const enum ModeFormMenuExpand {
	NONE = "none",
	CLICK_MENU = "click_menu",
	NOW_ROUTER = "now_router",
}
