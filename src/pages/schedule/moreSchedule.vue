<!--
    线索与任务列表(通用)
    by Zengyc 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <v-back></v-back>
            <h1>{{ pageTitle }}</h1>
        </v-header>
        <main>
            <v-scroller ref="scroller" :toLoadMore="true">
                <v-checkbox-group v-model="rowidArr" class="clue-group">
                    <div  v-for="(item,i) in customerData" :key="item.title">
                        <div class="item-title">
                            <v-checkbox :label="item.rowid">{{item.type}}</v-checkbox>
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="item-cnt">
                            <label>客户名称</label>
                            <span>{{ item.custName }} <i class="icon-39"/></span>
                        </div>
                        <div class="item-cnt">
                            <label>预计结束时间</label>
                            <span>{{ item.endTime }}</span>
                        </div>
                        <div class="item-cnt">
                            <label>联系电话</label>
                            <span>{{ item.phoneNum }}</span>
                        </div>
                        <div class="item-cnt" v-if="item.srcCamp">
                            <label>来源营销活动</label>
                            <span>{{ item.srcCamp }}</span>
                        </div>
                        <div class="item-cnt">
                            <label>详细内容</label>
                            <span>{{ item.comment }}</span>
                        </div>
                        <button v-tap="[finishClick,item]">登记</button>
                        <span>2</span>
                    </div>
                </v-checkbox-group>
            </v-scroller>
        </main>
        <div class="footer">
            <button style="width:100%" :key="i" v-tap="[toolsClick,i]">{{buttonList}}</button>
        </div>
    </v-page>
</template>
<script>
export default {
  data() {
    return {
      pageSize:5,
      pageTitle: "日程关联的提醒",
      buttonList: "关闭",
      rowidArr: [],
      customerData:[],
      rowid: ''
    };
  },
  created: function() {
    this.CRMQ41()
    if (this.$params.from == 'schedule') {
        this.rowid = this.$params.rowid
    }
    console.log(this.$params.rowid)
  },
  methods: {
    CRMQ41() {
      let vm = this;
      this.$http(
        "CRMQ41",{
          UserNum: '01340962',
          rowid: vm.$params.rowid,
          pageNum: 1,
          pageSize: 15
        }, {
          onSuccess(data) {
            console.log(data)
            vm.customerData = data.subTypes;
            // vm.pageSize+=5
          },
          loading: 3,
          scroller:this.$refs.scroller
        }
      );
    },
    toolsClick(i) {
      switch (i) {
        case 0:
          this.$go("/setSchedule");
          break;
        case 1:
          this.$refs.scroller.end({ nomore: true });
          break;
      }
    },
    finishClick(item) {
      if (this.rowidArr.length == 0) {
          this.$alert({ title: "提示", text: "请选择任务或线索" });
          return;
      }
      this.$go({ path: "/finish", params: item });
    },
    CRMD31() {
          let vm = this;
          this.$http(
              "CRMD31",
              {
                  operateType: "close",
                  rowid: this.form.rowid
              },
              {
                  onSuccess(data) {
                      vm.CRMQ34()
                      vm.$toast('该日程已删除');
                      
                  },
                  loading: 2
              }
          );
      },
  }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../common/css/index";

.ui-page > main {
  flex-flow: column;
  .clue-group {
    padding: 0 1rem 2rem;
    & > div {
      position: relative;
      margin-top: 1rem;
      padding-bottom: 3rem;
      padding-top: 0.8rem;
      background-color: white;
      border-radius: 0.6rem;
      & > div {
        overflow: hidden;
        padding: 0.3rem 0.8rem;
        & > div {
          float: left;
        }
        & > span {
          float: right;
        }
      }
      & > div:nth-child(1) {
        & > span {
          line-height: 2;
        }
      }
      & > button {
        float: right;
        padding: 0.3rem;
        margin: 0.1rem 0.6rem;
        background-color: white;
        color: rgb(217, 80, 61);
      }
      & > span {
        position: absolute;
        top: 3.6rem;
        right: 1.3rem;
        width: 0.8rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.1rem;
        text-align: center;
        background: $red-font;
        color: white;
        border-radius: 50%;
      }
    }
  }
}
.item-title{
    .ui-checkbox{
        label{
          font-size: 1.2rem;
        }
    }
    span{
        font-size: 1.2rem;
    }
}
.item-cnt{
    color: #999;
}

.ui-page > .footer {
  overflow: hidden;
  background-color: white;
  & > button {
    float: left;
    padding: 0.8rem 1rem;
    width: 50%;
    background-color: #fa6159;
    color: white;
  }
  & > button:nth-child(2) {
    background-color: gray;
  }
  & > button:nth-child(3) {
    background-color: #b5b0b0;
  }
}
</style>
