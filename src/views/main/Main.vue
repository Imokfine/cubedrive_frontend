<!--
 * 首页
 * @author: Xueni Fu
 * @since: 2023-10-18
 * Main.vue
-->
<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="btn">
          <el-upload
            :show-file-list="false"
            :multiple="true"
            action="http://localhost:8080/file/upload"
          >
            <el-button type="primary">
              <span class="iconfont icon-upload"></span>
              上传
            </el-button>
          </el-upload>
        </div>
        <el-button type="success">
          <span class="iconfont icon-folder-add"></span>
          新建文件夹
        </el-button>
        <el-button type="info">
          <span class="iconfont icon-download"></span>
          批量下载
        </el-button>
        <el-button type="danger">
          <span class="iconfont icon-del"></span>
          批量删除
        </el-button>
        <el-button type="warning">
          <span class="iconfont icon-move"></span>
          批量移动
        </el-button>
        <div class="search-panel">
          <!-- input输入 -->
          <el-input
            v-model="fileNameFuzzy"
            placeholder="输入文件名搜索"
            @keyup.native.enter="loadFileList"
          >
            <template #suffix>
              <i class="iconfont icon-search"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh"></div>
      </div>
      <!-- TODO: 实现Navigation -->
      <Navigation></Navigation>
    </div>
    <!-- file list -->
    <div class="file-list">
      <Table :dataSource="tableData">
        <slot>nihao</slot>
      </Table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, sizes, pager, next, jumper"
        :pager-count="5"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 15, 20, 25]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/utils/api"

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const curRoute = router.currentRoute;
let category = router.currentRoute.value.params;

// 方法
const tableData = ref([]);

const fileNameFuzzy = ref("");
let pageNum = 1;
let pageSize = 10;
let total = 0;
let fileCategory = "";


// 分页查询
const loadFileList = () => {
  if(category === 'all') {
    fileCategory = "";
  } else if(category === 'video') {
    fileCategory = "1";
  } else if(category === 'music') {
    fileCategory = "2";
  } else if(category === 'image') {
    fileCategory = "3";
  } else if(category === 'doc') {
    fileCategory = "4";
  } else if(category === 'others') {
    fileCategory = "5";
  } else {
    fileCategory = "";
  }
  proxy.$request.get(api.loadFileList, {
    params: {
      fileName: fileNameFuzzy.value,
      pageNum: pageNum,
      pageSize: pageSize,
      fileCategory: fileCategory
    }
  }).then(res => {
    tableData.value = res.data.filePage.records;
    modifyDate(tableData.value);
    modifyFileSize(tableData.value);
    total = res.data.filePage.total;
  })
}

// 换页
const handleCurrentChange = (val) => {
  pageNum = val;
  loadFileList();
};

// 改变分页大小
const handleSizeChange = (val) => {
  pageSize = val;
  loadFileList();
};

// 修改日期格式
const modifyDate = (fileLists) => {
  fileLists.forEach(file => {
    const date = new Date(file.createTime); // 将字符串日期转换为 Date 对象
    const formattedDate = date.toLocaleString(); // 获取本地日期时间格式

    // 将原始的 createTime 替换为格式化后的日期时间
    file.createTime = formattedDate;
  });
}

// 修改文件大小格式
const modifyFileSize = (fileLists) => {
  fileLists.forEach(file => {
    if (file.fileSize < 1024) {
      file.fileSize = file.fileSize + "B";
    } else if (file.fileSize < 1024 * 1024) {
      file.fileSize = (file.fileSize / 1024).toFixed(2) + "KB";
    } else if (file.fileSize < 1024 * 1024 * 1024) {
      file.fileSize = (file.fileSize / 1024 / 1024).toFixed(2) + "MB";
    } else {
      file.fileSize = (file.fileSize / 1024 / 1024 / 1024).toFixed(2) + "GB";
    }
  });
}

watch(
    () => route, // 如果路由发生了变化
    (newVal, oldVal) => {
      category = router.currentRoute.value.params.category;
      loadFileList();
    },
    { immediate: true, deep: true }
);

// 初始化Table
onMounted(loadFileList);

</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';

.pagination {
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 30%;
}

.file-list {
  margin-top: 10px;
  .file-item {
    .op {
      width: 120px;
    }
  }
}
</style>
