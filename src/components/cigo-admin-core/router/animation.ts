const pages = [
	{
		path: "animation/thermometer/one",
		name: "CigoThermometerOne",
		component: () =>
			import(
				"@/components/cigo-admin-core/pages/animation/thermometer/ThermometerOne.vue"
			),
	},
];
export default pages;
