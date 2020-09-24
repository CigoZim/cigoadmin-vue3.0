const pages = [
	{
		path: "settings",
		name: "CigoSettings",
		component: () =>
			import("@/components/cigo-admin-core/pages/settings/Settings.vue"),
	},
	{
		path: "settingItems",
		name: "CigoSettingItems",
		component: () =>
			import("@/components/cigo-admin-core/pages/settings/SettingItems.vue"),
	},
	{
		path: "files",
		name: "CigoFiles",
		component: () =>
			import("@/components/cigo-admin-core/pages/settings/Files.vue"),
	},
];
export default pages;
