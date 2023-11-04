<template>
  <div>
    <el-table
      :data="dataSource"
      :height="tableHeight"
      :stripe=false
      :border=false
      :row-style="rowStyle"
      highlight-current-row
      :default-sort="{ prop: 'createTime', order: 'descending' }"
    >
      <!--selection选择框-->
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        label="文件名"
        prop="fileName"
        width="550"
        align="left"
        sortable
      >
      </el-table-column>
      <el-table-column
        label=""
        width="200"
        align="left"
      >
        <template #default="scope">
          <span class="op">
            <span
              class="iconfont icon-download"
              style="font-size: 12px;"
              @click="downloadFile(scope.row)"
            >下载</span>
            <span
              class="iconfont icon-del"
              style="padding-right: 5px; font-size: 12px;"
              @click="deleteFile(scope.row)"
            >删除</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="200"
        align="left"
        sortable
      ></el-table-column>
      <el-table-column
        label="文件大小"
        prop="fileSize"
        width="150"
        align="left"
        sortable
      ></el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, } from "vue";
import api from "@/utils/api"

const { proxy } = getCurrentInstance();
const props = defineProps({
  dataSource: Object,
  options: {
    type: Object,
    default: {
      extHeight: 0,
      showIndex: false,
      selectType: "checkbox",
    },
  },
  rowStyle: {
    type: Function,
    default: () => {
      return { height: "52px" };
    },
  },
});

//顶部 60 , 内容区域距离顶部 20， 内容上下内间距 15*2  分页区域高度 50
const topHeight = 60 + 20 + 30 + 90;

const tableHeight = ref(
  props.options.tableHeight
    ? props.options.tableHeight
    : window.innerHeight - topHeight - props.options.extHeight
);

const downloadFile = (row) => {
  let url = api.download + "/" + row.fileName;
  try {
    proxy.$request.get(url, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      const fileName = row.fileName;
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        // 创建并触发鼠标点击事件
        const clickEvent = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: false,
        });
        link.dispatchEvent(clickEvent);

        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }
    });
  } catch (e) {
    proxy.$message.error("下载失败");
  }
};

</script>
<style lang="scss" scoped>
.op {
  width: 280px;
  margin-left: 15px;
  display: none;

  .iconfont {
    font-size: 13px;
    margin-left: 10px;
    color: #06a7ff;
    cursor: pointer;
  }

  .iconfont::before {
    margin-right: 3px;
  }
}

.el-table__body tr:hover {
  .op {
    display: inline;
  }
}
</style>
