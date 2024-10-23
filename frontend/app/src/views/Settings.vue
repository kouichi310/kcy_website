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
    <!-- 現在のパスワードフィールド -->
      <v-col cols="9">
      <v>現在のパスワード</v>
      <v-text-field
        :append-inner-icon="visible_now ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible_now ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="visible_now = !visible_now"
      ></v-text-field>
      </v-col>
    </v-row>    

    <v-row>
    <!-- 新しいパスワードフィールド -->
      <v-col cols="9">
      <v>新しいパスワード</v>
      <v-text-field
        :append-inner-icon="visible_new ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible_new ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="visible_new = !visible_new"
      ></v-text-field>
    </v-col>
      <!-- 更新ボタン -->
      <v-col cols="3" class="d-flex align-center">
        <v-btn color="green" @click="updatePassword">更新</v-btn>
        <span v-if="pwupdateMes" class="ml-2">更新されました</span>
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
      currentPassword: 'ww',
      newPassword: 'eee',
      showPassword: false, // 今のパスワード表示/非表示
      showNewPassword: false, // 新しいパスワード表示/非表示
      years: [1, 2, 3, 4, 5],
      departments: ['M', 'E', 'D', 'J', 'C'],
      visible_now: false,
      visible_new: false,
      pwupdateMes: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    updatePassword() {
      // パスワード更新処理
    },
    logout() {
      this.$router.push('/Login');// ログアウト処理
    },
    deleteAccount() {
      this.$router.push('/Login');// アカウント削除処理
    },
    updatePassword() {// パスワード更新処理
      this.currentPassword = '';
      this.newPassword = '';
      this.pwupdateMes = true;
      setTimeout(() => {
        this.pwupdateMes = false;
      }, 1500);
    },
  },
  components: {
    Footer,
  },
};
</script>

<style scoped>
</style>
