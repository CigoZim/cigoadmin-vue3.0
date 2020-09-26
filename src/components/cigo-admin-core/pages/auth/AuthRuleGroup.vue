<template>
<div class="cigo-auth-rule-group">
    <div class="top-bar">
        <a-button-group class="left">
            <a-button type="primary" @click.stop="requestGroupList">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-shuaxin1'"></cigo-icon-font>
                </template>刷新
            </a-button>
            <a-button type="primary" @click.stop="ctrlNew">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-add'"></cigo-icon-font>
                </template>新建角色
            </a-button>
        </a-button-group>
        <a-button-group class="right">
            <a-button type="primary">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-daochu'"></cigo-icon-font>
                </template>导出数据
            </a-button>
        </a-button-group>
    </div>

    <a-table class="auth-rule-group-list" :rowKey="'id'" :locale="{emptyText:'暂无角色数据'}" :pagination="false" :columns="columns" :children-column-name="'subList'" :data-source="groupTreeListRef" :scroll="{ x: 1300 , y: 'max-content'}">
        <template v-slot:operation="{ record }">
            <a-button class="opt-btn" @click.stop="ctrlStatus(record, record.status == 0 ? 1 : 0)" type="default" shape="circle" size="small">{{record.status ? '禁':'启'}}</a-button>
            <a-button class="opt-btn" @click.stop="ctrlAddSub(record)" type="default" shape="circle" size="small" title="添加子项">
                <template v-slot:icon>
                    <cigo-icon-font :name="'cigoadmin-icon-xinjianzixiang'" class="opt-icon opt-sub"></cigo-icon-font>
                </template>
            </a-button>
            <a-button class="opt-btn" @click.stop="ctrlView(record)" type="primary" shape="circle" size="small" title="查看">
                <template v-slot:icon>
                    <cigo-icon-font :name="'cigoadmin-icon-liulan'" class="opt-icon opt-primary opt-view"></cigo-icon-font>
                </template>
            </a-button>
            <a-button class="opt-btn" @click.stop="ctrlEdit(record)" type="primary" shape="circle" size="small" title="编辑">
                <template v-slot:icon>
                    <cigo-icon-font :name="'cigoadmin-icon-bianji'" class="opt-icon opt-primary opt-edit"></cigo-icon-font>
                </template>
            </a-button>
            <a-button class="opt-btn" @click.stop="ctrlStatus(record, -1)" type="danger" shape="circle" size="small" title="删除">
                <template v-slot:icon>
                    <cigo-icon-font :name="'cigoadmin-icon-shanchu1'" class="opt-icon opt-primary opt-del"></cigo-icon-font>
                </template>
            </a-button>
        </template>
    </a-table>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    isRef,
    markRaw,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    toRaw,
    unref,
    watch
} from "vue";
import {
    AuthGroup,
    Menu
} from "@/components/cigo-admin-core/utils/types";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import cigoLayer from "@/components/cigo-layer";
import EditRuleGroup from "@/components/cigo-admin-core/pages/auth/edit/RuleGroup.vue";
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";

