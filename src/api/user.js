import request from '@/utils/request'

import { stringify } from 'qs'

export function login(data) {
  return request({
    url: '/api/user/signIn',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/api/user/signOut',
    method: 'post'
  })
}

// 详情
export function show(data) {
  return request({
    url: `/api/user/${data.id}`,
    method: 'get'
    // params: {
    //   data
    // }
  })
}

// 列表
export function index(data) {
  return request({
    url: `/api/user?${stringify(data)}`,
    method: 'get'
  })
}
// 创建
export function create(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}
// 更新
export function update(data) {
  return request({
    url: `/api/user/${data.id}`,
    method: 'put',
    data
  })
}
// 删除
export function destroy(data) {
  return request({
    url: `/api/user/${data.id}`,
    method: 'delete',
    data
  })
}



