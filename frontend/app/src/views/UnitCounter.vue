<template>
  <v-container>

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

    <!-- 学科の選択ボタン -->
    <v-row>
      <v-col cols="12">
        <v-btn-toggle v-model="selectedDept" @="filterCourses" mandatory>
          <v-btn v-for="dept in departments" :key="dept" :value="dept">
            {{ dept }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- 個別学年フィルタリングボタン -->
    <v-row>
      <v-col v-for="year in years" :key="year" cols="4">
        <v-btn :color="yearFilters[year] ? 'primary' : 'default'" @click="toggleYearFilter(year)">
          {{ year }}年
        </v-btn>
      </v-col>
    </v-row>

    <!-- 必修/選択科目フィルタリング -->
    <v-row>
      <v-col cols="12">
        <v-checkbox label="必修科目" v-model="requiredChecked" @change="filterCourses"></v-checkbox>
        <v-checkbox label="選択科目" v-model="electiveChecked" @change="filterCourses"></v-checkbox>
      </v-col>
    </v-row>

    <!-- 教科名の検索フィールド -->
    <v-row>
      <v-col>
        <v-text-field v-model="searchQuery" label="教科名を検索" @input="filterCourses"></v-text-field>
      </v-col>
    </v-row>

    <!-- 単位詳細テーブル -->
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredCourses"
          item-value="credits"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.name + item.year">
              <td>{{ item.name }}</td>
              <td>{{ item.year }}</td>
              <td>{{ item.dept }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.credits }}</td>
              <td>
                <v-btn :color="item.checked ? 'primary' : 'default'" @click="toggleCourse(item)">
                  {{ item.checked ? '選択中' : '選択' }}
                </v-btn>
              </td>
            </tr>
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
      totalCredits: 0,
      courses: [
        { name: '国語IA', year: 1, dept: 'M', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 1, dept: 'E', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 1, dept: 'D', category: '必修', credits: 1, checked: false },
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

        //2J
        { name: '情報セキュリティ演習', year: 1, dept: 'J', category: '選択', credits: 2, checked: false },

        //3J
        { name: '国語III', year: 3, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '実験・実習IA', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        // 追加のコースデータ
      ],
      years: [1, 2, 3, 4, 5],
      departments: ['M', 'E', 'D', 'J', 'C'],
      selectedDept: 'J',
      yearFilters: { 1: false, 2: false, 3: false, 4: false, 5: false }, // 学年ごとのフィルター
      requiredChecked: false,
      electiveChecked: false,
      searchQuery: '',
      filteredCourses: [],
      requiredCredits: 0,
      specialStudyCredits: 0,
      specializedCredits: 0,
      generalCredits: 0,
    };
  },
  methods: {
    // 合計単位数を計算
    calculateCredits() {
      this.totalCredits = this.courses
        .filter(course => course.checked)
        .reduce((sum, course) => sum + course.credits, 0);
    },

    // 個別学年フィルターの切り替え
    toggleYearFilter(year) {
      this.yearFilters[year] = !this.yearFilters[year];
      this.filterCourses();
    },

    // コースデータのフィルタリング
    filterCourses() {
      let filtered = this.courses;

      // 学年フィルターの適用
      const selectedYears = Object.keys(this.yearFilters).filter(year => this.yearFilters[year]);
      if (selectedYears.length) {
        filtered = filtered.filter(course => selectedYears.includes(String(course.year)));
      }

      // 学科のフィルタリング
      if (this.selectedDept) {
        filtered = filtered.filter(course => course.dept === this.selectedDept);
      }

      // コース名でフィルタリング
      if (this.searchQuery) {
        filtered = filtered.filter(course => course.name.includes(this.searchQuery));
      }

      // 必修/選択フィルタリング
      if (this.requiredChecked && this.electiveChecked) {
        // どちらも選択されている場合は全科目表示
      } else if (this.requiredChecked) {
        filtered = filtered.filter(course => course.category === '必修');
      } else if (this.electiveChecked) {
        filtered = filtered.filter(course => course.category === '選択');
      }

      this.filteredCourses = filtered;
    },

    // コースの選択状態を切り替え
    toggleCourse(course) {
      course.checked = !course.checked;
      this.calculateCredits();
    },
  },
  mounted() {
    this.filterCourses(); // 初回フィルタリング実行
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
