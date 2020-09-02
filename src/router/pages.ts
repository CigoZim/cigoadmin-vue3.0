const pages = {
	path: "/pages/",
	name: "Pages",
	component: () => import("@/components/frame/Frame.vue"),
	redirect: "noRedirect",
	children: [
		/******************************= 自定义页面开始 =********************************/
		{
			path: "index",
			name: "Index",
			component: () => import("@/pages/index.vue"),
		},
		/******************************= 自定义页面结束 =********************************/
	],
};

export default pages;
