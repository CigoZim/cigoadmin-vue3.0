
const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/views/frame/Home.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/frame/Login.vue"),
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
