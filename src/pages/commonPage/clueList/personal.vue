<!--
    线索与任务列表(个人)
    by Zengyc 2017-10-18
-->
<template>
  <v-page>
    <v-header>
      <v-button @click="back">
        <i class="icon-38"></i>
      </v-button>
      <h1>客户{{clientName}}待处理工作</h1>
    </v-header>
    <main>
      <v-scroller ref="scroller" :toLoadMore="true" @loadmore="loadmore">
        <v-checkbox-group v-model="selArr" class="clue-group">
          <div v-for="(item,i) in listData" :key="item.title" :class="{'mission-height':divHeight(item)}">
            <div>
              <v-checkbox :label="i">{{ item.parType }}</v-checkbox>
            </div>
            <div>
              <label>预计结束时间</label>
              <span>{{ item.endTime }}</span>
            </div>
            <div>
              <label>联系电话</label>
              <span>{{ item.phoneNum }}</span>
            </div>
            <div v-show="item.parType=='线索'">
              <label>来源营销活动</label>
              <span>{{ item.srcCamp }}</span>
            </div>
            <div>
              <label>详细内容</label>
              <span>{{ item.comment }}</span>
            </div>
            <button v-tap="[finishClick,item]">登记</button>
            <div class="clear"></div>
            <p v-show="item.scheduleFlag=='Y'">已设置</p>
          </div>
        </v-checkbox-group>
      </v-scroller>
    </main>
    <div class="footer">
      <button v-for="(item,i) in buttonList" :key="i" v-tap="[toolsClick,i,item]">{{item}}</button>
    </div>
  </v-page>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      clientName: '',
      pageNum: 1,
      pageSize: 5,
      buttonList: ["设置日程", "关闭"],
      selArr: [], //选中的数组
      listData: []
    };
  },
  created: function() {
    this.clientName = this.$params.item.custName
    console.log(1)
    console.log(this.$params.item)
  },
  methods: {
    CRMQ36(params) {
      let vm = this;
      this.$http(
        "CRMQ36",
        {
          parType: '',
          type: '',
          subType: '',
          custEcif: this.$params.item.custEcif,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          rowid: ''
        },
        {
          onSuccess(data) {
            console.log(data);
            for (let i = 0; i < data.subTypes.length; i++) {
              vm.listData.push(data.subTypes[i])
            }
            vm.pageNum += 1;
            vm.$refs.scroller.end({ nomore: vm.pageSize > data.subTypes.length });
          },
          loading: 3,
        }
      );
    },
    CRMD31(params) {
      console.log(params.join(","))
      let vm = this;
      this.$http(
        "CRMD31",
        {
          operateType: "close",
          rowid: params.join(","),
          eventName: '',
          loacation: '',
          comment: '',
          contactDate: '',
          activeContactFlg: 'Y',
          feedbackFlag: 'Y',
          contactedFlag: 'Y'
        },
        {
          onSuccess(data) {
            vm.pageNum = 1
            vm.listData = []
            vm.selArr = []
            vm.CRMQ36()
          },
          loading: 2
        }
      );
    },
    back() {
      this.$back({
        transition: this.transition,
        params: { success: true }
      })
    },
    loadmore() {
      if(!this.update) {
        this.CRMQ36()
      }
    },
    divHeight(item) {
      return item.type === "任务";
    },
    done() {                          // 提示有多少条任务/线索已设置
      let vm = this
      let count = 0
      for (let i = 0; i < this.selArr.length; i++) {
        if (this.listData[this.selArr[i]].scheduleFlag == 'Y') {
          count++
        }
      }
      // 创一个放客户号的数组
      let rowidArr = []
      for (let i = 0; i < this.selArr.length; i++) {
        rowidArr.push(this.listData[this.selArr[i]].rowid)
      }
      if (count > 0) {
        this.$confirm({
          title: "提示",
          text: '你有' + count + '条【任务/线索】已设置日程，请确认是否变更日程安排？',
          closable: true,
          callback: () => {
            vm.$go({ path: "/setSchedule", params: rowidArr });
          }
        });
      } else {
        this.$go({ path: "/setSchedule", params: rowidArr })
      }
    },
    toolsClick(i, item) {
      // 创一个放客户号的数组
      let rowidArr = []
      for (let i = 0; i < this.selArr.length; i++) {
        rowidArr.push(this.listData[this.selArr[i]].rowid)
      }
      if (this.selArr.length == 0) {
        this.$alert({ title: "提示", text: "请选择任务或线索" });
        return;
      }
      let vm = this;
      switch (i) {
        case 0:
          this.done()
          break;
        case 1:
          this.$confirm({
            title: "请填写关闭原因",
            inputValue: "",
            inputType: "text",
            inputMaxlength: 150,
            closable: true,
            callback: () => {
              vm.CRMD31(rowidArr);
            }
          });
          break;
      }
    },
    finishClick(item) {
      this.$go({ path: "/finish", params: { item: item } });
    }
  },
  activated() {
    let vm = this
    setTimeout(function() {
      vm.pageNum = 1
      vm.listData = []
      vm.selArr = []
      vm.CRMQ36(vm.$params);
    }, 500);
    // 错开返回触发上拉后调用接口
    setTimeout(function() {
      vm.update = false
      vm.$refs.scroller.end()
    }, 1500);
  }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../clueList/css/index.scss";
.mission-height {
  height: 11rem !important;
}

.clear {
  clear: both;
}
</style>
