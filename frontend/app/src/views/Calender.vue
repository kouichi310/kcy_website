<template>
  <div>
    <!--ページ上部-->
    <div>
      <!--表示する学年学科の入力ボックス-->
      <v-row>
        <v-col>
          <v-sheet 
            color="grey-lighten-3"
            rounded="lg"
            height="50px"
            width="700px"
            class="mt-2 ml-2"
            border
          >
            <div class="d-flex align-center fill-height">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn 
                    variant="plain" 
                    icon="mdi-plus"
                    v-bind="props"/>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(grade, index) in gradeList"
                    :key="grade.name"
                    :title="grade.name"
                    @click="changeGradeDisp(index)"
                  ></v-list-item>
                  <v-list-item
                    v-for="(course, index) in courseList"
                    :key="course.name"
                    :title="course.name"
                    @click="changeCourseDisp(index)"
                  ></v-list-item>
                </v-list>
              </v-menu>
              <div 
                v-for="(grade, index) in gradeList"
                class="ml-1"
              >
                <div v-if="grade.disp == true">
                  <v-card
                    height="38px"
                    width="60px"
                    border
                  >
                    <div class="d-flex align-center justify-center fill-height">
                      {{ grade.name }}
                      <v-btn 
                        icon="mdi-close"
                        size="x-small"
                        width="18px"
                        height="18px"
                        color="grey-lighten-3"
                        class="mb-1 ml-1"
                        @click="changeGradeDisp(index)"
                      />            
                    </div>
                  </v-card>
                </div>
              </div>
              <div
                v-for="(course, index) in courseList"
                class="ml-1"
              >
                <div v-if="course.disp == true">
                  <v-card
                    height="38px"
                    width="57px"
                    border
                  >
                    <div class="d-flex align-center justify-center fill-height">
                      {{ course.name }}
                      <v-btn 
                        icon="mdi-close"
                        size="x-small"
                        width="18px"
                        height="18px"
                        color="grey-lighten-3"
                        class="mb-1 ml-1"
                        @click="changeCourseDisp(index)"
                      />            
                    </div>
                  </v-card>
                </div>
              </div>
            </div>   
          </v-sheet>
        </v-col>
        <!-- カレンダー/タスク切り替え -->
        <v-col>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" class="mt-3">
                <!-- calendar_or_task:0でカレンダー表示、1でタスク表示 -->
                <div v-if="calendar_or_task === '0'">カレンダー</div>
                <div v-else-if="calendar_or_task === '1'">タスク </div>
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
              <v-btn color="primary" v-bind="props" class="mt-3">
                <!-- calViewType:0で月表示、1で週表示 -->
                <div v-if="calViewType === '0'">月で表示</div>
                <div v-else-if="calViewType === '1'">週で表示</div>
              </v-btn>
            </template>
            <v-list @click:select="click_calViewType">
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
          <div v-if="calendarOptions.weekends == true" class="mt-3">
            <v-btn color="primary" @click="calendarOptions.weekends = false">土日</v-btn>
          </div>
          <div v-else>
            <v-btn @click="calendarOptions.weekends = true" class="mt-3">土日</v-btn>
          </div>
        </v-col>
        <!-- タスク追加ボタン -->
        <v-col>
          <v-btn icon="mdi-plus" size="x-large" color="green" @click="fullAddDialog = true" class="mt-1"></v-btn>
        </v-col>
      </v-row>
      
      <!-- タスク詳細ダイアログ -->
      <v-dialog v-model="fullDetailDialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline"><h2>{{ fullDetail.title }}</h2></span>
          </v-card-title>
          <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="1">
                <v-icon icon="mdi-clock-time-four-outline" size="x-large" color="grey-darken-1"/>
              </v-col>
              <v-col cols="7">
                {{ fullDetail.start.toLocaleDateString() }} ({{ formatDay(fullDetail.start) }})
                <p>{{ fullDetail.end.toLocaleDateString() }} ({{ formatDay(fullDetail.end) }})</p>
              </v-col>
              <v-col cols="2">
                {{ formatTime(fullDetail.start) }}
                <p>{{ formatTime(fullDetail.end) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon icon="mdi-map-marker" size="x-large" color="grey-darken-1"/>
              </v-col>
              <v-col>
                <div class="mt-2">{{ fullDetail.extendedProps.place }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-icon icon="mdi-account" size="x-large" color="grey-darken-1" class="mt-16"/>
              </v-col>
              <v-col>
                <v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-2"/>
                <p><v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-9"/></p>
                <p><v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-9"/></p>
              </v-col>
              <v-col>
                <div v-if="fullDetail.extendedProps.grade[0] == true">
                  <v-btn color="primary">1年</v-btn>
                </div>
                <div v-else>
                  <v-btn>1年</v-btn>
                </div>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.course[0] == true">
                    <v-btn color="primary">M</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>M</v-btn>
                  </div>
                </p>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.category == 1">
                    <v-btn color="red">イベント</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>イベント</v-btn>
                  </div>
                </p>
              </v-col>
              <v-col>
                <div v-if="fullDetail.extendedProps.grade[1] == true">
                  <v-btn color="primary">2年</v-btn>
                </div>
                <div v-else>
                  <v-btn>2年</v-btn>
                </div>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.course[1] == true">
                    <v-btn color="primary">E</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>E</v-btn>
                  </div>
                </p>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.category == 2">
                    <v-btn color="blue">就職</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>就職</v-btn>
                  </div>
                </p>
              </v-col>
              <v-col>
                <div v-if="fullDetail.extendedProps.grade[2] == true">
                  <v-btn color="primary">3年</v-btn>
                </div>
                <div v-else>
                  <v-btn >3年</v-btn>
                </div>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.course[2] == true">
                    <v-btn color="primary">D</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>D</v-btn>
                  </div>
                </p>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.category == 3">
                    <v-btn color="green">進学</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>進学</v-btn>
                  </div>
                </p>
              </v-col>
              <v-col>
                <div v-if="fullDetail.extendedProps.grade[3] == true">
                  <v-btn color="primary">4年</v-btn>
                </div>
                <div v-else>
                  <v-btn>4年</v-btn>
                </div>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.course[3] == true">
                    <v-btn color="primary">J</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>J</v-btn>
                  </div>
                </p>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.category == 4">
                    <v-btn color="orange-darken-1">振替</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>振替</v-btn>
                  </div>
                </p>
              </v-col>
              <v-col>
                <div v-if="fullDetail.extendedProps.grade[4] == true">
                  <v-btn color="primary">5年</v-btn>
                </div>
                <div v-else>
                  <v-btn>5年</v-btn>
                </div>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.course[4] == true">
                    <v-btn color="primary">C</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>C</v-btn>
                  </div>
                </p>
                <p class="mt-8">
                  <div v-if="fullDetail.extendedProps.category == 5">
                    <v-btn color="blue-grey-lighten-1">その他</v-btn>
                  </div>
                  <div v-else>
                    <v-btn>その他</v-btn>
                  </div>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon icon="mdi-information" size="x-large" color="grey-darken-1"/>
              </v-col>
              <v-col>
                <div class="mt-2">{{ fullDetail.extendedProps.detail }}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="fullDetailDialog = false">閉じる</v-btn>
          <v-btn color="primary" @click="fullDetailDialog = false">編集</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      <!-- タスク追加ダイアログ -->
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
                  ></v-date-input>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="newTaskTime.startValue"
                    :active="newTaskTime.startMenu"
                    :focus="newTaskTime.startMenu"
                    label="時刻"
                    prepend-icon="mdi-clock-time-four-outline"
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
                  v-model="newTask.extendedProps.place"
                  label="場所"
                  prepend-icon="mdi-map-marker"
                />
              </v-row>
              <v-row>
                <v-col>
                  <v-icon icon="mdi-account" size="x-large" color="grey-darken-1" class="mt-16"/>
                </v-col>
                <v-col>
                  <v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-2"/>
                  <p><v-icon icon="mdi-check" size="x-large" color="grey-darken-1" class="mt-9"/></p>
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
                  <p class="mt-8">
                    <div v-if="newTask.extendedProps.category == 1">
                      <v-btn color="red">イベント</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.category = 1">イベント</v-btn>
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
                  <p class="mt-8">
                    <div v-if="newTask.extendedProps.category == 2">
                      <v-btn color="blue">就職</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.category = 2">就職</v-btn>
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
                  <p class="mt-8">
                    <div v-if="newTask.extendedProps.category == 3">
                      <v-btn color="green">進学</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.category = 3">進学</v-btn>
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
                  <p class="mt-8">
                    <div v-if="newTask.extendedProps.category == 4">
                      <v-btn color="orange-darken-1">振替</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.category = 4">振替</v-btn>
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
                  <p class="mt-8">
                    <div v-if="newTask.extendedProps.category == 5">
                      <v-btn color="blue-grey-lighten-1">その他</v-btn>
                    </div>
                    <div v-else>
                      <v-btn @click="newTask.extendedProps.category = 5">その他</v-btn>
                    </div>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-icon icon="mdi-lock" color="grey-darken-1" class="mt-2"/>                  
                <div v-if="newTask.extendedProps.public == true" class="ml-10">
                  <v-btn color="green" @click="newTask.extendedProps.public = false">公開</v-btn>
                </div>
                <div v-else>
                  <v-btn @click="newTask.extendedProps.public = true" class="ml-10">公開</v-btn>
                </div>              
              </v-row>
              <v-row>
                <v-text-field
                  class="mt-8"
                  v-model="newTask.extendedProps.detail"
                  label="詳細"
                  prepend-icon="mdi-information"
                />
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="addTaskClose()">閉じる</v-btn>
            <v-btn color="primary" @click="addTask()">追加</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!--ページ中部-->
    <!-- カレンダー-->
    <div v-show="calendar_or_task == '0'">
      <div>
        <!-- カレンダーの表示 -->
        <full-calendar ref="fullCalendar" :options="calendarOptions"/>
      </div>  
    </div>
    
    <!-- タスクの表示 -->     
    <div v-show="calendar_or_task == '1'" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <!--月表示-->
      <h1> {{ disp_year }} 年 {{ disp_month }} 月 </h1>
      <br>
      <!--タスク一覧-->
      <div style="height: 600px; overflow-y: auto;">
        <v-card v-for="task in taskFilter" :key="task.id" @click="dispTaskDetail(task)" min-width="600px" max-width="600px" style="text-align: center;"> 
          <p>{{ formatDate(task.start) }}  ({{ formatDay(task.start) }}) {{ formatTime(task.start) }} - {{ formatDate(task.end) }}  ({{ formatDay(task.end) }}) {{ formatTime(task.end) }}</p>
          <h3>{{ task.title }} </h3>
        </v-card>
      </div>
      <br>
      <!--月送りボタン-->
      <div style="display:flex;">
        <v-btn @click="prevMonth()" color="primary">
          <
        </v-btn>
        <v-btn @click="nextMonth()" color="primary">
          >
        </v-btn>
      </div>
    </div>
      
    <!--ページ下部-->
    <!-- テスト -->
    <v-col>
      <v-btn @click="makeLog(this.calApi.getEvents())">
        テスト
      </v-btn>
      <v-btn @click="makeLog(taskList)">
        テスト2
      </v-btn>
    </v-col>
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
      saishiTask:{ 
        id:'1',
        title:'再試',
        start:'2024-12-11',
        end:'2024-12-13',
        extendedProps:{
          detail:'情報理論の再試',
          place:'第一講義室',
          public:false,
          grade:[false,false,false,false,true],
          course:[false,false,false,true,false],
          category:4,
          create_email:'',
          change_email:'',
          create_at:'',
          change_at:''
        },
        backgroundColor:'red',
        display:'block',
        allDay:true
      },
      calApi: null,
      //カレンダーのオプション
      calendarOptions: {
        locale: 'ja',                                 //表示言語
        plugins: [dayGridPlugin, interactionPlugin],  //プラグイン
        initialView: 'dayGridMonth',
        weekends: true,
        eventClick: this.clickEventFunc,              //イベントクリックイベント
        dateClick: this.dateAddTask,                  //日付クリックイベント
      },
      newTask:{
                id:'',
                title:'',
                start:null,
                end:null, 
                extendedProps:{ detail:null,
                                place:null,
                                public:false, 
                                grade:Array(5).fill(false),
                                course:Array(5).fill(false),
                                category:0,
                                create_email:'',
                                change_email:'',
                                create_at:'',
                                change_at:''
                              },
                backgroundColor:'',
                display:'block',
                allDay:true
              },
      newTaskTime: {startMenu:false, startValue:null , endMenu:false, endValue:null},
      fullDetailDialog: false,
      fullDetail: null,
      fullAddDialog: false,
      taskTypeList: [],
      errorMes: '',
      errorValue: false,
      //表示切り替え機能のデータ
      calendar_or_task: '0',
      calViewType: '0',
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
      //カレンダー機能のデータ
      //学年のリスト
      gradeList: [
        {name:'1年', disp:false},
        {name:'2年', disp:false},
        {name:'3年', disp:false},
        {name:'4年', disp:false},
        {name:'5年', disp:false}],
      //学科のリスト
      courseList: [
        {name:'M', disp:false},
        {name:'E', disp:false},
        {name:'D', disp:false},
        {name:'J', disp:false},
        {name:'C', disp:false}],
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
    this.calApi.addEvent(this.saishiTask);
    this.updateGradeDisp();
    this.updateCourseDisp();
  },

  computed: {
    //タスクデータ
    taskList(){
      if(this.calApi == null){
       return null; 
      }
      return this.calApi.getEvents();
    },
    
    //フィルタリング(年,月,学年,学科)
    taskFilter() {
      if (!this.taskList) {
        return []; // データがない場合は空配列を返す
      }

      return this.taskList.filter(task => {
        const startDate = new Date(task.start);
        const taskYear = startDate.getFullYear();
        const taskMonth = startDate.getMonth() + 1;

        // 現在の表示中の年と月に一致し、かつ表示が有効なタスクのみ
        return (
          taskYear === this.disp_year &&
          taskMonth === this.disp_month &&
          task.display === 'block'
        );
      });
    }
  },

  methods: {
    //表示する学年を切り替える関数(gradeListの値を変更する、true=表示したい/false=表示したくない)
    changeGradeDisp(index){
      if(this.gradeList[index].disp == true){
        this.gradeList[index].disp = false;
        this.updateGradeDisp();
      }
      else{
        this.gradeList[index].disp = true;
        this.updateGradeDisp();
      }
    },
    //学年のdisplayを更新(gradeListの値によって各タスクデータのdisplayを変更する、fullcalendarではdisplayの値によってタスクの表示を制御するため)
    updateGradeDisp(){
      for(let taskNum=0; taskNum<this.taskList.length; taskNum++){
        for(let gradeNum=0; gradeNum<this.gradeList.length; gradeNum++){
          if(this.taskList[taskNum].extendedProps.grade[gradeNum] == true){
            if(this.gradeList[gradeNum].disp == false){
              this.taskList[taskNum].setProp('display', 'none');
            }
            else{
              this.taskList[taskNum].setProp('display', 'block');
            }
          }
        }
      }
    },
    //表示する学科を切り替える関数(courseListの値を変更する、true=表示したい/false=表示したくない)
    changeCourseDisp(index){
      if(this.courseList[index].disp == true){
        this.courseList[index].disp = false;
        this.updateCourseDisp();
      }
      else{
        this.courseList[index].disp = true;
        this.updateCourseDisp();
      }
    },
    //学科のdisplayを更新(courseListの値によって各タスクデータのdisplayを変更する、fullcalendarではdisplayの値によってタスクの表示を制御するため)
    updateCourseDisp(){
      for(let taskNum=0; taskNum<this.taskList.length; taskNum++){
        for(let courseNum=0; courseNum<this.courseList.length; courseNum++){
          if(this.taskList[taskNum].extendedProps.course[courseNum] == true){
            if(this.courseList[courseNum].disp == false){
              this.taskList[taskNum].setProp('display', 'none');
            }
            else{
              this.taskList[taskNum].setProp('display', 'block');
            }
          }
        }
      }
    },
    //時間(Object)と時間(文字列)の足し算、返り値->object
    addTimes(timeObject, timeChar){
      const [hours, minutes] = timeChar.split(':').map(Number);
      timeObject.setHours(timeObject.getHours() + hours);
      timeObject.setMinutes(timeObject.getMinutes() + minutes);
      
      return timeObject;
    },
    //fullcalendarタスク追加
    addTask(){
      if(this.newTaskTime.startValue != null){
        this.newTask.allDay = false;
        this.newTask.start = this.addTimes(this.newTask.start, this.newTaskTime.startValue);
      }
      if(this.newTaskTime.endValue != null){
        this.newTask.allDay = false;
        this.newTask.end = this.addTimes(this.newTask.end, this.newTaskTime.endValue);
      }
      this.calApi.addEvent(this.newTask);
      this.addTaskClose();
    },
    //タスク追加ダイアログを閉じる処理(newTaskの初期化)
    addTaskClose(){
      this.newTask.id = '';
      this.newTask.title = '';
      this.newTask.start = null;
      this.newTask.end = null;
      this.newTask.backgroundColor = '';
      this.newTask.display = 'block';
      this.newTask.allDay = true;
      this.newTask.extendedProps.detail = null;
      this.newTask.extendedProps.place = null;
      this.newTask.extendedProps.public = false;
      for(let i=0; i<5; i++){
        this.newTask.extendedProps.grade[i] = false;
      }
      for(let i=0; i<5; i++){
        this.newTask.extendedProps.course[i] = false;
      }
      this.newTask.extendedProps.category = 0;
      this.newTask.extendedProps.create_email = '';
      this.newTask.extendedProps.change_email = '';
      this.newTask.extendedProps.create_at = '';
      this.newTask.extendedProps.change_at = '';
      this.newTaskTime.startValue = null;
      this.newTaskTime.endValue = null;
      this.fullAddDialog = false;
    },
    cheakNullData(){
      if( this.newTask.name === null || 
          this.newTask.start === null ||
          this.newTask.end === null ||
          this.newTask.extendedProps.place === null){
        this.errorMes = '入力されていない項目があります';
        return true;
      }
      return false;
    },
    //fullcalendarイベントクリック時のイベント詳細表示
    clickEventFunc: function(arg){
      this.makeLog(arg);
      this.dispTaskDetail(arg.event);
    },
    //イベント詳細表示
    dispTaskDetail(task){
      this.fullDetail = task;
      this.fullDetailDialog = true;
    },
    //日付をクリックしてイベント追加
    dateAddTask: function(arg){
      this.makeLog(arg);
      this.newTask.start = arg.date;
      this.newTask.end = arg.date;
      this.fullAddDialog = true;
    },
    //ログの出力
    makeLog(data){
      console.log(data);
    },
    //タスクの追加処理、v-valendarのもので今は使っていない、一応残している
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
    //入力されていない項目があったらエラーv-valendarのもので今は使っていない、一応残している
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
    //タスクの開始時間が終了時間より遅ければエラーを出力v-valendarのもので今は使っていない、一応残している
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
    click_calViewType(event){
      this.calViewType = event.id;
      if(this.calViewType == 0){
        this.calApi.changeView('dayGridMonth');
      }
      else{
        this.calApi.changeView('dayGridWeek');
      }
    },
    //タスクの詳細表示
    showTaskDetail(task){
      this.taskDetail = task;
      this.taskDetailDialog = true;
    },
    //曜日を返す
    formatDay(data){
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      return days[data.getDay()];
    },
    //日付をYYYY/MM/DDのフォーマットで返す
    formatDate(data){
      const [years, months, dates] = data.toLocaleDateString().split('/');
      return years + '/' + months + '/' + dates;
    },
    //時間を"hh:mmのフォーマットで返す
    formatTime(data){
      const [hours, minutes, seconds] = data.toLocaleTimeString().split(':');
      return hours + ':' + minutes;
    },

    //次月切り替え
    nextMonth(){
      if(this.disp_month === 12){
        this.disp_month = 1;
        this.disp_year += 1;
      }
      else{
        this.disp_month+=1;
      }
    },
    //前月切り替え
    prevMonth(){
      if(this.disp_month === 1){
        this.disp_month = 12;
        this.disp_year -= 1;
      }
      else{
        this.disp_month-=1;
      }
    },
    
    handleDateSelect(date) {
      console.log("選択された日付:", date);
    },
  }
};
</script>


<style scoped>

</style>