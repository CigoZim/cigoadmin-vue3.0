<template>
<div class="edit-rule-group">
    <div class="title-area">
        <span>{{layerData.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="父级角色：" name="pid">
                <a-select v-model:value="formDataRef.pid" show-search placeholder="请选择父级角色" not-found-content="当前无父级角色" :filter-option="filterParentGroupOption" @change="pGroupChange" :disabled="layerData.viewFlag">
                    <a-select-option :value="0" :itemData="{id:0, title:'', pid:0, path:'0,', rules:[]}">
                        <span style="color:#666;font-weight:700;">--设置根角色--</span>
                    </a-select-option>
                    <a-select-option v-for="(item,index) in groupNoTreeListRef" :key="index+1" :value="item.id" :itemData="item" :disabled="layerData.groupCurr && layerData.groupCurr.id == item.id">
                        <span v-if="item.level">
                            <span v-for="(tabItem,tabIndex) in item.level" :key="tabIndex">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{{item.last ? '└ ':'├ '}}</span>
                        </span>
                        {{item.title +(layerData.groupCurr && layerData.groupCurr.id == item.id ? ' (当前)' :'')}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="角色名：" name="title" v-bind="validateInfos.title">
                <a-input v-model:value="formDataRef.title" placeholder="请输入角色名" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="角色排序：" name="sort" v-bind="validateInfos.sort">
                <a-input v-model:value="formDataRef.sort" placeholder="请设置排序" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="说明：" name="summary">
                <a-textarea v-model:value="formDataRef.summary" :disabled="layerData.viewFlag" />
            </a-form-item>
            <div class="line"></div>
            <a-form-item label="权限配置：" name="rules">
                <a-tree v-model:checkedKeys="formDataRef.rules" :replaceFields="{children: 'subList', key: 'id'}" checkable :auto-expand-parent="true" :defaultExpandAll="true" :tree-data="layerData.menuList" :disabled="layerData.viewFlag" />
            </a-form-item>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doSubmit" v-if="!layerData.viewFlag">{{layerData.groupCurr ? '修 改' : '添 加'}}</a-button>
            <a-button type="default" @click.stop="cancel">{{layerData.viewFlag ? '关 闭' :'取 消'}}</a-button>
        </a-button-group>
    </div>
</div>
</template>

<script lang="ts">
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";
import {
    AuthGroup,
    Menu
} from "@/components/cigo-admin-core/utils/types";
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
    onMounted,
    reactive,
    ref,
    toRaw,
    toRef,
    toRefs,
    unref,
    watch
} from "vue";
export default defineComponent({
    name: "CigoEditRuleGroup",
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        onBeforeMount(() => {
            initNoTreeList();
            initParentGroup();
        });

        let groupNoTreeListRef: any = ref([]);
        const initNoTreeList = () => {
            let noTreeList: AuthGroup[] = [];
            convertGroupListToNoTree(
                props.layerData.groupTreeListRef.value,
                noTreeList,
                0
            );
            groupNoTreeListRef.value = [...noTreeList];
        };
        const convertGroupListToNoTree = (
            treeList: AuthGroup[],
            noTreeList: AuthGroup[],
            level: number
        ) => {
            treeList.every((item: AuthGroup, index: number) => {
                if (item.status == -1) {
                    treeList.splice(index, 1);
                    return true;
                }
                item.level = level;
                noTreeList.push(item);
                if (item.subList && item.subList.length) {
                    convertGroupListToNoTree(
                        item.subList,
                        noTreeList,
                        level + 1
                    );
                }

                return true;
            });
        };

        let pOldGroup: AuthGroup = {
            id: 0,
            title: "",
            pid: 0,
            path: "",
            rules: []
        };
        let pCurrGroup: AuthGroup = pOldGroup;
        const initParentGroup = () => {
            if (props.layerData.groupCurr && props.layerData.groupCurr.pid) {
                groupNoTreeListRef.value.every(
                    (item: AuthGroup, index: number) => {
                        if (item.id === props.layerData.groupCurr.pid) {
                            pOldGroup = item;
                            pCurrGroup = item;
                            formDataRef.pid = item.id;
                            formDataRef.path = item.path + item.id + ",";
                            return false;
                        }
                        return true;
                    }
                );
            } else if (
                props.layerData.groupParent &&
                props.layerData.groupParent.id
            ) {
                pOldGroup = props.layerData.groupParent;
                pCurrGroup = props.layerData.groupParent;
                formDataRef.pid = props.layerData.groupParent.id;
                formDataRef.path =
                    props.layerData.groupParent.path +
                    props.layerData.groupParent.id +
                    ",";
            }
        };

        let formDataRef = reactive({
            id: props.layerData.groupCurr ? props.layerData.groupCurr.id : null,
            title: props.layerData.groupCurr ?
                props.layerData.groupCurr.title : "",
            sort: props.layerData.groupCurr ?
                props.layerData.groupCurr.sort : 100,
            summary: props.layerData.groupCurr ?
                props.layerData.groupCurr.summary : "",
            rules: props.layerData.groupCurr ?
                props.layerData.groupCurr.rules : [],
            pid: pOldGroup.id,
            path: pOldGroup.path + pOldGroup.id + ","
        });
        const formItemRules = reactive({
            title: [{
                required: true,
                message: "请输入角色名"
            }],
            sort: [{
                    required: true,
                    message: "请配置角色排序"
                },
                {
                    type: "integer",
                    transform: (value: any) => {
                        return Number(value);
                    },
                    message: "排序为正整数"
                }
            ]
        });
        const {
            resetFields,
            validate,
            validateInfos,
            mergeValidateInfo
        } = useForm(formDataRef, formItemRules);
        const filterParentGroupOption = (inputVal: string, option: any) => {
            return (
                option.props.itemData &&
                option.props.itemData.title.indexOf(inputVal) != -1
            );
        };
        const pGroupChange = (value: any, option: any) => {
            pCurrGroup = option.props.itemData;
            formDataRef.path = value ?
                option.props.itemData.path + value + "," :
                "0,";
        };

        const doSubmit = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params: any = {};
                    Object.assign(params, toRaw(formDataRef));
                    apiRequest.v1
                        .post(
                            props.layerData.groupCurr ?
                            "/edit/Group" :
                            "/add/Group",
                            params, {
                                headers: apiSign(params)
                            }
                        )
                        .then(response => {
                            //更新本地数据
                            if (props.layerData.groupCurr) {
                                editRefreshLocalList(response.data.data);
                            } else {
                                addRefreshLocalList(response.data.data);
                            }
                            //刷新列表数据
                            ctx.emit(
                                "notify",
                                "refresh",
                                toRaw(props.layerData.groupTreeListRef.value)
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

        const addRefreshLocalList = (newData: AuthGroup) => {
            // 转化为响应式对象
            let newDataRef = reactive(newData);
            // 挂载新节点
            if (pCurrGroup.id) {
                if (!pCurrGroup.subList) {
                    pCurrGroup.subList = [];
                }
                pCurrGroup.subList = [...pCurrGroup.subList, newDataRef];

                props.layerData.groupTreeListRef.value = [
                    ...props.layerData.groupTreeListRef.value
                ];
            } else {
                props.layerData.groupTreeListRef.value = [
                    ...props.layerData.groupTreeListRef.value,
                    newDataRef
                ];
            }
        };
        const editRefreshLocalList = (newData: AuthGroup) => {
            // 刷新数据
            Object.assign(props.layerData.groupCurr, newData);
            // 转移节点
            if (pCurrGroup.id !== pOldGroup.id) {
                // 移除原位置
                if (pOldGroup.id) {
                    if (pOldGroup.subList) {
                        let tmpList = [...pOldGroup.subList];
                        tmpList.splice(
                            tmpList.indexOf(props.layerData.groupCurr),
                            1
                        );
                        tmpList.length == 0 ?
                            delete pOldGroup.subList :
                            (pOldGroup.subList = [...tmpList]);
                    }
                } else {
                    let tmpList = [...props.layerData.groupTreeListRef.value];
                    tmpList.splice(
                        tmpList.indexOf(props.layerData.groupCurr),
                        1
                    );
                    props.layerData.groupTreeListRef.value = [...tmpList];
                }
                // 加入新位置
                if (pCurrGroup.id) {
                    if (!pCurrGroup.subList) {
                        pCurrGroup.subList = [];
                    }
                    pCurrGroup.subList = [
                        ...pCurrGroup.subList,
                        props.layerData.groupCurr
                    ];
                } else {
                    props.layerData.groupTreeListRef.value = [
                        ...props.layerData.groupTreeListRef.value,
                        props.layerData.groupCurr
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
            filterParentGroupOption,
            pGroupChange,
            groupNoTreeListRef,
            formDataRef,
            doSubmit,
            cancel
        };
    }
});
</script>

<style lang="scss">
.edit-rule-group {
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
