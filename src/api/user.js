import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/signIn',
    method: 'post',
    data
  })
}

// 列表
export function getList(data) {
  return request({
    url: '/user/getList',
    method: 'post',
    data
  })
}
// 创建
export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
// 更新
export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
// 删除
export function destroy(data) {
  return request({
    url: '/user/destroy',
    method: 'post',
    data
  })
}


export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
