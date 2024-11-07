<template> 
  <v-container fluid> 
    <!-- Header with Selected Grade and Class -->
    <v-row justify="center">
      <v-col cols="6" md="6">
        <v-card class="header" justify="center" color="grey lighten-4" elevation="2">
          <h1 class="text-center display-2">{{ selectedGrade }}{{ selectedClass }}</h1>
        </v-card>
      </v-col>
    </v-row>

    <!-- Weekday Header -->
    <v-row justify="center">
      <v-col v-for="(day, dayIndex) in weekdays" :key="dayIndex" cols="2" md="2">
        <v-card class="weekday-card">{{ day }}</v-card>
      </v-col>
    </v-row>
    <!-- Schedule Table -->
    <v-row justify="center">
      <v-col cols="2" md="2" class="pa-0"> 
        <v-card v-for="(time,timeIndex) in timePeriods" :key="timeIndex" class="timetable-card"> 
          {{ time }} 
        </v-card> 
      </v-col> 

      <v-col
        v-for="(column, colIndex) in timetableColumns"
        :key="colIndex"
        cols="2"
        md="2"
        class = "pa-0"
      >
        <v-card
          v-for="(row, rowIndex) in timetableRows"
          :key="rowIndex"
          class = "timetable-card"
        >
        {{ scheduleData[selectedGrade][selectedClass][colIndex][rowIndex].content }}
        </v-card>
      </v-col>
    </v-row>

    <!-- Grade Buttons -->
    <v-row class = "button">
      <v-col>
        <v-btn-toggle v-model="selectedGrade" mandatory>
          <v-btn v-for="grade in grades" :key="grade" :value="grade" :class="{ 'v-btn--active': selectedGrade === grade }">
            {{ grade }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Class Buttons -->
    <v-row class = "button">
      <v-col>
        <v-btn-toggle v-model="selectedClass" mandatory>
          <v-btn v-for="cls in classes" :key="cls" :value="cls" :class="{ 'v-btn--active': selectedClass === cls }">
            {{ cls }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <Footer />
  </v-container>
</template>

<script> 
// Footerコンポーネントをインポート 
import Footer from '../components/Footer.vue'; 
 
export default { 
  name: 'App', 

  components: { 
    Footer, 
  }, 
 
  data() { 
    return { 
      selectedGrade: '1',  // 初期選択
      selectedClass: 'J',  // 初期選択
      grades: ['1', '2', '3', '4', '5'],  // 学年
      classes: ['M', 'E', 'D', 'J', 'C'],  // 学科
      weekdays:[' ', '月', '火', '水', '木', '金'], // 曜日
      timePeriods: ['1,2限', '3,4限', '5,6限', '7,8限'], // 時限
      timetableRows: Array.from({ length: 4 }), // 縦列(時限)
      timetableColumns: Array.from({ length: 5 }), //　横列(曜日) 
      // 5学年 × 5学科 × 5曜日 × 4限のデータ
      scheduleData: {
        '1': this.generateEmptySchedule(),
        '2': this.generateEmptySchedule(),
        '3': this.generateEmptySchedule(),
        '4': this.generateEmptySchedule(),
        '5': this.generateEmptySchedule(),
      }
    } 
  },

  methods: {
    // 空のスケジュールを生成する関数
    generateEmptySchedule() {
      return {
        'M': Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ content : '' }))),
        'E': Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ content : '' }))),
        'D': Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ content : '' }))),
        'J': Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ content : '' }))),
        'C': Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ content : '' }))),
      };
    },

    // サンプルデータを設定する関数(4次元配列 this.scheduleData['[学年]']['[学科]'][[曜日(0~4)]][時限(0~3)])
    setSampleSchedule() {
    //1年M科
      this.scheduleData['1']['M'][0][0] = { content: '英語(G)B\n岩崎'};
      this.scheduleData['1']['M'][0][1] = { content: '工学実験IB\n[実]\n石出\n歸山'}
      this.scheduleData['1']['M'][0][2] = { content: '基礎数学II\n山下'}
      this.scheduleData['1']['M'][0][3] = { content: '図学製図II\n松井'}

      this.scheduleData['1']['M'][1][0] = { content: '基礎数学III\n平井'};
      this.scheduleData['1']['M'][1][1] = { content: '物理学I\n高谷'}
      this.scheduleData['1']['M'][1][2] = { content: '技術者入門II\n[講6]\n歸山\n板垣\n小田\n青葉\n松井'}

      this.scheduleData['1']['M'][2][0] = { content: '保健体育IB\n坂田'};
      this.scheduleData['1']['M'][2][1] = { content: '芸術\n[講6]\n(馬場)'}
      this.scheduleData['1']['M'][2][2] = { content: '国語IB\n加田'}
      this.scheduleData['1']['M'][2][3] = { content: '課題学習時間'}

      this.scheduleData['1']['M'][3][0] = { content: '地理B\n(川元)'};
      this.scheduleData['1']['M'][3][1] = { content: '基礎数学II\n山下'}
      this.scheduleData['1']['M'][3][2] = { content: '情報処理II\n[ネ]\n伊藤\n青葉'}
      this.scheduleData['1']['M'][3][3] = { content: 'HR\n山下'}

      this.scheduleData['1']['M'][4][0] = { content: '英語(LS)IB\n[特]\n瀬川'};
      this.scheduleData['1']['M'][4][1] = { content: '基礎化学IB\n柳下'}
      this.scheduleData['1']['M'][4][2] = { content: '英語(RW)IB\n小川'}
      this.scheduleData['1']['M'][4][3] = { content: '課題学習時間'}

    //2年M科
      this.scheduleData['2']['M'][0][0] = { content: '線形代数IB\nN鈴木'};
      this.scheduleData['2']['M'][0][1] = { content: '保健体育IIB\n清野'}
      this.scheduleData['2']['M'][0][2] = { content: '英語IIIB\n小澤'}
      this.scheduleData['2']['M'][0][3] = { content: '課題学習時間'}

      this.scheduleData['2']['M'][1][0] = { content: '機構学I\n歸山'};
      this.scheduleData['2']['M'][1][1] = { content: '国語IIB\n加藤'}
      this.scheduleData['2']['M'][1][2] = { content: '物理学IIB\n嘉数'}

      this.scheduleData['2']['M'][2][0] = { content: '化学IB\nN佐久間'};
      this.scheduleData['2']['M'][2][1] = { content: '制作実習I\n[実]\n松井'}
      this.scheduleData['2']['M'][2][2] = { content: '制作実習I\n[実]\n松井'}
      this.scheduleData['2']['M'][2][3] = { content: '課題学習時間'}

      this.scheduleData['2']['M'][3][0] = { content: '英語IVB\n[特]\n岩崎'};
      this.scheduleData['2']['M'][3][1] = { content: '工学実験II\n[プA,プB]\n高橋\n板垣\n松井'}
      this.scheduleData['2']['M'][3][2] = { content: '微分積分IB\n田所'}
      this.scheduleData['2']['M'][3][3] = { content: 'HR\n柴田'}

      this.scheduleData['2']['M'][4][0] = { content: '微分積分IB\n田所'};
      this.scheduleData['2']['M'][4][1] = { content: '工業力学II\n伊藤'}
      this.scheduleData['2']['M'][4][2] = { content: '歴史B\n武長'}
      this.scheduleData['2']['M'][4][3] = { content: '課題学習時間'}
    
    //3年M科
      this.scheduleData['3']['M'][0][0] = { content: '体育IB\n田川\n(篠村)'};
      this.scheduleData['3']['M'][0][1] = { content: '物理学IV\n福地'}
      this.scheduleData['3']['M'][0][2] = { content: '英語VB\n福士'}
      this.scheduleData['3']['M'][0][3] = { content: '課題学習時間'}

      this.scheduleData['3']['M'][1][0] = { content: '微分積分III\n阿部'};
      this.scheduleData['3']['M'][1][1] = { content: '機械工作法I\n松井'}
      this.scheduleData['3']['M'][1][2] = { content: '一般特別セミナー\nプロジェクト実習\n(各講義教室等)\n人文・基礎学兄教員\n専門学科教員'}

      this.scheduleData['3']['M'][2][0] = { content: '材料力学I\n高橋'};
      this.scheduleData['3']['M'][2][1] = { content: '工学実験IIIB\n小田\n高橋\n青葉\n石出'}
      this.scheduleData['3']['M'][2][2] = { content: '設計製図III\n[M]\n板垣'}
      this.scheduleData['3']['M'][2][3] = { content: '課題学習時間'}

      this.scheduleData['3']['M'][3][0] = { content: '現代社会B\n小谷'};
      this.scheduleData['3']['M'][3][1] = { content: '材料学II\n青葉'}
      this.scheduleData['3']['M'][3][2] = { content: 'ドイツ語IB\n柴田'}
      this.scheduleData['3']['M'][3][3] = { content: 'HR\n高橋'}

      this.scheduleData['3']['M'][4][0] = { content: '化学II\n[講1]\nN佐久間\n柳下'};
      this.scheduleData['3']['M'][4][1] = { content: '計測工学II\n小田'}
      this.scheduleData['3']['M'][4][2] = { content: '線形代数II\nN関口'}
      this.scheduleData['3']['M'][4][3] = { content: '課題学習時間'}
    
    //4年M科
      this.scheduleData['4']['M'][0][0] = { content: '材料力学III\n高橋'};
      this.scheduleData['4']['M'][0][1] = { content: '中国語IB[講1]\n(田)\n中国語IB[階]\n(安)\n中国語IB[ワB]\n(儲)\nドイツ語IIB[講5]\n柴田'}
      this.scheduleData['4']['M'][0][2] = { content: '応用物理実験\n[講3,物]\n福地\n高谷\n嘉数'}
      this.scheduleData['4']['M'][0][3] = { content: '課題学習時間'}

      this.scheduleData['4']['M'][1][0] = { content: '工学実験IVB\n内田\n伊藤\n板垣\n小田'};
      this.scheduleData['4']['M'][1][1] = { content: '国語表現\n田嶋'}
      this.scheduleData['4']['M'][1][2] = { content: '制作実習IV\n[実]\n伊藤'}

      this.scheduleData['4']['M'][2][0] = { content: '英語演習IB[講1]\n小澤\n英語演習IB[階]\n岩崎\n英会話IB[ワA]\n(グラント)\n英会話IB[ワB]\n(ヘイゲン)'};
      this.scheduleData['4']['M'][2][1] = { content: '応用数学B\n[講1]\n山下'}
      this.scheduleData['4']['M'][2][2] = { content: '流体力学II\n石出'}
      this.scheduleData['4']['M'][2][3] = { content: '設計法I\n高橋'}

      this.scheduleData['4']['M'][3][0] = { content: '機械力学I\n板垣'};
      this.scheduleData['4']['M'][3][1] = { content: '哲学B[階]\n小谷\n経済学B[講1]\n武長\n社会学[講3]\n(杉谷)'}
      this.scheduleData['4']['M'][3][2] = { content: '課題研究\nM科全教員'}

      this.scheduleData['4']['M'][4][0] = { content: '熱力学II\n伊藤'};
      this.scheduleData['4']['M'][4][1] = { content: '電気工学演習\n内田\n歸山'}
      this.scheduleData['4']['M'][4][2] = { content: '課題学習時間'}
      this.scheduleData['4']['M'][4][3] = { content: '課題学習時間'}

    //5年M科
      this.scheduleData['5']['M'][0][1] = { content: '卒業研究\nM科全教員'};
      this.scheduleData['5']['M'][0][2] = { content: '中国語IB[講1]\n(田)\n中国語IB[階]\n(安)\n中国語IB[ワB]\n(儲)\nドイツ語IIB[講5]\n柴田'}
      this.scheduleData['5']['M'][0][3] = { content: '課題学習時間'}

      this.scheduleData['5']['M'][1][1] = { content: '制御工学II\n[講3]\n内田'};
      this.scheduleData['5']['M'][1][2] = { content: '卒業研究\nM科全教員'}

      this.scheduleData['5']['M'][2][0] = { content: '論文作成技法\n[講3]\n小田'};
      this.scheduleData['5']['M'][2][1] = { content: '工業英語演習\n[図フ]\n板垣}
      this.scheduleData['5']['M'][2][2] = { content: ''卒業研究\nM科全教員}
      this.scheduleData['5']['M'][2][3] = { content: ''課題学習時間}

      this.scheduleData['5']['M'][3][0] = { content: ''工学演習IV[ワA]\n小田};
      this.scheduleData['5']['M'][3][1] = { content: ''体育III\nH大野}
      this.scheduleData['5']['M'][3][2] = { content: ''卒業研究\nM科全教員}

      this.scheduleData['5']['M'][4][0] = { content: ''工学演習III\n[M]\n内田};
      this.scheduleData['5']['M'][4][1] = { content: ''卒業研究\nM科全教員}
      this.scheduleData['5']['M'][4][2] = { content: ''卒業研究\nM科全教員}
      this.scheduleData['5']['M'][4][3] = { content: ''課題学習時間}

    //1年J科
      this.scheduleData['1']['J'][0][0] = { content: '国語IB\n加田'};
      this.scheduleData['1']['J'][0][1] = { content: '基礎数学II\nN鈴木'}
      this.scheduleData['1']['J'][0][2] = { content: 'コンピュータ入門\n[講2]\n吉澤\n安井'}
      this.scheduleData['1']['J'][0][3] = { content: '基礎数学III\n平井'}

      this.scheduleData['1']['J'][1][0] = { content: '英語G(B)\n小澤'};
      this.scheduleData['1']['J'][1][1] = { content: 'コンピュータ演習II\n[講2]\n米村\n和田'}
      this.scheduleData['1']['J'][1][2] = { content: '技術者入門II\n[講2]\n米村\n和田\n能城'}

      this.scheduleData['1']['J'][2][0] = { content: '芸術\n[講6]\n(馬場)'}
      this.scheduleData['1']['J'][2][1] = { content: '実験・実習IB\n[講2]\n米村\n安井'}
      this.scheduleData['1']['J'][2][2] = { content: '物理学I\n高谷'}
      this.scheduleData['1']['J'][2][3] = { content: '課題学習時間'}

      this.scheduleData['1']['J'][3][0] = { content: '英語(RW)IB\n小川'}
      this.scheduleData['1']['J'][3][1] = { content: '基礎化学IB\n栁下'}
      this.scheduleData['1']['J'][3][2] = { content: '英語(LS)IB\n[得]\n瀬川'}
      this.scheduleData['1']['J'][3][3] = { content: 'HR\nN鈴木'}

      this.scheduleData['1']['J'][4][0] = { content: '保健体育IB\n坂田'}
      this.scheduleData['1']['J'][4][1] = { content: '地理B\n(川元)'}
      this.scheduleData['1']['J'][4][2] = { content: '基礎数学II\n鈴木'}
      this.scheduleData['1']['J'][4][3] = { content: '課題学習時間'}

    //2年J科
      this.scheduleData['2']['J'][0][0] = { content: '微分積分IB\n佐野'}
      this.scheduleData['2']['J'][0][1] = { content: '英語IVB\n[特]\n岩崎'}
      this.scheduleData['2']['J'][0][2] = { content: '電気回路II\n和崎'}
      this.scheduleData['2']['J'][0][3] = { content: '課題学習時間'}

      this.scheduleData['2']['J'][1][0] = { content: '物理学IIB\n嘉数'}
      this.scheduleData['2']['J'][1][1] = { content: '英語IIIB\n小澤'}
      this.scheduleData['2']['J'][1][2] = { content: '歴史B\n武長'}
      this.scheduleData['2']['J'][1][3] = { content: '一般特別セミナー'}

      this.scheduleData['2']['J'][2][0] = { content: 'プログラミング基礎II\n[図マ]\n大枝'}
      this.scheduleData['2']['J'][2][1] = { content: '国語IIB\n加藤'}
      this.scheduleData['2']['J'][2][2] = { content: '実験・実習IIB\n[講2]\n斎藤\n吉澤\n安井'}
      this.scheduleData['2']['J'][2][3] = { content: '課題学習時間'}

      this.scheduleData['2']['J'][3][0] = { content: '論理回路II\n[講2]\n吉澤'}
      this.scheduleData['2']['J'][3][1] = { content: '化学IB\nN佐久間'}
      this.scheduleData['2']['J'][3][2] = { content: '線形代数IB\n(川崎)'}
      this.scheduleData['2']['J'][3][3] = { content: 'HR\n福士'}

      this.scheduleData['2']['J'][4][1] = { content: '保健体育IIB\n清野'}
      this.scheduleData['2']['J'][4][2] = { content: 'プログラミング演習IB\n[図マ]\n大枝'}
      this.scheduleData['2']['J'][4][3] = { content: '課題学習時間'}

    //3年J科
      this.scheduleData['3']['J'][0][1] = { content: '物理学IV\n(藤本)'}
      this.scheduleData['3']['J'][0][2] = { content: '線形代数II\nN関口'}
      this.scheduleData['3']['J'][0][3] = { content: '課題学習時間'}

      this.scheduleData['3']['J'][1][0] = { content: '実験・実習IIIB\n和崎\n丸山'}
      this.scheduleData['3']['J'][1][1] = { content: '微分積分III\n阿部'}
      this.scheduleData['3']['J'][1][2] = { content: '一般特別セミナー\nプロジェクト実習'}

      this.scheduleData['3']['J'][2][0] = { content: '体育IB\n田川\n(篠村)'}
      this.scheduleData['3']['J'][2][1] = { content: 'ドイツ語IB\n柴田'}
      this.scheduleData['3']['J'][2][2] = { content: 'データ構造とアルゴリズムII\n[図マ]\nサプコタ'}
      this.scheduleData['3']['J'][2][3] = { content: '課題学習時間'}

      this.scheduleData['3']['J'][3][0] = { content: 'プログラミング演習IIB\n[図マ]\nサプコタ'}
      this.scheduleData['3']['J'][3][1] = { content: 'コンピュータアーキテクチャII\n[講2]\n能城'}
      this.scheduleData['3']['J'][3][2] = { content: '英語VB\n福士'}
      this.scheduleData['3']['J'][3][3] = { content: 'HR\n安井'}

      this.scheduleData['3']['J'][4][0] = { content: '化学II\n[階]\n柳下\nN佐久間'}
      this.scheduleData['3']['J'][4][1] = { content: '情報数学II\n和田'}
      this.scheduleData['3']['J'][4][2] = { content: '現代社会B\n小谷'}
      this.scheduleData['3']['J'][4][3] = { content: 'ネットワーク入門II\n[図マ]\n斎藤'}

    //4年J科
      this.scheduleData['4']['J'][0][0] = { content: '計算機インタフェースII\n[講2]\n(J栗本)'}
      this.scheduleData['4']['J'][0][1] = { content: '中国語IB[講1]\n(田)\n中国語IB[階]\n(安)\n中国語IB[ワB]\n(儲)\nドイツ語IIB[講5]\n柴田'}
      this.scheduleData['4']['J'][0][2] = { content: 'プログラミング演習IIIB\n[図マ]\n丸山'}
      this.scheduleData['4']['J'][0][3] = { content: '課題学習時間'}

      this.scheduleData['4']['J'][1][0] = { content: '課題研究\nJ科全教員'}
      this.scheduleData['4']['J'][1][1] = { content: 'プレゼンテーション技法\n[図マ]\n吉澤\nサプコタ'}
      this.scheduleData['4']['J'][1][2] = { content: '課題学習時間'}
      
      this.scheduleData['4']['J'][2][0] = { content: '英語演習IB[講1]\n小澤\n英語演習IB[階]\n岩崎\n英会話IB[ワA]\n(グラント)\n英会話IB[ワB]\n(ヘイゲン)'}
      this.scheduleData['4']['J'][2][1] = { content: '応用数学B\n[講1]\n山下'}
      this.scheduleData['4']['J'][2][2] = { content: '課題学習時間'}
      this.scheduleData['4']['J'][2][3] = { content: '課題研究\nJ科全教員'}

      this.scheduleData['4']['J'][3][0] = { content: 'オペレーティングシステムII\n和崎'}
      this.scheduleData['4']['J'][3][1] = { content: '哲学B[階]\n小谷\n経済学B[講1]\n武長\n社会学[講3]\n(杉谷)'}
      this.scheduleData['4']['J'][3][2] = { content: '言語処理系\n[講2]\n丸山'}

      this.scheduleData['4']['J'][4][0] = { content: 'プログラミング言語II\n[図マ]\n大枝'}
      this.scheduleData['4']['J'][4][1] = { content: '国語表現\n田嶋'}
      this.scheduleData['4']['J'][4][2] = { content: '工業英語\n[講2]\nサプコタ'}
      this.scheduleData['4']['J'][4][3] = { content: '情報セキュリティII\n[講2]\n米村'}

    //5年J科
      this.scheduleData['5']['J'][0][0] = { content: 'ネットワークシステムI\n[計]\n下馬場'};
      this.scheduleData['5']['J'][0][1] = { content: '画像情報システム\n[計]\n和崎'};
      this.scheduleData['5']['J'][0][2] = { content: '中国語IIA\n[階]\n(田)\n中国語IIA\n[講2]\n(安)\nドイツ語IIIA\n[講5]\n柴田'};
      this.scheduleData['5']['J'][0][3] = { content: '信号処理工学\n[講2]\n安井'};

      this.scheduleData['5']['J'][1][0] = { content: 'バイオインフォマティクス\n[図マ]\nサプコタ'};
      this.scheduleData['5']['J'][1][1] = { content: '体育III\nH大野'};
      this.scheduleData['5']['J'][1][2] = { content: 'データマイニング\n[図マ]\n大枝'};

      this.scheduleData['5']['J'][2][0] = { content: '卒業研究\nJ科全教員'};
      this.scheduleData['5']['J'][2][1] = { content: '分散情報システム\n[図マ]\n丸山'};
      this.scheduleData['5']['J'][2][2] = { content: '情報理論II\n[講5]\n和田'};
      this.scheduleData['5']['J'][2][3] = { content: '課題学習時間'};

      this.scheduleData['5']['J'][3][0] = { content: '卒業研究\nJ科全教員'};
      this.scheduleData['5']['J'][3][1] = { content: 'メディアデザイン\n[図マ]\n吉澤'};
      this.scheduleData['5']['J'][3][2] = { content: '卒業研究\nJ科全教員'};

      this.scheduleData['5']['J'][4][0] = { content: '卒業研究\nJ科全教員'};
      this.scheduleData['5']['J'][4][1] = { content: '計測システム\n[講2]\nサプコタ'};
      this.scheduleData['5']['J'][4][2] = { content: '課題学習時間'};
      this.scheduleData['5']['J'][4][3] = { content: '課題学習時間'};
    }
  },

  mounted() {
    // サンプルデータを設定
    this.setSampleSchedule();
  }
} 
</script> 

<style scoped> 
.header { 
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.weekday-card {
  border: none; 
  box-shadow: none; 
  text-align: center;
  font-weight: bold;
}

.timetable-card {
  border: 1px solid #e9f3ea;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: pre-line;
}

.button {
  text-align: center;
}

.v-btn--active {
  background-color: #4CAF50;
  color: white;
}
</style>