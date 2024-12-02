<template>
  <div>
    <!--ページ上部-->
    <div>
      <v-row>
        <!-- テスト -->
        <v-col>
          <v-btn @click="makeLog(this.calApi.getEventSourceById( 'myTask' ))">
            テスト
          </v-btn>  
        </v-col>
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
            @update:modelValue="changeTasks()"
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
            @update:modelValue="changeTasks()"
          ></v-select>
        </v-col>
        <!-- カレンダー/タスク切り替え -->
        <v-col>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" class="mt-4">
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
              <v-btn color="primary" v-bind="props" class="mt-4">
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
            class="mt-2"
          ></v-switch>
        </v-col>
        <!-- 自分のタスク表示の切り替え -->
        <v-col>
          <v-switch
            v-model="dispMyTasks"
            label="自分のタスク"
            color="blue"
            inset
            class="mt-2"
          ></v-switch>
        </v-col>
        <!-- タスク追加ボタン -->
        <v-col>
          <v-btn color="green" size="large" @click="addTaskDialog = true" class="mt-3">タスクの追加</v-btn>
          <v-dialog v-model="addTaskDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">新しいタスク</span>
              </v-card-title>
                <v-card-text>
                  <!-- タスク名入力 -->
                  タスク名
                  <v-text-field v-model="taskName" label="タスク名"></v-text-field>
                  <!-- タスク日時入力 -->
                  <div>
                    開始日時
                    <v-row>
                      <v-col>
                        <v-date-input 
                          v-model="taskDateStart" 
                          label="日付"
                        ></v-date-input>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="taskTimeStart"
                          :active="taskTimeStartMenu"
                          @focus="taskTimeStartMenu = true"
                          @blur="taskTimeStartMenu = false"
                          label="時刻"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                        >
                          <v-menu
                            v-model="taskTimeStartMenu"
                            :close-on-content-click="false"
                            activator="parent"
                            transition="scale-transition"
                          >
                            <v-time-picker
                              v-if="taskTimeStartMenu"
                              v-model="taskTimeStart"
                              format="24hr"
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
                          v-model="taskDateEnd" 
                          label="日付"
                        ></v-date-input>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="taskTimeEnd"
                          :active="taskTimeEndMenu"
                          @focus="taskTimeEndMenu = true"
                          @blur="taskTimeEndMenu = false"
                          label="時刻"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                        >
                          <v-menu
                              v-model="taskTimeEndMenu"
                              :close-on-content-click="false"
                              activator="parent"
                              transition="scale-transition"
                            >
                              <v-time-picker
                                v-if="taskTimeEndMenu"
                                v-model="taskTimeEnd"
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
                  <v-alert v-if="addTaskError" type="error">
                    {{ addTaskErrorMes }}
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="addTaskClose">閉じる</v-btn>
                  <v-btn color="primary" @click="oldAddTask">追加</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-col>
      </v-row>
    </div>

    <!--ページ中部-->
    <!-- カレンダーの表示 週表示-->
    <div v-if="calendar_or_task === '0'">
      <!--
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekdays"
          :events="tasks"
          :view-mode="disptype"
          @input="handleDateSelect"
        >
          <カレンダー上でタスク追加>
          <タスク詳細表示v-if="month_or_week === '0'">
          <template v-slot:event="{event,day}">
            <div>
              <v-btn :color="event.color" @click="showTaskDetail(event)">{{ event.name }}</v-btn>
              <v-dialog v-model="taskDetailDialog" max-width="600px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ taskDetail.name }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <p>開始 {{ formatDate(taskDetail.start) }} {{ formatTime(taskDetail.start) }}</p>
                      <p>終了 {{ formatDate(taskDetail.end) }}  {{ formatTime(taskDetail.end) }}</p>
                      <v-btn @click="makeLog(day)">確認用</v-btn>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="taskDetailDialog = false">閉じる</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>
        </v-calendar>
      </v-sheet>
    -->
      <!-- fullcalendar -->
      <div>
        <full-calendar ref="fullCalendar" :options="calendarOptions"/>
        <!-- タスク詳細表示 -->
        <v-dialog v-model="fullDetailDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ fullDetail.title }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <p>開始 {{ formatDate(fullDetail.start) }} {{ formatTime(fullDetail.start) }}</p>
                <p>終了 {{ formatDate(fullDetail.end) }} {{ formatTime(fullDetail.end)}}</p>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="fullDetailDialog = false">閉じる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 日付でタスク追加 -->
        <v-dialog v-model="fullAddDialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline"><h2>新規タスク</h2></span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-text-field 
                    v-model="newTask.title"
                    label="タスク名"
                    prepend-icon="mdi-pencil"
                  />
                </v-row>
                <v-row>
                  <v-col>
                    <v-date-input 
                      v-model="newTask.start" 
                      label="日付"
                      readonly
                    ></v-date-input>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newTaskTime.startValue"
                      :active="newTaskTime.startMenu"
                      :focus="newTaskTime.startMenu"
                      label="時刻"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-menu
                        v-model="newTaskTime.startMenu"
                        :close-on-content-click="false"
                        activator="parent"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-if="newTaskTime.startMenu"
                          v-model="newTaskTime.startValue"
                          format="24hr"
                          full-width
                        />
                      </v-menu>
                    </v-text-field>
                  </v-col>
                  <v-icon icon="mdi-chevron-right" size="x-large" color="grey-darken-1" class="mt-6"/>
                  <v-col>
                    <v-date-input 
                        v-model="newTask.end" 
                        label="日付"
                        readonly
                    ></v-date-input>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newTaskTime.endValue"
                      :active="newTaskTime.endMenu"
                      :focus="newTaskTime.endMenu"
                      label="時刻"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-menu
                        v-model="newTaskTime.endMenu"
                        :close-on-content-click="false"
                        activator="parent"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-if="newTaskTime.endMenu"
                          v-model="newTaskTime.endValue"
                          format="24hr"
                          full-width
                        />
                      </v-menu>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text-field 
                    v-model="newTask.extendedProps.location"
                    label="場所"
                    prepend-icon="mdi-map-marker"
                  />
                </v-row>
                <v-row>
                  <v-col>
                    <v-icon icon="mdi-account" size="x-large" color="grey-darken-1" class="mt-10"/>
                  </v-col>
                  <v-col>
                    <v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-2"/>
                    <p><v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-9"/></p>
                  </v-col>
                  <v-col>
                    <div v-if="newTask.extendedProps.grade[0] == true">
                      <v-btn color="primary" @click="newTask.extendedProps.grade[0] = false">1年</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.grade[0] = true">1年</v-btn>
                    </div>
                    <p class="mt-8">
                      <div v-if="newTask.extendedProps.course[0] == true">
                        <v-btn color="primary" @click="newTask.extendedProps.course[0] = false">M</v-btn>
                      </div>
                      <div v-else>
                        <v-btn @click="newTask.extendedProps.course[0] = true">M</v-btn>
                      </div>
                    </p>
                  </v-col>
                  <v-col>
                    <div v-if="newTask.extendedProps.grade[1] == true">
                      <v-btn color="primary" @click="newTask.extendedProps.grade[1] = false">2年</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.grade[1] = true">2年</v-btn>
                    </div>
                    <p class="mt-8">
                      <div v-if="newTask.extendedProps.course[1] == true">
                        <v-btn color="primary" @click="newTask.extendedProps.course[1] = false">E</v-btn>
                      </div>
                      <div v-else>
                        <v-btn @click="newTask.extendedProps.course[1] = true">E</v-btn>
                      </div>
                    </p>
                  </v-col>
                  <v-col>
                    <div v-if="newTask.extendedProps.grade[2] == true">
                      <v-btn color="primary" @click="newTask.extendedProps.grade[2] = false">3年</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.grade[2] = true">3年</v-btn>
                    </div>
                    <p class="mt-8">
                      <div v-if="newTask.extendedProps.course[2] == true">
                        <v-btn color="primary" @click="newTask.extendedProps.course[2] = false">D</v-btn>
                      </div>
                      <div v-else>
                        <v-btn @click="newTask.extendedProps.course[2] = true">D</v-btn>
                      </div>
                    </p>
                  </v-col>
                  <v-col>
                    <div v-if="newTask.extendedProps.grade[3] == true">
                      <v-btn color="primary" @click="newTask.extendedProps.grade[3] = false">4年</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.grade[3] = true">4年</v-btn>
                    </div>
                    <p class="mt-8">
                      <div v-if="newTask.extendedProps.course[3] == true">
                        <v-btn color="primary" @click="newTask.extendedProps.course[3] = false">J</v-btn>
                      </div>
                      <div v-else>
                        <v-btn @click="newTask.extendedProps.course[3] = true">J</v-btn>
                      </div>
                    </p>
                  </v-col>
                  <v-col>
                    <div v-if="newTask.extendedProps.grade[4] == true">
                      <v-btn color="primary" @click="newTask.extendedProps.grade[4] = false">5年</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.grade[4] = true">5年</v-btn>
                    </div>
                    <p class="mt-8">
                      <div v-if="newTask.extendedProps.course[4] == true">
                        <v-btn color="primary" @click="newTask.extendedProps.course[4] = false">C</v-btn>
                      </div>
                      <div v-else>
                        <v-btn @click="newTask.extendedProps.course[4] = true">C</v-btn>
                      </div>
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="fullAddDialog=false">閉じる</v-btn>
              <v-btn color="primary" @click="addTask">追加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>     
    </div>
    <!-- タスクの表示 --> 
    <div v-if="calendar_or_task === '1'" style="text-align: center;">
      <!--タスク一覧部分-->
      <div style="height: 600px; overflow-y: auto;">
        <h1>{{ disp_year }}年{{ disp_month }}月</h1>    
        <div v-if="Object.keys(filteredTasksByMonth).length === 0">   
          <p>今月の予定はありません。</p>   
        </div>   
        <div v-for="(tasks, date) in filteredTasksByMonth" :key="date" style="display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid #000000;">  
          <h3> {{ date }} </h3> 
          <ul style="width: 80%; padding: 8px; margin: 0; list-style: none; overflow-y: auto; max-height: 400px;  max-width:600px;">  
            <li   
              v-for="task in tasks"   
              :key="task.name"     
            > 
              <div style="display:flex;">
                <p style="margin-right:25px">{{ formatTime(task.start) }} - {{ formatTime(task.end) }}</p>
                <v-btn @click="showTaskDrtail(task)" :style="{ backgroundColor: task.color, padding: '8px', borderRadius: '4px', color: '#fff', alignItems: 'center', marginBottom: '8px' }"> {{ task.name }} </v-btn> 
              </div>
            </li>
          </ul>
          <v-divider style=""></v-divider>
        </div> 
      </div>
      <!--月送りボタン部分-->
      <div>
        <v-btn 
          depressed
          min-width="120"
          large
          color="primary" 
          @click="prevMonth"
          aria-label="Previous month"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>   
        <v-btn 
          depressed
          min-width="120"
          large
          color="primary"
          @click="nextMonth"
          aria-label="Next month"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn> 
      </div>
      <!-- タスク画面にタスク詳細ダイアログを追加 -->
      <v-dialog v-model="taskDetailDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ taskDetail.name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p>開始 {{ formatDate(taskDetail.start) }} {{ formatTime(taskDetail.start) }}</p>
              <p>終了 {{ formatDate(taskDetail.end) }} {{ formatTime(taskDetail.end) }}</p>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="taskDetailDialog = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ref } from 'vue';

