import ajax from './request'
import Qs from 'qs'
const baseUrl = '/projectmanage'

// 登录接口
export function login (params) {
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: [function (data) {
      return data
    }]
  }
  return ajax.post(baseUrl + '/login', params, config).then(res => res.data)
}
// 退出登录接口
export function logout (params) {
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  return ajax.get(baseUrl + '/logout', params, config).then(res => res.data)
}
// 查询项目
export function searchProject (params) {
  return ajax.get(baseUrl + '/project/findall?' + Qs.stringify(params)).then(res => res.data)
}
// 查询项目列表
export function searchProjectList (params) {
  return ajax.get(baseUrl + '/project/findproject?' + Qs.stringify(params)).then(res => res.data)
}
// 查询项目（根据id）
export function searchProjectById(params) {
  return ajax.get(baseUrl + '/project/findbyid?' + Qs.stringify(params)).then(res => res.data)
}
// 项目删除
export function projectDelete (params) {
  return ajax.post(baseUrl + '/project/delete?' + Qs.stringify(params)).then(res => res.data)
}
// 修改项目
export function projectUpdate (params) {
  return ajax.post(baseUrl + '/project/updateproject?' + Qs.stringify(params)).then(res => res.data)
}
// 添加项目
export function projectAdd (params) {
  return ajax.post(baseUrl + '/project/addproject?' + Qs.stringify(params)).then(res => res.data)
}
// 添加部门
export function departmentAdd(params) {
  return ajax.post(baseUrl + '/department/add?' + Qs.stringify(params)).then(res => res.data)
}
// 添加成员
export function memberAdd(params) {
  return ajax.post(baseUrl + '/member/add?' + Qs.stringify(params)).then(res => res.data)
}
// 删除成员
export function deleteMember(params) {
  return ajax.post(baseUrl + '/member/deleteMember?' + Qs.stringify(params)).then(res => res.data)
}
// 设置默认密码
export function setdefaultpswd(params) {
  return ajax.post(baseUrl + '/member/setdefaultpswd?' + Qs.stringify(params)).then(res => res.data)
}
// 修改成员信息
export function updatemember(params) {
  return ajax.post(baseUrl + '/member/updatemember?' + Qs.stringify(params)).then(res => res.data)
}
// 获取成员列表
export function findMember (params) {
  return ajax.get(baseUrl + '/member/findmember?' + Qs.stringify(params)).then(res => res.data)
}
// 根据id获取成员信息
export function findMemberById (params) {
  return ajax.get(baseUrl + '/member/findbyid?' + Qs.stringify(params)).then(res => res.data)
}
// 获取所有部门
export function departmentList () {
  return ajax.get(baseUrl + '/department/list').then(res => res.data)
}
// 获取所有项目
export function projectFindall () {
  return ajax.get(baseUrl + '/project/findall').then(res => res.data)
}
// 根据权限获取成员
export function memberFindByPermission (params) {
  return ajax.get(baseUrl + '/member/findbypermission?' + Qs.stringify(params)).then(res => res.data)
}
// 批量导入成员
export function batchAdd(params, config) {
  return ajax.post(baseUrl + '/member/batchadd', params, config).then(res => res.data)
}
// 修改密码
export function memberUpdatepswd(params) {
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: [function (data) {
      return data
    }]
  }
  return ajax.post(baseUrl + '/member/updatepswd', params, config).then(res => res.data)
}

// 文件上传
export function fileUpload (params) {
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: [function (data) {
      return data
    }]
  }
  return ajax.post(baseUrl + '/file/upload', params, config).then(res => res.data)
}
// 需求查询
export function requrementList (params) {
  return ajax.get(baseUrl + '/requirement/findrequrementlist?' + Qs.stringify(params)).then(res => res.data)
}
// 需求详情
export function requirementFindbyid (params) {
  return ajax.get(baseUrl + '/requirement/findbyid?' + Qs.stringify(params)).then(res => res.data)
}
// 新增需求
export function requirementAdd (params) {
  let config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      let temData = Qs.stringify(data)
      return temData
    }]
  }
  return ajax.post(baseUrl + '/requirement/add', params, config).then(res => res.data)
}
// 修改需求
export function requirementUpdate (params) {
  let config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      let temData = Qs.stringify(data)
      return temData
    }]
  }
  return ajax.post(baseUrl + '/requirement/update', params, config).then(res => res.data)
}
export function requirementAssign (params) {
  let config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      let temData = Qs.stringify(data)
      return temData
    }]
  }
  return ajax.post(baseUrl + '/requirement/assign', params, config).then(res => res.data)
}
export function updateStatus (params) {
  let config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      let temData = Qs.stringify(data)
      return temData
    }]
  }
  return ajax.post(baseUrl + '/requirement/updatestatus', params, config).then(res => res.data)
}
