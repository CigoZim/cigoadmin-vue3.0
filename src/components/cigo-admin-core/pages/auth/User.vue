<template>
<list-manager class="cigo-user" :add-label="'新建用户'" :dataUrl="'/userList'" :statusUrl="'/status/User'" :columns="columns" :columnsSlots="columnsSlots" :editComponent="EditUser" :editWinW="'700px'" :editWinH="'650px'">
    <template v-slot:imgTpl="{ record }">
        <div class="avatar-layer" v-if="record.img && record.img_info && record.img_info.signed_url" @click.stop="showAvatar(record.img_info.signed_url)">
            <img class="avatar" :src="record.img_info.signed_url" />
        </div>
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
    <template v-slot:createTime="{record}">
        <span>{{record.create_time? dayjs.unix(record.create_time).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
    </template>
</list-manager>
</template>

<script lang="ts">
import {
    defineComponent,
} from "vue";
import dayjs from "dayjs";
import ListManager from "@/components/cigo-admin-core/pages/template/ListManager.vue";
import EditUser from "@/components/cigo-admin-core/pages/auth/edit/EditUser.vue";
import {
    User
} from "@/components/cigo-admin-core/utils/types";
import {
    showAvatar,
    showSex
} from "@/components/cigo-admin-core/utils/edit";
export default defineComponent({
    name: "CigoUser",
    components: {
        ListManager
    },
    setup(props) {
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
                title: "注册时间",
                dataIndex: "create_time",
                width: "180px",
                slots: {
                    customRender: "createTime"
                }
            },
        ];
        let columnsSlots = [{
                slot: "img"
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
                slot: "createTime"
            }
        ];

        return {
            dayjs,
            columns,
            columnsSlots,
            EditUser,
            showSex,
            showAvatar
        };
    }
});
</script>

<style lang="scss">
.cigo-user {
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
