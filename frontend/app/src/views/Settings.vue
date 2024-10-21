<template>
  <v-container>
    <!-- 学年の選択 -->
    <v>学年</v>
    <v-row>
      <v-col>
        <v-btn-toggle v-model="selectedYear" mandatory>
          <v-btn v-for="year in years" :key="year" :value="year">{{ year }}</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- 学科の選択 -->
    <v>学科</v>
    <v-row>
      <v-col>
        <v-btn-toggle v-model="selectedDept" mandatory>
          <v-btn v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- パスワードフィールド -->
    <v-row>
      <v-col>
      <v>現在のパスワード</v>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
      <v>新しいパスワード</v>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- アクションボタン -->
    <v-row>
      <v-col>
        <v-btn color="primary" @click="logout">ログアウト</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="red" @click="deleteAccount">アカウントの削除</v-btn>
      </v-col>
    </v-row>
    <Footer />
  </v-container>
</template>

<script>
import Footer from '../components/Footer.vue'
export default {
  data() {
    return {
      selectedYear: 5,
      selectedDept: 'J',
      currentPassword: '',
      newPassword: '',
      showPassword: false, // 今のパスワード表示/非表示
      showNewPassword: false, // 新しいパスワード表示/非表示
      years: [1, 2, 3, 4, 5],
      departments: ['M', 'E', 'D', 'J', 'C'],
      visible: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    logout() {
      // ログアウト処理
    },
    deleteAccount() {
      // アカウント削除処理
    },
  },
  components: {
    Footer,
  },
};
</script>

<style scoped>
</style>
