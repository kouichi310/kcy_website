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
    <v-row class="d-flex justify-start">
      <v-col v-for="year in years" :key="year" cols="auto">
        <v-btn :color="yearFilters[year] ? 'primary' : 'default'" @click="toggleYearFilter(year)">
          {{ year }}年
        </v-btn>
      </v-col>
    </v-row>

    <!-- 必修/選択科目フィルタリング -->
    <v-row>
      <v-col cols="12">
        <v-checkbox label="必修科目を全選択" v-model="requiredChecked" @change="filterCourses"></v-checkbox>
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
        //J科
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語A'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語B' },
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IA(LS)' },
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IB(LS)'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IA(RW)'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IB(RW)' },
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '芸術'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語IA'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語IB'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '地理A'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '地理B'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '保健体育IA'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '保健体育IB'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '基礎化学IA'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '基礎化学IB'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '基礎科学'},
        { year: 1, dept: 'J', category: '必修', credits: 3, checked: false, name: '基礎数学I'},
        { year: 1, dept: 'J', category: '必修', credits: 2, checked: false, name: '基礎数学II'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '基礎数学III'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '物理学I'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータ入門I'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータ入門II'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータ演習I'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータ演習II'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '技術者入門I'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '技術者入門II'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IA'},
        { year: 1, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IB'},
        { year: 1, dept: 'J', category: '選択', credits: 1, checked: false, name: '情報セキュリティ演習'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語IIA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語IIB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '歴史A'},
        { year: 2, dept: 'J', category: '必修', credits: 2, checked: false, name: '歴史B'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IIIA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IIIB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IVA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語IVB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '保健体育IIA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '保健体育IIB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '線形代数IA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '線形代数IB'},
        { year: 2, dept: 'J', category: '必修', credits: 2, checked: false, name: '微分積分IA'},
        { year: 2, dept: 'J', category: '必修', credits: 2, checked: false, name: '微分積分IB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '物理学IIA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '物理学IIB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '化学IA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '化学IB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '日本文化論'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング基礎I'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング基礎II'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IB'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '電気回路I'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '電気回路II'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '論理回路I'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '論理回路II'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IIA'},
        { year: 2, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IIB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語III'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '現代社会A'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '現代社会B'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語VA'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語VB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IA'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '体育IA'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '体育IB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '線形代数II'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '微分積分II'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '微分積分III'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ライフサイエンス・アースサイエンス'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '物理学III'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '物理学IV'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '化学II'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '一般特別セミナー'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '日本文化論'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ネットワーク演習'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'データ構造とアルゴリズムI'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'データ構造とアルゴリズムII'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IIA'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IIB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報数学I'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報数学II'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ネットワーク入門I'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ネットワーク入門II'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータアーキテクチャI'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータアーキテクチャII'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IIIA'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IIIB'},
        { year: 3, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プロジェクト実習'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '国語表現'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '体育II'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語演習IA'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '英会話IA'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語演習IB'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '英会話IB'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '哲学A'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '経済学A'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '社会学A'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '哲学B'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '経済学B'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '社会学B'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IIA'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '中国語IA'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IIB'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '中国語IB'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '日本文化論'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'コンピュータアーキテクチャIII'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'インターフェース回路'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング言語I'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング言語II'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '言語処理系I'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '言語処理系II'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'オペ―レーティングシステムI'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'オペレーティングシステムII'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '計算機インターフェースI'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '計算機インターフェースII'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報セキュリティI'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報セキュリティII'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プレゼンテーション技法'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IIIA'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: 'プログラミング演習IIIB'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '実験実習IV'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '工業英語'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '課題研究'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '応用数学A'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '応用数学B'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '統計学'},
        { year: 4, dept: 'J', category: '必修', credits: 1, checked: false, name: '学外実習(インターン)'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '体育III'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '英語演習II'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '英会話II'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '国文学'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '心理学'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '法学'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IIIA'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '中国語IIA'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ドイツ語IIIB'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '中国語IIB'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '日本文化論'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '数値計算'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ソフトウェア設計I'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ソフトウェア設計II'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報理論I'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '情報理論II'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ネットワークシステムI'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'ネットワークシステムII'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '卒業研究'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '画像情報システム'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '知能システム'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '制御情報システム'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '分散情報システム'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '信号処理工学'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '認知科学'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'データマイニング'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'バイオインフォマティクス'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: 'メディアデザイン'},
        { year: 5, dept: 'J', category: '必修', credits: 1, checked: false, name: '計測システム'},


        // 追加のコースデータ
      ],
      years: [1, 2, 3, 4, 5],
      departments: ['M', 'E', 'D', 'J', 'C'],
      selectedDept: 'null',
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
