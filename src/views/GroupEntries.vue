<template>
  <div class="group_entries">

    <h1 v-if="users_loading">
      <loader>Loading</loader>
    </h1>

    <template v-else>

      <h1 v-if="group_loading">
        <Loader>Loading group info</loader>
      </h1>

      <h1 v-else-if="group">{{group.properties.name}}の予定</h1>
      <h1 v-else>グループ{{group_id}}の予定</h1>

      <p><button @click="excel_export()">エクセルにエクスポート</button> </p>


      <div
        class="user_calendar_wrapper"
        v-for="user in users"
        :key="user.identity.low" >

        <!-- top: user and total -->
        <div class="user_wrapper">
          <User :user="user" />
          <span class="spacer" />
          <Total :entries="user.entries" />
        </div>

        <!-- bottom: calendar view -->
        <Calendar :entries="user.entries"/>

      </div>

      <ExcelExportTable :users="users" />


    </template>

  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import User from '@/components/User.vue'
import Total from '@/components/Total.vue'
import ExcelExportTable from '@/components/ExcelExportTable.vue'
import XLSX from 'xlsx'

export default {
  name: 'GroupEntries',
  components: {
    Calendar,
    User,
    Total,
    ExcelExportTable
  },
  data() {
    return {
      users: [],
      users_loading: false,
      group: null,
      group_loading: false,
      loading: false,
    }
  },
  mounted(){
    this.get_entries()
    this.get_group()
  },
  methods: {
    get_entries(){
      this.users_loading = true
      const url = `${process.env.VUE_APP_API_URL}/groups/${this.group_id}/entries`
      this.axios.get(url)
      .then(response => {
        this.users = []
        response.data.forEach((record) => {
          const user = record._fields[record._fieldLookup.user]
          this.users.push(user)
        })

      })
      .catch(error => { console.error(error) })
      .finally( () => { this.users_loading = false })
    },
    get_group(){
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios.get(url)
      .then(response => {
        this.group = response.data
      })
      .catch(error => {
        if(error.response) console.error(error.response.data)
        else console.error(error)
      })
    },
    excel_export(){
      var workbook = XLSX.utils.book_new()
      var ws1 = XLSX.utils.table_to_sheet(document.getElementById('export_table'))
      XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1")
      XLSX.writeFile(workbook, 'export.xlsx')

      //alert(`エクセルはそのためではありません。正しいツール使わない人たちが他の社員に迷惑かけます。ITリテラシーを直してください。`)

    },
  },
  computed: {
    group_id(){
      return this.$route.params.id
    }
  }
}
</script>

<style scoped>


.user_calendar_wrapper {
  //border: 1px solid #dddddd;
  //border-radius: 0.5em;
  margin: 1em 0;
  //padding: 1em;
  padding: 1em 0;
}



.user_calendar_wrapper:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}


.user_calendar_wrapper > .user_wrapper {
  display: flex;
  align-items: center;
  flex-basis: 150px;
  flex-grow: 1;
  flex-shrink: 0;

  text-align: left;

  padding: 0.25em;

}

.spacer {
  flex-grow: 1;
}

.user_calendar_wrapper > .calendar{
  margin-top: 0.5em;
  flex-grow: 1;
}
</style>
