<template>
<list-manager class="cigo-manager" :add-label="'新建管理员'" :dataUrl="'/managerList'" :statusUrl="'/status/Manager'" :columns="columns" :columnsSlots="columnsSlots" :editComponent="EditManager" :editWinW="'700px'" :editWinH="'650px'" :tableScroll="{x: 2000, y: 'max-content'}" :attachDataForEdit="{groupList: groupTreeListProxy}">
    <template v-slot:imgTpl="{ record }">
        <div class="avatar-layer" v-if="record.img && record.img_info && record.img_info.signed_url" @click.stop="showAvatar(record.img_info.signed_url)">
            <img class="avatar" :src="record.img_info.signed_url" />
        </div>
    </template>
    <template v-slot:roleFlagTpl="{ record }">
        <span>{{record.role_flag == 2 ? '管理员' : '超级管理员'}}</span>
    </template>
    <template v-slot:sexTpl="{ record }">
        <span>{{showSex(record)}}</span>
    </template>
    <template v-slot:isOnlineTpl="{ record }">
        <span>{{record.is_online ? '在线' : '离线'}}</span>
    </template>
    <template v-slot:lastLogTimeTpl="{record}">
        <span>{{record.last_log_time ? dayjs.unix(record.last_log_time).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
    </template>
    <!-- //Tips_Flag Ant在authGroup为数组且有值得情况下，如果不用slot自定义视图，Ant将为authGroup数组子元素绑定v-node节点数据，在authGroup传递子组件时将导致长时间卡顿 -->
    <template v-slot:authGroupTpl="{ record }">
        <span>{{showAuthGroup(record)}}</span>
    </template>
</list-manager>
</template>

<script lang="ts">
import {
    defineComponent,
    onBeforeMount,
    ref
} from "vue";
import dayjs from "dayjs";
import cigoLayer from "@/components/cigo-layer";
import CigoPreviewImg from "@/components/cigo-ui/unit/form/uploader/cigo-preview-img.vue";
import ListManager from "@/components/cigo-admin-core/pages/template/ListManager.vue";
import EditManager from "@/components/cigo-admin-core/pages/auth/edit/EditManager.vue";
import {
    AuthGroup,
    User
} from "@/components/cigo-admin-core/utils/types";
import {
    showAvatar,
    showSex
} from "@/components/cigo-admin-core/utils/edit";
import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";

export default defineComponent({
    name: "CigoManager",
    components: {
        ListManager
    },
    setup(props) {
        let groupTreeListProxy: any = ref([]);
        let groupIdMapRef = ref(new Map());
        onBeforeMount(() => {
            // 获取角色分组数据
            requestGroupList();
        });
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
                    groupTreeListProxy.value = [...response.data.data];

                    // 转换无层级角色数据
                    groupIdMapRef.value.clear();
                    convertGroupNoTree(groupTreeListProxy.value, 0);
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
            }
        ];
        let columnsSlots = [{
                slot: "img"
            },
            {
                slot: "roleFlag"
            },
            {
                slot: "isOnline"
            },
            {
                slot: "lastLogTime"
            },
            {
                slot: "sex"
            },
            {
                slot: "authGroup"
            }
        ];

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

        return {
            dayjs,
            columns,
            columnsSlots,
            showAuthGroup,
            EditManager,
            showSex,
            showAvatar,
            groupTreeListProxy
        };
    }
});
</script>

<style lang="scss">
.cigo-manager {
    .cigo-data-list {
        .avatar-layer {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            padding: 1px;
            border: 1px solid #f0f0f055;
            cursor: pointer;
            box-shadow: 0px 2px 3px #ccc;

            .avatar {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
}
</style>
