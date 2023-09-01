<template>
  <div class="ele-body">
    <search-form @search="onSearch" @expand-change="onExpandChange" />
    <el-card shadow="never">
      <!-- 高级表格 -->
      <ele-pro-table
        ref="table"
        row-key="userId"
        title="组织列表"
        :border="true"
        :stripe="true"
        tools-theme="default"
        :height="tableHeight"
        :full-height="tableFullHeight"
        :columns="columns"
        :datasource="datasource"
        :row-click-checked="false"
        :row-click-checked-intelligent="false"
        :paginationClass="null"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
        cache-key="listBasicTable"
      >
        <!-- 表头工具按钮 -->
        <template v-slot:toolkit>
          <div class="ele-space">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              class="ele-btn-icon"
              @click="openEdit()"
            >
              新增
            </el-button>
            <div class="list-tool-divider">
              <el-divider direction="vertical" />
            </div>
          </div>
        </template>
        <template v-slot:name="{ row }">
          <router-link :to="'/list/basic/details/' + row.userId"> {{ row.name }}</router-link>
        </template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false"  icon="el-icon-edit" @click.stop="openEdit(row)">修改</el-link>
          <el-popconfirm :title="`确定要删除当前电池类型吗？`" class="ele-action" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
        <!-- 用户名表头 -->
        <template v-slot:nicknameHeader="{ column }">
          <span :class="{ 'ele-text-primary': !!nicknameFilterValue }">
            {{ column.label }}
          </span>
        </template>
      </ele-pro-table>
    </el-card>
    <FormEdit :data="current" :visible.sync="showEdit" @done="reload" />
  </div>
</template>

<script>
  import { pageBatteryType } from '@/api/admin/battery-type'
  import SearchForm from './components/search-form.vue';
  import FormEdit from './components/form-edit.vue'

  export default {
    name: 'AdminAccount',
    components: { SearchForm, FormEdit },
    data() {
      return {
        // 搜索表单是否展开
        searchExpand: false,
         // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 表格搜索参数
        lastWhere: {}
      };
    },
    computed: {
      // 表格高度
      tableHeight() {
        return this.fixedHeight
          ? this.searchExpand
            ? 'calc(100vh - 544px)'
            : 'calc(100vh - 492px)'
          : void 0;
      },
      // 表格全屏时高度
      tableFullHeight() {
        return this.fixedHeight ? 'calc(100vh - 126px)' : null;
      },
      // 表格的列配置，使用国际化要用computed
      columns() {
        return [
          {
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'batteryType',
            label: this.$t('类型'),
            width: 140,
            align: 'center',
          },
          {
            prop: 'voltage',
            label: this.$t('电压（V）'),
            align: 'center',
            minWidth: 80
          },
          {
            prop: 'capacity',
            label: this.$t('容量（Ah）'),
            align: 'center',
            minWidth: 110,
          },
          {
            prop: 'prefix',
            label: this.$t('前缀'),
            align: 'center',
          },
          {
            prop: 'remark',
            label: this.$t('备注'),
            align: 'center',
            minWidth: 110,
            formatter: (row) => {
              return row.remark || '--'
            }
          },
          {
            prop: 'ctime',
            label: this.$t('创建时间'),
            minWidth: 90,
            align: 'center',
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue);
            }
          },
          {
            prop: 'utime',
            label: this.$t('最后修改时间'),
            minWidth: 90,
            align: 'center',
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue) || '--'
            }
          },
          {
            columnKey: 'action',
            label: this.$t('操作'),
            width: 240,
            align: 'center',
            resizable: false,
            slot: 'action',
            hideInSetting: true,
            fixed: 'right'
          }
        ];
      }
    },
    methods: {
      /* 表格数据源 */
      async datasource({ page, limit, where }) {
        return await pageBatteryType({ page, limit, ...where })
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where });
      },
      /* 清空选择 */
      clearChoose() {
        this.$refs.table.clearSelection();
      },
      /* 编辑 */
      openEdit(row) {
        this.current = row
        this.showEdit = true
      },
      /* 删除 */
      remove(row) {
        console.log(row);
        this.$message.info('点击了删除');
      },
      /* 搜索展开改变事件 */
      onExpandChange(value) {
        this.searchExpand = value;
      },
      /* 搜索事件 */
      onSearch(where) {
        this.lastWhere = where;
        this.doReload();
      },
      /* 表格搜索 */
      doReload() {
        this.reload(this.lastWhere);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-tool-item > span {
    vertical-align: middle;
    margin-right: 6px;
  }

  .list-tool-divider {
    padding: 0 12px;
  }
</style>