export default defineComponent({
    name: "CigoAuthRuleGroup",
    components: {
        CigoIconFont
    },
    setup(props, ctx) {
        let groupTreeListRef: any = ref([]);
        onBeforeMount(() => {
            requestGroupList();
        });
        const requestGroupList = () => {
            let params = {
                module: "admin"
            };
            apiRequest.v1
                .post("/groupList", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    //属性角色列表
                    groupTreeListRef.value = [...response.data.data];
                })
                .catch(apiErrorCatch.v1);
        };

        let menuTreeListForEditRef: any = inject("menuTreeListForEditRef");
        let menuList: Menu[] = [...toRaw(menuTreeListForEditRef.value)];
        watch(menuTreeListForEditRef, (newVal, preVal) => {
            menuList = [...toRaw(menuTreeListForEditRef.value)];
        });

        const columns = [{
                title: "角色",
                dataIndex: "title"
            },
            {
                title: "排序",
                dataIndex: "sort",
                width: "90px"
            },
            {
                title: "说明",
                dataIndex: "summary",
                width: "400px"
            },
            {
                title: "操作",
                key: "operation",
                fixed: "right",
                width: 180,
                slots: {
                    customRender: "operation"
                }
            }
        ];

        const ctrlStatus = (group: AuthGroup, status: number) => {
            let params = {
                id: group.id,
                status: status
            };
            apiRequest.v1
                .post("/status/Group", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    // 提示
                    cigoLayer.msg(response.data.msg);
                    // 处理数据
                    if (status != -1) {
                        group.status = status;
                    } else {
                        let tmpGroup: any = reactive({
                            id: 0,
                            subList: groupTreeListRef.value
                        });
                        deleteGroupLocal(tmpGroup, group, 0);
                        if (tmpGroup.subList && tmpGroup.subList.length) {
                            groupTreeListRef.value = [...tmpGroup.subList];
                        } else {
                            groupTreeListRef.value = [];
                        }
                    }
                })
                .catch(apiErrorCatch.v1);
        };

        const deleteGroupLocal = (groupItem: AuthGroup, group: AuthGroup, level: number): boolean => {
            if (!groupItem.subList || !groupItem.subList.length) {
                delete groupItem.subList;
                return false;
            }
            let hasFlag = false;
            let hasIndex = -1;
            groupItem.subList.every((item: AuthGroup, index: number) => {
                // 判断当前项
                if (item.id == group.id) {
                    hasFlag = true;
                    hasIndex = index;
                    return false;
                }
                // 判断子级
                if (deleteGroupLocal(item, group, level + 1)) {
                    hasFlag = true;
                    return false;
                }
                // 都不存在，继续
                return true;
            });
            if (hasFlag && hasIndex > -1) {
                let tmpSubList = [...groupItem.subList];
                tmpSubList.splice(hasIndex, 1);
                tmpSubList.length ?
                    groupItem.subList = [...tmpSubList] :
                    delete groupItem.subList;
            }
            return hasFlag;
        };

        const ctrlView = (group: AuthGroup) => {
            cigoLayer.window({
                component: EditRuleGroup,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "查看角色",
                    groupCurr: group,
                    viewFlag: true,
                    menuList: menuList,
                    groupTreeListRef: groupTreeListRef,
                }
            });
        };

        const notify = (flag: string, dataList ? : any) => {
            switch (flag) {
                case 'refresh':
                    groupTreeListRef.value = [...dataList];
                    break;
            }
        };

        const ctrlNew = () => {
            cigoLayer.window({
                component: EditRuleGroup,
                width: "800px",
                height: "650px",
                maskClose: false,
                layerData: {
                    title: "添加角色",
                    menuList: menuList,
                    groupTreeListRef: groupTreeListRef,
                },
                notify: notify
            });
        };

        const ctrlAddSub = (group: AuthGroup) => {
            cigoLayer.window({
                component: EditRuleGroup,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "添加角色",
                    groupParent: group,
                    menuList: menuList,
                    groupTreeListRef: groupTreeListRef,
                },
                notify: notify
            });
        };

        const ctrlEdit = (group: AuthGroup) => {
            cigoLayer.window({
                component: EditRuleGroup,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "修改角色",
                    groupCurr: group,
                    menuList: menuList,
                    groupTreeListRef: groupTreeListRef,
                },
                notify: notify
            });
        };

        return {
            requestGroupList,
            groupTreeListRef,
            columns,
            ctrlStatus,
            ctrlAddSub,
            ctrlNew,
            ctrlView,
            ctrlEdit
        };
    }
});
</script>

<style lang="scss">
.cigo-auth-rule-group {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;

        .btn-icon {
            margin-right: 5px;
            width: 15px;
            height: 15px;
        }
    }

    .auth-rule-group-list {
        .opt-btn {
            margin-right: 5px;
        }

        .opt-btn:last-child {
            margin-right: 0px;
        }

        .opt-icon {
            color: #666;
            padding: 1px;
        }

        .opt-primary {
            color: #fff;
        }

        .opt-icon:hover {
            color: #1890ff;
        }

        .opt-primary:hover {
            color: #fff !important;
        }
    }
}

.cigo-auth-rule-group::-webkit-scrollbar {
    width: 0;
}
</style>
