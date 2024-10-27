<template>
  <v-container>
    <!-- 学科の選択 (画像のようにボタンで表示) -->
    <v-row>
      <v-col>
        <v-btn-toggle v-model="selectedDept" mandatory>
          <v-btn v-for="dept in departments" :key="dept" :value="dept" @click="filterByDept(dept)">
            {{ dept }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- 合計単位数 -->
    <v-row>
      <v-col class="text-center">
        <h2>現在の合計単位数</h2>
        <h1>{{ totalCredits }}</h1>
      </v-col>
    </v-row>

    <!-- 単位の種類ごとの表示 -->
    <v-row>
      <v-col>
        <p>一般: {{ generalCredits }} 単位 / 専門: {{ specializedCredits }} 単位</p>
        <p>特別学修: {{ specialStudyCredits }} 単位</p>
        <p>必修: {{ requiredCredits }} 単位</p>
      </v-col>
    </v-row>

    <!-- チェックボタン -->
    <v-row>
      <v-col>
        <v-btn @click="calculateCredits">合計単位数を計算する</v-btn>
      </v-col>
    </v-row>

    <!-- チェック操作と学年フィルタリング用ボタン -->
    <v-row>
      <v-col>
        <v-checkbox label="必修科目" v-model="requiredChecked" @change="filterCourses"></v-checkbox>
        <v-checkbox label="選択科目" v-model="electiveChecked" @change="filterCourses"></v-checkbox>
      </v-col>
      <v-col>
        <v-btn-toggle v-model="selectedYears" multiple>
          <v-btn
            v-for="year in years"
            :key="year"
            :value="year"
            @click="toggleYear(year)"
          >
            {{ year }}年
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>


    <!-- 教科名の検索フィールド -->
    <v-row>
      <v-col>
        <v-text-field v-model="searchQuery" label="教科名を検索" @input="filterCourses"></v-text-field>
      </v-col>
    </v-row>

    <!-- 単位詳細テーブル -->
    <v-row v-if="requiredChecked || electiveChecked || selectedYears.length > 0">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredCourses"
          item-value="credits"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <v-btn :color="item.checked ? 'primary' : 'default'" @click="toggleCourse(item)">
              {{ item.checked ? '選択中' : '選択' }}
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <Footer />
  </v-container>
</template>

<script>
import Footer from '../components/Footer.vue';

export default {
  name: 'App',

  components: {
    Footer,
  },
  data() {
    return {
      headers: [
        { text: '教科名', value: 'name' },
        { text: '学年', value: 'year' },
        { text: '科目', value: 'dept' },
        { text: '区分', value: 'category' },
        { text: '単位数', value: 'credits' },
        { text: '選択', value: 'action' }
      ],
      selectedYears: [], // Array to store selected years
      totalCredits: 0,
      courses: [
        { name: '国語IA', year: 1, dept: 'M', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 1, dept: 'E', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 1, dept: 'D', category: '必修', credits: 1, checked: false },
        { name: '地理B', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '美術', year: 1, dept: 'C', category: '必修', credits: 1, checked: false },
        { name: '英語IA', year: 1, dept: 'M', category: '選択', credits: 2, checked: false },
        { name: '英語IB', year: 1, dept: 'E', category: '選択', credits: 2, checked: false },
        { name: '社会IA', year: 1, dept: 'D', category: '選択', credits: 1, checked: false },
        { name: '社会IB', year: 1, dept: 'J', category: '選択', credits: 2, checked: false },
        { name: '体育', year: 1, dept: 'C', category: '選択', credits: 1, checked: false },
        { name: '国語IA', year: 2, dept: 'M', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 2, dept: 'E', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 2, dept: 'D', category: '必修', credits: 1, checked: false },
        { name: '地理B', year: 2, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '美術', year: 2, dept: 'C', category: '必修', credits: 1, checked: false },

        { name: '英語A', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '英語B', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '英語IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '英語IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '英語IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '英語IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '芸術', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '国語IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '地理B', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '保健体育IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '保健体育IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '基礎化学IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '基礎化学IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '基礎数学I', year: 1, dept: 'J', category: '必修', credits: 6, checked: false },
        { name: '基礎数学II', year: 1, dept: 'J', category: '必修', credits: 4, checked: false },
        { name: '基礎数学III', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '物理学I', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: 'コンピュータ入門I', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: 'コンピュータ入門II', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: 'コンピュータ演習I', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: 'コンピュータ演習II', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '技術者入門I', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '技術者入門II', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '実験・実習IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '実験・実習IB', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '情報セキュリティ演習', year: 1, dept: 'J', category: '選択', credits: 2, checked: false },
        // その他のコース情報を追加...
      ],
      years: [1, 2, 3, 4, 5],
      departments: ['M', 'E', 'D', 'J', 'C'], // 学科
      selectedDept: 'J', // 初期状態でJ学科が選択されるように設定
      selectedYear: 1, // 初期状態は1年を選択
      requiredChecked: false,
      electiveChecked: false,
      searchQuery: '',
      filteredCourses: [], // フィルタリングされたコース
    };
  },
  methods: {
    calculateCredits() {
      this.totalCredits = this.courses
        .filter(course => course.checked)
        .reduce((sum, course) => sum + course.credits, 0);
    },
    filterCourses() {
      let filtered = this.courses;

      // Department filtering
      if (this.selectedDept) {
        filtered = filtered.filter(course => course.dept === this.selectedDept);
      }

      // Course name search
      if (this.searchQuery) {
        filtered = filtered.filter(course => course.name.includes(this.searchQuery));
      }

      // Required/Elective filtering
      if (this.requiredChecked && this.electiveChecked) {
        // Show all courses if both are checked
      } else if (this.requiredChecked) {
        filtered = filtered.filter(course => course.category === '必修');
      } else if (this.electiveChecked) {
        filtered = filtered.filter(course => course.category === '選択');
      }

      // Academic year filtering based on multi-select
      if (this.selectedYears.length) {
        filtered = filtered.filter(course => this.selectedYears.includes(course.year));
      }

      this.filteredCourses = filtered;
    },

    toggleCourse(course) {
      course.checked = !course.checked;
    },
    filterByDept(dept) {
      this.selectedDept = dept;
      this.filterCourses();
    }
  },
  mounted() {
    this.filterCourses(); // 初期状態でJ学科のコースを表示
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
