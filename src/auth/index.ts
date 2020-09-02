import { Router } from "vue-router";
import { systemStore } from "@/store/index";

class Auth {
	protected guard: any;

	public init(initGuard: any) {
		this.guard = initGuard;
		return this;
	}

	public getAuard() {
		return this.guard;
	}

	/**
	 * 检查登录情况
	 */
	public checkLogin(router: Router): boolean {
		//是否登录模块
		if (this.guard.name === "Login") {
			return false;
		}
		//是否登录状态
		if (!systemStore.getState().userInfo.isLogin) {
			console.log("尚未登录，跳转登录页面...");
			if (this.guard.name === "Gone") {
				setTimeout(() => {
					router.push("/login");
				}, 3000);
			} else {
				router.push("/login");
			}

			return false;
		}

		return true;
	}

	/**
	 * 检查权限
	 */
	public checkAuth(router: Router) {}
}

const authInstance = new Auth();

export { Auth, authInstance };
