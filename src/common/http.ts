import { php } from "locutus";
import Axios from "axios";
import cigoLayer from "@/components/cigo-layer/index";

/**
 * 相关域名
 */
export const enum Domain {
	apiDomain = "http://api-admin.cigoos.cn",
	cdnOpen = "http://cdn-open.cigoadmin.com",
	cdnOpenIcon = "http://cdn-open.cigoadmin.com/icon/",
}
export const enum bucket {
	open = "cigoadmin-open",
	img = "cigoadmin-img",
	video = "cigoadmin-video",
}

// 网络请求
export const apiRequest = {
	v1: Axios.create({
		baseURL: Domain.apiDomain + "/v1",
	}),
};
export const apiErrorCatch = {
	v1: (error: any) => {
		console.log("error:", error.response);

		let responseStatus = Math.floor(error.response.status / 100);

		switch (responseStatus) {
			case 3: //重定向
			case 4: //客户端错误
				cigoLayer.msg(error.response.data.msg || error.response.data.message);
				break;
			case 5: //服务器错误
				cigoLayer.msg("服务器内部错误");
				break;
			default:
				//其它错误
				cigoLayer.msg("未知错误");
				break;
		}
	},
};

/**
 * 网络请求错误码
 */
export const enum HttpReponseCode {
	//成功
	Success_OK = "200", // 请求成功
	Success_Created = "201", // 请求成功，新资源建立
	Success_Accept = "202", // 请求成功
	Success_NoContent = "204", // 请求成功,没有内容

	//重定向
	Redirect_MultipleChoices = "300", // 存在多个资源
	Redirect_MovedPermanently = "301", // 资源被永转移
	Redirect_Found = "302", // 请求的资源被暂时转移
	Redirect_SeeOther = "303", // 引用他处

	//请求错误
	ClientError_BadRequest = "400", // 请求不正确
	ClientError_Unauthorized = "401", // 需要认证
	ClientError_Forbidden = "403", // 禁止访问
	ClientError_NotFound = "404", // 没有找到指定的资源
	ClientError_TooManyRequests = "429", // 访问次数过多

	//服务器错误
	ServerError_InternalServer_Error = "500", // 服务器端发生错误
	ServerError_ServerClose = "503", // 服务器暂时停止运营
}

/**
 * 接口错误码
 */
export const enum ApiErrorCode {
	//正确无误
	OK = "0",

	// 接口检查错误
	ApiCheck_TimeStampError = "10001", // 时间戳错误
	ApiCheck_SignError = "10002", // 接口签名错误

	// 服务器错误
	ServerError_AliCloudSendMsg = "20001", // 阿里短信发送错误
	// 客户端错误
	ClientError_ArgsWrong = "30001", // 参数错误
	ClientError_TokenError = "30002", // Token无效
	ClientError_AuthError = "30003", // 权限错误

	// 分支操作
	MoreCtrl_NeedBindPhone = "40001", // 需绑定手机号码
}

/**
 * 接口签名
 * @param params 请求参数
 */
export function apiSign(params: Object) {
	// 参数排序
	php.array.ksort(params);
	let sign: string = php.url.http_build_query(params);
	sign = php.strings.md5(sign);
	//封装header
	return {
		"Cigo-Device-Type": "pc",
		"Cigo-Timestamp": Date.parse(new Date().toString()) / 1000,
		"Cigo-Sign": sign,
		// "Cigo-Token": store.state.token,
	};
}
