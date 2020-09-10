import { reactive, toRaw, ref, watch, toRef } from "vue";
import router from "@/router/index";
import {
	SystemState,
	NoCachedState,
	LoginUserInfo,
	Menu,
	ModeFormMenuExpand,
} from "@/components/frame/utils/types";

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

		//同步缓存中systemState
		let systemState = localStorage.getItem("systemState");
		if (systemState) {
			this.state.systemState = JSON.parse(systemState);
		} else {
			this.saveToStorage("systemState", initialState.systemState);
		}
		//同步缓存中userInfo
		let userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			this.state.userInfo = JSON.parse(userInfo);
		} else {
			this.saveToStorage("userInfo", initialState.userInfo);
		}
		//同步缓存中openTabs
		let openTabs = localStorage.getItem("openTabs");
		if (openTabs) {
			let tabs: string[] = JSON.parse(openTabs);
			this.state.openTabs = tabs ? tabs : [];
		} else {
			this.saveToStorage("openTabs", initialState.openTabs);
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
	 * 记录当前打开组件
	 * @param componentName
	 */
	public recordCurrComponent(componentName: string) {
		this.state.systemState.currComponent = componentName;
		let openTabs = toRaw(this.state.openTabs);
		if (openTabs.indexOf(componentName) === -1) {
			this.state.openTabs = [...openTabs, componentName];
		}
		this.setModeForMenuExpand(ModeFormMenuExpand.NOW_ROUTER);
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	/**
	 * 保存用户信息
	 */
	public saveUserInfo(userInfo: LoginUserInfo): void {
		this.state.userInfo = userInfo;
		this.saveToStorage("userInfo", toRaw(this.state.userInfo));

		router.push("/");
	}

	/**
	 * 退出登录
	 */
	public logout(): void {
		this.state.userInfo = { isLogin: false };
		localStorage.clear();
		router.push("/gone");
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
		//非关闭页面无动作
		if (pageItem && !pageItem.can_close_tab) {
			return;
		}
		//移除当前页缓存
		const tmpList = this.state.openTabs.slice();
		let index = tmpList.indexOf(componentName);
		tmpList.splice(index, 1);
		this.state.openTabs = tmpList;
		this.saveToStorage("openTabs", toRaw(this.state.openTabs));
		//TODO 关闭当前页缓存实例
		//TODO 跳转临近页面
		//TODO 暂时跳转尾页
		if (tmpList.length) {
			let jumpName: string = tmpList[tmpList.length - 1];
			if (baseList.has(jumpName)) {
				let jumpMenu = baseList.get(jumpName);
				if (jumpMenu && jumpMenu.url) {
					router.push(jumpMenu.url);
					return;
				}
			}
		}
		router.push("/");
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
