import { reactive, toRaw, ref, watch, toRef } from "vue";
import router from "@/router/index";
import {
	SystemState,
	NoCachedState,
	LoginUserInfo,
	Menu,
	ModeFormMenuExpand,
} from "@/components/cigo-admin-core/utils/types";
import cigoLayer from "@/components/cigo-layer";

interface State {
	systemState: SystemState;
	noCached: NoCachedState;
	userInfo: LoginUserInfo;
	openTabs: string[];
}
class Store {
	protected state: State;

	constructor(initialState: State) {
		// 初始化值进行响应式代理
		this.state = reactive(initialState);
		this.synchronizeData();
	}

	private synchronizeData(): void {
		//同步缓存中systemState
		let systemState = localStorage.getItem("systemState");
		if (systemState) {
			this.state.systemState = JSON.parse(systemState);
		} else {
			this.saveToStorage("systemState", this.state.systemState);
		}
		//同步缓存中userInfo
		let userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			this.state.userInfo = JSON.parse(userInfo);
		} else {
			this.saveToStorage("userInfo", this.state.userInfo);
		}
		//同步缓存中openTabs
		let openTabs = localStorage.getItem("openTabs");
		if (openTabs) {
			let tabs: string[] = JSON.parse(openTabs);
			this.state.openTabs = tabs ? tabs : [];
		} else {
			this.saveToStorage("openTabs", this.state.openTabs);
		}
	}

	/**
	 * 获取缓存状态数据
	 */
	public getState(): State {
		return this.state;
	}

	/**
	 * 保存数据至缓存
	 *
	 * @param itemFlag 数据项缓存标识
	 * @param item 缓存数据
	 */
	private saveToStorage(itemFlag: string, item: any) {
		localStorage.setItem(itemFlag, JSON.stringify(toRaw(item)));
	}

	/**
	 * 切换边栏菜单开闭
	 */
	public toggleSideMenu(): void {
		this.state.systemState.sideMenuOpen = !this.state.systemState.sideMenuOpen;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 切换右侧边栏覆盖层开闭
	 */
	public toggleRightPanel() {
		this.state.systemState.rightPanelOpen = !this.state.systemState
			.rightPanelOpen;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 关闭右侧边栏覆盖层
	 */
	public closeRightPanel() {
		this.state.systemState.rightPanelOpen = false;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 设置左侧菜单容器宽度
	 * @param width
	 */
	public setLeftMenuContainerWidth(width: string) {
		this.state.systemState.leftMenuContainerWidth = width;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 设置当前一级菜单展开以谁为主
	 */
	public setModeForMenuExpand(flag: ModeFormMenuExpand) {
		this.state.noCached.modeForMenuExpand = flag;
	}

	/**
	 * 保存用户信息
	 */
	public saveUserInfo(userInfo: LoginUserInfo): void {
		this.state = reactive(initialState());
		this.state.userInfo = userInfo;
		localStorage.clear();
		this.synchronizeData();

		router.push("/");
	}

	/**
	 * 退出登录
	 */
	public logout(): void {
		this.state = reactive(initialState());
		localStorage.clear();
		router.push("/");
	}

	/**
	 * 记录当前打开组件
	 * @param componentName
	 */
	public recordCurrComponent(component: any) {
		let componentName: string = component.type.name;
		let openTabs = toRaw(this.state.openTabs);
		if (
			componentName &&
			!component.type.notRecordOpentabs && //TIPS_FLAG
			openTabs.indexOf(componentName) === -1
		) {
			this.state.openTabs = [...openTabs, componentName];
			this.saveToStorage("openTabs", toRaw(this.state.openTabs));
		}

		this.state.systemState.currComponent = componentName;
		this.setModeForMenuExpand(ModeFormMenuExpand.NOW_ROUTER);
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 移除打开tab页面
	 */
	public removeOpenTab(componentName: string): void {
		const tmpList = this.state.openTabs.slice();
		tmpList.splice(tmpList.indexOf(componentName), 1);
		this.state.openTabs = tmpList;

		this.saveToStorage("openTabs", toRaw(this.state.openTabs));
	}

	/**
	 * 关闭tab页面
	 */
	public closeOpenTab(
		componentName: string,
		pageItem: Menu,
		baseList: Map<string, Menu>
	): void {
		if (pageItem && pageItem.can_not_close_opentab) {
			cigoLayer.msg("当前页面不可关闭");
			return;
		}
		//移除当前页缓存
		//TODO 关闭当前页缓存实例
		const tmpList = this.state.openTabs.slice();
		let index = tmpList.indexOf(componentName);
		tmpList.splice(index, 1);
		this.state.openTabs = [...tmpList];
		this.saveToStorage("openTabs", toRaw(this.state.openTabs));

		//是否全部关闭
		if (tmpList.length == 0) {
			cigoLayer.msg("页面全部关闭");
			router.push("/");
			return;
		}
		//TODO 跳转临近页面
		if (index >= tmpList.length) {
			index = tmpList.length - 1;
		}

		if (!baseList.has(tmpList[index])) {
			cigoLayer.msg(tmpList[index] + "页面丢失");
			router.push("/");
			return;
		}
		let jumpItem = baseList.get(tmpList[index]);
		router.push(jumpItem && jumpItem.url ? jumpItem.url : "/");
	}
}

const initialState = (): State => {
	let systemState: SystemState = {
		sideMenuOpen: false,
		rightPanelOpen: false,
		leftMenuContainerWidth: "113px",
		currComponent: "",
	};
	let noCached: NoCachedState = {
		modeForMenuExpand: ModeFormMenuExpand.NOW_ROUTER,
	};
	let userInfo: LoginUserInfo = { isLogin: false };
	let tabs: string[] = [];
	return {
		systemState: systemState,
		noCached: noCached,
		userInfo: userInfo,
		openTabs: tabs,
	};
};

const systemStore = new Store(initialState());
export { State, systemStore };
