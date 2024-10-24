<!--10/23メモ
webページが表示されなくなったため終了。検証でコンソールを確認するとunitcounter.vueにエラーがあるとしか出なかったが、
そのエラーは1時間前ぐらいからあったので、急に表示されなくなったのにはこのファイルも関係しているかもしてない。
日付入力機能を実装するためにVDataInputをインポート・コンポーネントしたら表示されなくなった(エラーには出てこない)。
・やったこと
カレンダー/タスク表示の切り替え(タスク画面はできていない)、月/週表示の切り替え、土日非表示、新規タスクのダイアログボタン
・次回
新規タスクを追加する機能
-->
<template>
  <div>
    <div>
      <v-row>
        <!--学年を選択するプルダウン-->
        <v-col cols="4">
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
        <v-col  cols="4">
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
              <v-btn color="primary" v-bind="props">
                <!-- calender_or_task:0でカレンダー表示、1でタスク表示 -->
                <div v-if="calender_or_task === '0'">カレンダー</div>
                <div v-else-if="calender_or_task === '1'">タスク　</div>
              </v-btn>
            </template>
            <v-list @click:select="click_calender_or_task">
              <v-list-item key="0" value="0">
                <v-list-item-title>カレンダー</v-list-item-title>
              </v-list-item>
              <v-list-item key="1" value="1">
                <v-list-item-title>タスク　</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <!-- 月/週切り替え -->
        <v-col>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props">
                <!-- month_or_week:0で月表示、1で週表示 -->
                <div v-if="month_or_week === '0'">月で表示</div>
                <div v-else-if="month_or_week === '1'">週で表示</div>
              </v-btn>
            </template>
            <v-list @click:select="click_month_or_week">
              <v-list-item key="0" value="0">
                <v-list-item-title>月で表示</v-list-item-title>
              </v-list-item>
              <v-list-item key="1" value="1">
                <v-list-item-title>週で表示</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <!-- 土日表示の切り替え -->
        <v-col>
          <v-switch
            v-model="dispweekend"
            label="土日も表示"
            color="blue"
            inset
          ></v-switch>
        </v-col>
        <!-- タスク追加ボタン -->
        <v-col>
          <v-btn color="green" size="large" @click="dialog = true">タスクの追加</v-btn>
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">新しいタスク</span>
              </v-card-title>
              <v-container>
                <v-text-field label="名前"></v-text-field>
                <!--v-date-input label="日付"></v-date-input-->
              </v-container>
              <v-card-text>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </div>

    <!-- カレンダーの表示 -->
    <div v-if="calender_or_task === '0'">
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekdays"
          :events="events"
          :view-mode="disptype"
        ></v-calendar>
      </v-sheet>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue';
import { VCalendar } from 'vuetify/labs/VCalendar';
//import { VDateInput } from 'vuetify/labs/VDateInput';

export default{
  name: 'App',

  components: {
    Footer,
    VCalendar,
    //VDateInput,
  },

  data() {
    return {
      grade: ['1年'],
      gradelist: ['1年', '2年', '3年', '4年', '5年'],
      course: ['M'],
      courselist: ['M', 'E', 'D', 'J', 'C'],
      calender_or_task: '0',
      month_or_week: '0',
      dispweekend: false,
      value: [new Date()],
      dialog: false,
      events: [ // 仮のイベントデータを追加
        { name: 'イベント1', start: new Date('2024-10-21'), end: new Date('2024-10-21'), color: 'blue' },
        { name: 'イベント2', start: new Date('2024-10-21'), end: new Date('2024-10-21'), color: 'green' }
      ]
    };
  },

  computed: {
    //月表示/週表示の切り替え
    disptype(){
      if(this.month_or_week == '0'){
        return 'month';
      }
      else{
        return 'week'
      }
    },
    //土日表示の切り替え
    weekdays(){
      if(this.dispweekend == true){
        return [0, 1, 2, 3, 4, 5, 6];
      }
      else{
        return [1, 2, 3, 4, 5];
      }
    }
  },

  methods: {
    //カレンダー/タスク切り替えボタンの制御
    click_calender_or_task(event){
      this.calender_or_task = event.id;
    },
    //月/週切り替えボタンの制御
    click_month_or_week(event){
      this.month_or_week = event.id;
    }
  }
}
</script>


<style scoped>

</style>