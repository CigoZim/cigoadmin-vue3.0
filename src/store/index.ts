import { reactive, toRaw } from "vue";
import router from "@/router/index";
import { SystemState, LoginUserInfo } from "@/components/frame/types";

interface State {
	systemState: SystemState;
	userInfo: LoginUserInfo;
}
class Store {
	protected state: State;

	constructor(initialState: State) {
		let systemState = localStorage.getItem("systemState");
		console.log("recoverStore", systemState);

		this.state = reactive(initialState);
		if (systemState) {
			this.state.systemState = JSON.parse(systemState);
		} else {
			this.saveToStorage("systemState", initialState.systemState);
		}
		let userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			this.state.userInfo = JSON.parse(userInfo);
		} else {
			this.saveToStorage("userInfo", initialState.userInfo);
		}
	}

	public getState(): State {
		return this.state;
	}

	private saveToStorage(itemFlag: string, item: any) {
		localStorage.setItem(itemFlag, JSON.stringify(toRaw(item)));
	}

	public toggleSideMenu(): void {
		this.state.systemState.sideMenuOpen = !this.state.systemState.sideMenuOpen;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	public toggleRightPanel() {
		this.state.systemState.rightPanelOpen = !this.state.systemState
			.rightPanelOpen;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	public setLeftMenuContainerWidth(width: string) {
		this.state.systemState.leftMenuContainerWidth = width;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	public closeRightPanel() {
		this.state.systemState.rightPanelOpen = false;
		this.saveToStorage("systemState", toRaw(this.state.systemState));
	}

	public saveUserInfo(userInfo: LoginUserInfo): void {
		this.state.userInfo = userInfo;
		this.saveToStorage("userInfo", toRaw(this.state.userInfo));

		router.push("/");
	}

	public logout(): void {
		this.state.userInfo = initialLoginUserInfo();
		localStorage.clear();
		router.push("/gone");
	}
}

const initialState = (): State => {
	let systemState = initialSystemState();
	let userInfo = initialLoginUserInfo();
	return {
		systemState: systemState,
		userInfo: userInfo,
	};
};

const initialSystemState = (): SystemState => ({
	sideMenuOpen: false,
	rightPanelOpen: false,
	leftMenuContainerWidth: "113px",
});
const initialLoginUserInfo = (): LoginUserInfo => ({
	isLogin: false,
});

const systemStore = new Store(initialState());
export { systemStore };
