from pyproj import Transformer, CRS
from typing import List, Dict, Tuple, Optional
import pandas as pd
import os
import json
from pathlib import Path

# 缓存EPSG坐标系列表
_epsg_cache = None

# 定义常用坐标系（保留这些作为快速访问）
common_coordinate_systems = {
    'EPSG:4326': {
        'name': 'WGS84',
        'description': '世界大地坐标系',
        'definition': '+proj=longlat +datum=WGS84 +no_defs'
    },
    'EPSG:3857': {
        'name': 'Web Mercator',
        'description': 'Web墨卡托投影',
        'definition': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs'
    },
    'EPSG:4490': {
        'name': 'CGCS2000',
        'description': '国家2000坐标系',
        'definition': '+proj=longlat +datum=CGCS2000 +no_defs'
    },
    'EPSG:4547': {
        'name': 'CGCS2000 / 3-degree Gauss-Kruger CM 117E',
        'description': '国家2000坐标系 3度带 117度中央经线',
        'definition': '+proj=gauss +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    },
    'GCJ02': {
        'name': '火星坐标系',
        'description': '高德、腾讯地图使用的坐标系',
        'definition': '+proj=longlat +datum=WGS84 +no_defs'
    },
    'BD09': {
        'name': '百度坐标系',
        'description': '百度地图使用的坐标系',
        'definition': '+proj=longlat +datum=WGS84 +no_defs'
    }
}

# 中国特有坐标系
china_coordinate_systems = {
    'GCJ02': {
        'name': '火星坐标系',
        'description': '高德、腾讯地图使用的坐标系',
        'definition': '+proj=longlat +datum=WGS84 +no_defs'
    },
    'BD09': {
        'name': '百度坐标系',
        'description': '百度地图使用的坐标系',
        'definition': '+proj=longlat +datum=WGS84 +no_defs'
    }
}


def get_all_epsg_coordinate_systems() -> Dict[str, Dict]:
    """获取所有可用的EPSG坐标系"""
    global _epsg_cache
    
    if _epsg_cache is not None:
        return _epsg_cache
    
    try:
        # 获取所有可用的CRS
        all_crs = {}
        
        # 添加常用坐标系
        all_crs.update(common_coordinate_systems)
        
        # 获取pyproj支持的所有EPSG坐标系
        # 这里我们获取一些常用的EPSG代码，实际应用中可以根据需要扩展
        common_epsg_codes = [
            # 全球坐标系
            'EPSG:4326',  # WGS84
            'EPSG:3857',  # Web Mercator
            'EPSG:4087',  # World Equidistant Cylindrical (Sphere)
            'EPSG:3785',  # Popular Visualisation CRS / Mercator
            
            # 中国坐标系
            'EPSG:4490',  # CGCS2000
            'EPSG:4214',  # Xian 1980
            'EPSG:4610',  # Beijing 1954
            
            # 中国投影坐标系
            'EPSG:4547',  # CGCS2000 / 3-degree Gauss-Kruger CM 117E
            'EPSG:4548',  # CGCS2000 / 3-degree Gauss-Kruger CM 120E
            'EPSG:4549',  # CGCS2000 / 3-degree Gauss-Kruger CM 123E
            'EPSG:4550',  # CGCS2000 / 3-degree Gauss-Kruger CM 126E
            'EPSG:4551',  # CGCS2000 / 3-degree Gauss-Kruger CM 129E
            'EPSG:4552',  # CGCS2000 / 3-degree Gauss-Kruger CM 132E
            'EPSG:4553',  # CGCS2000 / 3-degree Gauss-Kruger CM 135E
            'EPSG:4554',  # CGCS2000 / 3-degree Gauss-Kruger CM 138E
            'EPSG:4555',  # CGCS2000 / 3-degree Gauss-Kruger CM 141E
            'EPSG:4556',  # CGCS2000 / 3-degree Gauss-Kruger CM 144E
            'EPSG:4557',  # CGCS2000 / 3-degree Gauss-Kruger CM 147E
            'EPSG:4558',  # CGCS2000 / 3-degree Gauss-Kruger CM 150E
            'EPSG:4559',  # CGCS2000 / 3-degree Gauss-Kruger CM 153E
            'EPSG:4560',  # CGCS2000 / 3-degree Gauss-Kruger CM 156E
            'EPSG:4561',  # CGCS2000 / 3-degree Gauss-Kruger CM 159E
            'EPSG:4562',  # CGCS2000 / 3-degree Gauss-Kruger CM 162E
            'EPSG:4563',  # CGCS2000 / 3-degree Gauss-Kruger CM 165E
            'EPSG:4564',  # CGCS2000 / 3-degree Gauss-Kruger CM 168E
            'EPSG:4565',  # CGCS2000 / 3-degree Gauss-Kruger CM 171E
            'EPSG:4566',  # CGCS2000 / 3-degree Gauss-Kruger CM 174E
            'EPSG:4567',  # CGCS2000 / 3-degree Gauss-Kruger CM 177E
            'EPSG:4568',  # CGCS2000 / 3-degree Gauss-Kruger CM 180E
            
            # 中国6度带
            'EPSG:4489',  # CGCS2000 / 6-degree Gauss-Kruger CM 75E
            'EPSG:4491',  # CGCS2000 / 6-degree Gauss-Kruger CM 81E
            'EPSG:4492',  # CGCS2000 / 6-degree Gauss-Kruger CM 87E
            'EPSG:4493',  # CGCS2000 / 6-degree Gauss-Kruger CM 93E
            'EPSG:4494',  # CGCS2000 / 6-degree Gauss-Kruger CM 99E
            'EPSG:4495',  # CGCS2000 / 6-degree Gauss-Kruger CM 105E
            'EPSG:4496',  # CGCS2000 / 6-degree Gauss-Kruger CM 111E
            'EPSG:4497',  # CGCS2000 / 6-degree Gauss-Kruger CM 117E
            'EPSG:4498',  # CGCS2000 / 6-degree Gauss-Kruger CM 123E
            'EPSG:4499',  # CGCS2000 / 6-degree Gauss-Kruger CM 129E
            'EPSG:4500',  # CGCS2000 / 6-degree Gauss-Kruger CM 135E
            'EPSG:4501',  # CGCS2000 / 6-degree Gauss-Kruger CM 141E
            'EPSG:4502',  # CGCS2000 / 6-degree Gauss-Kruger CM 147E
            'EPSG:4503',  # CGCS2000 / 6-degree Gauss-Kruger CM 153E
            'EPSG:4504',  # CGCS2000 / 6-degree Gauss-Kruger CM 159E
            'EPSG:4505',  # CGCS2000 / 6-degree Gauss-Kruger CM 165E
            'EPSG:4506',  # CGCS2000 / 6-degree Gauss-Kruger CM 171E
            'EPSG:4507',  # CGCS2000 / 6-degree Gauss-Kruger CM 177E
            
            # UTM坐标系
            'EPSG:32649',  # WGS 84 / UTM zone 49N
            'EPSG:32650',  # WGS 84 / UTM zone 50N
            'EPSG:32651',  # WGS 84 / UTM zone 51N
            'EPSG:32652',  # WGS 84 / UTM zone 52N
            'EPSG:32653',  # WGS 84 / UTM zone 53N
            
            # 其他常用坐标系
            'EPSG:2154',  # RGF93 / Lambert-93 (法国)
            'EPSG:25832',  # ETRS89 / UTM zone 32N (欧洲)
            'EPSG:25833',  # ETRS89 / UTM zone 33N (欧洲)
            'EPSG:31255',  # MGI / Austria GK East (奥地利)
            'EPSG:28992',  # Amersfoort / RD New (荷兰)
            'EPSG:31466',  # DHDN / 3-degree Gauss-Kruger zone 2 (德国)
            'EPSG:31467',  # DHDN / 3-degree Gauss-Kruger zone 3 (德国)
            'EPSG:31468',  # DHDN / 3-degree Gauss-Kruger zone 4 (德国)
            'EPSG:31469',  # DHDN / 3-degree Gauss-Kruger zone 5 (德国)
        ]
        
        # 尝试获取每个EPSG代码的详细信息
        for epsg_code in common_epsg_codes:
            try:
                crs = CRS.from_epsg(int(epsg_code.split(':')[1]))
                name = crs.name
                description = f"{crs.name} - {crs.to_proj4()}"
                
                # 如果已经在常用坐标系中，跳过
                if epsg_code in all_crs:
                    continue
                    
                all_crs[epsg_code] = {
                    'name': name,
                    'description': description,
                    'definition': crs.to_proj4()
                }
            except Exception as e:
                print(f"无法获取EPSG代码 {epsg_code} 的信息: {e}")
                continue
        
        # 添加中国特有坐标系
        all_crs.update(china_coordinate_systems)
        
        _epsg_cache = all_crs
        return all_crs
        
    except Exception as e:
        print(f"获取EPSG坐标系列表失败: {e}")
        # 如果获取失败，返回常用坐标系
        return common_coordinate_systems


def get_supported_coordinate_systems() -> List[Dict]:
    """获取所有支持的坐标系列表"""
    coordinate_systems = get_all_epsg_coordinate_systems()
    return [
        {
            'code': code,
            'name': system['name'],
            'description': system['description']
        }
        for code, system in coordinate_systems.items()
    ]


def create_transformer(source_crs: str, target_crs: str) -> Transformer:
    """创建坐标转换器"""
    try:
        # 对于中国特有坐标系，需要特殊处理
        if source_crs in ['GCJ02', 'BD09'] and target_crs in ['GCJ02', 'BD09']:
            # 如果都是中国特有坐标系，直接返回WGS84转换器，因为前端已经处理了偏移
            return Transformer.from_crs("EPSG:4326", "EPSG:4326", always_xy=True)
        
        # 如果是中国特有坐标系转WGS84或其他标准坐标系
        if source_crs in ['GCJ02', 'BD09']:
            # 先转到WGS84
            source_crs = "EPSG:4326"
        
        # 如果是WGS84或其他标准坐标系转中国特有坐标系
        if target_crs in ['GCJ02', 'BD09']:
            # 先从WGS84转换
            target_crs = "EPSG:4326"
        
        # 尝试直接创建转换器
        try:
            return Transformer.from_crs(source_crs, target_crs, always_xy=True)
        except Exception:
            # 如果直接转换失败，尝试通过WGS84作为中间坐标系
            if source_crs != "EPSG:4326" and target_crs != "EPSG:4326":
                transformer1 = Transformer.from_crs(source_crs, "EPSG:4326", always_xy=True)
                transformer2 = Transformer.from_crs("EPSG:4326", target_crs, always_xy=True)
                return transformer1, transformer2
            else:
                raise
                
    except Exception as e:
        raise ValueError(f"创建坐标转换器失败: {e}")


def transform_single_coordinate(
    coordinate: List[float], 
    source_crs: str, 
    target_crs: str
) -> List[float]:
    """单点坐标转换"""
    try:
        # 对于中国特有坐标系，前端已经处理了偏移，这里直接返回
        if source_crs in ['GCJ02', 'BD09'] and target_crs in ['GCJ02', 'BD09']:
            return coordinate
        
        transformer = create_transformer(source_crs, target_crs)
        
        # 如果返回的是元组，表示是两步转换
        if isinstance(transformer, tuple):
            transformer1, transformer2 = transformer
            x, y = transformer1.transform(coordinate[0], coordinate[1])
            x, y = transformer2.transform(x, y)
        else:
            x, y = transformer.transform(coordinate[0], coordinate[1])
            
        return [x, y]
    except Exception as e:
        raise ValueError(f"坐标转换失败: {e}")


def transform_batch_coordinates(
    coordinates: List[List[float]], 
    source_crs: str, 
    target_crs: str
) -> List[List[float]]:
    """批量坐标转换"""
    try:
        # 对于中国特有坐标系，前端已经处理了偏移，这里直接返回
        if source_crs in ['GCJ02', 'BD09'] and target_crs in ['GCJ02', 'BD09']:
            return coordinates
        
        transformer = create_transformer(source_crs, target_crs)
        results = []
        
        # 如果返回的是元组，表示是两步转换
        if isinstance(transformer, tuple):
            transformer1, transformer2 = transformer
            for coord in coordinates:
                x, y = transformer1.transform(coord[0], coord[1])
                x, y = transformer2.transform(x, y)
                results.append([x, y])
        else:
            for coord in coordinates:
                x, y = transformer.transform(coord[0], coord[1])
                results.append([x, y])
                
        return results
    except Exception as e:
        raise ValueError(f"批量坐标转换失败: {e}")


def transform_file_coordinates(
    file_path: str, 
    source_crs: str, 
    target_crs: str
) -> List[List[float]]:
    """文件坐标转换"""
    try:
        # 读取文件
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.csv':
            df = pd.read_csv(file_path, header=None)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path, header=None)
        elif file_ext == '.txt':
            df = pd.read_csv(file_path, header=None, delimiter=None, engine='python')
        else:
            raise ValueError(f"不支持的文件格式: {file_ext}")
        
        # 提取坐标
        coordinates = []
        for _, row in df.iterrows():
            if len(row) >= 2:
                x = float(row.iloc[0])
                y = float(row.iloc[1])
                if not (pd.isna(x) or pd.isna(y)):
                    coordinates.append([x, y])
        
        # 批量转换坐标
        return transform_batch_coordinates(coordinates, source_crs, target_crs)
    except Exception as e:
        raise ValueError(f"文件坐标转换失败: {e}")


def is_epsg_code_supported(epsg_code: str) -> bool:
    """检查EPSG代码是否支持"""
    try:
        # 检查是否是中国特有坐标系
        if epsg_code in china_coordinate_systems:
            return True
            
        # 检查是否是常用坐标系
        if epsg_code in common_coordinate_systems:
            return True
            
        # 尝试从pyproj创建CRS
        if epsg_code.startswith('EPSG:'):
            code = int(epsg_code.split(':')[1])
            CRS.from_epsg(code)
            return True
            
        return False
    except Exception:
        return False
