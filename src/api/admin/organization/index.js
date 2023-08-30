import request from '@/utils/request';

/**
 * 组织查询
 */
export async function pageOrganization(data) {
  const res = await request.post('/admin/organization/list', data)
  if(res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 组织新增
 */
export async function addOrganization(data) {
  const res = await request.post('/admin/organization/add', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 组织修改
 */
export async function alterOrganization(data) {
  const res = await request.post('/admin/organization/alter', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 组织删除
 */
export async function deleteOrganization(data) {
  const res = await request.post('/admin/organization/delete', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 组织禁用/启用
 */
export async function enableOrganization(data) {
  const res = await request.post('/admin/organization/enable', data)
  if(res.data.code === 0) {
    return res.data.msg;
  }
  return Promise.reject(res.data.msg);
}

/**
 * 组织修改回显
 */
export async function echoOrganization(data) {
  const res = await request.post('/admin/organization/alterEcho', data)
  if(res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 分公司查询
 */
export async function subCompany(data) {
  const res = await request.post('/admin/organization/company/list', data)
  if(res.data.code === 0 && res.data.datas) {
    return res.data.datas;
  }
  return Promise.reject(res.data.msg);
}