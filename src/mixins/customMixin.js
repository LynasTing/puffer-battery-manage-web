export default {
  data() {
    return {
      where: {
        startTime: '',
        endTime: ''
      },
      /* el-date-picker 绑定变量 */
      timeFrame: [],
      // el-date-picker 扩展选项
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  methods: {
    /* el-date-picker 日期选择回调 */
    dateChangePicker(e) {
      if(e === null) {
        this.where.startTime = ''
        this.where.endTime = ''
      }else {
        this.where.startTime = e[0]
        this.where.endTime = e[1]
      }
    }
  }
}