<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">日记系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="userMail">
					<el-input v-model="param.userMail" placeholder="email">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="userPass">
					<el-input
						type="password"
						placeholder="password"
						v-model="param.userPass"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
        <el-form-item prop="code" >
          <el-input v-model="param.code" placeholder="验证码" style="width: 50%">
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
          <img :src=code.checkCode style="width: 40%;height: 30px;margin-left: 10px;" @click="changeCode" alt="点击更换验证码"/>
        </el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<p class="login-tips">Tips : 记得每天记录哦。
          <a href="#/register" target="_blank" class="login-tips"  style="margin-left: 10%;color: #00c888">没有账户？注册一个？</a>
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
import {AxiosResponse} from "axios";
import {sendEmailCode, userLogin} from "../api";


interface LoginInfo {
  userMail: string;
  userPass: string;
  code: string;
}
interface CheckCode {
  checkCode : string;
}
const code = reactive<CheckCode>({
  checkCode: '/api/login/getCheckCode/date='+new Date()
});
const router = useRouter();
const param = reactive<LoginInfo>({
  userMail: '',
  userPass: '',
  code: ''
});

const rules: FormRules = {
  userMail: [
		{
			required: true,
			message: '请输入邮箱地址',
			trigger: 'blur'
		}
	],
  userPass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			ElMessage.success('登录成功');
			localStorage.setItem('ms_username', param.userMail);
			const keys = permiss.defaultList[param.userMail == 'admin' ? 'admin' : 'user'];
			permiss.handleSet(keys);
			localStorage.setItem('ms_keys', JSON.stringify(keys));
       var formData = new FormData();
       formData.append("userMail",param.userMail);
       formData.append("userPass",param.userPass);
       formData.append("code",param.code);
      userLogin(formData).then(response=>{
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
  code.checkCode = '/api/login/getCheckCode/date='+new Date()
}
const registe=()=>{
  router.push('/memorandum');
}
const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg.jpg);
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
