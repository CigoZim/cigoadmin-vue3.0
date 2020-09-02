import { reactive, toRaw } from "vue";
import router from "@/router/index";
import { SystemState, LoginUserInfo } from "@/types/index";

interface State {
	systemState: SystemState;
	userInfo: LoginUserInfo;
}
class Store {
	protected state: State;

	constructor(initialState: State) {
		this.state = reactive(initialState);
	}

	public getState(): State {
		return this.state;
	}

	private saveToStorage(itemFlag: string, item: any) {
		localStorage.setItem(itemFlag, JSON.stringify(toRaw(item)));
	}

	public recoverStore() {
		console.log("recoverStore");

		let systemState = localStorage.getItem("systemState");
		if (systemState) {
			this.state.systemState = JSON.parse(systemState);
		}
		let userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			this.state.userInfo = JSON.parse(userInfo);
		}
	}

	public toggleMenu(): void {
		this.state.systemState.sideMenuOpen = !this.state.systemState.sideMenuOpen;
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

// const initialState = (): State => ({
// 	systemState: initialSystemState(),
// 	userInfo: initialLoginUserInfo(),
// });

const initialState = (): State => {
	console.log("initialState");

	return {
		systemState: initialSystemState(),
		userInfo: initialLoginUserInfo(),
	};
};

const initialSystemState = (): SystemState => ({
	sideMenuOpen: false,
});
const initialLoginUserInfo = (): LoginUserInfo => ({
	isLogin: false,
});

const systemStore = new Store(initialState());
export { systemStore };
