<template>
<div class="cigo-avatar">
    <input type="file" ref="vFileRef" style="display:none;width:0;height:0;padding:0;" @change="fileSelectChange($event.target.files)" accept="image/x-png, image/jpg, image/jpeg, image/gif" />
    <div class="avatar">
        <img v-if="preViewUrlRef" :src="preViewUrlRef" />
    </div>
    <div class="ctrl-bar">
        <cigo-icon-font v-if="preViewUrlRef" class="icon" @click.stop="showPreview" :name="'cigoadmin-icon-liulan'"></cigo-icon-font>
        <cigo-icon-font class="icon" @click.stop="chooseImg" :name="'cigoadmin-icon-bianji'"></cigo-icon-font>
    </div>
</div>
</template>

<script lang="ts">
import cigoLayer from "@/components/cigo-layer";
import {
    defineComponent,
    onBeforeMount,
    onMounted,
    onUpdated,
    ref,
    toRaw
} from "vue";
import * as qiniu from "qiniu-js";
import UUID from "uuidjs";
import {
    makeFileExtFilter,
    FileSaved
} from "@/components/cigo-ui/utils/types";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import CigoPreviewImg from "@/components/cigo-ui/unit/form/uploader/cigo-preview-img.vue";
import {
    apiErrorCatch,
    apiRequest,
    apiSign,
    bucket
} from "@/common/http";

export default defineComponent({
    name: "CigoAvatar",
    components: {
        CigoIconFont
    },
    props: {
        avatarInfo: {
            type: Object,
            default: () => {
                return {
                    id: 0
                };
            }
        }
    },
    setup(props, ctx) {
        let vFileRefTmp: any = null;
        let vFileRef = ref(vFileRefTmp);

        let preViewUrlTmp: any;
        let preViewUrlRef = ref(preViewUrlTmp);

        let selectedImgTmp: any = null;
        let selectedImgRef = ref(selectedImgTmp);

        onBeforeMount(() => {
            initFileInfo();
        });

        const initFileInfo = () => {
            if (!props.avatarInfo) {
                return;
            }
            //解析平台
            switch (props.avatarInfo.platform) {
                case "tencent": //腾讯云
                    break;
                case "aliyun": //阿里云
                    break;
                case "qiniu": //七牛云
                    preViewUrlRef.value = props.avatarInfo.signed_url;
                    break;
                case "local":
                    break;
                default:
                    cigoLayer.msg("未知上传平台:" + props.avatarInfo.platform);
                    break;
            }
        };

        const chooseImg = () => {
            vFileRef.value.click();
        };

        const fileSelectChange = (fileList: any[]) => {
            if (!fileList || fileList.length == 0) {
                return;
            }
            selectedImgRef.value = fileList[0];
            readLocalFile();
            makeUploadToken();
        };
        const readLocalFile = () => {
            if (!window.FileReader) {
                cigoLayer.msg("不支持读取本地File");
                return;
            }
            var fileReader = new FileReader();
            fileReader.onload = event => {
                if (!event.target) {
                    return;
                }
                var fileData = event.target.result;
                if (!validateImg(fileData)) {
                    cigoLayer.msg("请上传png,jpg,gif格式的图片");
                } else {
                    preViewUrlRef.value = fileData;
                }
            };

            fileReader.readAsDataURL(toRaw(selectedImgRef.value));
        };
        const validateImg = (fileData: any) => {
            var pos = fileData.indexOf(",") + 1;
            let fileExtFilter = makeFileExtFilter();
            for (var typeKey of fileExtFilter.keys()) {
                if (fileData.indexOf(fileExtFilter.get(typeKey)) === pos) {
                    return typeKey;
                }
            }
            return null;
        };

        const makeUploadToken = () => {
            let params = {
                bucket: bucket.img
            };
            //1. 获取上传凭证Token
            apiRequest.v1
                .post("/qiniu/token", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    doUpload(response);
                })
                .catch(apiErrorCatch.v1);
        };

        const doUpload = (response: any) => {
            let config = {
                uphost: response.data.data.upload_host,
                useCdnDomain: true //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                // region: qiniu.region.z2 // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
            };
            let putExtra = {
                params: {}, //用来放置自定义变量
                mimeType: '"image/jpeg", "image/png", "image/gif"' //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
            };

            var observable = qiniu.upload(
                toRaw(selectedImgRef.value),
                UUID.generate(),
                response.data.data.token,
                putExtra,
                config
            );
            observable.subscribe({
                // next: result => {
                //     // result.total.percent * 100 //上传进度
                //     // console.log('percent:', result.total.percent);
                // },
                error: errResult => {
                    cigoLayer.msg(
                        selectedImgRef.value.name +
                        "(上传失败，失败原因：" +
                        errResult +
                        ")"
                    );
                },
                complete: result => {
                    cigoLayer.msg(selectedImgRef.value.name + ":" + result.msg);
                    //更换为远程图片
                    preViewUrlRef.value = result.data.signed_url;

                    // 更新表单数据
                    ctx.emit("update:avatarInfo", result.data);
                }
            });
        };

        const showPreview = () => {
            cigoLayer.window({
                component: CigoPreviewImg,
                backgroundColor: "#00000000",
                maskClose: true,
                windowSize: "max",
                showCtrlBar: false,
                canDragFlag: false,
                layerData: {
                    imgList: preViewUrlRef.value ? [preViewUrlRef.value] : []
                }
            });
        };

        return {
            vFileRef,
            preViewUrlRef,
            chooseImg,
            fileSelectChange,
            showPreview
        };
    }
});
</script>

<style lang="scss">
.cigo-avatar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2px;
    border: 2px solid #f0f0f055;
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 50%;
    box-shadow: 0px 2px 10px #ccc;

    .avatar {
        border-radius: 50%;
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    .ctrl-bar {
        position: absolute;
        width: 100%;
        height: 100%;
        display: none;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        top: 0px;
        left: 0px;
        border-radius: 50%;
        background-color: #333333;
        opacity: 0;

        .icon {
            width: 40px;
            height: 40px;
            padding: 10px;
            color: #f0f0f0;
        }
    }
}

.cigo-avatar:hover>.ctrl-bar {
    display: flex;
    opacity: 0.6;
}
</style>
