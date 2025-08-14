// 表单验证规则类型
export interface FormValidationRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

// 用户信息类型
export interface UserInfo {
  id?: string | number
  username?: string
  password?: string
  email?: string
  phone?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: any
}

export interface UserInfoNoToken {
  ip: string
  login_time: Date
  user_id: number
  username: string
  avatar?: string | null
  role?:string
}

// 登录请求参数类型
export interface LoginReq {
  username: string
  password: string
  captcha_text: string
  captcha_id: string
}

// 登录响应类型
export interface LoginResponse {
  success: boolean
  message: string
  code: number
  data?: {
    token: string
    refreshToken?: string
    userInfo: UserInfo
    expiresIn?: number
  }
}

export interface LoginResNoToken {
  code: number,
  msg: "登录成功",
  data: {
    user_id: number,
    username: string,
    login_time: Date,
    ip: string
  }
}

// 验证码响应类型
export interface CaptchaResponse {
  code: number
  msg: string
  data: {
    captcha_id: string
    captcha_url: string
  }
}

// 登录表单验证规则类型
export interface LoginFormRules {
  username: FormValidationRule[]
  password: FormValidationRule[]
  captcha_text: FormValidationRule[]
}

// 刷新Token请求类型
export interface RefreshTokenReq {
  refreshToken: string
}

// 刷新Token响应类型
export interface RefreshTokenResponse {
  success: boolean
  message: string
  data?: {
    token: string
    expiresIn?: number
  }
}

// 登出响应类型
export interface LogoutResponse {
  success: boolean
  message: string
}

// 注册相关类型声明

// 注册表单数据类型
export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  captcha_id: string
  captcha_text: string
}

// 注册请求参数类型
export interface RegisterRequest {
  username: string
  password: string
  email: string
  captcha_id: string
  captcha_text: string
}

// 注册响应类型
export interface RegisterResponse {
  code?: number
  msg?: string
  data?: {
    userId: string
    username: string
    email: string
  }
}

// 注册表单验证规则类型
export interface RegisterFormRules {
  username: FormValidationRule[]
  password: FormValidationRule[]
  confirmPassword: FormValidationRule[]
  email: FormValidationRule[]
}