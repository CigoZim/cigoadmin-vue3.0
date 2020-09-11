const pages = {
	path: "/pages",
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
		{
			path: "demo/news",
			name: "DemoNews",
			component: () => import("@/pages/demo/news.vue"),
		},
		{
			path: "demo/upload",
			name: "DemoUpload",
			component: () => import("@/pages/demo/upload.vue"),
		},
		{
			path: "demo/continue",
			name: "DemoContinue",
			component: () => import("@/pages/demo/continue.vue"),
		},
		/******************************= 自定义页面结束 =********************************/
		{
			path: "gone",
			name: "PagesGone",
			component: () => import("@/components/frame/pages/Gone.vue"),
		},
	],
};

export default pages;
