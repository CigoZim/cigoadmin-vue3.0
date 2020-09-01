import { createApp } from "vue";

import Alert from "./alert.vue";
import Msg from "./msg.vue";

import "../css/layer.css";

class CigoLayer {
	private countFlag: number = 0;
	private layerInstances: Map<number, any> = new Map();
	/**
	 * 构造函数
	 */
	constructor() {}

	/**
	 * 打开新layer
	 */
	private open(newInstance: any) {
		//节点ID
		let nodeId = "cigo-layer-item-" + this.countFlag;
		//添加节点
		let body = document.body || document.documentElement;
		let root = document.createElement("div");
		root.setAttribute("id", nodeId);
		body.appendChild(root);
		//渲染vue实例
		newInstance.mount("#" + nodeId);
		//记录节点
		this.layerInstances.set(this.countFlag, newInstance);
		//记录标识递增
		this.countFlag++;
	}

	/**
	 * 恢复layer
	 */
	public resume() {
		console.log("resume layer");
	}

	/**
	 * 关闭指定layer
	 */
	public close() {
		console.log("close layer");
	}

	/**
	 * 关闭所有
	 */
	public closeAll() {
		console.log("close all layer");
	}

	/**
	 * 弹框
	 */
	public alert() {
		console.log("show alert");
		let instance = createApp(Alert);
		this.open(instance);
	}
	/**
	 * 消息
	 */
	public msg(msg: string) {
		console.log("show msg:", msg);
		let instance = createApp(Msg);
		this.open(instance);
	}
}

const cigoLayer = new CigoLayer();

export default cigoLayer;
