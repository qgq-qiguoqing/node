<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 用户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="handle-box">
             

                <el-input v-model="StudentID1" placeholder="学号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch1">精确搜索</el-button>
            </div> -->
            <div class="handle-box">
                <!-- <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button> -->
                <!-- <el-input v-model="query.address" placeholder="id" class="handle-select mr10">
                    <!-- <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option> -->
                <!-- </el-input> -->

                <el-input v-model="StudentID2" placeholder="学号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch2">搜索</el-button>
            </div>
            <div class="handle-box">
                <!-- <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button> -->
                <!-- <el-input v-model="query.address" placeholder="id" class="handle-select mr10">
                    <!-- <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option> -->
                <!-- </el-input> -->

                <el-button type="primary" icon="el-icon-search" @click="handleBtn">取消</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="user_id" label="学号" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户名"></el-table-column>
                <el-table-column prop="signature" label="签名"></el-table-column>
                <el-table-column prop="followed_num" label="粉丝"></el-table-column>

                <!-- <el-table-column label="标题">
                    <template slot-scope="scope">{{ scope.row.money }}</template>
                </el-table-column> -->
                <el-table-column label="头像(点击图片查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.user_header"
                            :preview-src-list="[scope.row.user_header]"
                        ></el-image>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
                <!-- <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''">{{
                            scope.row.state
                        }}</el-tag>
                    </template>
                </el-table-column> -->

                <!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-if="scope.$index == 0"
                            style="display: block"
                            v-model="value0"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 1"
                            style="display: block"
                            v-model="value1"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 2"
                            style="display: block"
                            v-model="value2"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 3"
                            style="display: block"
                            v-model="value3"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 4"
                            style="display: block"
                            v-model="value4"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 5"
                            style="display: block"
                            v-model="value5"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 6"
                            style="display: block"
                            v-model="value6"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 7"
                            style="display: block"
                            v-model="value7"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 8"
                            style="display: block"
                            v-model="value8"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                        <el-switch
                            v-if="scope.$index == 9"
                            style="display: block"
                            v-model="value9"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="违规"
                            inactive-text="正常"
                            @change="change(scope.row.user_id, scope.$index)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="10"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            StudentID1: '',
            StudentID2: '',
            query: {
                // address: '',
                // name: '',
                pageIndex: 1,
                pageSize: 10
            },
            value: [],
            value0: false,
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            value5: false,
            value6: false,
            value7: false,
            value8: false,
            value9: false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handleBtn() {
            this.StudentID1 = this.StudentID2 = '';
            this.getData();
        },
        stu(data) {
            console.log(data);
            this.value0 = this.value1 = this.value2 = this.value3 = this.value4 = this.value5 = this.value6 = this.value7 = this.value8 = this.value9 = false;
            for (let i in data) {
                let key = 'value' + i;
                // that.arr[i] = key;
                // that.value[i] = {};

                if (data[i].status == 'true') {
                    if (key == 'value0') {
                        this.value0 = true;
                    }
                    if (key == 'value1') {
                        this.value1 = true;
                    }
                    if (key == 'value2') {
                        this.value2 = true;
                    }
                    if (key == 'value3') {
                        this.value3 = true;
                    }
                    if (key == 'value4') {
                        this.value4 = true;
                    }
                    if (key == 'value5') {
                        this.value5 = true;
                    }
                    if (key == 'value6') {
                        this.value6 = true;
                    }
                    if (key == 'value7') {
                        this.value7 = true;
                    }
                    if (key == 'value8') {
                        this.value8 = true;
                    }
                    if (key == 'value9') {
                        this.value9 = true;
                    }
                }

                // that.value[i]= res.data[i].status;
            }
        },
        getData() {
            var that = this;
            this.axios
                .get(this.api.getUser, {
                    token: localStorage.getItem('token'),
                    page: 1
                })
                .then(res => {
                    that.stu(res.data);
                    that.tableData = res.data;
                    that.pageTotal = res.total;
                    console.log(that.tableData);

                    console.log(that.value0);
                });
        },
        change(id, index) {
            console.log(id, index);
            if (this.tableData[index].status == 'true') {
                var status = 0;
                this.tableData[index].status = 'false';
            } else {
                this.tableData[index].status = 'true';
                var status = 1;
            }
            var that = this;
            this.axios
                .post(this.api.change, {
                    id: id,
                    status: status,
                    token: localStorage.getItem('token')
                })
                .then(res => {
                    this.stu(that.tableData);
                    console.log(res.data);
                });
        },
        // 触发搜索按钮
        handleSearch1() {
            var that = this;
            this.axios
                .get(this.api.search, {
                    cnt: this.StudentID1,
                    s: 1,
                    d: 1,
                    token: localStorage.getItem('token')
                })
                .then(res => {
                    that.stu(res.data);
                    that.tableData = res.data;
                    // that.tableData[0].user_id=
                    that.pageTotal = 1;
                });
            // this.$set(this.query, 'pageIndex', 1);
            // this.getData();
        },
        handleSearch2() {
            var that = this;
            this.axios
                .get(this.api.search, {
                    cnt: this.StudentID2,
                    s: 1,

                    token: localStorage.getItem('token'),
                    page: this.query.pageIndex
                })
                .then(res => {
                    that.stu(res.data);
                    that.tableData = res.data;
                    // that.tableData[0].user_id=
                    that.pageTotal = res.total;
                });
            // this.$set(this.query, 'pageIndex', 1);
            // this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            console.log(index);
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            console.log(this.delList);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].id + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        // saveEdit() {
        //     this.editVisible = false;
        //     this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        //     this.$set(this.tableData, this.idx, this.form);
        // },
        // 分页导航
        handlePageChange(val) {
            var that = this;
            if (this.StudentID2) {
                this.query.pageIndex = val;
                this.handleSearch2();
            } else {
                this.axios
                    .get(this.api.getUser, {
                        token: localStorage.getItem('token'),
                        page: val
                    })
                    .then(res => {
                        that.stu(res.data);
                        that.tableData = res.data;
                        // that.pageTotal = res.total;
                        // console.log(that.tableData);

                        // console.log(that.value0);
                    });
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    display: inline-block;
    margin-bottom: 20px;
    margin-right: 30px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
