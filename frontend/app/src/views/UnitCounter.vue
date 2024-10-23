<template>
  <v-container>
    <!-- 学科の選択 -->
    <v-row>
      <v-col>
        <v-btn-toggle v-model="selectedDept" mandatory>
          <v-btn v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</v-btn>
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
        <v-checkbox label="必修科目のチェック" v-model="requiredChecked"></v-checkbox>
        <v-checkbox label="選択科目のチェック" v-model="electiveChecked"></v-checkbox>
        <v-checkbox label="全ての授業のチェック" v-model="allChecked"></v-checkbox>
      </v-col>
    </v-row>

    <!-- 単位詳細テーブル -->
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="courses" item-value="credits" class="elevation-1">
          <template v-slot:item.action="{ item }">
            <v-checkbox v-model="item.checked"></v-checkbox>
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
      totalCredits: 0,
      courses: [
        { name: '教科名', year: '学年', dept: '科目', category: '区分', credits: '単位数', checked: '選択' },
        { name: '国語IA', year: 1, dept: '一般', category: '必修', credits: 2, checked: false },
        { name: '国語IB', year: 1, dept: '一般', category: '必修', credits: 2, checked: false },
        { name: '地理A', year: 1, dept: '一般', category: '必修', credits: 1, checked: false },
        { name: '地理B', year: 1, dept: '一般', category: '必修', credits: 2, checked: false },
        { name: '美術', year: 1, dept: '一般', category: '必修', credits: 1, checked: false },
        { name: '英語IA', year: 1, dept: '一般', category: '必修', credits: 2, checked: false },
        { name: '英語IB', year: 1, dept: '一般', category: '必修', credits: 2, checked: false },
        // その他のコース情報を追加
      ],
      headers: [
        { text: '教科名', value: 'name' },
        { text: '学年', value: 'year' },
        { text: '科目', value: 'dept' },
        { text: '区分', value: 'category' },
        { text: '単位数', value: 'credits' },
        { text: '選択', value: 'action' }
      ]
    };
  },
  methods: {
    calculateCredits() {
      // 選択されたコースの単位を合計する
      this.totalCredits = this.courses
        .filter(course => course.checked)
        .reduce((sum, course) => sum + course.credits, 0);
    }
  }
  ,
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
