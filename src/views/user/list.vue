<!-- 用户模块 -->
<template>
  <div class="userList">

    <el-form :inline="true" ref="form" :model="listQuery" label-width="80px" @submit.native.prevent="onSubmit">
      <el-form-item label="用户名称">
        <el-input v-model.trim="listQuery.name" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- @click="onSubmit" -->
        <el-button type="primary" size="small" native-type="submit">查询</el-button>
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
      <el-table-column prop="name"
                       label="用户名" />
      <el-table-column prop="phone"
                       label="电话号码" />
      <el-table-column prop="avatarUrl"
                       label="头像" />
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
      </el-pagination>
    </div>
  </div>
</template>

<script>


import { getList } from '@/api/user'

export default {
  name: 'UserList',
  data() {
    return {

      // limit: toInt(ctx.query.limit),
      // offset: toInt(ctx.query.offset),
      list: [],
      total: 0,
      pageSizes: [10, 100, 200, 300, 400],
      listQuery: {
        offset: 1,
        limit: 10
      },
    }
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    init(){
      this.fetchData()
    },
    fetchData() {
      
      this.listLoading = true

      const query = this.$route.query || {}

      if(this.pageSizes.includes(Number(query.offset))){
        this.listQuery.offset = Number(query.offset) || 1
      }
      if(this.pageSizes.includes(Number(query.limit))){
        this.listQuery.limit = Number(query.limit) || 10
      }

      const listQuery = Object.assign({}, this.listQuery, {
        offset: query.offset,
        limit: query.limit,
      })
      getList(listQuery).then(response => {
        console.log('response', response)
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
        query: Object.assign({}, this.listQuery ,{
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
        query: Object.assign({}, this.listQuery ,{
          offset: val,
        })
      })
      this.init()
    },

    // 查询
    onSubmit(e){
      e.preventDefault();
      this.$router.push({
        query: Object.assign({}, this.listQuery )
      })
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.userList {
  padding: 20px;
}
</style>
