<template>
  <v-container class="login" fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="8">
        <v-card>
          <!-- ログイン/登録のタブ -->
          <v-tabs v-model="tab" fixed-tabs color="blue">
            <v-tab>ログイン</v-tab>
            <v-tab>登録</v-tab>
          </v-tabs>

          <!-- ログインタブの内容 -->
          <v-card-text v-if="tab === 0">
            <v-form>
              <p>メールアドレスもしくはユーザーID</p>
              <v-text-field
                outlined
                dense
              ></v-text-field>

              <p>パスワード</p>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="visible = !visible"
              ></v-text-field>

              <v-btn block color="primary" class="mt-4" @click="goToCalendar">
                ログインする
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- 登録タブの内容 -->
          <v-card-text v-if="tab === 1">
            <v-form>
              <p>メールアドレスもしくはユーザーID</p>
              <v-text-field
                outlined
                dense
              ></v-text-field>

              <p>パスワード</p>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="visible = !visible"
              ></v-text-field>

              <v-row>
                <v-col cols="12">
                  <div>学年</div>
                  <v-btn-toggle v-model="grade" mandatory>
                    <v-btn v-for="n in 5" :key="n" :value="n">{{ n }}</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <div>学科</div>
                  <v-btn-toggle v-model="department" mandatory>
                    <v-btn value="M">M</v-btn>
                    <v-btn value="E">E</v-btn>
                    <v-btn value="D">D</v-btn>
                    <v-btn value="J">J</v-btn>
                    <v-btn value="C">C</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>

              <v-btn block color="primary" class="mt-4"  @click="goToCalendar">
                登録する
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- フッターコンポーネント -->
        <Footer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Footerコンポーネントをインポート
import Footer from '../components/Footer.vue';

export default {
  name: 'LoginRegister',
  components: {
    Footer,
  },
  data() {
    return {
      tab: 0, // デフォルトでログインタブを表示
      visible: false,
      grade: 5, // 学年の初期値
      department: 'J', // 学科の初期値
    };
  },
  methods: {
  goToCalendar() {
    this.$router.push('/calender'); // カレンダーページに遷移
  }
}
};
</script>

<style scoped>

</style>
