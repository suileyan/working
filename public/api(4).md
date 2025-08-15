# 智能垃圾分类系统 API 文档

## 概述

本文档详细描述了智能垃圾分类系统的所有API接口，包括HTTP REST API和WebSocket接口。系统包含三个核心应用模块：

- **hzsystem_rubbish**: 垃圾分类核心功能
- **hzsystem_yolo**: YOLO模型检测服务
- **hzsystem_websocket**: WebSocket实时通信

## 基础信息

- **基础URL**: `http://localhost:8000`
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 1. 垃圾分类应用 (hzsystem_rubbish)

### 1.1 数据集展示接口

**接口地址**: `GET /api/rubbish/api/dataset/`

**功能描述**: 获取数据集概览信息和类别统计

**请求参数**: 无

**响应格式**:

```json
{
  "overview": {
    "total_categories": 44,
    "total_images": 15000,
    "train_images": 12000,
    "val_images": 3000,
    "dataset_size": 2048.5
  },
  "categories": [
    {
      "id": 0,
      "name": "塑料瓶",
      "train_count": 300,
      "val_count": 75,
      "total_count": 375,
      "sample_images": [
        "/static/datasets/train/images/bottle_001.jpg",
        "/static/datasets/train/images/bottle_002.jpg"
      ]
    }
  ],
  "config": {
    "names": {
      "0": "塑料瓶",
      "1": "易拉罐"
    }
  }
}
```

### 1.2 垃圾分类列表接口

**接口地址**: `GET /api/rubbish/api/categories/`

**功能描述**: 获取所有垃圾分类类别

**请求参数**: 无

**响应格式**:

