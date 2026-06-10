/** 文件/目录树节点（对应 back/config/util.ts IFile） */
export interface FileNode {
  title: string;
  key: string;
  type: 'directory' | 'file';
  parent: string;
  createTime: number;
  size?: number;
  children?: FileNode[];
}

/** 脚本/日志文件操作通用请求 */
export interface FilePathRequest {
  /** 文件相对路径 */
  path?: string;
  /** 文件名 */
  filename: string;
}
