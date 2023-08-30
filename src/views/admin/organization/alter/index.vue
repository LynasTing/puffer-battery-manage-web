<template>
  <div class="ele-body">
    <el-card shadow="never">
      <div v-loading="loading">
        <edit-form :data="organizationData" />
      </div>
    </el-card>
  </div>
</template>

<script>
  import EditForm from '../components/edit-form.vue';
  import { echoOrganization } from '@/api/admin/organization';

  export default {
    name: 'AccountEdit',
    components: { EditForm },
    data() {
      return {
        loading: true,
        organizationData: undefined
      };
    },
    created() {
      this.query();
    },
    methods: {
      query() {
        const { query } = this.$route;
        if (query.id) {
          echoOrganization({ id: query.id })
            .then((data) => {
              this.loading = false;
              this.organizationData = data;
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      }
    }
  };
</script>
