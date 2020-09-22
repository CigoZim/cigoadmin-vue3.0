<template>
<div class="cigo-manager">
    <div class="top-bar">
        <a-button-group class="left">
            <a-button type="primary" @click.stop="requestList">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-shuaxin1'"></cigo-icon-font>
                </template>刷新
            </a-button>
            <a-button type="primary" @click.stop="ctrlNew">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-add'"></cigo-icon-font>
                </template>新建管理员
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

    <a-table class="manager-list" :rowKey="'id'" :locale="{emptyText:'暂无管理员数据'}" :pagination="true" :columns="columns" :data-source="managerListRef" :scroll="{ x: 2000 , y: 'max-content'}">
        <template v-slot:img="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{record.is_online ? '在线' : '离线'}}</span>
        </template>
        <template v-slot:roleFlag="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{record.role_flag == 2 ? '管理员' : '超级管理员'}}</span>
        </template>
        <template v-slot:sex="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{showSex(record)}}</span>
        </template>
        <template v-slot:isOnline="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{record.is_online ? '在线' : '离线'}}</span>
        </template>
        <template v-slot:lastLogTime="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{record.last_log_time ? dayjs.unix(record.last_log_time).format('YYYY-MM-DD HH:mm:ss') : '未登录'}}</span>
        </template>
        <!-- //Tips_Flag Ant在authGroup为数组且有值得情况下，如果不用slot自定义视图，Ant将为authGroup数组子元素绑定v-node节点数据，在authGroup传递子组件时将导致长时间卡顿 -->
        <template v-slot:authGroup="{ txt, record }">
            <span v-if="txt"></span>
            <span>{{showAuthGroup(record)}}</span>
        </template>
        <template v-slot:operation="{ txt, record }">
            <span v-if="txt"></span>
            <a-button class="opt-btn" @click.stop="ctrlStatus(record, record.status == 0 ? 1 : 0)" type="default" shape="circle" size="small">{{record.status ? '禁':'启'}}</a-button>
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
    onBeforeMount,
    reactive,
    ref,
    toRaw
} from "vue";
import EditManager from "@/components/cigo-admin-core/pages/auth/edit/EditManager.vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import dayjs from "dayjs";
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";
import {
    AuthGroup,
    User
} from "../../utils/types";
import cigoLayer from "@/components/cigo-layer";
export default defineComponent({
    name: "CigoManager",
    components: {
        CigoIconFont
    },
    setup(props) {
        let groupTreeListRef: any = ref([]);
        let groupIdMapRef = ref(new Map());
        let page = 1;
        let managerListRef: any = ref([]);

        onBeforeMount(() => {
            requestList();
        });

        const requestList = () => {
            // 获取角色分组数据
            requestGroupList();

            //获取管理员数据
            let params = {
                page: page,
                pageSize: 15
            };
            apiRequest.v1
                .post("/managerList", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    //属性角色列表
                    managerListRef.value = [...response.data.data];
                })
                .catch(apiErrorCatch.v1);
        };

        const requestGroupList = () => {
            let params = {
                status: "1"
            };
            apiRequest.v1
                .post("/groupList", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    //更新本地角色分组数据
                    groupTreeListRef.value = [...response.data.data];

                    // 转换无层级角色数据
                    groupIdMapRef.value.clear();
                    convertGroupNoTree(groupTreeListRef.value, 0);
                })
                .catch(apiErrorCatch.v1);
        };
        const convertGroupNoTree = (treeList: AuthGroup[], level: number) => {
            treeList.every((item: AuthGroup, index: number) => {
                item.level = level;
                let tmpGroup: any = {};
                Object.assign(tmpGroup, item);
                delete tmpGroup.subList;
                groupIdMapRef.value.set("id_" + tmpGroup.id, tmpGroup);
                if (item.subList && item.subList.length) {
                    convertGroupNoTree(item.subList, level + 1);
                }

                return true;
            });
        };

        const columns = [{
                title: "编号",
                dataIndex: "id",
                width: "80px"
            },
            {
                title: "头像",
                dataIndex: "img",
                width: "80px",
                slots: {
                    customRender: "img"
                }
            },
            {
                title: "用户名",
                dataIndex: "username",
                width: "100px"
            },
            {
                title: "类型",
                dataIndex: "role_flag",
                width: "120px",
                slots: {
                    customRender: "roleFlag"
                }
            },
            {
                title: "是否在线",
                dataIndex: "is_online",
                width: "100px",
                slots: {
                    customRender: "isOnline"
                }
            },
            {
                title: "最后登录时间",
                dataIndex: "last_log_time",
                width: "180px",
                slots: {
                    customRender: "lastLogTime"
                }
            },
            {
                title: "手机号",
                dataIndex: "phone",
                width: "150px"
            },
            {
                title: "Email",
                dataIndex: "email",
                width: "180px"
            },
            {
                title: "昵称",
                dataIndex: "nickname",
                width: "100px"
            },
            {
                title: "姓名",
                dataIndex: "realname",
                width: "100px"
            },
            {
                title: "性别",
                dataIndex: "sex",
                width: "100px",
                slots: {
                    customRender: "sex"
                }
            },
            {
                title: "角色",
                dataIndex: "auth_group",
                slots: {
                    customRender: "authGroup"
                }
            },
            {
                title: "操作",
                key: "operation",
                fixed: "right",
                width: 145,
                slots: {
                    customRender: "operation"
                }
            }
        ];

        const showSex = (manager: User) => {
            let sex = "";
            switch (manager.sex) {
                case 1:
                    sex = "男";
                    break;
                case 2:
                    sex = "女";
                    break;
                case 0:
                default:
                    sex = "保密";
                    break;
            }
            return sex;
        };

        const showAuthGroup = (manager: User) => {
            if (!manager.auth_group || manager.auth_group.length == 0) {
                return "";
            }
            let authGroup: string[] = [];
            manager.auth_group.every((item: number, index: number) => {
                if (groupIdMapRef.value.has("id_" + item)) {
                    authGroup.push(groupIdMapRef.value.get("id_" + item).title);
                }
                return true;
            });
            return authGroup.join(",");
        };

        const ctrlStatus = (manager: User, status: number) => {
            let params = {
                id: manager.id,
                status: status
            };
            apiRequest.v1
                .post("/statusManager", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    // 提示
                    cigoLayer.msg(response.data.msg);
                    // 处理数据
                    if (status != -1) {
                        manager.status = status;
                    } else {
                        let tmpSubList = [...managerListRef.value];
                        tmpSubList.splice(tmpSubList.indexOf(manager), 1);
                        managerListRef.value = [...tmpSubList];
                    }
                })
                .catch(apiErrorCatch.v1);
        };

        const ctrlView = (manager: User) => {
            cigoLayer.window({
                component: EditManager,
                width: "800px",
                height: "600px",
                maskClose: true,
                layerData: {
                    title: "查看管理员",
                    managerCurr: manager,
                    viewFlag: true,
                    groupList: [...toRaw(groupTreeListRef.value)]
                }
            });
        };

        const notify = (flag: string, data ? : any) => {
            switch (flag) {
                case "refresh":
                    managerListRef.value = [...data];
                    break;
            }
        };

        const ctrlNew = () => {
            cigoLayer.window({
                component: EditManager,
                width: "800px",
                height: "650px",
                maskClose: false,
                layerData: {
                    title: "添加管理员",
                    managerListRef: managerListRef,
                    groupList: [...toRaw(groupTreeListRef.value)]
                },
                notify: notify
            });
        };

        const ctrlEdit = (manager: User) => {
            cigoLayer.window({
                component: EditManager,
                width: "800px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "修改管理员",
                    managerCurr: manager,
                    managerListRef: managerListRef,
                    groupList: [...toRaw(groupTreeListRef.value)]
                },
                notify: notify
            });
        };

        return {
            requestList,
            managerListRef,
            columns,
            dayjs,
            showSex,
            showAuthGroup,
            ctrlNew,
            ctrlStatus,
            ctrlView,
            ctrlEdit
        };
    }
});
</script>

<style lang="scss">
.cigo-manager {
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

    .manager-list {
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

.cigo-manager::-webkit-scrollbar {
    width: 0;
}
</style>
