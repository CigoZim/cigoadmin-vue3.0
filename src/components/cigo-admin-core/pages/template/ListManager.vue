<template>
<div class="cigo-list-manager">
    <div class="top-bar">
        <a-button-group class="left">
            <a-button type="primary" @click.stop="requestList">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-shuaxin1'"></cigo-icon-font>
                </template>
                {{refreshLabel}}
            </a-button>
            <a-button type="primary" @click.stop="ctrlNew">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-add'"></cigo-icon-font>
                </template>
                {{addLabel}}
            </a-button>
        </a-button-group>
        <a-button-group class="right">
            <a-button type="primary">
                <template v-slot:icon>
                    <cigo-icon-font class="btn-icon" :name="'cigoadmin-icon-daochu'"></cigo-icon-font>
                </template>
                {{exportLabel}}
            </a-button>
        </a-button-group>
    </div>

    <a-table class="cigo-data-list" :rowKey="rowKey" :locale="{emptyText:emptyText}" :columns="columnsRef" :data-source="dataListRef" :pagination="showPage" :children-column-name="'subList'" :scroll="tableScroll">
        <template v-for="(item,index) in columnsSlots" :key="index" v-slot:[item.slot]="{record}">
            <!-- //Tips_Flag 具名插槽嵌套 -->
            <slot :name="item.slot+'Tpl'" :record="record"></slot>
        </template>

        <template v-if="useDefaultOperation" v-slot:operation="{ record }">
            <a-button class="opt-btn" @click.stop="ctrlStatus(record, record.status == 0 ? 1 : 0)" type="default" shape="circle" size="small">{{record.status ? '禁':'启'}}</a-button>
            <a-button v-if="treeFlag" class="opt-btn" @click.stop="ctrlAddSub(record)" type="default" shape="circle" size="small" title="添加子项">
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
    computed,
    defineComponent,
    onBeforeMount,
    reactive,
    ref
} from "vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import dayjs from "dayjs";
import {
    apiErrorCatch,
    apiRequest,
    apiSign,
    bucket
} from "@/common/http";
import cigoLayer from "@/components/cigo-layer";
export default defineComponent({
    name: "CigoListManager",
    components: {
        CigoIconFont
    },
    props: {
        refreshLabel: {
            type: String,
            default: '刷新'
        },
        addLabel: {
            type: String,
            default: '新建'
        },
        exportLabel: {
            type: String,
            default: '导出数据'
        },
        rowKey: {
            type: String,
            default: 'id'
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        //Tips_Flag 如果出现某个字段不显示考虑这里宽度是否设置小了
        tableScroll: {
            type: Object,
            default: {
                x: 1300,
                y: 'max-content'
            },
        },
        dataUrl: {
            type: String,
            default: '',
        },
        statusUrl: {
            type: String,
            default: '',
        },
        viewWinTitle: {
            title: String,
            default: '查看'
        },
        addWinTitle: {
            title: String,
            default: '新增'
        },
        editWinTitle: {
            title: String,
            default: '修改'
        },
        editWinW: {
            type: String,
            default: '600px'
        },
        editWinH: {
            type: String,
            default: '600px'
        },
        columns: {
            type: Array,
            default: [{
                title: '编号',
                dataIndex: 'id',
                width: 80,
            }]
        },
        useDefaultOperation: {
            type: Boolean,
            default: true,
        },
        columnsSlots: {
            type: Array,
            default: []
        },
        editComponent: {
            type: Object,
            default: {}
        },
        treeFlag: {
            type: Boolean,
            default: false
        },
        showPage: {
            type: Boolean,
            default: false
        },
        attachDataForEdit: {
            type: Object,
            default: {}
        },
    },
    setup(props) {
        let defaultOperationOption = {
            title: "操作",
            key: "operation",
            fixed: "right",
            width: 180,
            slots: {
                customRender: "operation"
            }
        };
        let columnsRef = computed(() => {
            return props.useDefaultOperation ? [...props.columns, defaultOperationOption] : [...props.columns];
        });

        let page = 1;
        let dataListRef: any = ref([]);

        onBeforeMount(() => {
            requestList();
        });

        const requestList = () => {
            let params = {};
            if (props.showPage) {
                let pageInfo = {
                    page: page,
                    pageSize: 15
                }
                Object.assign(params, pageInfo);
            }
            apiRequest.v1
                .post(props.dataUrl, params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    dataListRef.value = [...response.data.data];
                })
                .catch(apiErrorCatch.v1);
        };

        const ctrlStatus = (record: any, status: number) => {
            let params = {
                id: record.id,
                status: status
            };

            apiRequest.v1
                .post(props.statusUrl, params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    // 提示
                    cigoLayer.msg(response.data.msg);
                    // 处理数据
                    if (status != -1) {
                        record.status = status;
                    } else if (props.treeFlag) {
                        let tmpItem: any = reactive({
                            id: 0,
                            subList: dataListRef.value
                        });
                        deleteLocal(tmpItem, record, 0);
                        if (tmpItem.subList && tmpItem.subList.length) {
                            dataListRef.value = [...tmpItem.subList];
                        } else {
                            dataListRef.value = [];
                        }
                    } else {
                        let tmpList = [...dataListRef.value];
                        tmpList.splice(tmpList.indexOf(record), 1);
                        dataListRef.value = [...tmpList];
                    }
                })
                .catch(apiErrorCatch.v1);
        };

        const deleteLocal = (item: any, record: any, level: number): boolean => {
            if (!item.subList || !item.subList.length) {
                delete item.subList;
                return false;
            }
            let hasFlag = false;
            let hasIndex = -1;
            item.subList.every((item: any, index: number) => {
                // 判断当前项
                if (item.id == record.id) {
                    hasFlag = true;
                    hasIndex = index;
                    return false;
                }
                // 判断子级
                if (deleteLocal(item, record, level + 1)) {
                    hasFlag = true;
                    return false;
                }
                // 都不存在，继续
                return true;
            });
            if (hasFlag && hasIndex > -1) {
                let tmpSubList = [...item.subList];
                tmpSubList.splice(hasIndex, 1);
                tmpSubList.length ?
                    item.subList = [...tmpSubList] :
                    delete item.subList;
            }
            return hasFlag;
        };

        const ctrlView = (record: any) => {
            cigoLayer.component({
                component: props.editComponent,
                width: props.editWinW,
                height: props.editWinH,
                maskClose: true,
                layerData: {
                    title: props.viewWinTitle,
                    recordCurr: record,
                    viewFlag: true,
                    dataListRef: dataListRef,
                    ...props.attachDataForEdit,
                }
            });
        };

        const notify = (flag: string, dataList ? : any) => {
            switch (flag) {
                case "refresh":
                    dataListRef.value = [...dataList];
                    break;
            }
        };

        const ctrlNew = () => {
            cigoLayer.component({
                component: props.editComponent,
                width: props.editWinW,
                height: props.editWinH,
                maskClose: false,
                layerData: {
                    title: props.addWinTitle,
                    dataListRef: dataListRef,
                    ...props.attachDataForEdit,
                },
                notify: notify
            });
        };
        const ctrlAddSub = (record: any) => {
            cigoLayer.component({
                component: props.editComponent,
                width: props.editWinW,
                height: props.editWinH,
                maskClose: false,
                layerData: {
                    title: props.addWinTitle,
                    recordParent: record,
                    dataListRef: dataListRef,
                    ...props.attachDataForEdit,
                },
                notify: notify
            });
        };

        const ctrlEdit = (record: any) => {
            cigoLayer.component({
                component: props.editComponent,
                width: props.editWinW,
                height: props.editWinH,
                maskClose: false,
                layerData: {
                    title: props.editWinTitle,
                    recordCurr: record,
                    dataListRef: dataListRef,
                    ...props.attachDataForEdit,
                },
                notify: notify
            });
        };

        return {
            columnsRef,
            requestList,
            dataListRef,
            dayjs,
            ctrlNew,
            ctrlAddSub,
            ctrlStatus,
            ctrlView,
            ctrlEdit
        };
    }
});
</script>

<style lang="scss">
.cigo-list-manager {
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

    .cigo-data-list {
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

.cigo-list-manager::-webkit-scrollbar {
    width: 0;
}
</style>
