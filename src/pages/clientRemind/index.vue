<!--
    客户提醒首页
    by Zengyc 2017-10-18
-->
<template>
  <v-page>
    <v-header>
      <v-back></v-back>
      <h1>客户提醒</h1>
    </v-header>
    <main>
      <v-scroller>
        <ul class="common-ul">
          <li v-for="(item,i) in allData" :key="i" v-tap="[listClick,item]">
            <label v-if="item.subType">
              {{item.subType}}
              <mark>{{item.notFinishAmt}}</mark>
            </label>
            <label v-if="item.subType != null">
              {{item.parType}}-{{item.type}}
              <mark>{{item.notFinishAmt}}</mark>
            </label>
            <a></a>
          </li>
        </ul>
      </v-scroller>
    </main>
  </v-page>
</template>
<script>
export default {
  data() {
    return {
      allData: [],
      title:[]
    };
  },
  created: function() {
    this.CRMQ35();
  },
  methods: {
    listClick(item) {
      this.$go({
         path: "/clueList",
         params: { from: 'clientIndex', item: item }
      });
    },
    CRMQ35() {
      let vm = this;
      this.$http(
        "CRMQ35",
        {
          pageNum: "1",
          pageSize: "5"
        },
        {
          onSuccess(data) {
            console.log(data)
            vm.allData = data.subTypes
          },
          loading: 1
        }
      );
    }
  }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../common/css/index";

.ui-page>main {
  flex-flow: column;
  label {
    position: relative;
  }
}
</style>
