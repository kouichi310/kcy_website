<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col>
          <h1>ここはテスト用ページです（Home.vue）</h1>
          <p>本来はログインしていなければ<a href="/login">ログインページ</a>に飛ばし、</p>
          <p>ログインしていれば<a href="/calender">カレンダーページ</a>に飛ばします。</p>
          <br>
          <h3>いろいろ</h3>
          <li>担当するページ以外のファイルを編集しないこと（ReadOnly）</li>
          <li>担当ページのパスはfrontend/app/src/views/〇〇.vue</li>
          <li>担当ページに既に記述されている内容を削除すると正常に動作しない可能性があるので注意</li>
          <li>セーブすると即Webページに反映されます</li>
          <li><b>なんか画面が真っ白になったとき</b>は、F12を押して「Console」を押すとエラー文が書いてある</li>
          <br>
          <li>figmaのデザイン例はスマホ画面だけど、気にせずに画面全体を使って作ってOK<br>
          （F12とかでスマホ画面で見てみて崩れていないように調整できたら良いかも）<br>
          （スマホ用に見た目を調整したいときは、@media (max-width: 600px)で検索）
          </li>
          <br>
          <li>見た目作成に関してはVuetifyのコンポーネントを使えば開発しやすい</li>
          <li>生成AIに聞くときは、使用技術がVue、Vuetifyであることを明記したほうが良い</li><br>
          <li>バックエンドと通信する必要がある部分は、一旦サンプルデータを適当に用意して開発を進める</li>
          <li>バックエンドからデータを受け取るorデータを送る処理をするコードは作っておいて、コメントアウトしておく</li>
          <li>結合テストのタイミングでバックエンドとのデータ通信をチェック</li>
          <li>受け取るor送るデータ構造についてはNotionかイチパチ_要件定義書.pdfに記載があるはず</li>
          <br><br>
          
          
        </v-col>
      </v-row>

      <h3>適当なVuetifyのサンプル（frontend/app/src/views/Home.vueでコードを見れる）</h3>
      <br>

      <v-row>
        <v-col cols="10">
          <v-btn color="primary">Vuetify ボタン</v-btn>
          <br><br>
          <v-btn block rounded="0" size="x-large">Test Button</v-btn>
          <br>
          <v-btn prepend-icon="mdi-vuetify"> アイコン付き Button </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <!-- テキストフィールド -->
        <v-col cols="6">
          <v-text-field
            label="名前"
            placeholder="名前を入力"
            v-model="name"
          ></v-text-field>
        </v-col>

        <!-- チェックボックス -->
        <v-col cols="6">
          <v-checkbox
            v-model="agree"
            label="利用規約に同意する"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <!-- スイッチ -->
        <v-col cols="6">
          <v-switch
            v-model="notifications"
            label="通知を受け取る"
          ></v-switch>
        </v-col>

        <!-- スライダー -->
        <v-col cols="6">
          <v-slider
            v-model="value"
            :min="0"
            :max="100"
            label="スライダー"
          ></v-slider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              カウンターアプリ
            </v-card-title>
            <v-card-text>
              現在のカウント: {{ count }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="increment">カウントを増やす</v-btn>
              <v-btn @click="reset">リセット</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-container>
        <v-btn color="green" size="large" @click="dialog = true">ダイアログを開く</v-btn>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ダイアログタイトル</span>
            </v-card-title>
            <v-card-text>
              これはダイアログの内容です。ここに詳細な情報を記載できます。
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>

      <v-container>
        <v-tabs v-model="tab" background-color="primary" dark>
          <v-tab v-for="(item, index) in items" :key="index">
            {{ item.title }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, index) in items" :key="index">
            <template v-slot:default>
              <v-card v-if="tab === index">
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>{{ item.content }}</v-card-text>
              </v-card>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </v-container>

    </v-container>
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue'

export default {
  name: 'App',

  components: {
    Footer,
  },

  data: () => ({
    name: '',
    agree: false,
    notifications: false,
    value: 50,
    count: 0,
    dialog: false,
    tab: 0, // 現在のタブのインデックス
    items: [
      { title: 'タブ1', content: 'タブ1の内容' },
      { title: 'タブ2', content: 'タブ2の内容' },
      { title: 'タブ3', content: 'タブ3の内容' },
    ],
  }),

  methods: {
    increment() {
      this.count++;
    },
    reset() {
      this.count = 0;
    },
  }
}
</script>