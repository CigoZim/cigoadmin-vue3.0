import { reactive } from "vue";
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

	public toggleMenu(): void {
		this.state.systemState.sideMenuOpen = !this.state.systemState.sideMenuOpen;
	}

	public saveUserInfo(userInfo: LoginUserInfo): void {
		this.state.userInfo = userInfo;

		console.log(userInfo);

		console.log(this.state.userInfo);

		router.push("/");
	}

	public logout(): void {
		this.state.userInfo = initialLoginUserInfo();
		router.push("/gone");
	}
}

const initialState = (): State => ({
	systemState: initialSystemState(),
	userInfo: initialLoginUserInfo(),
});

const initialSystemState = (): SystemState => ({
	sideMenuOpen: false,
});
const initialLoginUserInfo = (): LoginUserInfo => ({
	isLogin: false,
});

const systemStore = new Store(initialState());
export { systemStore };
