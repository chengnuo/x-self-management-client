<!-- 用户模块-列表 -->
<template>
  <div class="npmjsList">
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
      <el-form-item class="fr">
        <el-button type="primary"
                   size="small"
                   @click="handleCreate">新增</el-button>
      </el-form-item>
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
    <el-table :data="list"
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
                       label="名称" width="100" />
      <el-table-column prop="description"
                       label="描述" width="500" />
      <el-table-column prop="url"
                       label="地址">
        <template slot-scope="scope">
          <div>
            <a :href="scope.row.url" target="_blank">
              <el-button slot="reference"
                         type="text"
                         size="small">{{scope.row.url}}
              </el-button>
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt"
                       label="新增时间" />
      <el-table-column prop="updatedAt"
                       label="更新时间" />
    </el-table>

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


import { index, destroy, show } from '@/api/npmjs'
import UserEditor from '@/components/Npmjs/Editor'

export default {
  name: 'NpmjsList',
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
      this.fetchIndex()
    },
    fetchIndex() {
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
      })
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
  },
}
</script>

<style lang="scss" scoped>
.npmjsList {
  padding: 20px;
}
</style>
