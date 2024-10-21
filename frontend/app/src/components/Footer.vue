<template>
  <v-footer app>
    <v-row justify="center" no-gutters> <!-- no-gutters を追加 -->
      <!-- セパレーターをボタンの上に追加 -->
      <v-col cols="12">
        <v-divider class="thin-divider" />
      </v-col>

      <!-- カレンダー -->
      <v-col cols="3" class="text-center">
        <div
          @click="navigateTo('/calender')"
          :class="['footer-card', { active: isActive('/calender') }]">
          <v-icon
          class="footer-icon"
          :class="{ 'calender-active' : isActive('/calender') }">
            mdi-calendar
          </v-icon>
          <div
          :class="[isActive('/calender') ? 'active-text' : 'inactive-text', { 'calender-active': isActive('/calender') }]">
            カレンダー
          </div>
        </div>
      </v-col>

      <!-- 時間割 -->
      <v-col cols="3" class="text-center">
        <div
          @click="navigateTo('/timetable')"
          :class="['footer-card', { active: isActive('/timetable') }]">
          <v-icon
          class="footer-icon"
          :class="{ 'timetable-active': isActive('/timetable') }">
            mdi-timetable
          </v-icon>
          <div
          :class="[isActive('/timetable') ? 'active-text' : 'inactive-text', { 'timetable-active': isActive('/timetable') }]">
            時間割
          </div>
        </div>
      </v-col>

      <!-- 単位カウンター -->
      <v-col cols="3" class="text-center">
        <div
          @click="navigateTo('/unitcounter')"
          :class="['footer-card', { active: isActive('/unitcounter') }]">
          <v-icon
          class="footer-icon"
          :class="{ 'unitcounter-active': isActive('/unitcounter') }"
          >
            mdi-counter
          </v-icon>
          <div
          :class="[isActive('/unitcounter') ? 'active-text' : 'inactive-text', { 'unitcounter-active': isActive('/unitcounter') }]">
            単位カウンター
          </div>
        </div>
      </v-col>

      <!-- 設定 -->
      <v-col cols="3" class="text-center">
        <div
          @click="navigateTo('/settings')"
          :class="['footer-card', { active: isActive('/settings') }]">
          <v-icon
          class="footer-icon"
          :class="{ 'settings-active': isActive('/settings') }">
            mdi-cog
          </v-icon>
          <div
          :class="[isActive('/settings') ? 'active-text' : 'inactive-text', { 'settings-active': isActive('/settings') }]">
            設定
          </div>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>



<script>
export default {
  name: "Footer",
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    navigateTo(route) {
      this.$router.push(route); // 指定したルートに遷移
    },
  },
};
</script>

<style scoped>
.footer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
  text-decoration: none;
  cursor: pointer;
  height: 100%; /* 高さを100%に設定 */
  margin: 1px;
}

.footer-icon {
  margin-bottom: 1px; /* アイコンを少しテキストから離す */
  font-size: 40px;
  color: grey;
}

.footer-card.active {
  background-color: #f4f4f4; /* アクティブなときの背景色 */
}

.active-text {
  font-weight: 600;
}

.inactive-text {
  color: grey;
  font-weight: 600
}

.calender-active {
  color: #e39e27; /* カレンダーがアクティブなときのテキストの色 */
}

.timetable-active {
  color: #33bae3; /* 時間割がアクティブなときのテキストの色 */
}

.unitcounter-active {
  color: #6dcd66; /* 単位カウンターがアクティブなときのテキストの色 */
}

.settings-active {
  color: #b14a4b; /* 設定がアクティブなときのテキストの色 */
}

/* スマホの縦画面で文字を非表示に */
@media (max-width: 600px) {
  .active-text, .inactive-text {
    display: none; /* 600px以下で非表示に */
  }
}
</style>