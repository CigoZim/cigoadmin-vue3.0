/**
 * 系统状态
 */
export interface SystemState {
	sideMenuOpen: boolean;
	rightPanelOpen: boolean;
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
