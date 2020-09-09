import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { authInstance } from "@/auth";
import pagesRouter from "./pages";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/login",
		name: "Login",
		component: () => import("@/components/frame/pages/Login.vue"),
	},
	{
		path: "/",
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
		],
	},
	/*-----------------------*/
	/* 内页router */
	pagesRouter,
	/*-----------------------*/
	{
		path: "/gone",
		name: "CigoGone",
		component: () => import("@/components/frame/pages/Gone.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((guard) => {
	let continueFlag: boolean = authInstance.init(guard).checkLogin(router);
	if (!continueFlag) {
		return;
	}
	authInstance.checkAuth(router);
});

export default router;
