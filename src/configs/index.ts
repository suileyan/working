import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'index',
    label: 'menu.index',
    href: '/',
    icon: null,
  },
  {
    id: 'detection',
    label: 'menu.detection',
    href: '/detection',
    icon: null,
  },
  {
    id: 'history',
    label: 'menu.history',
    href: '/history',
    icon: null,
  },
  {
    id: 'knowledge',
    label: 'menu.knowledge',
    href: '/knowledge',
    icon: null,
  },
  {
    id: 'stats',
    label: 'menu.stats',
    href: '/stats',
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
    path: "/admin/promoteKnowledge",
  },
  {
    id: "5",
    title: "模型管理",
    icon: "SetUp",
    path: "/admin/modelParameter",
  },
  {
    id: "6",
    title: "数据集展示",
    icon: "DataAnalysis",
    path: "/admin/datasetShow",
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
