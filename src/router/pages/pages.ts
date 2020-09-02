const pages = {
	path: "/pages/",
	name: "Pages",
	component: () => import("@/components/frame/Frame.vue"),
	redirect: "noRedirect",
	children: [
		{
			path: "dashboard",
			name: "Dashboard",
			component: () => import("@/components/frame/Dashboard.vue"),
		},
	],
};

export default pages;
