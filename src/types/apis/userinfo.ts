// 用户详细信息类型
export interface UserDetailInfo {
  id: number
  username: string
  email: string
}

// 更新用户信息请求类型
export interface UpdateUserInfoRequest {
  id: number
  username: string
  email: string
}

// 更新用户信息响应类型
export interface UpdateUserInfoResponse {
  code: number
  msg: string
  data?: UserDetailInfo
}

// 修改密码请求类型
export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  reset_password: string
}

// 修改密码响应类型
export interface ChangePasswordResponse {
  code: number
  msg: string
}

// 文件上传响应类型
export interface UploadFileResponse {
  code: number
  msg: string
  data: {
    upload_path: string
  }
}

// 用户信息表单验证规则类型
export interface UserInfoFormRules {
  email: UserInfoFormValidationRule[]
  'user_info.phone': UserInfoFormValidationRule[]
  'user_info.gender': UserInfoFormValidationRule[]
}

// 修改密码表单验证规则类型
export interface ChangePasswordFormRules {
  old_password: UserInfoFormValidationRule[]
  new_password: UserInfoFormValidationRule[]
  reset_password: UserInfoFormValidationRule[]
}

// 表单验证规则类型（从auth.ts复用）
export interface UserInfoFormValidationRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}