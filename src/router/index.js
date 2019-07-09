import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const constantsRouterMap = [{
  name: '登录',
  path: '/login',
  component: () => import('@/views/login/login')
}]
export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/requirementManger',
    name: 'Index',
    component: () => import('@/views/layout/layout'),
    children: [
      {
        name: '需求列表',
        path: '/requirementManger',
        component: () => import('@/views/requirementManger/requirementManger'),
        meta: {role: [1, 2, 3]}
      }, {
        name: '创建需求',
        path: '/requirementAdd',
        component: () => import('@/views/requirementManger/requirementAdd'),
        meta: {role: [1, 2]}
      }, {
        name: '编辑需求',
        path: '/requirementEdit/:id',
        component: () => import('@/views/requirementManger/requirementEdit'),
        meta: {role: [1, 2, 3]}
      }, {
        name: '项目管理',
        path: '/projectManagement',
        component: () => import('@/views/projectManagement/index'),
        meta: {role: [1]}
      }, {
        name: '人员管理',
        path: '/staffManagement',
        component: () => import('@/views/staffManagement/index'),
        meta: {role: [1]}
      }
    ]
  },
  { path: '*', redirect: '/' }
]

const finanlRouter = constantsRouterMap.concat(asyncRouterMap)

const createRouter = () => new Router({
  routes: finanlRouter
})
const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router
