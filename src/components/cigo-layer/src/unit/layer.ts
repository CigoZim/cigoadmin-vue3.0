import { createApp, defineAsyncComponent } from "vue";

import Antd from "ant-design-vue";

import Confirm from "./confirm.vue";
import Msg from "./msg.vue";
import Component from "./component.vue";
import Prompt from "./prompt.vue";

import "ant-design-vue/dist/antd.css";
import "../css/layer.css";
import { isString } from "lodash";

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
	 * 确认弹框
	 */
	public confirm(
		options: string | object //Tips_Flag 联合类型
	) {
		options = options || {};
		if (isString(options)) {
			options = { msg: options };
		}
		this.open(Confirm, options);
	}
	/**
	 * 消息
	 */
	public msg(
		msg: string,
		timeout?: number //Tips_Flag 可选参数
	) {
		let options: any = {};
		options.msg = msg;
		if (timeout) options.timeout = timeout;
		this.open(Msg, options);
	}
	/**
	 * 动态组件窗体
	 */
	public component(options: any) {
		if (!options.component) {
			cigoLayer.msg("请配置弹窗组件");
			return;
		}
		this.open(Component, options);
	}

	/**
	 * 输入弹框
	 * @param options
	 */
	public prompt(options: any) {
		delete options.component;
		delete options.notify;
		!options.width ? (options.width = "400px") : false;
		!options.height ? (options.height = "200px") : false;
		options.showCtrlBar = false;
		cigoLayer.component({
			...options,
			component: Prompt,
			notify: (flag: string, resolve: any, reject: any, val?: any) => {
				switch (flag) {
					case "ok":
						options.ok && options.ok(val) ? reject() : resolve(); //Tips_Flag 模拟类似Click事件的冒泡处理
						break;
					case "cancel":
						options.cancel && options.cancel() ? reject() : resolve();
						break;
				}
			},
		});
	}
}

const cigoLayer = new CigoLayer();

export default cigoLayer;
