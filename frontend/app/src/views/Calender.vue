<template>
  <div>
    <!--ページ上部-->
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
                <!-- calendar_or_task:0でカレンダー表示、1でタスク表示 -->
                <div v-if="calendar_or_task === '0'">カレンダー</div>
                <div v-else-if="calendar_or_task === '1'">タスク  </div>
              </v-btn>
            </template>
            <v-list @click:select="click_calendar_or_task">
              <v-list-item key="0" value="0">
                <v-list-item-title>カレンダー</v-list-item-title>
              </v-list-item>
              <v-list-item key="1" value="1">
                <v-list-item-title>タスク</v-list-item-title>
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
          {{ taskTimeError }}
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
                <v-card-text>
                  <!-- タスク名入力 -->
                  タスク名
                  <v-text-field label="タスク名"></v-text-field>
                  <!-- タスク日時入力 -->
                  <div>
                    開始日時
                    <v-row>
                      <v-col>
                        <v-date-input 
                          v-model="task_date_start_value" 
                          label="日付"
                          @change="checkInvalidTime"
                        ></v-date-input>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="task_time_start_value"
                          :active="task_time_start_menu"
                          @focus="task_time_start_menu = true"
                          @blur="task_time_start_menu = false"
                          label="時刻"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                        >
                          <v-menu
                            v-model="task_time_start_menu"
                            :close-on-content-click="false"
                            activator="parent"
                            transition="scale-transition"
                          >
                            <v-time-picker
                              v-if="task_time_start_menu"
                              v-model="task_time_start_value"
                              format="24hr"
                              @change="checkInvalidTime"
                              full-width
                            ></v-time-picker>
                          </v-menu>
                        </v-text-field>
                      </v-col> 
                    </v-row>
                  </div>
                  <div>
                    終了日時
                    <v-row>
                      <v-col>
                        <v-date-input 
                          v-model="task_date_end_value" 
                          label="日付"
                          @change="checkInvalidTime"  
                        ></v-date-input>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="task_time_end_value"
                          :active="task_time_end_menu"
                          @focus="task_time_end_menu = true"
                          @blur="task_time_end_menu = false"
                          label="時刻"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                        >
                          <v-menu
                              v-model="task_time_end_menu"
                              :close-on-content-click="false"
                              activator="parent"
                              transition="scale-transition"
                            >
                              <v-time-picker
                                v-if="task_time_end_menu"
                                v-model="task_time_end_value"
                                format="24hr"
                                @change="checkInvalidTime"
                                full-width
                              ></v-time-picker>
                          </v-menu>
                        </v-text-field>
                      </v-col> 
                    </v-row>
                  </div>
                  <!-- エラーメッセージ -->
                  <v-alert v-if="taskTimeError" type="error">
                    {{ taskTimeError }}
                  </v-alert>
                </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
                <v-btn color="primary" @click="dialog = false">追加</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </div>

    <!--ページ中部-->
    <!-- カレンダーの表示 週表示-->
    <div v-if="calendar_or_task === '0'">
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekdays"
          :events="tasks"
          :view-mode="disptype"
        ></v-calendar>
      </v-sheet>
    </div>
    <!--タスクの表示-->
    <div v-if="calendar_or_task === '1'"> 
      <h1>{{ disp_year }}年{{ disp_month }}月</h1> 
      <div v-if="Object.keys(filteredTasksByMonth).length === 0">
        <p>今月の予定はありません。</p>
      </div>
      <div v-for="(tasks, date) in filteredTasksByMonth" :key="date">
        <ul> 
          <li v-for="task in tasks" :key="task.name"> 
            {{ formatDate(task.start) }} {{ formatTime(task.start) }} - {{ formatTime(task.end) }} : {{ task.name }} 
          </li> 
        </ul> 
        <v-divider></v-divider> 
      </div> 
      <v-btn @click="prevMonth"><</v-btn> 
      <v-btn @click="nextMonth">></v-btn> 
    </div>
    <!--ページ下部-->
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue';
import { VCalendar } from 'vuetify/labs/VCalendar';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default{
  name: 'App',

  components: {
    Footer,
    VCalendar,
    VDateInput,
    VTimePicker,
  },

  data() {
    return {
      //表示切り替え機能のデータ
      calendar_or_task: '0',
      month_or_week: '0',
      dispweekend: false,
      //タスク関連のデータ
      taskTimeError: "era--",
      dialog: false,
      task_time_start_menu: false,
      task_time_end_menu: false,
      task_time_start_value: null,
      task_time_end_value: null,
      task_date_start_value: null,
      task_date_end_value: null,
      tasks: [
        { name: 'イベント1', start: new Date('2024-10-21T18:00'), end: new Date('2024-10-21T21:00'), color: 'blue' },
        { name: 'イベント2', start: new Date('2024-10-21T21:00'), end: new Date('2024-10-21T23:59'), color: 'green' },
        { name: 'イベント3', start: new Date('2024-11-21T18:00'), end: new Date('2024-11-21T21:00'), color: 'blue' },
        { name: 'イベント4', start: new Date('2025-01-01T18:00'), end: new Date('2024-01-01T21:00'), color: 'blue' }
      ],
      //カレンダー機能のデータ
      grade: ['1年'],
      gradelist: ['1年', '2年', '3年', '4年', '5年'],
      course: ['M'],
      courselist: ['M', 'E', 'D', 'J', 'C'],
      value: [new Date()],
      //タスク表示機能のデータ
      disp_year: new Date().getFullYear(), 
      disp_month: new Date().getMonth() + 1,
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
    },
    //タスクを日付と時間順にソート
    sortedTasks() {
      return this.tasks.slice().sort((a, b) => a.start - b.start);
    },
    //タスクを日と月ごとに分類(二次元配列)
    tasksByMonth() {
    const tasksByMonth = {};
      this.sortedTasks.forEach(task => {
        const month = task.start.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
        const date = task.start.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        if (!tasksByMonth[month]) {
          tasksByMonth[month] = {};
        }
        if (!tasksByMonth[month][date]) {
          tasksByMonth[month][date] = [];
        }
        tasksByMonth[month][date].push(task);
      });
      return tasksByMonth;
    },
    // 表示中の年と月のタスクのみをフィルタリング
    filteredTasksByMonth() {
      const monthKey = `${this.disp_year}年${this.disp_month}月`;
      return this.tasksByMonth[monthKey] || {};
    }
  },

  methods: {
    checkInvalidTime() {
  console.log('checkInvalidTime called');
  console.log('Start Date:', this.task_date_start_value);
  console.log('Start Time:', this.task_time_start_value);
  console.log('End Date:', this.task_date_end_value);
  console.log('End Time:', this.task_time_end_value);

  // ここでのstartDateとstartTimeはどちらもundefinedでないことを確認
  if (this.task_date_start_value && this.task_time_start_value && 
      this.task_date_end_value && this.task_time_end_value) {
    
    const start = new Date(`${this.task_date_start_value}T${this.task_time_start_value}`);
    const end = new Date(`${this.task_date_end_value}T${this.task_time_end_value}`);

    if (end < start) {
      this.taskTimeError = "終了日時は開始日時よりも後でなければなりません。";
    } else {
      this.taskTimeError = null; // エラーがなければクリア
    }
  } else {
    console.log('日時が不完全です');
  }
},
    //カレンダー/タスク切り替えボタンの制御
    click_calendar_or_task(event){
      this.calendar_or_task = event.id;
    },
    //月/週切り替えボタンの制御
    click_month_or_week(event){
      this.month_or_week = event.id;
    },
    //年,月日,時間をフォーマット(例: 2024/10/23, 9:00:00 AM)
    formatDate(date) {
      return date.toLocaleString();
    },
    //月日フォーマット
    formatDate(date) {
      return date.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
    },
    //時間フォーマット
    formatTime(date) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    },
    //前月へ
    prevMonth() {
      if (this.disp_month === 1) {
        this.disp_month = 12;
        this.disp_year -= 1;
      } else {
        this.disp_month -= 1;
      }
    },
    //次月へ
    nextMonth() {
      if (this.disp_month === 12) {
        this.disp_month = 1;
        this.disp_year += 1;
      } else {
        this.disp_month += 1;
      }
    }
  }
};
</script>


<style scoped>

</style>