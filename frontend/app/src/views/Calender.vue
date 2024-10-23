<template>
  <div>
    <v-sheet
      class="d-flex"
      height="54"
      tile
    >
    <v-row>
      <!--学年を選択するプルダウン-->
      <v-col>
        <v-select
          v-model="grade"
          :items="gradelist"
          class="ma-2"
          label="学年"
          variant="outlined"
          dense
          hide-details
        ></v-select>
      </v-col>
      <!--学科を選択するプルダウン-->
      <v-col>
        <v-select
          v-model="course"
          :items="courselist"
          class="ma-2"
          label="学科"
          variant="outlined"
          dense
          hide-details
        ></v-select>
      </v-col>
      <!-- カレンダー/タスク切り替え -->
      <v-col>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
            >
            カレンダー
            </v-btn>
          </template>
          <v-list @click:select="clickItem">
            <v-list-item key="1" value="1">
              <v-list-item-title>カレンダー</v-list-item-title>
            </v-list-item>
            <v-list-item key="2" value="2">
              <v-list-item-title>タスク</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <!-- 月/週切り替え -->
      <v-col>
        <v-switch
          v-model="month_or_week"
          label="週"
        ></v-switch>
      </v-col>
      <!-- 土日表示の切り替え -->
      <v-col>
        <v-switch
          v-model="dispweekend"
          label="週"
        ></v-switch>
      </v-col>
    </v-row>
    </v-sheet>

  <v-sheet
    height="50%"
    width="100%">
    <v-calendar
      ref="calendar"
      v-model="value"
      :weekdays="weekdays"
      :events="events"
      :view-mode="month"
    ></v-calendar>
  </v-sheet>
  <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue';
import { VCalendar } from 'vuetify/labs/VCalendar';

export default{
  name: 'App',

  components: {
    Footer,
    VCalendar,
  },

  data() {
    return {
      selected: '',
      grade: ['1年'],
      gradelist: ['1年', '2年', '3年', '4年', '5年'],
      course: ['M'],
      courselist: ['M', 'E', 'D', 'J', 'C'],
      calender_or_task: false,
      month_or_week: false,
      dispweekend: false,
      value: [new Date()],
      weekdays: [0, 1, 2, 3, 4, 5, 6], // 月曜から日曜に設定
      events: [ // 仮のイベントデータを追加
        { name: 'イベント1', start: new Date('2024-10-21'), end: new Date('2024-10-21'), color: 'blue' },
        { name: 'イベント2', start: new Date('2024-10-21'), end: new Date('2024-10-21'), color: 'green' }
      ]
    };
  },

  methods: {
    clickItem(event){
      this.selected = event.id;
    }
  }
}
</script>


<style scoped>

</style>