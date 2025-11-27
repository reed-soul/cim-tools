# CIM工具箱

一个专业的坐标系转换工具，支持多种常见坐标系之间的相互转换，包括WGS84、GCJ02、BD09、CGCS2000等，以及各种EPSG代码定义的坐标系。提供单点转换和批量转换功能，并配备可视化地图展示。

## 技术架构

### 前端
- **框架**：Vite7 + Vue3 + TypeScript
- **UI组件库**：Element Plus
- **地图组件**：Leaflet
- **状态管理**：Pinia
- **坐标转换**：proj4js
- **HTTP客户端**：axios

### 后端
- **框架**：Python + FastAPI
- **包管理**：uv
- **坐标转换**：pyproj
- **文件处理**：pandas + python-multipart
- **服务器**：uvicorn

## 功能特点

- **单点坐标转换**：支持单个坐标点的快速转换，实时显示转换结果
- **批量坐标转换**：支持批量坐标转换，可通过文本输入或文件上传方式
- **地图可视化**：在地图上直观展示转换前后的坐标位置
- **多格式支持**：支持CSV、TXT、Excel等多种文件格式的导入导出
- **EPSG支持**：支持各种EPSG代码定义的坐标系，可自定义坐标系转换参数

## 支持的坐标系

### 国际坐标系
- WGS84 (EPSG:4326) - 世界大地坐标系
- Web Mercator (EPSG:3857) - Web墨卡托投影

### 中国坐标系
- GCJ02 - 火星坐标系（高德、腾讯地图）
- BD09 - 百度坐标系
- CGCS2000 (EPSG:4490) - 国家2000坐标系
- CGCS2000 / 3-degree Gauss-Kruger CM 117E (EPSG:4547)

## 快速开始

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
uv install
uv run python run.py
```

### 生产构建
```bash
# 前端
cd frontend
npm run build

# 后端
cd backend
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API接口

### 获取支持的坐标系列表
```
GET /api/systems
```

### 单点坐标转换
```
POST /api/transform/single
Content-Type: application/json

{
  "coordinate": [116.404, 39.915],
  "sourceCrs": "EPSG:4326",
  "targetCrs": "EPSG:3857"
}
```

### 批量坐标转换
```
POST /api/transform/batch
Content-Type: application/json

{
  "coordinates": [[116.404, 39.915], [121.474, 31.230]],
  "sourceCrs": "EPSG:4326",
  "targetCrs": "EPSG:3857"
}
```

### 文件上传转换
```
POST /api/transform/file
Content-Type: multipart/form-data

file: [文件]
sourceCrs: [源坐标系]
targetCrs: [目标坐标系]
```

## 使用说明

1. 选择源坐标系和目标坐标系
2. 输入要转换的坐标（单点或批量）
3. 点击转换按钮获取结果
4. 可在地图上查看转换前后的坐标位置
5. 支持将转换结果导出为CSV等格式

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT
