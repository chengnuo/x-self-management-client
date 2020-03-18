<!-- 用户模块-列表 -->
<template>
  <div class="projectList">
    <el-form :inline="true"
             ref="form"
             :model="listQuery"
             label-width="80px"
             @submit.native.prevent="onSubmit">
      <el-form-item label="用户名称">
        <el-input v-model.trim="listQuery.name"
                  size="small"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   native-type="submit">查询</el-button>
      </el-form-item>
      <div class="fr">
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleCreate">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleDownload">导出</el-button>

        </el-form-item>
      </div>
    </el-form>
    <div class="block">
      <el-pagination class="paging"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.offset"
                     :page-sizes="pageSizes"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" />
    </div>
    <!-- <el-table :data="list"
              style="width: 100%">
      <el-table-column label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？"
                         @onConfirm="handleDestory(scope.row)">
            <el-button slot="reference"
                       type="text"
                       size="small">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="名称"
                       width="100" />
      <el-table-column prop="description"
                       label="描述"
                       width="500" />
      <el-table-column prop="createdAt"
                       label="新增时间" />
      <el-table-column prop="updatedAt"
                       label="更新时间" />
    </el-table> -->

    <div class="box-card-layout">

      <el-row :gutter="20">
        <el-col :span="12"
                v-for="(item, index) in list"
                :key="item.id">
          <el-card class="box-card"
                   :id="`boxCard${item.id}`"
                   :style="{ height: `${boxCardsMaxHeight[index]}px`}">
            <div slot="header"
                 class="clearfix">
              <span>{{item.name}}</span>
              <div style="float: right; padding: 3px 0">
                <!-- @click="handleCopy(item)" -->
                <!-- id="copyBtn"
                         data-clipboard-action="copy"
                         data-clipboard-target="#target" -->
                <el-button type="text"
                           size="small"
                           id="copyBtn"
                           data-clipboard-action="copy"
                           @click="handleCopy(item)">复制</el-button>
                <el-button type="text"
                           size="small"
                           @click="handleUpdate(item)">编辑</el-button>
                <el-popconfirm title="这是一段内容确定删除吗？"
                               @onConfirm="handleDestory(item)">
                  <el-button slot="reference"
                             type="text"
                             size="small">删除</el-button>
                </el-popconfirm>
              </div>
            </div>
            <div class="text item">
              <!-- {{item.description.split('\n')}} -->
              <p v-for="(descriptionItem, descriptionIndex) in item.description.split('\n')"
                 :key="descriptionIndex">
                {{descriptionItem}}
              </p>
              <!-- <el-input v-model="item.description"
                      clearable
                      type="textarea"
                      :rows="20"
                      id="target"
                      class="target"
                      ></el-input> -->
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <div class="block">
      <el-pagination class="paging"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.offset"
                     :page-sizes="pageSizes"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" />
    </div>
    <!-- 编辑 -->
    <UserEditor :visible.sync="dialogUserEditor"
                @fetchIndex="fetchIndex"
                :listItem="listItem" />
  </div>
</template>

<script>


import { index, destroy, show } from '@/api/project'
import UserEditor from '@/components/Project/Editor'

import ClipboardJS from 'clipboard';

