import CryptoJS from "crypto-js"
import { Message } from "element-ui"

/**
 * 文件转base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}


/**
 * 文件上传工具
 * @params file 上传的文件
 * @params name 文件名
 * @params path 文件上传路径
 */
export const encryptionUpload = async (file, name, path) => {
  const sourceFile = file.target.files[0]
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 4 * 1024 * 1024
  // 检查文件类型
  if (!allowedTypes.includes(sourceFile.type)) {
    Message.error('只允许上传 JPG 或 PNG 图片文件')
    return
  }
  // 检查文件大小
  if (sourceFile.size > maxSize) {
    Message.error('文件大小不能超过 4MB')
    return
  }
  const nonce = new Date().getTime()
  var md5Params = 'fmidw3mcdts32' + nonce + '74f918afb66fad4f9f663abe8a1f4081'
  const params = {
    fileStr: await fileToBase64(sourceFile),
    fileName: name,
    filePath:  path || '/assets/battery',
    sign: CryptoJS.MD5(md5Params).toString(),
    appId: 'fmidw3mcdts32',
    nonce
  }
  return new Promise((resolve, reject) => {
    fetch('http://img.hthuandian.cn/fm/ng/imgJsonUpload', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
      .then(response => response.json())
      .then(res => {
        resolve(res.data.url)
      })
      .catch(err => {
        reject(false)
        console.log(`err + ::>>`, err)
      })
  })
}