import { Router } from "vue-router";
import weixinRouter from "./weixin";
import { authInstance } from "@/auth";

export const frameRoutes = [
	{
		path: "/login",
		name: "Login",
		component: () => import("@/components/frame/pages/Login.vue"),
	},
	{
		path: "/frame",
		name: "FramePages",
		component: () => import("@/components/frame/Frame.vue"),
		redirect: "noRedirect",
		children: [
			{
				path: "",
				name: "Dashboard",
				component: () => import("@/components/frame/pages/Dashboard.vue"),
			},
			{
				path: "logoutTip",
				name: "CigoTipLogout",
				component: () => import("@/components/frame/pages/TipLogout.vue"),
			},
			{
				path: "authRule",
				name: "CigoAuthRule",
				component: () => import("@/components/frame/pages/auth/AuthRule.vue"),
			},
			{
				path: "authGroup",
				name: "CigoAuthRuleGroup",
				component: () =>
					import("@/components/frame/pages/auth/AuthRuleGroup.vue"),
			},
			{
				path: "manager",
				name: "CigoManager",
				component: () => import("@/components/frame/pages/auth/Manager.vue"),
			},
			{
				path: "user",
				name: "CigoUser",
				component: () => import("@/components/frame/pages/auth/User.vue"),
			},
			/*-----------微信管理路由------------*/
			...weixinRouter,
			/*---------------------------------*/
			{
				path: "gone",
				name: "CigoGone",
				component: () => import("@/components/frame/pages/Gone.vue"),
			},
		],
	},
];

export function checkAuth(guard: any, router: Router) {
	//检查路由是否存在
	if (!router.hasRoute(guard.name)) {
		//三层不同404路由
		if (guard.fullPath.indexOf("/frame") >= 0) {
			router.push("/frame/gone");
		} else if (guard.fullPath.indexOf("/pages") >= 0) {
			router.push("/pages/gone");
		} else {
			router.push("/gone");
		}
		return;
	}
	//检查登录状态
	let continueFlag: boolean = authInstance.init(guard).checkLogin(router);
	if (!continueFlag) {
		return;
	}
	//检查权限
	authInstance.checkAuth(router);
}
