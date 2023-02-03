<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">注册页面</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入用户名">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="param.email" placeholder="请输入邮箱">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="validCode" >
          <el-input v-model="param.validCode" placeholder="验证码" style="width: 50%">
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
<!--          <img :src=code.checkCode style="width: 40%;height: 30px;margin-left: 10px;" @click="changeCode" alt="点击更换验证码"/>-->
          <el-button style="margin-left: 3%;width: 40%" @click="sendcode" :disabled="code.disable">{{code.checkCode}}</el-button>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">注册</el-button>
        </div>
        <p class="login-tips">Tips : 所有信息必须填写。
<!--          <a href="#/memorandum" target="_blank" class="login-tips"  style="margin-left: 10%;color: #00c888">没有账户？注册一个？</a>-->
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import {getWeather, register, sendEmailCode} from '../api/index';
import {AxiosResponse} from "axios";
import encroy from "../utils/AESUtil";


interface LoginInfo {
  username: string;
  password: string;
  validCode: string;

  email:string;
}
interface CheckCode {
  disable:boolean;
  checkCode : string;
  count:number;
}
const code = reactive<CheckCode>({
  disable:false,
  count: 60,
  checkCode: '发送邮箱验证码'
});
const router = useRouter();
const param = reactive<LoginInfo>({
  username: '',
  password: '',
  validCode: '',
  email:'',
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      // ElMessage.success('登录成功');
      localStorage.setItem('ms_username', param.username);
      const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
      permiss.handleSet(keys);
      localStorage.setItem('ms_keys', JSON.stringify(keys));
      var formData = new FormData();
      var encryptKey = "ABCDEFGHIJKHOQUV";
      var userPass = encroy.encrypt({word: param.password, keyStr: encryptKey});
      formData.append("userMail",param.email);
      formData.append("userPass",userPass);
      formData.append("code",param.validCode);
      formData.append("userName",param.username);
     register({data: formData}).then(response=>{
       ElMessage.success(response.data.data.msg)
       if (response.data.code=="200"){
         router.push("/login")
       }
       console.log(response.data)
     })
      // router.push('/');
    } else {
      ElMessage.error('登录成功');
      return false;
    }
  });
};
const changeCode=()=>{
  code.checkCode = '/api/vaildate/getCode/date='+new Date()
}
const registe=()=>{
  router.push('/memorandum');
}
const sendcode=()=>{

  //调用后端接口发送邮箱注册码
  if (param.email!= "") {
    code.disable = true
    sendEmailCode({data: param.email}).then(response => {
      ElMessage.success(response.data.data.msg)
      console.log(response.data)
    })
    //定时
    var timer = setInterval(() => {
      if (code.count > 0) {
        code.count--
        code.checkCode = '重新获取' + code.count
      } else {
        code.count = 60
        code.disable = false
        code.checkCode = '发送邮箱验证码'
        clearInterval(timer)
      }
    }, 1000);
  }else {
    ElMessage.error("邮箱地址不存在")
  }
}
const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/catdog.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
