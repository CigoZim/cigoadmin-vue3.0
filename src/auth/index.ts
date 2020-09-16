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
		//是否登录状态
		if (!systemStore.getState().userInfo.isLogin) {
			console.log("guard.name", this.guard.name);

			switch (this.guard.name) {
				case "CigoGone":
				case "CigoTipLogout":
				case "Login":
					break;
				default:
					router.push("/login");
					break;
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
