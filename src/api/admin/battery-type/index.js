import request from '@/utils/request';

/**
 * 查询电池类型
 */
export async function pageBatteryType(data) {
  const res = await request.post('/admin/batteryType/list', data)
  if(res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 新增电池类型
 */
export async function addBatteryType(data) {
  const res = await request.post('/admin/batteryType/add', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 修改电池类型
 */
export async function alterBatteryType(data) {
  const res = await request.post('/admin/batteryType/alter', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 修改电池回显
 */
export async function echoBatteryType(data) {
  const res = await request.post('/admin/batteryType/alterEcho', data)
  if(res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}