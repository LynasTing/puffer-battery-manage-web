<template>
  <ele-modal
    width="460px"
    :visible="visible"
    :close-on-click-modal="true"
    :title="isUpdate ? '修改电池类型' : '添加电池类型'"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-form-item label="电池类型:" prop="batteryType">
        <el-input v-model="form.batteryType" placeholder="请输入电池类型" :maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="电压:" prop="voltage">
        <el-input v-model="form.voltage" placeholder="请输入电压（正整数）" :maxlength="5" clearable />
      </el-form-item>
      <el-form-item label="容量:" prop="capacity">
        <el-input v-model="form.capacity" placeholder="请输入容量（正整数）" :maxlength="5" clearable />
      </el-form-item>
      <el-form-item label="前缀:" prop="prefix">
        <el-input v-model="form.prefix" placeholder="请输入前缀" :maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" :maxlength="20" clearable />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading">保存</el-button>
    </template>
  </ele-modal>
</template>

<script>
  import { addBatteryType, alterBatteryType } from '@/api/admin/battery-type';
  import { positiveIntegerReg } from 'ele-admin'
  export default {
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object
    },
    data() {
      const defaultForm = {
        id: null,
        voltage: '',
        batteryType: '',
        capacity: '',
        prefix: '',
        remark: '',
      };
      return {
        defaultForm,
        // 表单数据
        form: { ...defaultForm },
        // 表单验证规则
        rules: {
          voltage: { required: true, trigger: 'blur', pattern: positiveIntegerReg, message: '请输入电压（正整数）' },
          batteryType: { required: true, trigger: 'blur', message: '请输入电池类型名称' },
          capacity: { required: true, trigger: 'blur', pattern: positiveIntegerReg, message: '请输入容量（正整数）' },
          prefix: { required: true, trigger: 'blur', message: '请输入前缀' },
          remark: { required: false, trigger: 'blur', message: '请输入备注' },
        },
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false
      };
    },
    methods: {
      /* 保存编辑 */
      save() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          const saveOrUpdate = this.isUpdate ? alterBatteryType : addBatteryType;
          saveOrUpdate(this.form)
            .then(msg => {
              this.loading = false;
              this.$message.success(msg);
              this.updateVisible(false);
              this.$emit('done');
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err);
            });
        });
      },
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      }
    },
    watch: {
      visible(visible) {
        if (visible) {
          if (this.data) {
            this.$util.assignObject(this.form, this.data);
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
          }
        } else {
          this.$refs.form.clearValidate();
          this.form = { ...this.defaultForm };
        }
      }
    }
  };
</script>
