/**
 * 系统状态
 */
export interface SystemState {
	sideMenuOpen: boolean;
	rightPanelOpen: boolean;
	leftMenuContainerWidth: string;
}

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

	color?: string;

	// group: ""
	// group_sort: 100
	// module: "admin"
	// opt_rate: 0
	// path: "0,"
	// pid: 0
	// sort: 100
	// status: 1
	// type: 0
}
