const echarts = [
	{
		path: "echarts/line/basicLine",
		name: "CigoEchartsBasicLine",
		component: () =>
			import("@/components/cigo-admin-core/pages/echarts/line/BasicLine.vue"),
	},
	/*********************************************/
	{
		path: "echarts/demo/gens",
		name: "EchartDemoGens",
		component: () =>
			import("@/components/cigo-admin-core/pages/echarts/demo/gens/Gens.vue"),
	},
];
export default echarts;
