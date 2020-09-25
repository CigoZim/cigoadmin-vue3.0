<template>
<div class="cigo-user">
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
                </template>新建用户
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

    <a-table class="user-list" :rowKey="'id'" :locale="{emptyText:'暂无用户数据'}" :pagination="false" :columns="columns" :data-source="userListRef" :scroll="{ x: 1300 , y: 'max-content'}">
        <template v-slot:img="{ record }">
            <div class="avatar-layer" v-if="record.img && record.img_info && record.img_info.signed_url" @click.stop="showAvatar(record.img_info.signed_url)">
                <img class="avatar" :src="record.img_info.signed_url" />
            </div>
        </template>
        <template v-slot:sex="{ record }">
            <span>{{showSex(record)}}</span>
        </template>
        <template v-slot:isOnline="{ record }">
            <span>{{record.is_online ? '在线' : '离线'}}</span>
        </template>
        <template v-slot:lastLogTime="{ record }">
            <span>{{record.last_log_time ? dayjs.unix(record.last_log_time).format('YYYY-MM-DD HH:mm:ss') : '未登录'}}</span>
        </template>

        <template v-slot:operation="{ record }">
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
    ref
} from "vue";
import EditUser from "@/components/cigo-admin-core/pages/auth/edit/EditUser.vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import dayjs from "dayjs";
import {
    apiErrorCatch,
    apiRequest,
    apiSign,
    bucket
} from "@/common/http";
import cigoLayer from "@/components/cigo-layer";
import CigoPreviewImg from "@/components/cigo-ui/unit/form/uploader/cigo-preview-img.vue";
import {
    User
} from "../../utils/types";
export default defineComponent({
    name: "CigoUser",
    components: {
        CigoIconFont
    },
    setup(props) {
        let page = 1;
        let userListRef: any = ref([]);

        onBeforeMount(() => {
            requestList();
        });

        const requestList = () => {
            let params = {
                page: page,
                pageSize: 15
            };
            apiRequest.v1
                .post("/userList", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    userListRef.value = [...response.data.data];
                })
                .catch(apiErrorCatch.v1);
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
                title: "操作",
                key: "operation",
                fixed: "right",
                width: 145,
                slots: {
                    customRender: "operation"
                }
            }
        ];

        const showAvatar = (url: string) => {
            cigoLayer.window({
                component: CigoPreviewImg,
                backgroundColor: "#00000000",
                maskClose: true,
                windowSize: "max",
                showCtrlBar: false,
                canDragFlag: false,
                layerData: {
                    imgList: url ? [url] : []
                }
            });
        };

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

        const ctrlStatus = (user: User, status: number) => {
            let params = {
                id: user.id,
                status: status
            };

            apiRequest.v1
                .post("/status/User", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    // 提示
                    cigoLayer.msg(response.data.msg);
                    // 处理数据
                    if (status != -1) {
                        user.status = status;
                    } else {
                        let tmpSubList = [...userListRef.value];
                        tmpSubList.splice(tmpSubList.indexOf(user), 1);
                        userListRef.value = [...tmpSubList];
                    }
                })
                .catch(apiErrorCatch.v1);
        };

        const ctrlView = (user: User) => {
            cigoLayer.window({
                component: EditUser,
                width: "600px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "查看用户",
                    userCurr: user,
                    viewFlag: true
                }
            });
        };

        const notify = (flag: string, data ? : any) => {
            switch (flag) {
                case "refresh":
                    userListRef.value = [...data];
                    break;
            }
        };

        const ctrlNew = () => {
            cigoLayer.window({
                component: EditUser,
                width: "600px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "添加用户",
                    userListRef: userListRef
                },
                notify: notify
            });
        };

        const ctrlEdit = (user: User) => {
            cigoLayer.window({
                component: EditUser,
                width: "600px",
                height: "600px",
                maskClose: false,
                layerData: {
                    title: "修改用户",
                    userCurr: user,
                    userListRef: userListRef
                },
                notify: notify
            });
        };

        return {
            requestList,
            userListRef,
            columns,
            dayjs,
            showAvatar,
            showSex,
            ctrlNew,
            ctrlStatus,
            ctrlView,
            ctrlEdit
        };
    }
});
</script>

<style lang="scss">
.cigo-user {
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

    .user-list {
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

.cigo-user::-webkit-scrollbar {
    width: 0;
}
</style>
