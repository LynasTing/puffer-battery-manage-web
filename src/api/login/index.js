import request from '@/utils/request';
import { setToken } from '@/utils/token-util';

/**
 * 登录
 */
export async function login(data) {
  const res = await request.post('/login', data);
  if (res.data.code === 0) {
    setToken(res.data.data.token, false); 
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

