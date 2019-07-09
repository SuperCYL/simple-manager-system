import { Message } from 'element-ui'
import router from '@/router'
router.beforeEach((to, from, next) => {
  let platformPermission = localStorage.user ? JSON.parse(localStorage.user).platformPermission : null
  if (to.path === '/login') {
    next()
  } else {
    if (platformPermission !== null) {
      if (to.meta.role.indexOf(platformPermission) !== -1) {
        next()
      } else {
        Message({
          message: '没有此页面的权限',
          type: 'error'
        })
        next('/')
      }
    } else {
      next('/login')
    }
  }
})
