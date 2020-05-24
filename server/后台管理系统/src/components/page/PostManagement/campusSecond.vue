<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 校园二手帖子管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="StudentID" placeholder="学号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch1" style="margin-right: 10px;">搜索</el-button>
                <el-input v-model="pid" placeholder="帖子id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch2" style="margin-right: 10px;">搜索</el-button>
                <el-input v-model="title" placeholder="标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch3">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleBtn" style="margin-top: 10px;">取消</el-button>
            </div>
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <!-- <el-input v-model="query.address" placeholder="id" class="handle-select mr10">
                    <!-- <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option> -->
                <!-- </el-input> -->
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
                <el-table-column prop="author.user_id" label="学号" align="center"></el-table-column>
                <el-table-column prop="author.user_name" label="用户名"></el-table-column>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>

                <el-table-column prop="content" label="内容" width="200"></el-table-column>
                <el-table-column prop="timeago" label="时间"></el-table-column>
                <!-- <el-table-column label="标题">
                    <template slot-scope="scope">{{ scope.row.money }}</template>
                </el-table-column> -->
                <el-table-column label="图片(点击图片查看大图)" align="center" style="display:flex">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            style=" display: inline-block; margin-right: 10px;"
                            v-for="item in scope.row.imgurl"
                            :src="item"
                            :preview-src-list="[item]"
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
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">内容详情</el-button>
 <el-button
                            type="text"
                            v-if="scope.row.status == 0"
                            icon="el-icon-circle-plus-outline"
                            @click="handleRemove(scope.$index, scope.row)"
                            >首页推荐</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
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
        <el-dialog v-dialogDrag title="详情" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="70px">
                <!-- <div>
                    <template>
                        <el-image class="table-td-thumb" :src="form.thumb" :preview-src-list="[form.thumb]"></el-image>
                    </template>
                </div> -->

                <!-- <el-form-item label="用户名:"> -->
                <!-- {{ form.author.user_name }} -->
                <!-- <el-input disabled="" v-model="form.name"></el-input> -->
                <!-- </el-form-item> -->
                <!-- <div>
                    <template>
                        <el-image class="table-td-thumb" :src="form.thumb" :preview-src-list="[form.thumb]"></el-image>
                    </template>
                </div> -->
                <el-form-item label="标题:" style="font-weight: 600;">
                    {{ form.title }}
                    <!-- <el-input disabled="" v-model="form.name"></el-input> -->
                </el-form-item>
                <el-form-item label="内容:">
                    {{ form.content }}
                    <!-- <el-input disabled="" v-model="form.name"></el-input> -->
                </el-form-item>
                <el-form-item label="图片">
                    <el-image
                        class="table-td-thumb"
                        style=" display: inline-block; margin-right: 10px;width:100px;height:100px"
                        v-for="item in form.imgurl"
                        :src="item"
                        :preview-src-list="[item]"
                    ></el-image>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
                <!-- <el-button type="primary" @click="saveEdit">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            StudentID: '',
            title: '',
            pid: '',
            query: {
                // address: '',
                // name: '',
                pageIndex: 1,
                pageSize: 10
            },
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
            this.title = this.StudentID = this.pid = '';
            this.query.pageIndex = 1;
            this.getData();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },

        getData() {
            var that = this;
            this.axios
                .get(this.api.post, {
                    token: localStorage.getItem('token'),
                    page: this.query.pageIndex,
                    gid: 2
                })
                .then(res => {
                    // console.log(res);
                    that.tableData = res.data;
                    that.pageTotal = res.total;
                });
        },
        // 触发搜索按钮
        handleSearch1() {
             this.title = this.pid = '';
            this.axios
                .get(this.api.search, {
                    token: localStorage.getItem('token'),
                    s: 0,
                    d: 0,
                    status: 0,
                    gid: 2,
                    cnt: this.StudentID,
                    page: 1
                })
                .then(res => {
                    this.tableData = res.data;
                    this.pageTotal = res.total;
                });
        },
        handleSearch2() {
               this.title = this.StudentID = '';
            this.axios
                .get(this.api.search, {
                    token: localStorage.getItem('token'),
                    s: 0,
                    d: 1,
                    gid: 2,
                    status: 0,
                    cnt: this.pid,
                    page: 1
                })
                .then(res => {
                    this.tableData = res.data;
                    this.pageTotal = res.total;
                });
        },
        handleSearch3() {
               this.pid = this.StudentID = '';
            this.axios
                .get(this.api.search, {
                    token: localStorage.getItem('token'),
                    s: 0,
                    d: 2,
                    gid: 2,
                    status: 0,
                    cnt: this.title,
                    page: 1
                })
                .then(res => {
                    this.tableData = res.data;
                    this.pageTotal = res.total;
                });
        },
        handleRemove(index, row) {
            this.axios
                .post(this.api.addIndex, {
                    id: row.id
                })
                .then(res => {
                    if (res.data.affectedRows) {
                        this.$message.success('操作成功');
                        this.tableData[index].status = 1;
                    }
                });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.axios
                        .post(this.api.remove, {
                            token: localStorage.getItem('token'),
                            id: row.id,

                            d: 0
                        })
                        .then(res => {
                            if (res.code == 1) {
                                if (res.data.affectedRows) {
                                    this.$message.success('删除成功');
                                    this.tableData.splice(index, 1);
                                } else {
                                    this.$message.success('删除失败');
                                }
                            } else {
                                this.$message.success('删除失败');
                            }
                        });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
        },
        delAllSelection() {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    const length = this.multipleSelection.length;
                    let arr = [];
                    this.delList = this.delList.concat(this.multipleSelection);
                    console.log(this.delList);
                    for (let j = 0; j < this.tableData.length; j++) {
                        for (let i = 0; i < length; i++) {
                            if (this.tableData[j].id != this.multipleSelection[i].id) {
                                arr.push(this.tableData[j]);
                            }
                        }
                    }
                    for (let i = 0; i < length; i++) {
                        this.axios
                            .post(this.api.remove, {
                                token: localStorage.getItem('token'),
                                id: this.multipleSelection[i].id,
                                d: 0
                            })
                            .then(res => {
                                if (res.code == 1) {
                                    if (res.data.affectedRows) {
                                        this.$message.success(`${this.multipleSelection[i].title} 删除成功`);
                                    } else {
                                        this.$message.success(`${this.multipleSelection[i].title}删除失败`);
                                    }
                                } else {
                                    this.$message.success(`${this.multipleSelection[i].title}删除失败`);
                                }
                            });
                    }
                    this.tableData = arr;
                })
                .catch(() => {});
        },

        // 分页导航
        handlePageChange(val) {
            var that = this;
            this.query.pageIndex = val;
            if (this.title) {
                this.axios
                    .get(this.api.search, {
                        token: localStorage.getItem('token'),
                        s: 0,
                        d: 2,
                        gid: 2,
                        status: 0,
                        cnt: this.title,
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data;
                        this.pageTotal = res.total;
                    });
            } else if (this.StudentID) {
                this.axios
                    .get(this.api.search, {
                        token: localStorage.getItem('token'),
                        s: 0,
                        d: 0,
                        status: 0,
                        gid: 2,
                        cnt: this.StudentID,
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data;
                        this.pageTotal = res.total;
                    });
            } else if (this.pid) {
                this.axios
                    .get(this.api.search, {
                        token: localStorage.getItem('token'),
                        s: 0,
                        d: 1,
                        gid: 2,
                        status: 0,
                        cnt: this.pid,
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data;
                        this.pageTotal = res.total;
                    });
            } else {
                var that = this;
                this.axios
                    .get(this.api.post, {
                        token: localStorage.getItem('token'),
                        page: val,
                        gid: 2
                    })
                    .then(res => {
                        // console.log(res);
                        that.tableData = res.data;
                        that.pageTotal = res.total;
                    });
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
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
