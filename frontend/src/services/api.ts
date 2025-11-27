import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  },
  error => {
    // 对响应错误做点什么
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 坐标转换API
export const coordinateApi = {
  // 单点坐标转换
  transformSingle: (data: {
    coordinate: [number, number]
    sourceCrs: string
    targetCrs: string
  }) => {
    return api.post('/coordinate/transform/single', data)
  },

  // 批量坐标转换
  transformBatch: (data: {
    coordinates: Array<[number, number]>
    sourceCrs: string
    targetCrs: string
  }) => {
    return api.post('/coordinate/transform/batch', data)
  },

  // 文件上传转换
  transformFile: (formData: FormData) => {
    return api.post('/coordinate/transform/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取支持的坐标系列表
  getSupportedSystems: () => {
    return api.get('/coordinate/systems')
  }
}

export default api