export default {
  name: 'ProjectList',
  components: {
    UserEditor,
  },
  data() {
    return {
      list: [],
      listItem: {},
      total: 0,
      pageSizes: [10, 100, 200, 300, 400],
      // 请求参数
      listQuery: {
        offset: 1,
        limit: 10,
        name: '',
      },
      dialogUserEditor: false,
      filename: '项目管理',
      boxCardsArr: [], // 一维数组
      boxCards2Arr: [], // 二维数组
      boxCardsMaxHeight: [],
    }
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchIndex(() => {
        console.log('this.list', this.list)
        this.$nextTick(() => {
          this.list.map((item) => {
            let boxCards = document.querySelector(`#boxCard${item.id}`);
            console.log(`boxCard`, boxCards.clientHeight)
            this.boxCardsArr.push(boxCards.clientHeight)

            console.log('this.boxCardsArr', this.boxCardsArr)
            let boxCards2Arr = this.to2Arr(2, this.boxCardsArr);

            let boxCardsMaxHeight = [];
            boxCards2Arr.map((to2ArrItem) => {
              let itemMaxLength = Math.ceil((Math.max.apply(null, to2ArrItem)));
              let itemMaxLength2 = Math.ceil((Math.max.apply(null, to2ArrItem)));
              boxCardsMaxHeight.push(itemMaxLength)
              boxCardsMaxHeight.push(itemMaxLength2)
            });

            this.boxCardsMaxHeight = boxCardsMaxHeight;

            console.log(`boxCards2Arr`, boxCardsMaxHeight)
          })
        })
      })
    },
    fetchIndex(callback) {
      this.listLoading = true
      const query = this.$route.query || {}
      // 页码当前页设置
      if (query.offset) {
        this.listQuery.offset = Number(query.offset) || 1
      }
      // 页码每页条数设置，做判断是为了不随便搜索
      if (this.pageSizes.includes(Number(query.limit))) {
        this.listQuery.limit = Number(query.limit) || 10
      }
      const listQuery = Object.assign({}, this.listQuery, {
        offset: query.offset,
        limit: query.limit,
      })
      index(listQuery).then(response => {
        this.list = response.data
        this.total = response.total;
        this.listLoading = false
        callback && callback()
      })
    },
    // 转二维数组
    to2Arr(num, arr) {
      // var num = 4;//每个子数组里的元素个数
      var num = num || 1;
      // var arr = [1,4,5,6,34,34,67,895,2456,87,9,5,23,884,56];
      var Arr = new Array(Math.ceil(arr.length / num));
      for (var i = 0; i < Arr.length; i++) {
        Arr[i] = new Array();
        for (var j = 0; j < num; j++) {
          Arr[i][j] = 0;
        }
      }
      for (var i = 0; i < arr.length; i++) {
        Arr[parseInt(i / num)][i % num] = arr[i];
      }
      return Arr;
    },
    // 分页大小
    handleSizeChange(val) {
      this.listQuery.offset = 1
      this.listQuery.limit = val
      this.$router.push({
        query: Object.assign({}, this.listQuery, {
          offset: 1,
          limit: val,
        })
      })
      this.init()
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.offset = val
      this.$router.push({
        query: Object.assign({}, this.listQuery, {
          offset: val,
        })
      })
      this.init()
    },
    // 查询
    onSubmit(e) {
      e.preventDefault();
      this.$router.push({
        query: Object.assign({}, this.listQuery)
      })
      this.init()
    },
    // 新增
    handleCreate() {
      this.dialogUserEditor = true;
      this.listItem = {};
    },
    // 更新
    handleUpdate(row) {
      this.dialogUserEditor = true;
      this.listItem = row;
    },
    // 删除-逻辑删除
    handleDestory(row) {
      const listQuery = Object.assign({}, {
        id: row.id,
        deletedAt: 1,
      })
      destroy(listQuery).then(response => {
        this.$notify({
          type: 'error',
          title: '系统提示',
          message: '删除成功',
        });
        this.init();
      })
    },

    handleDownload() {
      this.downloadLoading = true
      import('../../../vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '名称', '描述', '地址']
        const filterVal = ['id', 'name', 'description', 'url']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 复制
    // handleCopy() {
    //   let self = this;
    //   let clipboard = new ClipboardJS("#copyBtn");
    //   clipboard.on('success', () => {
    //     self.$notify.success({
    //       title: '提示',
    //       message: '复制成功'
    //     })
    //     clipboard.destroy();
    //   });
    //   clipboard.on('error', () => {
    //     self.$notify.error({
    //       title: '提示',
    //       message: '复制失败'
    //     })
    //     clipboard.destroy();
    //   });
    // },
    handleCopy(item) {
      let self = this;
      new ClipboardJS('#copyBtn', {
        text: function (trigger) {
          console.log('trigger', trigger)
          return item.description;
        }
      });
      this.$notify.success({
        title: '提示',
        message: '复制成功'
      })
    },
  },

}
</script>

<style lang="scss" scoped>
.projectList {
  padding: 20px;

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .box-card-layout{
    margin-top: 20px;
  }
  .box-card {
    // width: 480px;
    // width: 50%;
    margin-bottom: 20px;
  }
  .target {
    // display: none;
    // position: absolute;
    // left: -9999px;
  }
}
</style>
