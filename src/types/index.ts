/**
 * 系统状态
 */
export interface SystemState {
	sideMenuOpen: boolean;
}

/**
 * 登录用户信息
 */
export interface LoginUserInfo {
	isLogin: boolean;
	id?: number;
	username?: string;
	nickname?: string;
	realname?: string;
	phone?: string;
}
