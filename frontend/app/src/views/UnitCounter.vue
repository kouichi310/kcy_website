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

    <!-- チェック操作 -->
    <v-row>
      <v-col>
        <v-checkbox label="必修科目のチェック" v-model="requiredChecked" @change="filterCourses"></v-checkbox>
        <v-checkbox label="選択科目のチェック" v-model="electiveChecked" @change="filterCourses"></v-checkbox>
      </v-col>
    </v-row>

    <!-- 学年フィルタリング -->
    <v-row>
      <v-col>
        <v-select
          v-model="selectedYear"
          :items="years"
          label="学年でフィルタリング"
          @change="filterCourses"
          :items="[null, 1, 2, 3, 4, 5]" <!-- 初期設定として「選択しない」を追加 -->
        >
          <template v-slot:selection="{ item }">
            <span>{{ item === null ? '選択しない' : item }}</span> <!-- 表示名を変更 -->
          </template>
        </v-select>
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
      totalCredits: 0,
      courses: [
        { name: '国語IA', year: 1, dept: 'M', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 1, dept: 'E', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 1, dept: 'D', category: '必修', credits: 1, checked: false },
        { name: '地理B', year: 1, dept: 'J', category: '必修', credits: 2, checked: false },
        { name: '美術', year: 1, dept: 'C', category: '必修', credits: 1, checked: false },
        { name: '英語IA', year: 1, dept: 'M', category: '必修', credits: 2, checked: false },
        { name: '英語IB', year: 1, dept: 'E', category: '必修', credits: 2, checked: false },
        // その他のコース情報を追加
      ],
      departments: ['M', 'E', 'D', 'J', 'C'], // 学科
      years: [1, 2, 3, 4, 5], // 学年
      selectedDept: null,
      selectedYear: null, // 初期設定はnull
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
      // 初期状態で全コースを取得
      let filtered = this.courses;

      // 教科名でフィルタリング
      if (this.searchQuery) {
        filtered = filtered.filter(course => course.name.includes(this.searchQuery));
      }

      // 必修または選択科目でフィルタリング
      if (this.requiredChecked && this.electiveChecked) {
        // 両方選択
        // 何も変更しない
      } else if (this.requiredChecked) {
        filtered = filtered.filter(course => course.category === '必修');
      } else if (this.electiveChecked) {
        filtered = filtered.filter(course => course.category === '選択');
      }

      // 学年でフィルタリング
      if (this.selectedYear) {
        filtered = filtered.filter(course => course.year === this.selectedYear);
      }

      this.filteredCourses = filtered; // フィルタリング結果を更新
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
    this.filteredCourses = this.courses; // 初期状態で全てのコースを表示
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
