const pages = [
	{
		path: "demos/thermometer/one",
		name: "CigoThermometerOne",
		component: () =>
			import(
				"@/components/cigo-admin-core/pages/demos/thermometer/ThermometerOne.vue"
			),
	},
];
export default pages;
