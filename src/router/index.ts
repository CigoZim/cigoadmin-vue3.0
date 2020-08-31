import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { authInstance } from "./auth";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/components/frame/Home.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/components/frame/Login.vue"),
	},
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
