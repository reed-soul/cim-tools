from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CIM工具箱"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # API配置
    api_prefix: str = "/api"
    
    # 文件上传配置
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: list = [".csv", ".txt", ".xlsx", ".xls"]
    
    # CORS配置
    allowed_origins: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
