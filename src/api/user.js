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
