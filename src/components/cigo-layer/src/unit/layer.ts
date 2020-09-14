import { createApp, defineAsyncComponent } from "vue";

import Antd from "ant-design-vue";

import Alert from "./alert.vue";
import Msg from "./msg.vue";
import PopWindow from "./pop-window.vue";

import "ant-design-vue/dist/antd.css";
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
	private open(layerType: any, options?: any) {
		//节点ID
		let nodeId: string = "cigo-layer-item-" + this.countFlag;
		//添加节点
		let body = document.body || document.documentElement;
		let root = document.createElement("div");
		root.setAttribute("id", nodeId);
		root.setAttribute("class", "cigo-layer-item");
		body.appendChild(root);
		//实例化并绑定渲染vue组件实例
		options = options || {};
		options.layerIndex = this.countFlag;
		let newInstance = createApp(layerType, options);
		newInstance.use(Antd);
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
	public close(layerIndex: number) {
		//解绑vue
		this.layerInstances.get(layerIndex).unmount();
		this.layerInstances.delete(layerIndex);
		//节点ID
		let nodeId: string = "cigo-layer-item-" + layerIndex;
		//移除节点
		let body = document.body || document.documentElement;
		let node = document.getElementById(nodeId);
		if (node) {
			body.removeChild(node);
		}
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
		this.open(Alert);
	}
	/**
	 * 消息
	 */
	public msg(msg: string) {
		this.open(Msg, { msg: msg });
	}
	/**
	 * 动态组件窗体
	 */
	public window(options: any) {
		console.log(options);
		if (!options.component) {
			cigoLayer.msg("请配置弹窗组件");
			return;
		}
		this.open(PopWindow, options);
	}
}

const cigoLayer = new CigoLayer();

export default cigoLayer;
