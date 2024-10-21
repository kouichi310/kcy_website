<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-toolbar flat>
            <v-toolbar-title>{{ currentMonth }}</v-toolbar-title>
          </v-toolbar>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <p>現在のフォーカス日: {{ focus }}</p>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue'

export default{
  name: 'App',

  components: {
    Footer,
  },

  data() {
    return {
      focus: new Date().toISOString().substr(0, 10), // 現在の日付
      currentMonth: '' // 現在の月を保存する
    }
  },
  mounted() {
    this.updateMonth(this.focus); // 初期表示時に月をセット
  },
  methods: {
    updateMonth(date) {
      const monthNames = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ];
      const selectedDate = new Date(date);
      this.currentMonth = monthNames[selectedDate.getMonth()];
    }
  }
}
</script>


<style scoped>

</style>