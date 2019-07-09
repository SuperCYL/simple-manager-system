import axios from 'axios'
import router from '@/router'
import { Message, Loading } from 'element-ui'
// import store from '@/store'
let loading
let loadingNum = 0
// 不显示loading的url
let showloading = function () {
  loadingNum++
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
let hideLoading = function () {
  loadingNum--
  if (loadingNum === 0) {
    loading.close()
  }
}
// create an axios instance
const service = axios.create({
  baseURL: '',
  // baseURL: process.env.BASE_API,
  timeout: 60000,
  // withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  transformRequest: [function (data) {
    data = JSON.stringify(data)
    return data
  }]
})

// request interceptor
service.interceptors.request.use(config => {
  showloading()
  return config
}, error => {
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    hideLoading()
    // console.log(response)
    const res = response.data
    if (response.status === 200) {
      if (res.code !== 0 && res.code !== 200 && res.code) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 4 * 1000
        })
      }
      if (res.code === 401) {
        router.push('/login')
      }
      return response
    }
  },
  error => {
    hideLoading()
    console.log(error.response)
    Message({
      message: error.response && error.response.data.msg ? error.response.data.msg : '出现问题，请重试',
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(error)
  })

export default service
