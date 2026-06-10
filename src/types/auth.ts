/** 认证 Token 数据 */
export interface AuthToken {
  /** Bearer Token 值 */
  token: string;
  /** Token 类型，固定为 Bearer */
  token_type: 'Bearer';
  /** 过期时间（Unix 秒级时间戳），默认 30 天 */
  expiration: number;
}

/** GET /open/auth/token 查询参数 */
export interface AuthTokenQuery {
  client_id: string;
  client_secret: string;
}