export default{
  name: 'App',

  components: {
    Footer,
    VCalendar,
    VDateInput,
    VTimePicker,
    FullCalendar,
  },

  data() {
    return {
      //fullcalendar
      //自分のタスク、データベースの代わり
      myTasks: [{ title:'再試', start:'2024-11-11', end:'2024-11-13', backgroundColor:'red', extendedProps:{location:'', type:'', grade:[], course:[]}}],
      //学年のタスク、データベースの代わり
      gradeTasks: [
        {
          events:[{ title:'1年データ', start:'2024-11-16', end:'2024-11-17', backgroundColor:'red', extendedProps:{location:'', type:'', grade:[], course:[]}}]
        },
        {
          events:[]
        },
        {
          events:[]
        },
        {
          events:[]
        },
        {
          events:[]
        },
      ],
      //学科のタスク、データベースの代わり
      courseTasks: [
        {
          events:[]
        },
        {
          events:[]
        },
        {
          events:[]
        },
        {
          events:[]
        },
        {
          events:[]
        },
      ],
      calApi: null,
      //カレンダーのオプション
      calendarOptions: {
        locale: 'ja',                                 //表示言語
        plugins: [dayGridPlugin, interactionPlugin],  //プラグイン
        eventClick: this.dispTaskDetail,              //イベントクリックイベント
        dateClick: this.fullAddTask,                  //日付クリックイベント 
      },
      dispMyTasks: true,
      newTask: {title: '', start:'', end:'', backgroundColor:'', extendedProps:{location:'aaa', type:'', grade: Array(5).fill(false), course: Array(5).fill(false)}},
      newTaskTime: {startMenu:false, startValue:null , endMenu:false, end:null},
      fullDetailDialog: false,
      fullDetail: null,
      fullAddDialog: false,
      taskTypeList: [],
      errorMes: '',
      errorValue: false,
      //表示切り替え機能のデータ
      calendar_or_task: '0',
      month_or_week: '0',
      dispweekend: false,
      //タスク関連のデータ
      addTaskDialog: false,
      addTaskError: false,
      addTaskErrorMes: '',
      taskTimeStartMenu: false,
      taskTimeEndMenu: false,
      taskName: null,
      taskTimeStart: null,
      taskTimeEnd: null,
      taskDateStart: null,
      taskDateEnd: null,
      tasks: [
        { name: '情報理論追試', start: new Date('2024-10-21T18:00'), end: new Date('2024-10-21T21:00'), color: 'blue' },
        { name: '入学式', start: new Date('2024-10-22T21:00'), end: new Date('2024-10-22T23:59'), color: 'green' },
        { name: '卒業式', start: new Date('2024-10-23T21:00'), end: new Date('2024-10-23T23:59'), color: 'green' },
        { name: '実験実習レポート提出', start: new Date('2024-10-24T18:00'), end: new Date('2024-10-24T21:00'), color: 'blue' },
        { name: '知能システム振替', start: new Date('2025-10-25T18:00'), end: new Date('2025-10-25T21:00'), color: 'blue' }
      ],
      //カレンダー機能のデータ
      grade: ['1年'],        //表示する学年
      gradelist: ['選択しない', '1年', '2年', '3年', '4年', '5年'],   //表示できる学年のリスト
      course: ['M'],        //表示する学科
      courselist: ['選択しない', 'M', 'E', 'D', 'J', 'C'],      //表示できる学科のリスト
      onlyMyTask: true,   //自分のタスクのみ表示するか
      value: [new Date()],
      taskDetailDialog: false,
      taskDetail: null,
      //タスク表示機能のデータ
      disp_year: new Date().getFullYear(), 
      disp_month: new Date().getMonth() + 1,
    };
  },

  mounted(){
    this.calApi = this.$refs.fullCalendar.getApi();
    //eventSourcesの初期化
    this.calApi.addEventSource({id: 'myTask', events: this.myTasks, display:'block'});
    let listNum = 1;
    for(let gradeNum=1; gradeNum<this.gradelist.length; gradeNum++){
        this.calApi.addEventSource({id: this.gradelist[gradeNum], events: this.gradeTasks[gradeNum-1].events});
        listNum += 1;
    }
    for(let courseNum=1; courseNum<this.courselist.length; courseNum++){
        this.calApi.addEventSource({id: this.courselist[courseNum], events: this.courseTasks[courseNum-1].events});
        console.log(this.courselist[courseNum]);
        listNum += 1;
    }
    //calendarApi.addEvent({ title:'1年データ', start:'2024-11-16', end:'2024-11-17', backgroundColor:'red', extendedProps:{location:'', type:''}},'1年');
    //calendarApi.getEventSources().refetch();  
  },

  computed: {
    //タスク開始時間
    taskStart(){
      const [startTimeHours, startTimeMinutes] = this.taskTimeStart.split(':').map(Number);
      const start = this.taskDateStart;

      start.setHours(start.getHours() + startTimeHours);
      start.setMinutes(start.getMinutes() + startTimeMinutes);

      return start;
    },
    //タスク終了時間
    taskEnd(){
      const [endTimeHours, endTimeMinutes] = this.taskTimeEnd.split(':').map(Number);
      const end = this.taskDateEnd;

      end.setHours(end.getHours() + endTimeHours);
      end.setMinutes(end.getMinutes() + endTimeMinutes);

      return end;
    },
    //月表示/週表示の切り替え
    disptype(){
      if(this.month_or_week === '0'){
        return 'month';
      }
      else{
        return 'week';
      }
    },
    //土日表示の切り替え
    weekdays(){
      if(this.dispweekend === true){
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
    //fullcalendarタスク追加
    addTask(){
      if(this.cheakNullData()){
        this.errorValue = true;
      }
      else{
        console.log("aaa");
        this.calApi.addEvent(this.newTask, 'myTask');
      }
    },
    cheakNullData(){
      if( this.newTask.name === null || 
          this.newTask.start === null ||
          this.newTask.end === null ||
          this.newTask.extendedProps.location === null){
        this.errorMes = '入力されていない項目があります';
        return true;
      }
      return false;
    },
    //fullcalendarイベントクリック時のイベント詳細表示
    dispTaskDetail: function(arg){
      this.fullDetail = arg.event;
      this.fullDetailDialog = true;
      console.log(arg);
    },
    //日付をクリックしてイベント追加
    fullAddTask: function(arg){
      this.newTask.start = arg.date;
      this.newTask.end = arg.date;
      console.log(arg);
      this.fullAddDialog = true;
    },
    //ログの出力
    makeLog(data){
      console.log(data);
    },
    //タスクの追加処理
    oldAddTask(){
      if(this.oldCheakNullData()){
        this.addTaskError = true;
      }
      else if(this.checkInvalidTime()){
        this.addTaskError = true;
      }
      else{
        this.tasks.push({ name: this.taskName, start: this.taskDateStart, end: this.taskDateEnd, color: 'blue' });
        this.addTaskClose();
      }
    },
    //タスク追加ダイアログを閉じる処理
    addTaskClose(){
      this.addTaskError = false;
      this.addTaskDialog = false;
      this.taskName = null;
      this.taskTimeStart = null;
      this.taskTimeEnd = null;
      this.taskDateStart = null;
      this.taskDateEnd = null;
    },
    //入力されていない項目があったらエラー
    oldCheakNullData(){
      if( this.taskName === null || 
          this.taskTimeStart === null ||
          this.taskTimeEnd === null ||
          this.taskDateStart === null ||
          this.taskDateEnd === null){
            this.addTaskErrorMes = '入力されていない項目があります';
            return true;
          }
    },
    //タスクの開始時間が終了時間より遅ければエラーを出力
    checkInvalidTime() {
      if(this.taskStart > this.taskEnd){
        this.addTaskErrorMes = '開始時間は終了時間よりも早くなければいけません';
        return true;
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
    //タスクの詳細表示
    showTaskDetail(task){
      this.taskDetail = task;
      this.taskDetailDialog = true;
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
    },
    handleDateSelect(date) {
      console.log("選択された日付:", date);
    }
  }
};
</script>


<style scoped>

</style>