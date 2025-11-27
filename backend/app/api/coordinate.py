from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Union
import pandas as pd
import os
import tempfile
import json

from app.core.config import settings
from app.services.coordinate import (
    transform_single_coordinate,
    transform_batch_coordinates,
    transform_file_coordinates,
    get_supported_coordinate_systems
)

router = APIRouter()


class CoordinateRequest(BaseModel):
    coordinate: List[float]
    sourceCrs: str
    targetCrs: str


class CoordinateResponse(BaseModel):
    success: bool
    result: Optional[List[float]] = None
    results: Optional[List[List[float]]] = None
    message: Optional[str] = None
    count: Optional[int] = None


class CoordinateSystemResponse(BaseModel):
    code: str
    name: str
    description: str


@router.get("/systems", response_model=List[CoordinateSystemResponse])
async def get_coordinate_systems():
    """获取支持的坐标系列表"""
    try:
        systems = get_supported_coordinate_systems()
        return systems
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transform/single", response_model=CoordinateResponse)
async def transform_single(request: CoordinateRequest):
    """单点坐标转换"""
    try:
        result = transform_single_coordinate(
            request.coordinate, 
            request.sourceCrs, 
            request.targetCrs
        )
        return CoordinateResponse(
            success=True,
            result=result
        )
    except Exception as e:
        return CoordinateResponse(
            success=False,
            message=str(e),
            result=None
        )


@router.post("/transform/batch", response_model=CoordinateResponse)
async def transform_batch(request: CoordinateRequest):
    """批量坐标转换"""
    try:
        results = transform_batch_coordinates(
            request.coordinate, 
            request.sourceCrs, 
            request.targetCrs
        )
        return CoordinateResponse(
            success=True,
            results=results,
            count=len(results)
        )
    except Exception as e:
        return CoordinateResponse(
            success=False,
            message=str(e),
            results=None
        )


@router.post("/transform/file", response_model=CoordinateResponse)
async def transform_file(
    file: UploadFile = File(...),
    sourceCrs: str = Form(...),
    targetCrs: str = Form(...)
):
    """文件上传转换"""
    try:
        # 检查文件大小
        if file.size > settings.max_file_size:
            return CoordinateResponse(
                success=False,
                message=f"文件大小超过限制({settings.max_file_size}字节)",
                result=None,
                results=None
            )
        
        # 检查文件扩展名
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.allowed_extensions:
            return CoordinateResponse(
                success=False,
                message=f"不支持的文件格式: {file_ext}",
                result=None,
                results=None
            )
        
        # 保存上传的文件到临时目录
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # 转换坐标
        results = transform_file_coordinates(
            temp_file_path, 
            sourceCrs, 
            targetCrs
        )
        
        # 删除临时文件
        os.unlink(temp_file_path)
        
        return CoordinateResponse(
            success=True,
            results=results,
            count=len(results)
        )
    except Exception as e:
        return CoordinateResponse(
            success=False,
            message=str(e),
            result=None,
            results=None
        )
