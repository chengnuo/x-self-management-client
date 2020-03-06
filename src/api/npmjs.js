import request from '@/utils/request'

import { stringify } from 'qs'

// 详情
export function show(data) {
  return request({
    url: `/api/npmjs/${data.id}`,
    method: 'get'
    // params: {
    //   data
    // }
  })
}

// 列表
export function index(data) {
  return request({
    url: `/api/npmjs?${stringify(data)}`,
    method: 'get'
  })
}
// 创建
export function create(data) {
  return request({
    url: '/api/npmjs',
    method: 'post',
    data
  })
}
// 更新
export function update(data) {
  return request({
    url: `/api/npmjs/${data.id}`,
    method: 'put',
    data
  })
}
// 删除
export function destroy(data) {
  return request({
    url: `/api/npmjs/${data.id}`,
    method: 'delete',
    data
  })
}



