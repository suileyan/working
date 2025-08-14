import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'menu.dashboard',
    href: '/dashboard',
    icon: null,
    hide: true,
  },
  {
    id: 'system',
    label: 'menu.system',
    icon: null,
    children: [
      {
        id: 'user-management',
        label: 'menu.userManagement',
        href: '/system/users',
      },
      {
        id: 'role-management',
        label: 'menu.roleManagement',
        href: '/system/roles',
      },
      {
        id: 'permission',
        label: 'menu.permission',
        children: [
          {
            id: 'menu-permission',
            label: 'menu.menuPermission',
            href: '/system/permission/menu',
          },
          {
            id: 'api-permission',
            label: 'menu.apiPermission',
            href: '/system/permission/api',
            hide: true,
          },
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'menu.content',
    icon: null,
    children: [
      {
        id: 'articles',
        label: 'menu.articles',
        href: '/content/articles',
      },
      {
        id: 'categories',
        label: 'menu.categories',
        href: '/content/categories',
      },
    ],
  },
  {
    id: 'settings',
    label: 'menu.settings',
    href: '/settings',
    icon: null,
  },
  {
    id: 'admin',
    label: 'menu.admin',
    href: '/admin',
    icon: null,
  },
]

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: "1",
    title: "仪表板",
    icon: "Odometer",
    path: "/admin/dashboard",
  },
  {
    id: "2",
    title: "用户管理",
    icon: "User",
    path: "/admin/userManage",
  },
  {
    id: "3",
    title: "检测历史",
    icon: "Tickets",
    path: "/admin/history",
  },
  {
    id: "4",
    title: "宣传知识管理",
    icon: "Collection",
    path: "/admin/PromoteKnowledge",
  },
  {
    id: "5",
    title: "模型参数管理",
    icon: "SetUp",
    path: "/admin/ModelParameter",
  },
  {
    id: "6",
    title: "数据集展示",
    icon: "DataAnalysis",
    path: "/admin/DatasetShow",
  },
];

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

}
export default serverConfig
