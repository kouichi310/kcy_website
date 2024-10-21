<template> 
  <v-container class="schedule" fluid> 
    <!-- Header with Selected Grade and Class -->
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-sheet class="header" color="grey lighten-4" elevation="2">
          <h1 class="text-center display-2">{{ selectedGrade }}{{ selectedClass }}</h1>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Schedule Table -->
    <v-row justify="center" class="weekday">
      <!-- Weekday Header -->
      <v-col v-for="(day, dayIndex) in weekdays" :key="dayIndex" cols="2" md="2">
        <v-card class="weekday-header">{{ day }}</v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="timetable-card">
      <v-col
        v-for="(column, colIndex) in timetableColumns"
        :key="colIndex"
        cols="2"
        md="2"
        class="pa-0"
      >
        <v-card
          v-for="(row, rowIndex) in timetableRows"
          :key="rowIndex"
          text="時間割の内容"
          
        >
          {{ row }} - {{ column }}
        </v-card>
      </v-col>
    </v-row>

    <!-- Grade Buttons -->
    <v-row justify="center">
      <v-col cols="2" md="2">
        <v-btn-toggle v-model="selectedGrade" mandatory>
          <v-btn v-for="grade in grades" :key="grade" :value="grade" :class="{ 'v-btn--active': selectedGrade === grade }">
            {{ grade }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Class Buttons -->
    <v-row justify="center">
      <v-col cols="2" md="2">
        <v-btn-toggle v-model="selectedClass" mandatory>
          <v-btn v-for="cls in classes" :key="cls" :value="cls" :class="{ 'v-btn--active': selectedClass === cls }">
            {{ cls }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <Footer />
  </v-container>
</template>

<script> 
// Footerコンポーネントをインポート 
import Footer from '../components/Footer.vue'; 
 
export default { 
  name: 'App', 

  components: { 
    Footer, 
  }, 
 
  data() { 
    return { 
      selectedGrade: '5',  // 初期選択
      selectedClass: 'J',  // 初期選択
      grades: ['1', '2', '3', '4', '5'],  // グレードの選択肢
      classes: ['M', 'E', 'D', 'J', 'C'],  // クラスの選択肢
      weekdays:['月', '火', '水', '木', '金'],
      timetableRows: Array.from({ length: 8 }, (_, i) => `時間 ${i + 1}`), // 縦8
      timetableColumns: Array.from({ length: 5 }, (_, i) => `科目 ${i + 1}`), // 横5
    } 
  }
} 
</script> 

<style scoped> 
.header { 
  padding: 20px; 
  margin-bottom: 20px;
  font-weight: bold; 
}

.schedule-table {
  margin-bottom: 30px;
}

.v-btn--active {
  background-color: #4CAF50;
  color: white;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  padding: 0;
  /*margin: 0;*/
}

.timetable-card {
  border: 1px solid #f0f0f0; /* グリッドの境界線を追加 */
  margin: 0; /* タイムテーブルのカードの間の隙間をなくす */
  padding: 0;
}

.weekday{
  margin: 0;
  padding: 0;
}
</style>