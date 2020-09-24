const pages = [
	{
		path: "files",
		name: "CigoFiles",
		component: () =>
			import("@/components/cigo-admin-core/pages/settings/Files.vue"),
	},
];
export default pages;
