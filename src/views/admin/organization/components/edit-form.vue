<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="100px"
    style="max-width: 600px; margin: 0 auto"
  >
    <el-form-item label="名称:" prop="title">
      <el-input v-model="form.title" placeholder="请输入名称" :maxlength="20" clearable />
    </el-form-item>
    <el-form-item label="编码:" prop="code">
      <el-input v-model="form.code" placeholder="请输入编码" :maxlength="20" clearable />
    </el-form-item>
    <el-form-item label="联系人:" prop="name">
      <el-input v-model="form.name" placeholder="请输入联系人" :maxlength="20" clearable />
    </el-form-item>
    <el-form-item label="联系人:" prop="phone">
      <el-input v-model.trim="form.phone" placeholder="请输入联系人" :maxlength="11" clearable />
    </el-form-item>
    <el-form-item label="地址:" prop="address">
      <el-input v-model="form.address" placeholder="请输入地址" :maxlength="20" clearable />
    </el-form-item>
    <el-form-item label="组织类型:" prop="type">
      <el-select v-model="form.type" clearable class="ele-block" placeholder="请选择所属组织" :disabled="isUpdate">
        <el-option v-for="item in options.type" :key="item.val" :label="item.text" :value="item.val" />
      </el-select>
    </el-form-item>
    <el-form-item label="代理分公司:" prop="proxyCompany" :required="form.type === 4" v-if="form.type === 4" :show-message="false"	>
      <el-select v-model="form.proxyCompany" clearable class="ele-block" placeholder="请选择代理分公司" :disabled="isUpdate">
        <el-option v-for="item in options.subCompany" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="onClose">关闭</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { phoneReg } from 'ele-admin';
  import { addOrganization, alterOrganization, subCompany } from '@/api/admin/organization';
  import { removePageTab, reloadPageTab } from '@/utils/page-tab-util';

  export default {
    props: {
      // 修改回显的数据
      data: Object
    },
    data() {
      const defaultForm = {
        title:  '',
        code:  '',
        id: null,
        name:  '',
        phone:  '',
        address:  '',
        type:  '',
        proxyCompany: ''
      }
      return {
        defaultForm,
        defaultType: '',
        // 表单数据
        form: { ...defaultForm },
        options: {
          type: [
            { text: '平台', val: 1 },
            { text: '分公司', val: 2 },
            { text: '供应商', val: 3 },
            { text: '代理商', val: 4 }
          ],
          subCompany: []
        },
        // 表单验证规则
        rules: {
          title: { required: true, trigger: 'blur', message: '请输入组织名称' },
          code: { required: true, trigger: 'blur', message: '请输入组织编码' },
          name: { required: true, trigger: 'blur', message: '请输入联系人' },
          phone: { required: true, pattern: phoneReg, trigger: 'blur', message: '请输入联系电话' },
          address: { required: true, trigger: 'blur', message: '请输入组织地址' },
          type: { required: true, trigger: 'blur', message: '请输入请选择组织类型' }
        },
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false
      };
    },
    created() {
      this.getSubCompany()
    },
    methods: {
      /* 分公司列表 */
      async getSubCompany() {
        const res = await subCompany()
        this.options.subCompany = res
      },
      /* 保存编辑 */
      save() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          if(this.form.type === 4 && !this.form.proxyCompany) {
            this.$message.error('请输入代理分公司')
            return
          }
          this.loading = true;
          const saveOrUpdate = this.isUpdate ? alterOrganization : addOrganization;
          saveOrUpdate(this.form)
            .then((msg) => {
              this.loading = false;
              this.$message.success(msg);
              this.onDone();
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e.message);
            });
        });
      },
      /* 关闭当前页面并跳转到列表页面 */
      onClose() {
        removePageTab({ key: this.$route.path });
        this.$router.push('/admin/organization');
      },
      /* 关闭当前页面并刷新列表页面 */
      onDone() {
        removePageTab({ key: this.$route.path });
        reloadPageTab({ fullPath: '/admin/organization' });
      }
    },
    watch: {
      data: {
        handler(data) {
          if (data) {
            this.$util.assignObject(this.form, data);
            this.defaultType = data.type
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
            this.$refs.form?.clearValidate();
            this.form = { ...this.defaultForm };
          }
        },
        immediate: true
      }
    }
  };
</script>
