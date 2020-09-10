const pages = [
	{
		path: "wxAuth",
		name: "CigoWeiXinAuth",
		component: () => import("@/components/frame/pages/weixin/Auth.vue"),
	},
	{
		path: "wxPay",
		name: "CigoWeiXinPay",
		component: () => import("@/components/frame/pages/weixin/Pay.vue"),
	},
	{
		path: "wxFans",
		name: "CigoWeiXinFans",
		component: () => import("@/components/frame/pages/weixin/Fans.vue"),
	},
	{
		path: "wxResource",
		name: "CigoWeiXinResource",
		component: () => import("@/components/frame/pages/weixin/Resource.vue"),
	},
	{
		path: "wxMenu",
		name: "CigoWeiXinMenu",
		component: () => import("@/components/frame/pages/weixin/Menu.vue"),
	},
	{
		path: "wxReplyRule",
		name: "CigoWeiXinReplyRule",
		component: () => import("@/components/frame/pages/weixin/ReplyRule.vue"),
	},
	{
		path: "wxFollow",
		name: "CigoWeiXinFollow",
		component: () => import("@/components/frame/pages/weixin/Follow.vue"),
	},
	{
		path: "wxOther",
		name: "CigoWeiXinOther",
		component: () => import("@/components/frame/pages/weixin/Other.vue"),
	},
];
export default pages;
