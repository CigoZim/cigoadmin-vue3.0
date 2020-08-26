import { reactive } from "vue";
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
