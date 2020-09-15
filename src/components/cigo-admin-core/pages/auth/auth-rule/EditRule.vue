<template>
<div class="edit-rule">
    <div class="title-area">
        <span>{{dataRef.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="菜单名：" name="title" v-bind="validateInfos.title">
                <a-input v-model:value="formData.title" placeholder="请输入菜单名" />
            </a-form-item>
            <a-form-item label="组件名：" name="component_name">
                <a-input v-model:value="formData.component_name" placeholder="请填写组件名" />
            </a-form-item>
            <a-form-item label="图标：" name="icon">
                <a-input v-model:value="formData.icon" placeholder="请设置图标">
                    <template v-slot:suffix>
                        <cigo-icon-font class="btn-icon" :bindIcon="bindIcon" :color="'blue'"></cigo-icon-font>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label="路由：" name="url">
                <a-input v-model:value="formData.url" placeholder="请设置路由" />
            </a-form-item>
            <a-form-item label="排序：" name="sort">
                <a-input v-model:value="formData.sort" placeholder="请设置排序" />
            </a-form-item>
        </a-form>
        <div class="line"></div>
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="菜单分组：" name="group">
                <a-input v-model:value="formData.group" placeholder="请设置分组" />
            </a-form-item>
            <a-form-item label="分组排序：" name="group_sort">
                <a-input v-model:value="formData.group_sort" placeholder="请设置分组排序" />
            </a-form-item>
            <a-form-item label="节点类型" name="type">
                <a-radio-group v-model:value="formData.type">
                    <a-radio value="0">菜单</a-radio>
                    <a-radio value="1">节点</a-radio>
                    <a-radio value="2">按钮</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不可关闭" name="can_not_close_opentab">
                <a-radio-group v-model:value="formData.can_not_close_opentab">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不被记录" name="can_not_record_opentab">
                <a-radio-group v-model:value="formData.can_not_record_opentab">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="不被缓存" name="can_not_cache">
                <a-radio-group v-model:value="formData.can_not_cache">
                    <a-radio value="0">否</a-radio>
                    <a-radio value="1">是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="跳转类型" name="target_type">
                <a-radio-group v-model:value="formData.target_type">
                    <a-radio value="0">右侧</a-radio>
                    <a-radio value="1">弹窗</a-radio>
                    <a-radio value="2">新页</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="说明：" name="summary">
                <a-textarea v-model:value="formData.summary" />
            </a-form-item>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doAdd">添加</a-button>
            <a-button type="default" @click.stop="cancel">取消</a-button>
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
import cigoLayer from "@/components/cigo-layer";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import {
    useForm
} from "@ant-design-vue/use";
import {
    toArray
} from "lodash";
import {
    defineComponent,
    reactive,
    toRaw,
    toRef,
    toRefs,
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
        let dataRef = reactive(props.data);
        let formData = reactive({
            type: 0, //节点类型（0-系统菜单；1-权限节点非菜单；2-按钮）
            pid: 0,
            path: "0,",
            title: "",
            icon: "cigoadmin-icon-menu",
            component_name: "",
            can_not_close_opentab: 0,
            can_not_record_opentab: 0,
            can_not_cache: 0,
            url: "",
            target_type: "", //content-page：右侧页面；layer-win：弹窗窗口；_blank：新打开页面
            summary: "",
            group: "",
            group_sort: "",
            sort: ""
        });
        let iconRef = toRef(formData, "icon");
        const bindIcon = () => {
            return iconRef;
        };

        const formItemRules = reactive({
            title: [{
                required: true,
                message: "请输入用户名"
            }]
        });
        const {
            resetFields,
            validate,
            validateInfos,
            mergeValidateInfo
        } = useForm(formData, formItemRules);

        const doAdd = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params = toRaw(formData);
                    apiRequest.v1
                        .post("/addRule", params, {
                            headers: apiSign(params)
                        })
                        .then(response => {
                            cigoLayer.msg("添加");
                        })
                        .catch(apiErrorCatch.v1);
                })
                .catch(err => {
                    console.log("error", err);
                    let help: any = mergeValidateInfo(...toArray(validateInfos))
                        .help;
                    cigoLayer.msg(help);
                });
        };
        const cancel = () => {
            console.log("取消");
            ctx.emit("close");
        };

        return {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16
            },
            dataRef,
            formData,
            bindIcon,
            validateInfos,
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
        padding: 8px 12px;
        display: flex;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        flex-direction: row;
        justify-content: center;
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
