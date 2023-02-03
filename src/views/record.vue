<template>
  <div class="container">
    <div class="plugins-tips">
<!--      <a href="https://www.wangeditor.com/doc/" target="_blank">wangEditor</a>-->
      <p v-for="(record,index) in recordType.type" :key="index">《{{record.recordName}}》{{record.recordDesc}}</p>
    </div>
请选择日志类型：
    <el-select v-model="recordType.selectType" placeholder="日志类型" class="handle-select mr10">
      <el-option key="1" :label="record.recordName" :value="record.recordName" v-for="(record,index) in recordType.type" :key="index">{{record.recordName}}</el-option>
    </el-select>

    <div class="mgb20" ref="editor"></div>
    <el-button type="primary" @click="syncHTML">提交</el-button>
  </div>
</template>

<script setup lang="ts" name="editor">
import WangEditor from 'wangeditor';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import {getRecordType} from "../api";

const editor = ref(null);
const content = reactive({
  html: '',
  text: ''
});
interface recordType{
  type:Array<any>;
  selectType:String;
}
const recordType = reactive<recordType>({
  type:[],
  selectType:""
})

let instance: any;
onMounted(() => {
  instance = new WangEditor(editor.value);
  instance.config.zIndex = 1;
  instance.create();
  getRecordType().then(response=>{
    recordType.type = response.data.data
    console.log(recordType.type)
  })
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});
const syncHTML = () => {
  content.html = instance.txt.html();
  console.log(content.html);
};
</script>

<style>
.handle-select {
  width: 200px;
  margin-bottom: 20px;
}
</style>
