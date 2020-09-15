import { reactive } from "vue";

export interface TransStatus {
	refreshMenuTrans: number;
}

class FrameTrans {
	protected transStatus: TransStatus;

	constructor(initStatus: TransStatus) {
		this.transStatus = reactive(initStatus);
	}

	public getTransStatus(): TransStatus {
		return this.transStatus;
	}

	public notifyRefreshMenu() {
		this.transStatus.refreshMenuTrans++;
	}
}
const frameTrans = new FrameTrans({
	refreshMenuTrans: 0,
});
export { frameTrans };
