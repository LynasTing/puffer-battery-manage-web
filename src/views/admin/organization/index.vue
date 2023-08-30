<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
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
        <template v-slot:status="{ row }">
          <ele-dot :ripple="row.status === 0" :type="[null, 'danger'][row.status]" :text="['正常', '冻结'][row.status]" />
        </template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false"  icon="el-icon-edit"  @click.stop="openEdit(row)">修改</el-link>
          <el-popconfirm :title="`确定要${row.status ? '冻结' : '启用'}当前组织吗？`" class="ele-action" @confirm="enableDisable(row)">
            <template v-slot:reference>
              <el-link 
                :type="row.status ? 'warning' : 'success'" 
                :underline="false"
                :icon="row.status ? 'el-icon-open' : 'el-icon-turn-off'"
              >
              {{ row.status ? '冻结' : '启用' }}
            </el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定要删除当前组织吗？" class="ele-action" @confirm="remove(row)">
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
  </div>
</template>

<script>
  import { pageOrganization, deleteOrganization, enableOrganization } from '@/api/admin/organization'
  import SearchForm from './components/search-form.vue';
  import { removePageTab } from '@/utils/page-tab-util';

  export default {
    name: 'AdminAccount',
    components: { SearchForm },
    data() {
      return {
        // 搜索表单是否展开
        searchExpand: false,
        // 表格搜索参数
        lastWhere: {}
      };
    },
    computed: {
      // 表格高度
      tableHeight() {
        return this.fixedHeight ? this.searchExpand ? 'calc(100vh - 544px)' : 'calc(100vh - 492px)' : void 0;
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
            prop: 'title',
            label: this.$t('名称'),
            width: 200,
            align: 'center'
          },
           {
            prop: 'code',
            label: this.$t('编码'),
            width: 200,
            align: 'center'
          },
          {
            prop: 'phone',
            label: this.$t('手机号'),
            width: 110,
            align: 'center'
          },
          {
            prop: 'status',
            label: this.$t('状态'),
            width: 110,
            slot: 'status',
            align: 'center'
          },
          {
            prop: 'typeText',
            label: this.$t('类型'),
            align: 'center'
          },
          {
            prop: 'ctime',
            label: this.$t('创建时间'),
            align: 'center',
            minWidth: 110,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue);
            }
          },
          {
            prop: 'utime',
            label: this.$t('最后修改时间'),
            minWidth: 110,
            align: 'center',
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue);
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
      /* 启用/禁用  */
      enableDisable(row) {
        enableOrganization({ id: row.id, status: row.status ? 0 : 1 })
          .then(res => {
            this.$message.success(res)
            this.reload()
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      /* 表格数据源 */
      async datasource({ page, limit, where }) {
        return await pageOrganization({ page, limit, ...where })
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
        const path = row ? '/admin/organization/alter' : '/admin/organization/add';
        removePageTab({ key: path });
        this.$nextTick(() => {
          this.$router.push({
            path,
            query: row ? { id: row.id } : undefined
          });
        });
      },
      /* 删除 */
      remove(row) {
        deleteOrganization({ id: row.id })
          .then(res => {
            this.$message.success(res)
            this.reload()
          })
          .catch(err => this.$message.error(err))
      },
      /* 搜索展开改变事件 */
      onExpandChange(value) {
        this.searchExpand = value;
      },
      /* 销毁表格 */
      destroyTable() {
        this.$refs.table.reRenderTable();
      },
      /* 搜索事件 */
      onSearch(where) {
        this.lastWhere = where;
        this.doReload();
      },
      /* 表格搜索 */
      doReload() {
        this.reload({ ...this.lastWhere });
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
