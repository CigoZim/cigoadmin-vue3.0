<template>
<div class="cigo-edit">
    <div class="title-area">
        <span>{{layerData.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol" :validate-trigger="'blur'">
            <a-form-item v-if="treeFlag" label="父级" name="pid">
                <a-select v-model:value="formDataProxy.pid" show-search placeholder="请选择父级" not-found-content="当前无数据" :filter-option="filterParentOption" @change="parentChange" :disabled="layerData.viewFlag">
                    <a-select-option :value="0" :itemData="{id:0, title:'', pid:0, path:'0,', rules:[]}">
                        <span style="color:#666;font-weight:700;">--设置为根项目--</span>
                    </a-select-option>
                    <a-select-option v-for="(item,index) in dataNoTreeListRef" :key="index+1" :value="item.id" :itemData="item" :disabled="layerData.recordCurr && layerData.recordCurr.id == item.id">
                        <span v-if="item.level">
                            <span v-for="(tabItem,tabIndex) in item.level" :key="tabIndex">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{{item.last ? '└ ':'├ '}}</span>
                        </span>
                        {{item.title +(layerData.recordCurr && layerData.recordCurr.id == item.id ? ' (当前)' :'')}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <slot name="content" :formDataProxy="formDataProxy" :validateInfos="validateInfos"></slot>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doSubmit" v-if="!layerData.viewFlag">{{layerData.recordCurr ? '修 改' : '添 加'}}</a-button>
            <a-button type="default" @click.stop="cancel">{{layerData.viewFlag ? '关 闭' :'取 消'}}</a-button>
        </a-button-group>
    </div>
</div>
</template>

<script lang="ts">
//TODO 页面按键监听：回车键、ESC 
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";
import {
    convertTreeToNoTree
} from "@/components/cigo-admin-core/utils/common";
import cigoLayer from "@/components/cigo-layer";
import {
    useForm
} from "@ant-design-vue/use";
import {
    toArray
} from "lodash";
import {
    defineComponent,
    onBeforeMount,
    reactive,
    ref,
    toRaw
} from "vue";
export default defineComponent({
    name: "CigoEdit",
    props: {
        treeFlag: {
            type: Boolean,
            default: false
        },
        layerData: {
            type: Object,
            default: {}
        },
        formData: {
            type: Object,
            default: {}
        },
        formItemRules: {
            type: Object,
            default: {}
        },
        addUrl: {
            type: String,
            required: true,
            default: ""
        },
        editUrl: {
            type: String,
            required: true,
            default: ""
        },
        newDataPushFlag: {
            type: Boolean,
            default: false
        },
        beforeEdit: {
            type: Function,
            default: () => {}
        }
    },
    setup(props, ctx) {
        onBeforeMount(() => {
            if (props.treeFlag) {
                initNoTreeList();
                initParent();
            }
        });

        /**************************** 处理父级相关 *******************************/
        let dataNoTreeListRef: any = ref([]);
        const initNoTreeList = () => {
            let noTreeList: any[] = [];
            convertTreeToNoTree(
                props.layerData.dataListRef.value,
                noTreeList,
                0
            );
            dataNoTreeListRef.value = [...noTreeList];
        };
        let parentOld: any = {
            id: 0,
            name: "",
            pid: 0,
            path: ""
        };
        let parentCurr: any = parentOld;
        const initParent = () => {
            if (props.layerData.recordCurr && props.layerData.recordCurr.pid) {
                dataNoTreeListRef.value.every((item: any, index: number) => {
                    if (item.id === props.layerData.recordCurr.pid) {
                        parentOld = item;
                        parentCurr = item;
                        formDataProxy.pid = item.id;
                        formDataProxy.path = item.path + item.id + ",";
                        return false;
                    }
                    return true;
                });
            } else if (
                props.layerData.recordParent &&
                props.layerData.recordParent.id
            ) {
                parentOld = props.layerData.recordParent;
                parentCurr = props.layerData.recordParent;
                formDataProxy.pid = props.layerData.recordParent.id;
                formDataProxy.path =
                    props.layerData.recordParent.path +
                    props.layerData.recordParent.id +
                    ",";
            }
        };
        const filterParentOption = (inputVal: string, option: any) => {
            return (
                option.props.itemData &&
                option.props.itemData.title.indexOf(inputVal) != -1
            );
        };
        const parentChange = (value: any, option: any) => {
            parentCurr = option.props.itemData;
            formDataProxy.path = value ?
                option.props.itemData.path + value + "," :
                "0,";
        };

        /************************** 表单配置 *********************************/

        let formDataTmp = Object.assign(props.formData, {
            pid: parentOld.id,
            path: parentOld.path + parentOld.id + ","
        });
        let formDataProxy = reactive(formDataTmp);
        const formItemRulesProxy = reactive(props.formItemRules);
        const {
            validate,
            validateInfos,
        } = useForm(formDataProxy, formItemRulesProxy);

        /************************** 提交表单及数据处理 *********************************/

        const doSubmit = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params: any = {};
                    Object.assign(params, toRaw(formDataProxy));
                    props.beforeEdit(params);
                    apiRequest.v1
                        .post(
                            props.layerData.recordCurr ?
                            props.editUrl :
                            props.addUrl,
                            params, {
                                headers: apiSign(params)
                            }
                        )
                        .then(response => {
                            //更新本地数据
                            if (props.layerData.recordCurr) {
                                props.treeFlag ?
                                    editRefreshTree(response.data.data) :
                                    editRefreshNoTree(response.data.data);
                            } else {
                                props.treeFlag ?
                                    addRefreshTree(response.data.data) :
                                    addRefreshNoTree(response.data.data);
                            }
                            //刷新列表数据
                            ctx.emit(
                                "notify",
                                "refresh",
                                toRaw(props.layerData.dataListRef.value)
                            );
                            //提示及关闭窗口
                            cigoLayer.msg(response.data.msg);
                            ctx.emit("close");
                        })
                        .catch(apiErrorCatch.v1);
                })
                .catch(err => {
                    console.log("error", err);
                });
        };

        const addRefreshNoTree = (newData: any) => {
            let newDataRef = reactive(newData);
            props.layerData.dataListRef.value = props.newDataPushFlag ? [...props.layerData.dataListRef.value, newDataRef] : [newDataRef, ...props.layerData.dataListRef.value];
        };
        const addRefreshTree = (newData: any) => {
            let newDataRef = reactive(newData);
            if (parentCurr.id) {
                if (!parentCurr.subList) {
                    parentCurr.subList = [];
                }
                parentCurr.subList = props.newDataPushFlag ? [...parentCurr.subList, newDataRef] : [newDataRef, ...parentCurr.subList];
                props.layerData.dataListRef.value = [
                    ...props.layerData.dataListRef.value
                ];
            } else {
                props.layerData.dataListRef.value = props.newDataPushFlag ? [...props.layerData.dataListRef.value, newDataRef] : [newDataRef, ...props.layerData.dataListRef.value];
            }
        };

        const editRefreshNoTree = (newData: any) => {
            Object.assign(props.layerData.recordCurr, newData);
        };
        const editRefreshTree = (newData: any) => {
            Object.assign(props.layerData.recordCurr, newData);
            if (parentCurr.id !== parentOld.id) {
                // 移除原位置
                if (parentOld.id) {
                    if (parentOld.subList) {
                        let tmpList = [...parentOld.subList];
                        tmpList.splice(
                            tmpList.indexOf(props.layerData.recordCurr),
                            1
                        );
                        tmpList.length == 0 ?
                            delete parentOld.subList :
                            (parentOld.subList = [...tmpList]);
                    }
                } else {
                    let tmpList = [...props.layerData.dataListRef.value];
                    tmpList.splice(
                        tmpList.indexOf(props.layerData.recordCurr),
                        1
                    );
                    props.layerData.dataListRef.value = [...tmpList];
                }
                // 加入新位置
                if (parentCurr.id) {
                    if (!parentCurr.subList) {
                        parentCurr.subList = [];
                    }
                    parentCurr.subList = props.newDataPushFlag ? [...parentCurr.subList, props.layerData.recordCurr] : [props.layerData.recordCurr, ...parentCurr.subList];
                    props.layerData.dataListRef.value = [
                        ...props.layerData.dataListRef.value
                    ];
                } else {
                    props.layerData.dataListRef.value = props.newDataPushFlag ? [
                        ...props.layerData.dataListRef.value,
                        props.layerData.recordCurr
                    ] : [
                        props.layerData.recordCurr,
                        ...props.layerData.dataListRef.value
                    ];
                }
            }
        };

        const cancel = () => {
            ctx.emit("close");
        };

        return {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 19
            },
            validateInfos,
            formDataProxy,
            filterParentOption,
            dataNoTreeListRef,
            parentChange,
            doSubmit,
            cancel
        };
    }
});
</script>

<style lang="scss">
.cigo-edit {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .title-area {
        background-color: #f5f5f5;
        border-bottom: 1px solid #f0f0f0;
        padding: 15px 12px;
        display: flex;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        flex-direction: row;
        justify-content: center;
        font-size: 16px;
    }

    .content-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        flex: 1;
        padding: 8px 12px;
        overflow-x: hidden;
        overflow-y: scroll;

        .form-item {
            width: 100%;

            .line {
                width: 90%;
                height: 1px;
                background-color: #f0f0f0;
                margin: 0px auto;
            }
        }
    }

    .btn-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 8px 12px;
        border-top: 1px solid #f0f0f0;
    }
}
</style>
