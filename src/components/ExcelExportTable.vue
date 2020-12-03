<template>
  <table id="export_table">

    <tr>
      <th>No</th>
      <th>名前</th>
      <th>Type</th>
      <th>Previous year</th>

      <template v-for="month in 12">

        <th :key="`table_month_header_${month}`">
          {{month}}月
        </th>

        <th
          v-if="month === 5 || month === 8"
          :key="`5_days_taken_${month}_header`">
          5日以上
        </th>


      </template>


    </tr>
    <template v-for="(user, user_index) in users">
      <tr :key="`user_${user_index}_yotei`">
        <!-- INDEX -->
        <td rowspan="3">{{user_index +1}}</td>
        <!-- User name -->
        <td rowspan="3">{{user.properties.display_name}}</td>

        <!-- User rank -->
        <td rowspan="3"></td>

        <!-- Previous year -->
        <td rowspan="3"></td>

        <template v-for="month in 12">
          <td v-bind:key="`user_${user_index}_yotei_${month}`">
            {{
              entries_of_month(user, month)
              .filter(entry => {return entry.taken})
              .map(day_of_entry).join(', ')
            }}
          </td>
          <td
            v-if="month === 5 || month === 8"
            rowspan="3"
            :key="`user_${user_index}_5_days_taken_${month}`">
            N/A
          </td>
        </template>


      </tr>

      <tr :key="`user_${user_index}_taken`">
        <!-- First item: user name -->

        <template v-for="month in 12">
          <td
            :key="`user_${user_index}_taken_${month}`">
            {{entries_of_month(user, month).map(day_of_entry).join(', ')}}
          </td>



        </template>

      </tr>

      <tr :key="`user_${user_index}_bottom`">

        <template v-for="month in 12">
          <td :key="`user_${user_index}_bottom_${month}`">
            <!-- The originaql calendar has a progress bar here -->
          </td>
        </template>

      </tr>

    </template>

  </table>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ExcelExportTable',
  props: {
    users: Array
  },
  methods: {

    entries_of_month(user, month){
      return user.entries.filter(entry => {
        return new Date(entry.date).getMonth() + 1 === month
      })
    },
    day_of_entry(entry){
      let output = new Date(entry.date).getDate()
      if(entry.am && !entry.pm) output = `${output}AM`
      else if(!entry.am && entry.pm) output = `${output}PM`
      return output
    },
  },

}
</script>

<style scoped>
table {
  display: none;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  border: 1px solid black;
}
</style>
