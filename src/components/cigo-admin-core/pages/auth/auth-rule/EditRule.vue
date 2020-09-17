<template>
<div class="edit-rule">
    <div class="title-area">
        <span>{{dataRef.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="父级节点：" name="pid">
                <a-select v-model:value="formData.pid" show-search placeholder="请选择父级节点" not-found-content="当前无父级节点" :filter-option="filterParentMenuOption" @change="handleParentMenuChange" :disabled="dataRef.viewFlag">
                    <a-select-option :value="0" :itemData="{}">
                        <span style="color:#666;font-weight:700;">--根菜单--</span>
                    </a-select-option>
                    <!-- //Tips_Flag key值+1保证排除第一项，可尝试取消看option背景色 -->
                    <a-select-option v-for="(item,index) in menuList" :key="index+1" :value="item.id" :itemData="item" :disabled="dataRef.menuCurr && dataRef.menuCurr.id == item.id">
                        <span v-if="item.level">
                            <span v-for="(tabItem,tabIndex) in item.level" :key="tabIndex">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{{item.last ? '└ ':'├ '}}</span>
                        </span>
                        {{item.title +(dataRef.menuCurr && dataRef.menuCurr.id == item.id ? ' (当前)' :'')}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="菜单名：" name="title" v-bind="validateInfos.title">
                <a-input v-model:value="formData.title" placeholder="请输入菜单名" :disabled="dataRef.viewFlag" />
            </a-form-item>
            <a-form-item label="组件名：" name="component_name" v-bind="validateInfos.component_name">
                <a-input v-model:value="formData.component_name" placeholder="请配置唯一组件/节点名" :disabled="dataRef.viewFlag" />
            </a-form-item>
            <a-form-item label="图标：" name="icon">
                <a-input v-model:value="formData.icon" placeholder="请设置图标" :disabled="dataRef.viewFlag">
                    <template v-slot:suffix>
                        <cigo-icon-font class="btn-icon" :name="formData.icon" :color="'blue'"></cigo-icon-font>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label="路由：" name="url" v-bind="validateInfos.url">
                <a-input v-model:value="formData.url" placeholder="请设置路由" :disabled="dataRef.viewFlag" />
            </a-form-item>
            <a-form-item label="节点排序：" name="sort" v-bind="validateInfos.sort">
                <a-input v-model:value="formData.sort" placeholder="请设置排序" :disabled="dataRef.viewFlag" />
            </a-form-item>
            <a-form-item label="菜单分组：" name="group">
                <a-input v-model:value="formData.group" placeholder="请设置分组" :disabled="dataRef.viewFlag" />
            </a-form-item>
            <a-form-item label="分组排序：" name="group_sort" v-bind="validateInfos.group_sort">
                <a-input v-model:value="formData.group_sort" placeholder="请设置分组排序" :disabled="dataRef.viewFlag" />
            </a-form-item>
        </a-form>
        <div class="line"></div>
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="节点类型" name="type">
                <a-radio-group v-model:value="formData.type" :disabled="dataRef.viewFlag">
                    <a-radio :value="0">菜单</a-radio>
                    <a-radio :value="1">节点</a-radio>
                    <a-radio :value="2">按钮</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不可关闭" name="can_not_close_opentab">
                <a-radio-group v-model:value="formData.can_not_close_opentab" :disabled="dataRef.viewFlag">
                    <a-radio :value="0">否</a-radio>
                    <a-radio :value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不被记录" name="can_not_record_opentab">
                <a-radio-group v-model:value="formData.can_not_record_opentab" :disabled="dataRef.viewFlag">
                    <a-radio :value="0">否</a-radio>
                    <a-radio :value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不被缓存" name="can_not_cache">
                <a-radio-group v-model:value="formData.can_not_cache" :disabled="dataRef.viewFlag">
                    <a-radio :value="0">否</a-radio>
                    <a-radio :value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="跳转类型" name="target_type">
                <a-radio-group v-model:value="formData.target_type" :disabled="dataRef.viewFlag">
                    <a-radio :value="'content-page'">右侧</a-radio>
                    <a-radio :value="'layer-win'">弹窗</a-radio>
                    <a-radio :value="'_blank'">新页</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="说明：" name="summary">
                <a-textarea v-model:value="formData.summary" :disabled="dataRef.viewFlag" />
            </a-form-item>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doAdd" v-if="!dataRef.viewFlag">添 加</a-button>
            <a-button type="default" @click.stop="cancel">{{dataRef.viewFlag ? '关 闭' :'取 消'}}</a-button>
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
    frameTrans
} from "@/components/cigo-admin-core/utils/trans";
import {
    Menu
} from "@/components/cigo-admin-core/utils/types";
import cigoLayer from "@/components/cigo-layer";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import {
    useForm
} from "@ant-design-vue/use";
import {
    toArray
} from "lodash";
import {
    computed,
    defineComponent,
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
    name: "EditRule",
    components: {
        CigoIconFont
    },
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let menuList = [...props.data.menuList];
        let dataRef = reactive(props.data);
        let formData = reactive({
            id: dataRef.menuCurr ? dataRef.menuCurr.id : null,
            type: dataRef.menuCurr ? dataRef.menuCurr.type : 0, //节点类型（0-系统菜单；1-权限节点非菜单；2-按钮）
            pid: dataRef.menuCurr ?
                dataRef.menuCurr.pid :
                dataRef.menuParent ?
                dataRef.menuParent.id :
                0,
            path: dataRef.menuCurr ?
                dataRef.menuCurr.path :
                dataRef.menuParent ?
                dataRef.menuParent.path + dataRef.menuParent.id + "," :
                "0,",
            title: dataRef.menuCurr ? dataRef.menuCurr.title : "",
            icon: dataRef.menuCurr ?
                dataRef.menuCurr.icon :
                "cigoadmin-icon-menu",
            component_name: dataRef.menuCurr ?
                dataRef.menuCurr.component_name :
                "",
            can_not_close_opentab: dataRef.menuCurr ?
                dataRef.menuCurr.can_not_close_opentab :
                0,
            can_not_record_opentab: dataRef.menuCurr ?
                dataRef.menuCurr.can_not_record_opentab :
                0,
            can_not_cache: dataRef.menuCurr ?
                dataRef.menuCurr.can_not_cache :
                0,
            url: dataRef.menuCurr ? dataRef.menuCurr.url : "",
            target_type: dataRef.menuCurr ?
                dataRef.menuCurr.target_type :
                "content-page", //content-page：右侧页面；layer-win：弹窗窗口；_blank：新打开页面
            summary: dataRef.menuCurr ? dataRef.menuCurr.summary : "",
            group: dataRef.menuCurr ? dataRef.menuCurr.group : "",
            group_sort: dataRef.menuCurr ? dataRef.menuCurr.group_sort : 100,
            sort: dataRef.menuCurr ? dataRef.menuCurr.sort : 100
        });
        const formItemRules = reactive({
            title: [{
                required: true,
                message: "请输入用户名"
            }],
            url: [{
                required: true,
                message: "请配置路由"
            }],
            component_name: [{
                required: true,
                message: "请配置唯一组件/节点名"
            }],
            sort: [{
                    required: true,
                    message: "请配置节点排序"
                },
                {
                    type: "integer",
                    transform: (value: any) => {
                        return Number(value);
                    },
                    message: "排序为正整数"
                }
            ],
            group_sort: [{
                    required: true,
                    message: "请配置分组排序"
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
        } = useForm(formData, formItemRules);
        const filterParentMenuOption = (inputVal: string, option: any) => {
            return (
                option.props.itemData &&
                option.props.itemData.title.indexOf(inputVal) != -1
            );
        };
        const handleParentMenuChange = (value: any, option: any) => {
            console.log("change");

            formData.path = value ?
                option.props.itemData.path + value + "," :
                "0,";
        };

        const doAdd = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params = toRaw(formData);
                    apiRequest.v1
                        .post(
                            props.data.menuCurr ? "/editRule" : "/addRule",
                            params, {
                                headers: apiSign(params)
                            }
                        )
                        .then(response => {
                            //通知刷新菜单
                            frameTrans.notifyRefreshMenu();

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

        const cancel = () => {
            console.log("取消");
            ctx.emit("close");
        };

        return {
            menuList,
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16
            },
            dataRef,
            formData,
            validateInfos,
            filterParentMenuOption,
            handleParentMenuChange,
            doAdd,
            cancel
        };
    }
});
</script>

<style lang="scss">
.edit-rule {
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
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex: 1;
        padding: 8px 12px;
        overflow-x: hidden;
        overflow-y: scroll;

        .form-item {
            width: 45%;
            height: 100%;
        }

        .line {
            width: 1px;
            height: 90%;
            background-color: #f0f0f0;
        }
    }

    .content-area::-webkit-scrollbar {
        width: 0;
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
