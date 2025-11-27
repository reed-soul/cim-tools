import proj4 from 'proj4'

// 缓存EPSG坐标系列表
let epsgCache: Record<string, { name: string; description: string; definition: string }> | null = null

// 定义常用坐标系（保留这些作为快速访问）
export const commonCoordinateSystems: Record<string, { name: string; description: string; definition: string }> = {
  'EPSG:4326': {
    name: 'WGS84',
    description: '世界大地坐标系',
    definition: '+proj=longlat +datum=WGS84 +no_defs'
  },
  'EPSG:3857': {
    name: 'Web Mercator',
    description: 'Web墨卡托投影',
    definition: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs'
  },
  'EPSG:4490': {
    name: 'CGCS2000',
    description: '国家2000坐标系',
    definition: '+proj=longlat +datum=CGCS2000 +no_defs'
  },
  'EPSG:4547': {
    name: 'CGCS2000 / 3-degree Gauss-Kruger CM 117E',
    description: '国家2000坐标系 3度带 117度中央经线',
    definition: '+proj=gauss +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  },
  'GCJ02': {
    name: '火星坐标系',
    description: '高德、腾讯地图使用的坐标系',
    definition: '+proj=longlat +datum=WGS84 +no_defs'
  },
  'BD09': {
    name: '百度坐标系',
    description: '百度地图使用的坐标系',
    definition: '+proj=longlat +datum=WGS84 +no_defs'
  }
}

// 中国特有坐标系
const chinaCoordinateSystems = {
  'GCJ02': {
    name: '火星坐标系',
    description: '高德、腾讯地图使用的坐标系',
    definition: '+proj=longlat +datum=WGS84 +no_defs'
  },
  'BD09': {
    name: '百度坐标系',
    description: '百度地图使用的坐标系',
    definition: '+proj=longlat +datum=WGS84 +no_defs'
  }
}

// 获取所有可用的EPSG坐标系
export function getAllEpsgCoordinateSystems(): Record<string, { name: string; description: string; definition: string }> {
  if (epsgCache !== null) {
    return epsgCache
  }
  
  try {
    // 获取所有可用的CRS
    const allCrs: Record<string, { name: string; description: string; definition: string }> = {}
    
    // 添加常用坐标系
    Object.assign(allCrs, commonCoordinateSystems)
    
    // 定义一些常用的EPSG代码及其proj4定义
    const commonEpsgDefinitions: Record<string, string> = {
      // 全球坐标系
      'EPSG:4087': '+proj=eqc +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
      'EPSG:3785': '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      
      // 中国坐标系
      'EPSG:4214': '+proj=longlat +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +no_defs',
      'EPSG:4610': '+proj=longlat +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +no_defs',
      
      // 中国投影坐标系 - 3度带
      'EPSG:4548': '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4549': '+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4550': '+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4551': '+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4552': '+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4553': '+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4554': '+proj=tmerc +lat_0=0 +lon_0=138 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4555': '+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4556': '+proj=tmerc +lat_0=0 +lon_0=144 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4557': '+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4558': '+proj=tmerc +lat_0=0 +lon_0=150 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4559': '+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4560': '+proj=tmerc +lat_0=0 +lon_0=156 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4561': '+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4562': '+proj=tmerc +lat_0=0 +lon_0=162 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4563': '+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4564': '+proj=tmerc +lat_0=0 +lon_0=168 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4565': '+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4566': '+proj=tmerc +lat_0=0 +lon_0=174 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4567': '+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4568': '+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      
      // 中国6度带
      'EPSG:4489': '+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4491': '+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4492': '+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4493': '+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4494': '+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4495': '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4496': '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4497': '+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4498': '+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4499': '+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4500': '+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4501': '+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4502': '+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4503': '+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4504': '+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4505': '+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4506': '+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:4507': '+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      
      // UTM坐标系
      'EPSG:32649': '+proj=utm +zone=49 +datum=WGS84 +units=m +no_defs',
      'EPSG:32650': '+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs',
      'EPSG:32651': '+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs',
      'EPSG:32652': '+proj=utm +zone=52 +datum=WGS84 +units=m +no_defs',
      'EPSG:32653': '+proj=utm +zone=53 +datum=WGS84 +units=m +no_defs',
      
      // 其他常用坐标系
      'EPSG:2154': '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:25832': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:25833': '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'EPSG:31255': '+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.423 +units=m +no_defs',
      'EPSG:28992': '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.23699,50.0087,465.658, -0.406857,0.350732,-1.87035,4.0812 +units=m +no_defs',
      'EPSG:31466': '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
      'EPSG:31467': '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
      'EPSG:31468': '+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
      'EPSG:31469': '+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs'
    }
    
    // 添加所有EPSG定义
    Object.entries(commonEpsgDefinitions).forEach(([code, definition]) => {
      // 如果已经在常用坐标系中，跳过
      if (code in allCrs) {
        return
      }
      
      // 从代码中提取名称
      const name = code.replace('EPSG:', 'EPSG:')
      allCrs[code] = {
        name: name,
        description: `${name} - ${definition}`,
        definition: definition
      }
    })
    
    // 添加中国特有坐标系
    Object.assign(allCrs, chinaCoordinateSystems)
    
    epsgCache = allCrs
    return allCrs
    
  } catch (error) {
    console.error('获取EPSG坐标系列表失败:', error)
    // 如果获取失败，返回常用坐标系
    return commonCoordinateSystems
  }
}

// 初始化proj4坐标系定义
export function initCoordinateSystems() {
  const coordinateSystems = getAllEpsgCoordinateSystems()
  Object.entries(coordinateSystems).forEach(([code, system]) => {
    proj4.defs(code, system.definition)
  })
}

// 坐标转换函数
export function transformCoordinate(
  coordinate: [number, number],
  sourceCrs: string,
  targetCrs: string
): [number, number] {
  try {
    // 对于中国特有坐标系，需要特殊处理
    if (sourceCrs in chinaCoordinateSystems && targetCrs in chinaCoordinateSystems) {
      // 如果都是中国特有坐标系，直接返回原坐标，因为前端已经处理了偏移
      return coordinate
    }
    
    // 如果是中国特有坐标系转WGS84或其他标准坐标系
    let actualSourceCrs = sourceCrs
    if (sourceCrs in chinaCoordinateSystems) {
      actualSourceCrs = "EPSG:4326"
    }
    
    // 如果是WGS84或其他标准坐标系转中国特有坐标系
    let actualTargetCrs = targetCrs
    if (targetCrs in chinaCoordinateSystems) {
      actualTargetCrs = "EPSG:4326"
    }
    
    // 尝试直接转换
    try {
      const result = proj4(actualSourceCrs, actualTargetCrs, coordinate)
      return result as [number, number]
    } catch (error) {
      // 如果直接转换失败，尝试通过WGS84作为中间坐标系
      if (actualSourceCrs !== "EPSG:4326" && actualTargetCrs !== "EPSG:4326") {
        const wgs84Coord = proj4(actualSourceCrs, "EPSG:4326", coordinate)
        const result = proj4("EPSG:4326", actualTargetCrs, wgs84Coord)
        return result as [number, number]
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('坐标转换失败:', error)
    throw new Error(`坐标转换失败: ${error}`)
  }
}

// 批量坐标转换
export function transformCoordinates(
  coordinates: Array<[number, number]>,
  sourceCrs: string,
  targetCrs: string
): Array<[number, number]> {
  try {
    return coordinates.map(coord => transformCoordinate(coord, sourceCrs, targetCrs))
  } catch (error) {
    console.error('批量坐标转换失败:', error)
    throw new Error(`批量坐标转换失败: ${error}`)
  }
}

// 获取所有支持的坐标系列表
export function getSupportedCoordinateSystems() {
  const coordinateSystems = getAllEpsgCoordinateSystems()
  return Object.entries(coordinateSystems).map(([code, system]) => ({
    code,
    name: system.name,
    description: system.description
  }))
}

// 检查坐标系是否支持
export function isCoordinateSystemSupported(crsCode: string): boolean {
  const coordinateSystems = getAllEpsgCoordinateSystems()
  return crsCode in coordinateSystems
}

// 添加自定义坐标系
export function addCustomCoordinateSystem(
  code: string,
  name: string,
  description: string,
  definition: string
) {
  const coordinateSystems = getAllEpsgCoordinateSystems()
  coordinateSystems[code] = { name, description, definition }
  proj4.defs(code, definition)
  
  // 清除缓存，以便下次获取时包含新添加的坐标系
  epsgCache = null
}

// 搜索坐标系
export function searchCoordinateSystems(query: string) {
  const coordinateSystems = getAllEpsgCoordinateSystems()
  const lowerQuery = query.toLowerCase()
  
  return Object.entries(coordinateSystems)
    .filter(([code, system]) => 
      code.toLowerCase().includes(lowerQuery) || 
      system.name.toLowerCase().includes(lowerQuery) || 
      system.description.toLowerCase().includes(lowerQuery)
    )
    .map(([code, system]) => ({
      code,
      name: system.name,
      description: system.description
    }))
}