```json
[
  {
    "id": 1,
    "name": "可回收垃圾",
    "category_type": "recyclable",
    "description": "可以回收利用的垃圾",
    "disposal_method": "投放到蓝色垃圾桶",
    "icon": "♻️",
    "color": "#007bff",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**创建分类**: `POST /api/rubbish/api/categories/`

**请求体**:

```json
{
  "name": "新分类",
  "category_type": "recyclable",
  "description": "分类描述",
  "disposal_method": "处理方法",
  "icon": "🗑️",
  "color": "#666666"
}
```

### 1.3 垃圾物品列表接口

**接口地址**: `GET /api/rubbish/api/items/`

**功能描述**: 获取垃圾物品列表

**请求参数**:

- `category` (可选): 分类ID，用于过滤特定分类的物品

**响应格式**:

```json
[
  {
    "id": 1,
    "name": "塑料瓶",
    "category": {
      "id": 1,
      "name": "可回收垃圾",
      "category_type": "recyclable"
    },
    "description": "各种塑料饮料瓶",
    "disposal_tips": "清洗后投放",
    "image": "/media/garbage_items/bottle.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**创建物品**: `POST /api/rubbish/api/items/`

**请求体**:

```json
{
  "name": "物品名称",
  "category": 1,
  "description": "物品描述",
  "disposal_tips": "投放提示",
  "image": "图片文件"
}
```

### 1.4 检测记录接口

**接口地址**: `GET /api/rubbish/api/records/`

**功能描述**: 获取检测记录列表

**请求参数**:

- `user` (可选): 用户ID
- `type` (可选): 检测类型 (image/video/camera)

**响应格式**:

```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "testuser"
    },
    "detection_type": "image",
    "original_file": "/media/detections/original/image.jpg",
    "result_image": "/media/detections/results/result.jpg",
    "detected_category": {
      "id": 1,
      "name": "可回收垃圾"
    },
    "detected_item": {
      "id": 1,
      "name": "塑料瓶"
    },
    "confidence": 0.95,
    "processing_time": 1.23,
    "is_correct": true,
    "user_feedback": "检测正确",
    "detection_data": {},
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 1.5 知识文章接口

#### 1.5.1 获取知识文章列表

**接口地址**: `GET /api/rubbish/api/knowledge/`

**功能描述**: 获取知识文章列表

**请求参数**:

- `type` (可选): 文章类型 (guide/tips/policy)

**响应格式**:

```json
[
  {
    "id": 1,
    "title": "垃圾分类指南",
    "article_type": "guide",
    "content": "详细的垃圾分类指南内容...",
    "summary": "文章摘要",
    "cover_image": "/media/knowledge/cover.jpg",
    "is_published": true,
    "view_count": 100,
    "sort_order": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### 1.5.2 创建知识文章

**接口地址**: `POST /api/rubbish/api/knowledge/`

**功能描述**: 创建新的知识文章

**请求格式**: `application/json` 或 `multipart/form-data`（含图片）

**请求体**:

```json
{
  "title": "新的垃圾分类指南",
  "article_type": "guide",
  "content": "详细的分类指南内容...",
  "summary": "文章摘要",
  "cover_image": "图片文件（可选）",
  "is_published": true,
  "sort_order": 1
}
```

**响应格式**:

```json
{
  "id": 2,
  "title": "新的垃圾分类指南",
  "article_type": "guide",
  "content": "详细的分类指南内容...",
  "summary": "文章摘要",
  "cover_image": "/media/knowledge/cover.jpg",
  "is_published": true,
  "view_count": 0,
  "sort_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 1.5.3 更新知识文章

**接口地址**: `PUT /api/rubbish/api/knowledge/{id}/` （全量更新）或 `PATCH /api/rubbish/api/knowledge/{id}/` （部分更新）

**功能描述**: 更新指定ID的知识文章

**路径参数**:

- `id`: 文章ID

**请求体** (PUT - 需要所有字段):

```json
{
  "title": "更新后的标题",
  "article_type": "tips",
  "content": "更新后的内容...",
  "summary": "更新后的摘要",
  "is_published": false,
  "sort_order": 2
}
```

**请求体** (PATCH - 仅需要更新的字段):

```json
{
  "title": "仅更新标题",
  "is_published": false
}
```

**响应格式**: 返回更新后的文章完整信息

#### 1.5.4 删除知识文章

**接口地址**: `DELETE /api/rubbish/api/knowledge/{id}/`

**功能描述**: 删除指定ID的知识文章

**路径参数**:

- `id`: 文章ID

**响应格式**: 返回204状态码（无内容）

**注意事项**:

- 文章类型 `article_type` 支持: `guide`（分类指南）、`tips`（环保小贴士）、`policy`（政策法规）
- `cover_image` 字段支持图片文件上传
- `is_published` 控制文章是否在前端显示
- `sort_order` 用于控制文章排序，数值越小越靠前
- `view_count` 系统自动维护，无需手动设置

### 1.6 统计概览接口

**接口地址**: `GET /api/rubbish/api/statistics/overview/`

**功能描述**: 获取系统整体统计信息

**请求参数**: 无

**响应格式**:

```json
{
  "total_detections": 1000,
  "total_users": 50,
  "accuracy_rate": 85.5,
  "category_distribution": [
    {
      "detected_category__name": "可回收垃圾",
      "count": 400
    },
    {
      "detected_category__name": "厨余垃圾",
      "count": 300
    }
  ]
}
```

### 1.7 用户统计接口

**接口地址**: `GET /api/rubbish/api/statistics/user/{user_id}/`

**功能描述**: 获取指定用户的统计信息

**路径参数**:

- `user_id`: 用户ID

**响应格式**:

```json
{
  "total_detections": 100,
  "correct_detections": 85,
  "accuracy_rate": 85.0,
  "weekly_detections": 20,
  "monthly_detections": 80,
  "eco_points": 850,
  "achievements": ["新手", "环保达人"],
  "recent_records": [
    {
      "id": 1,
      "detection_type": "image",
      "confidence": 0.95,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 2. YOLO检测应用 (hzsystem_yolo)

### 2.1 图片检测接口

**接口地址**: `POST /api/yolo/api/detect/image/`

**功能描述**: 上传图片进行垃圾检测

**请求格式**: `multipart/form-data`

**请求参数**:

- `image` (必需): 图片文件
- `confidence` (可选): 置信度阈值，默认0.5
- `iou_threshold` (可选): IOU阈值，默认0.45

**响应格式**:

```json
{
  "success": true,
  "record_id": 123,
  "detections": [
    {
      "class_id": 0,
      "class_name": "塑料瓶",
      "confidence": 0.95,
      "bbox": [100, 50, 200, 150],
      "area": 10000
    }
  ],
  "processing_time": 1.23,
  "original_image": "/media/uploads/images/image.jpg",
  "result_image": "/media/detection_results/result.jpg",
  "detected_category": "可回收垃圾"
}
```

**错误响应**:

```json
{
  "error": "请上传图片文件"
}
```

### 2.2 视频检测接口

**接口地址**: `POST /api/yolo/api/detect/video/`

**功能描述**: 上传视频进行垃圾检测

**请求格式**: `multipart/form-data`

**请求参数**:

- `video` (必需): 视频文件
- `confidence` (可选): 置信度阈值，默认0.5
- `iou_threshold` (可选): IOU阈值，默认0.45
- `frame_skip` (可选): 跳帧数，默认5

**响应格式**:

```json
{
  "success": true,
  "record_id": 124,
  "frame_detections": [
    {
      "frame_number": 0,
      "timestamp": 0.0,
      "detections": [
        {
          "class_id": 0,
          "class_name": "塑料瓶",
          "confidence": 0.95,
          "bbox": [100, 50, 200, 150]
        }
      ]
    }
  ],
  "summary": {
    "total_frames": 100,
    "processed_frames": 20,
    "total_detections": 15,
    "unique_classes": ["塑料瓶", "易拉罐"]
  },
  "processing_time": 15.67,
  "original_video": "/media/uploads/videos/video.mp4",
  "detected_category": "可回收垃圾"
}
```

### 2.3 模型信息接口

**接口地址**: `GET /api/yolo/api/model/info/`

**功能描述**: 获取当前YOLO模型信息

**请求参数**: 无

**响应格式**:

```json
{
  "model_name": "YOLOv8n",
  "model_path": "/models/best.pt",
  "model_size": "6.2MB",
  "input_size": [640, 640],
  "num_classes": 44,
  "class_names": {
    "0": "塑料瓶",
    "1": "易拉罐"
  },
  "confidence_threshold": 0.5,
  "iou_threshold": 0.45,
  "device": "cpu",
  "loaded_at": "2024-01-01T00:00:00Z"
}
```

### 2.4 模型列表接口

**接口地址**: `GET /api/yolo/api/models/`

**功能描述**: 获取所有YOLO模型配置

**请求参数**: 无

**响应格式**:

```json
[
  {
    "id": 1,
    "name": "垃圾分类模型v1",
    "model_path": "models/best.pt",
    "confidence_threshold": 0.5,
    "iou_threshold": 0.45,
    "max_detections": 1000,
    "input_size": 640,
    "is_active": true,
    "model_exists": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**创建模型**: `POST /api/yolo/api/models/`

**请求体**:

```json
{
  "name": "新模型",
  "model_path": "models/new_model.pt",
  "confidence_threshold": 0.6,
  "iou_threshold": 0.4,
  "max_detections": 500,
  "input_size": 640,
  "is_active": true
}
```

### 2.5 检测任务列表接口

**接口地址**: `GET /api/yolo/api/tasks/`

**功能描述**: 获取检测任务列表

**请求参数**: 无

**响应格式**:

```json
[
  {
    "id": 1,
    "task_id": "task_123456",
    "task_type": "image",
    "status": "completed",
    "input_file": "/media/yolo/inputs/image.jpg",
    "output_file": "/media/yolo/outputs/result.jpg",
    "model": {
      "id": 1,
      "name": "垃圾分类模型v1"
    },
    "detection_results": [
      {
        "class_name": "塑料瓶",
        "confidence": 0.95
      }
    ],
    "processing_time": 1.23,
    "error_message": "",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### 2.6 检测统计接口

**接口地址**: `GET /api/yolo/api/statistics/`

**功能描述**: 获取YOLO检测统计信息

**请求参数**: 无

**响应格式**:

```json
{
  "total_detections": 1000,
  "detection_types": {
    "image": 600,
    "video": 300,
    "camera": 100
  },
  "avg_processing_time": 1.45,
  "category_distribution": [
    {
      "detected_category__name": "可回收垃圾",
      "count": 400
    }
  ]
}
```

---

## 3. WebSocket应用 (hzsystem_websocket)

### 3.1 HTTP接口

#### 3.1.1 WebSocket状态接口

**接口地址**: `GET /api/websocket/status/`

**功能描述**: 获取WebSocket服务状态

**请求参数**: 无

**响应格式**:

```json
{
  "status": "success",
  "websocket_config": {
    "enabled": true,
    "max_connections": 100,
    "timeout": 30,
    "protocols": ["ws", "wss"],
    "endpoints": {
      "detection": "/ws/detection/",
      "camera_stream": "/ws/camera/{camera_id}/"
    }
  },
  "active_connections": {
    "total": 5,
    "detection": 3,
    "camera_stream": 2
  },
  "server_time": "2024-01-01T00:00:00Z"
}
```

#### 3.1.2 检测配置接口

**接口地址**: `GET /api/websocket/detection/config/`

**功能描述**: 获取实时检测配置

**请求参数**: 无

**响应格式**:

```json
{
  "status": "success",
  "config": {
    "confidence_threshold": 0.5,
    "iou_threshold": 0.45,
    "max_detections": 10,
    "detection_classes": {
      "0": "塑料瓶",
      "1": "易拉罐"
    },
    "frame_rate": 30,
    "image_size": [640, 640],
    "save_frames": true,
    "save_results": true
  }
}
```

**更新配置**: `POST /api/websocket/detection/config/`

**请求体**:

```json
{
  "confidence_threshold": 0.6,
  "iou_threshold": 0.4,
  "max_detections": 15,
  "frame_rate": 25,
  "save_frames": false,
  "save_results": true
}
```

**响应格式**:

```json
{
  "status": "success",
  "message": "检测配置已更新",
  "config": {
    "confidence_threshold": 0.6,
    "iou_threshold": 0.4,
    "max_detections": 15,
    "frame_rate": 25,
    "save_frames": false,
    "save_results": true
  }
}
```

#### 3.1.3 摄像头列表接口

**接口地址**: `GET /api/websocket/cameras/`

**功能描述**: 获取摄像头列表

**请求参数**: 无

**响应格式**:

```json
{
  "status": "success",
  "cameras": [
    {
      "id": "camera_001",
      "name": "前门摄像头",
      "location": "主入口",
      "status": "online",
      "resolution": "1920x1080",
      "fps": 30,
      "last_detection": "2024-01-01T00:00:00Z"
    },
    {
      "id": "camera_002",
      "name": "后门摄像头",
      "location": "后门出口",
      "status": "online",
      "resolution": "1280x720",
      "fps": 25,
      "last_detection": "2024-01-01T00:05:00Z"
    }
  ],
  "total_count": 3,
  "online_count": 2
}
```

#### 3.1.4 检测统计接口

**接口地址**: `GET /api/websocket/detection/stats/`

**功能描述**: 获取实时检测统计

**请求参数**:

- `days` (可选): 统计天数，默认7天

**响应格式**:

```json
{
  "status": "success",
  "stats": {
    "realtime": {
      "total_detections": 500,
      "successful_detections": 450,
      "average_confidence": 0.85,
      "average_processing_time": 0.12,
      "detection_rate": 90.0
    },
    "daily": [
      {
        "date": "2024-01-01",
        "count": 50
      },
      {
        "date": "2024-01-02",
        "count": 75
      }
    ],
    "categories": [
      {
        "category": "可回收垃圾",
        "count": 200
      },
      {
        "category": "厨余垃圾",
        "count": 150
      }
    ]
  },
  "period": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-08T00:00:00Z",
    "days": 7
  }
}
```

### 3.2 WebSocket接口

#### 3.2.1 实时检测WebSocket

**连接地址**: `ws://localhost:8001/ws/detection/`

**功能描述**: 实时图像检测WebSocket连接

**连接流程**:

1. 建立WebSocket连接
2. 发送图像帧数据
3. 接收检测结果

**发送消息格式**:

```json
{
  "type": "image_frame",
  "data": {
    "image": "base64编码的图像数据",
    "timestamp": "2024-01-01T00:00:00Z",
    "camera_id": "camera_001",
    "frame_id": 12345
  }
}
```

**接收消息格式**:

```json
{
  "type": "detection_result",
  "data": {
    "frame_id": 12345,
    "timestamp": "2024-01-01T00:00:00Z",
    "detections": [
      {
        "class_id": 0,
        "class_name": "塑料瓶",
        "confidence": 0.95,
        "bbox": [100, 50, 200, 150]
      }
    ],
    "processing_time": 0.12,
    "camera_id": "camera_001"
  }
}
```

**错误消息格式**:

```json
{
  "type": "error",
  "data": {
    "message": "检测失败",
    "error_code": "DETECTION_ERROR",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.2.2 摄像头流WebSocket

**连接地址**: `ws://localhost:8000/ws/camera/{camera_id}/`

**功能描述**: 摄像头视频流WebSocket连接

**路径参数**:

- `camera_id`: 摄像头ID

**连接流程**:

1. 建立WebSocket连接
2. 接收视频流数据
3. 发送控制命令

**接收消息格式**:

```json
{
  "type": "video_frame",
  "data": {
    "frame": "base64编码的视频帧",
    "timestamp": "2024-01-01T00:00:00Z",
    "camera_id": "camera_001",
    "frame_number": 12345,
    "fps": 30
  }
}
```

**发送控制命令**:

```json
{
  "type": "camera_control",
  "data": {
    "command": "start|stop|pause|resume",
    "parameters": {
      "resolution": "1920x1080",
      "fps": 30
    }
  }
}
```

**状态消息格式**:

```json
{
  "type": "camera_status",
  "data": {
    "camera_id": "camera_001",
    "status": "online|offline|error",
    "message": "摄像头状态信息",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

---

## 4. 错误处理

### 4.1 HTTP状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权
- `403 Forbidden`: 禁止访问
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

### 4.2 错误响应格式

```json
{
  "error": "错误描述信息",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z",
  "details": {
    "field": "具体错误字段",
    "message": "详细错误信息"
  }
}
```

### 4.3 常见错误码

- `INVALID_PARAMETER`: 参数无效
- `FILE_NOT_FOUND`: 文件不存在
- `MODEL_LOAD_ERROR`: 模型加载失败
- `DETECTION_ERROR`: 检测失败
- `WEBSOCKET_ERROR`: WebSocket连接错误
- `DATABASE_ERROR`: 数据库错误

---

## 5. 数据模型

### 5.1 垃圾分类 (GarbageCategory)

```json
{
  "id": 1,
  "name": "分类名称",
  "category_type": "recyclable|kitchen|hazardous|other",
  "description": "分类描述",
  "disposal_method": "处理方法",
  "icon": "图标",
  "color": "颜色代码",
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

### 5.2 垃圾物品 (GarbageItem)

```json
{
  "id": 1,
  "name": "物品名称",
  "category": "所属分类对象",
  "description": "物品描述",
  "disposal_tips": "投放提示",
  "image": "物品图片URL",
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

### 5.3 检测记录 (DetectionRecord)

```json
{
  "id": 1,
  "user": "用户对象",
  "detection_type": "image|video|camera",
  "original_file": "原始文件路径",
  "result_image": "结果图片路径",
  "detected_category": "检测分类对象",
  "detected_item": "检测物品对象",
  "confidence": "置信度",
  "processing_time": "处理时间",
  "is_correct": "是否正确",
  "user_feedback": "用户反馈",
  "detection_data": "检测详细数据",
  "created_at": "检测时间"
}
```

---

## 6. 认证与授权

### 6.1 认证方式

系统支持以下认证方式：

- Basic Authentication
- 自定义CSRF豁免认证

### 6.2 请求头

```http
Authorization: Basic base64(username:password)
Content-Type: application/json
X-CSRFToken: csrf_token_value
```

### 6.3 WebSocket认证

WebSocket连接可以通过查询参数传递认证信息：

```
ws://localhost:8000/ws/detection/?token=auth_token
```

---

## 7. 限制与配额

### 7.1 文件上传限制

- 图片文件：最大10MB，支持格式：jpg, jpeg, png, bmp
- 视频文件：最大100MB，支持格式：mp4, avi, mov, mkv

### 7.2 API调用限制

- 每分钟最多100次请求
- WebSocket连接最多100个并发

### 7.3 检测参数限制

- 置信度阈值：0.1 - 1.0
- IOU阈值：0.1 - 1.0
- 最大检测数量：1 - 100
- 帧率：1 - 60 FPS

---

## 8. 示例代码

### 8.1 Python示例

```python
import requests
import json

# 图片检测示例
url = 'http://localhost:8000/api/yolo/api/detect/image/'
files = {'image': open('test.jpg', 'rb')}
data = {'confidence': 0.6, 'iou_threshold': 0.4}

response = requests.post(url, files=files, data=data)
result = response.json()
print(json.dumps(result, indent=2, ensure_ascii=False))
```

### 8.2 JavaScript示例

```javascript
// WebSocket连接示例
const ws = new WebSocket('ws://localhost:8000/ws/detection/');

ws.onopen = function(event) {
    console.log('WebSocket连接已建立');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('接收到检测结果:', data);
};

ws.onerror = function(error) {
    console.error('WebSocket错误:', error);
};

// 发送图像帧
function sendImageFrame(imageData) {
    const message = {
        type: 'image_frame',
        data: {
            image: imageData,
            timestamp: new Date().toISOString(),
            camera_id: 'camera_001',
            frame_id: Date.now()
        }
    };
    ws.send(JSON.stringify(message));
}
```

### 8.3 cURL示例

```bash
# 获取垃圾分类列表
curl -X GET "http://localhost:8000/api/rubbish/api/categories/" \
     -H "Content-Type: application/json"

# 图片检测
curl -X POST "http://localhost:8000/api/yolo/api/detect/image/" \
     -F "image=@test.jpg" \
     -F "confidence=0.6" \
     -F "iou_threshold=0.4"

# 获取检测统计
curl -X GET "http://localhost:8000/api/websocket/detection/stats/?days=7" \
     -H "Content-Type: application/json"
```

---

## 9. 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 实现基础垃圾分类功能
- 集成YOLO检测模型
- 支持WebSocket实时检测

---

## 10. 联系信息

- **项目地址**: <https://github.com/your-repo/garbage-classification>
- **文档地址**: <https://docs.your-domain.com/api>
- **技术支持**: <support@your-domain.com>

---

*本文档最后更新时间：2024-01-01*
