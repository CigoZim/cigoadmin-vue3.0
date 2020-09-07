import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { authInstance } from "@/auth";
import pagesRouter from "./pages";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/login",
		name: "Login",
		component: () => import("@/components/frame/Login.vue"),
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
				component: () => import("@/components/frame/Dashboard.vue"),
			},
		],
	},
	/*-----------------------*/
	/* 内页router */
	pagesRouter,
	/*-----------------------*/
	{
		path: "/gone",
		name: "Gone",
		component: () => import("@/components/frame/other/gone.vue"),
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
