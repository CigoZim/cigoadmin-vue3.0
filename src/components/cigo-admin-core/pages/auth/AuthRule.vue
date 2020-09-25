<template>
<div class="cigo-auth-rule">
    <div class="top-bar">
        <a-button-group class="left">
            <a-button type="primary" @click.stop="notify('refresh')">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-shuaxin1'"></cigo-icon-font>
                </template>刷新
            </a-button>
            <a-button type="primary" @click.stop="ctrlNew">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-add'"></cigo-icon-font>
                </template>新建菜单/节点
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

    <a-table class="auth-rule-list" :rowKey="'id'" :locale="{emptyText:'暂无节点数据'}" :pagination="false" :columns="columns" :children-column-name="'subList'" :data-source="menuTreeListForEditRef" :row-selection="rowSelection" :scroll="{ x: 1800 , y: 'max-content'}">
        <template v-slot:icon="{ record }">
            <cigo-icon-font class="menu-icon" :name="record.icon" :style="[{color:record.color}]"></cigo-icon-font>
        </template>
        <template v-slot:type="{ record }">
            <span>{{menuType(record)}}</span>
        </template>

        <template v-slot:targetType="{ record }">
            <span>{{menuTargetType(record)}}</span>
        </template>
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
    ref,
    toRaw,
    unref,
    watch
} from "vue";
import {
    Menu
} from "@/components/cigo-admin-core/utils/types";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import cigoLayer from "@/components/cigo-layer";
import EditRule from "@/components/cigo-admin-core/pages/auth/edit/Rule.vue";
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";
import {
    frameTrans
} from "../../utils/trans";

export default defineComponent({
    name: "CigoAuthRule",
    components: {
        CigoIconFont
    },
    setup(props, context) {
        let menuTreeListForEditRef: any = inject("menuTreeListForEditRef");
        let menuBaseListForEditRef: any = inject("menuBaseListForEditRef");
        let menuBaseList: Menu[] = [...toRaw(menuBaseListForEditRef.value)];

        //Tips_Flag 深刻理解ref、unref、reacte、toRaw、;、Proxy和RefImpl对象
        watch(menuBaseListForEditRef, (newVal, preVal) => {
            // console.log("newVal:", newVal); //新旧值都是Proxy对象
            // console.log("preVal:", newVal);
            // console.log("menuBaseListForEditRef:", menuBaseListForEditRef); //ref()出来的RefImpl
            // console.log("menuBaseListForEditRef.value:", menuBaseListForEditRef.value); //Proxy对象，reacte出来的对象
            // console.log("unref(menuBaseListForEditRef):", unref(menuBaseListForEditRef)); //unref是个获取ref中value的三元运算语法糖
            // console.log("toRaw(menuBaseListForEditRef.value):", toRaw(menuBaseListForEditRef.value)); //还原Proxy对象
            menuBaseList = [...toRaw(menuBaseListForEditRef.value)];
            // console.log("menuBaseList:", menuBaseList);
        });

        const columns = [{
                title: "权限节点/菜单",
                dataIndex: "title"
            },
            {
                title: "图标",
                dataIndex: "icon",
                width: "80px",
                slots: {
                    customRender: "icon"
                }
            },
            {
                title: "节点类型",
                dataIndex: "type",
                width: "90px",
                slots: {
                    customRender: "type"
                }
            },
            {
                title: "跳转路由/URL",
                dataIndex: "url",
            },
            {
                title: "跳转类型",
                dataIndex: "target_type",
                width: "150px",
                slots: {
                    customRender: "targetType"
                }
            },
            {
                title: "对应组件名",
                dataIndex: "component_name",
                width: "150px"
            },
            {
                title: "分组",
                dataIndex: "group",
                width: "100px"
            },
            {
                title: "分组排序",
                dataIndex: "group_sort",
                width: "90px"
            },
            {
                title: "排序",
                dataIndex: "sort",
                width: "90px"
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

        const menuType = (menu: Menu) => {
            let type = "";
            switch (menu.type) {
                case 1:
                    type = "权限节点";
                    break;
                case 2:
                    type = "操作按钮";
                    break;
                case 0:
                default:
                    type = "系统菜单";
                    break;
            }
            return type;
        };
        const menuTargetType = (menu: Menu) => {
            let type = "";
            switch (menu.target_type) {
                case "layer-win":
                    type = "弹窗动态组件";
                    break;
                case "_blank":
                    type = "新窗口";
                    break;
                case "content-page":
                default:
                    type = "右侧动态组件";
                    break;
            }
            return type;
        };

        const rowSelection = {
            fixed: true,
            type: "radio",
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                console.log(
                    `selectedRowKeys: ${selectedRowKeys}`,
                    "selectedRows: ",
                    selectedRows
                );
            },
            onSelect: (record: any, selected: any, selectedRows: any) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (
                selected: any,
                selectedRows: any,
                changeRows: any
            ) => {
                console.log(selected, selectedRows, changeRows);
            }
        };

        const statusAuth = (id: number, status: number) => {};

        const ctrlStatus = (menu: Menu, status: number) => {
            let params = {
                id: menu.id,
                status: status
            };
            apiRequest.v1
                .post("/status/Rule", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    notify("refresh");
                    //提示
                    cigoLayer.msg(response.data.msg);
                })
                .catch(apiErrorCatch.v1);
        };

        const notify = (flag: string, data ? : object) => {
            if (flag == "refresh") {
                //TODO 优化速度
                //通知刷新菜单
                frameTrans.notifyRefreshMenu();
            }
        };

        const ctrlAddSub = (menu: Menu) => {
            cigoLayer.window({
                component: EditRule,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "添加节点",
                    menuList: menuBaseList,
                    menuParent: menu
                },
                notify: notify
            });
        };
        const ctrlView = (menu: Menu) => {
            cigoLayer.window({
                component: EditRule,
                width: "800px",
                height: "600px",
                layerData: {
                    title: "查看节点",
                    menuList: menuBaseList,
                    menuCurr: menu,
                    viewFlag: true
                }
            });
        };

        const ctrlNew = () => {
            cigoLayer.window({
                component: EditRule,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "添加节点",
                    menuList: menuBaseList
                },
                notify: notify
            });
        };

        const ctrlEdit = (menu: Menu) => {
            cigoLayer.window({
                component: EditRule,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "修改节点",
                    menuList: menuBaseList,
                    menuCurr: menu
                },
                notify: notify
            });
        };

        return {
            menuTreeListForEditRef,
            columns,
            menuType,
            menuTargetType,
            rowSelection,
            ctrlStatus,
            ctrlAddSub,
            ctrlNew,
            ctrlView,
            ctrlEdit,
            notify
        };
    }
});
</script>

<style lang="scss">
.cigo-auth-rule {
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

    .auth-rule-list {
        .menu-icon {
            width: 16px;
            height: 16px;
        }

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

.cigo-auth-rule::-webkit-scrollbar {
    width: 0;
}
</style>
