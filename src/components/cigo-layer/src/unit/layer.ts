import msgLayer from "./msg.vue";

class CigoLayer {
	/**
	 * 构造函数
	 */
	constructor() {}

	/**
	 * 打开
	 */
	public open() {
		console.log("show layer");
	}

	/**
	 * 关闭
	 */
	public close() {
		console.log("close layer");
	}

	/**
	 * 弹框
	 */
	public alert() {
		console.log("show alert");
	}
	/**
	 * 消息
	 */
	public msg(msg: string) {
		console.log("show msg:", msg);
		msgLayer.$mount();
	}
}

const cigoLayer = new CigoLayer();

export default cigoLayer;
