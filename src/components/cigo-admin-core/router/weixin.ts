const pages = [
	{
		path: "wxAuth",
		name: "CigoWeiXinAuth",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Auth.vue"),
	},
	{
		path: "wxPay",
		name: "CigoWeiXinPay",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Pay.vue"),
	},
	{
		path: "wxFans",
		name: "CigoWeiXinFans",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Fans.vue"),
	},
	{
		path: "wxResource",
		name: "CigoWeiXinResource",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Resource.vue"),
	},
	{
		path: "wxMenu",
		name: "CigoWeiXinMenu",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Menu.vue"),
	},
	{
		path: "wxReplyRule",
		name: "CigoWeiXinReplyRule",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/ReplyRule.vue"),
	},
	{
		path: "wxFollow",
		name: "CigoWeiXinFollow",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Follow.vue"),
	},
	{
		path: "wxOther",
		name: "CigoWeiXinOther",
		component: () =>
			import("@/components/cigo-admin-core/pages/weixin/Other.vue"),
	},
];
export default pages;
