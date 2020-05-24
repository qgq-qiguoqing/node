<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>图片上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- <div class="container">
            <div class="content-title">支持拖拽</div>
            <div class="plugins-tips">
                Element UI自带上传组件。 访问地址：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank"
                    >Element UI Upload</a
                >
            </div> -->

        <div>公告注释：<el-input placeholder="请输入内容" v-model="content" clearable style="height:100px"> </el-input></div>
        <el-upload
            class="avatar-uploader"
            :action="'http://www.qinqin.life:3000/upload/api/notice?token=' + token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            name="img"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="width:200px ;height:100px;text-align: center;margin:20px">
            <el-button type="primary" icon="el-icon-search" @click="add">提交</el-button>
        </div>

        <!-- <div class="content-title">支持裁剪</div>
            <div class="plugins-tips">
                vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
            </div>
            <div class="crop-demo">
                <img :src="cropImg" class="pre-img">
                <div class="crop-demo-btn">选择图片
                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                </div>
            </div>
        
            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog> -->
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
export default {
    name: 'upload',
    data: function() {
        return {
            defaultSrc: require('../../assets/img/img.jpg'),
            fileList: [],
            imageUrl: '',
            cropImg: '',
            url: '',
            token: '',
            content: '',
            dialogVisible: false
        };
    },
    components: {
        VueCropper
    },
    methods: {
        // getData() {
        //     this.axios
        //         .get(this.api.notice, {
        //             page: 1
        //         })
        //         .then(res => {
        //             this.tableData = res.data;
        //         });
        // },
        add() {
            if (this.content == '' && this.imageUrl == '') {
                this.$message.warning('请填写完整');
                return false;
            }
            this.axios
                .post(this.api.add, {
                    token: localStorage.getItem('token'),
                    content: this.content,
                    img: this.imageUrl
                })
                .then(res => {
                    console.log(res);
                    if (res.data.affectedRows == 1) {
                        this.$message.success('上传成功');
                        location.reload();
                    }
                });
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.data;
            // console.log(res);
        }
    },
    created() {
        this.token = localStorage.getItem('token');
    }
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
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
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
