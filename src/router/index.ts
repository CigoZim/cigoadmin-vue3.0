import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { frameRoutes, checkAuth } from "@/components/frame/router";
import pagesRouter from "./pages";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "root",
		redirect: "/frame",
	},
	/*-----------------------*/
	...frameRoutes,
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
	checkAuth(guard, router);
});

export default router;
