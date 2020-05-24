<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 首页公告管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <!-- <el-input v-model="query.address" placeholder="id" class="handle-select mr10">
                    <!-- <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option> -->
                <!-- </el-input> -->

                <el-input v-model="nid" placeholder="id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch1" style="margin-right: 10px;">搜索</el-button>
                <el-input v-model="content" placeholder="内容" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch2">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleBtn" style="margin-left: 10px;">取消</el-button>
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
                <!-- <el-table-column prop="id" label="学号" align="center"></el-table-column> -->
                <el-table-column prop="nid" label="id"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <!-- <el-table-column prop="id" label="广告连接"></el-table-column> -->
                <!-- <el-table-column label="标题">id
                    <template slot-scope="scope">{{ scope.row.money }}</template>
                </el-table-column> -->
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="stutas" label="是否展示"></el-table-column>
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
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            type="text"
                            v-if="scope.row.stutas == 0"
                            icon="el-icon-circle-plus-outline"
                            @click="handleRemove(scope.$index, scope.row)"
                            >首页展示</el-button
                        ><el-button
                            type="text"
                            v-if="scope.row.stutas == 1"
                            icon="el-icon-remove-outline"
                            class="red"
                            @click="handleRemove(scope.$index, scope.row)"
                            >移除展示</el-button
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
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog v-dialogDrag title="详情" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="70px">
                <div style="margin:10px">
                    点击图片可更换图片
                    <!-- <el-input v-model="form.content"></el-input> -->
                </div>
                <el-form-item label="图片:">
                    <div>
                        <template>
                            <el-upload
                                class="avatar-uploader"
                                :action="'http://www.qinqin.life:3000/upload/api/notice?token=' + token"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                name="img"
                            >
                                <img v-if="form.img" :src="form.img" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item label="内容:">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <!-- <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit">确 定</el-button>
                <!-- <el-button type="primary" @click="saveEdit">确 定</el-button> -->
            </span>
        </el-dialog>
        <uplodad></uplodad>
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
import uplodad from '../Upload';
export default {
    name: 'basetable',
    data() {
        return {
            StudentID: '',
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
            id: -1,
            token: '',
            nid: '',
            content: ''
        };
    },
    created() {
        this.getData();
        this.token = localStorage.getItem('token');
    },
    components: {
        uplodad
    },
    methods: {
        handleBtn() {
            this.nid = this.content = '';
            this.query.pageIndex = 1;
            this.getData();
        },
        getData() {
            this.axios
                .get(this.api.notice, {
                    page: this.query.pageIndex
                })
                .then(res => {
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.total;
                });
        },
        handleAvatarSuccess(res, file) {
            this.form.img = res.data;
            // console.log(res);
        },
        // 触发搜索按钮
        handleSearch1() {
            this.content = '';
            this.axios
                .get(this.api.nSearch, {
                    nid: this.nid,
                    page: 1
                })
                .then(res => {
                    this.tableData = res.data;
                });
        },
        handleSearch2() {
            this.nid = '';
            this.axios
                .get(this.api.nSearch, {
                    content: this.content,
                    page: 1
                })
                .then(res => {
                    this.tableData = res.data;
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
                        .post(this.api.nDelete, {
                            nid: row.nid
                        })
                        .then(res => {
                            if (res.data.affectedRows) {
                                this.$message.success('删除成功');
                                this.tableData.splice(index, 1);
                            } else {
                                this.$message.warning('删除失败');
                            }
                        });
                })
                .catch(() => {});
        },

        handleRemove(index, row) {
            console.log(row);
            if (row.stutas == 0) {
                var stutas = 1;
            } else {
                var stutas = 0;
            }
            this.axios
                .post(this.api.nChange, {
                    nid: row.nid,
                    status: stutas
                })
                .then(res => {
                    if (res.data.affectedRows) {
                        this.$message.success('设置成功');
                        this.tableData[index].stutas = stutas;
                    } else {
                        this.$message.warning('设置失败');
                    }
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
                            if (this.tableData[j].nid != this.multipleSelection[i].nid) {
                                arr.push(this.tableData[j]);
                            }
                        }
                    }
                    let m = 0;
                    for (let i = 0; i < length; i++) {
                        this.axios
                            .post(this.api.nDelete, {
                                nid: this.multipleSelection[i].nid
                            })
                            .then(res => {
                                if (res.code == 1) {
                                    if (res.data.affectedRows) {
                                        m++;
                                        this.$message.success(`${this.multipleSelection[i].nid} 删除成功`);
                                    } else {
                                        this.$message.warning(`${this.multipleSelection[i].nid}删除失败`);
                                    }
                                } else {
                                    this.$message.warningw(`${this.multipleSelection[i].nid}删除失败`);
                                }
                            });
                    }
                    if ((length = m)) {
                        this.tableData = arr;
                    }
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        //保存编辑
        saveEdit() {
            this.axios
                .post(this.api.nUpdate, {
                    img: this.form.img,
                    nid: this.form.nid,
                    content: this.form.content
                })
                .then(res => {
                    if (res.data.affectedRows) {
                        this.$message.success('更新成功');
                        this.editVisible = false;
                    } else {
                        this.$message.warning('更新失败');
                    }
                });
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            if (this.nid != '') {
                this.axios
                    .get(this.api.nSearch, {
                        nid: this.nid,
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data;
                    });
            } else if (this.content != '') {
                this.axios
                    .get(this.api.nSearch, {
                        content: this.content,
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data;
                    });
            } else {
                this.axios
                    .get(this.api.notice, {
                        page: val
                    })
                    .then(res => {
                        this.tableData = res.data.data;
                    });
            }
        }
    }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 100%;
    height: 178px;
    display: block;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
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
