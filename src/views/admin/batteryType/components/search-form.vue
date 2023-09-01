<template>
  <el-card shadow="never" body-style="padding: 22px 22px 7px 22px;">
    <!-- 搜索表单 -->
    <el-form
      label-width="80px"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
          <el-form-item label="电压:">
            <el-input v-model="where.voltage" placeholder="请输入电压" clearable />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
          <el-form-item label="容量:">
            <el-input v-model="where.capacity" placeholder="请输入容量" clearable />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
          <el-form-item label="前缀:">
            <el-input v-model="where.prefix" placeholder="请输入前缀" clearable />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 8 }">
          <el-form-item label="时间:">
            <el-date-picker
              v-model="timeFrame"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="dateChangePicker"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
          <div class="ele-form-actions ele-text-right">
            <el-button
              type="primary"
              icon="el-icon-search"
              class="ele-btn-icon"
              @click="search"
            >
              查询
            </el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
  import customMixin from '@/mixins/customMixin'
  export default {
    mixins: [customMixin],
    data() {
      // 默认表单数据
      const defaultWhere = {
        voltage: '',
        capacity: '',
        prefix: ''
      };
      return {
        defaultWhere,
        // 表单数据
        where: { ...defaultWhere },
        // 搜索表单是否展开
        searchExpand: false
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /* 重置搜索 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.timeFrame = [],
        this.search();
      },
      /* 搜索展开/收起 */
      toggleExpand() {
        this.searchExpand = !this.searchExpand;
        this.$emit('expand-change', this.searchExpand);
      }
    }
  };
</script>
