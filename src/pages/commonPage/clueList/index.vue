<!--
    线索与任务列表
    by Zengyc 2017-10-18
-->
<template>
  <v-page>
    <v-header>
      <v-back></v-back>
      <h1>{{ pageTitle }}</h1>
    </v-header>
    <main>
      <div class="main">
        <v-scroller ref="scroller" :toLoadMore="true" @loadmore="loadmore">
          <v-checkbox-group v-model="selArr" class="clue-group">
            <div v-for="(item,i) in listData" :key="item.title" :class="{'mission-height':divHeight(item)}">
              <div>
                <v-checkbox :label="i">{{ item.parType }}</v-checkbox>
                <span>{{item.subType}}</span>
              </div>
              <div>
                <label>客户名称</label>
                <span class="name-margin" v-tap="[clientClick,item]">{{ item.custName }}
                  <i class="icon-39" />
                </span>
              </div>
              <div>
                <label>预计结束时间</label>
                <span>{{ item.endTime }}</span>
              </div>
              <div>
                <label>联系电话</label>
                <span>{{ item.phoneNum }}</span>
              </div>
              <div v-show="item.parType=='线索' && pageTitle != '消息提醒'">
                <label>来源营销活动</label>
                <span>{{ item.srcCamp }}</span>
              </div>
              <div>
                <label>详细内容</label>
                <span>{{ item.comment }}</span>
              </div>
              <button v-tap="[finishClick,item]">登记</button>
              <div class="clear"></div>
              <span v-show="(item.notFinishAmt > 1)&&item.custEcif">{{ item.notFinishAmt }}</span>
              <p v-show="item.scheduleFlag=='Y'">已设置</p>
            </div>
          </v-checkbox-group>
        </v-scroller>
      </div>
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
      pageNum: 1,
      pageSize: 5,
      pageTitle: "",
      buttonList: ["设置日程", "关闭"],
      selArr: [], //选中的数组
      msgCountArr: [],
      listData: [],
      newData: [],
      update: false
    };
  },
  created: function() {
    if (this.$params.from == 'workManage') {
      this.pageTitle = this.$params.subType
    } else if (this.$params.from == 'clientIndex') {
      this.pageTitle = this.$params.item.subType;
    } else if (this.$params.from == 'home') {
      this.pageTitle = this.$params.title;
    }

  },
  methods: {
    CRMQ36() {
      let vm1 = this;
      if (this.$params.from == 'workManage') {
        this.$http(
          "CRMQ36",
          {
            parType: '线索',
            type: '',
            subType: '',
            custEcif: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rowid: ''
          },
          {
            onSuccess(data) {
              // console.log(data);
              for (let i = 0; i < data.subTypes.length; i++) {
                vm1.newData.push(data.subTypes[i])
              }
              vm1.pageNum += 1;
              vm1.$refs.scroller.end({ nomore: vm1.pageSize > data.subTypes.length });
            },
            loading: 3,
            finally() {
              if (vm1.newData.length > 0) {
                vm1.CRMQ40(vm1.newData);
              }
            }
          }
        );
      } else if (this.$params.from == 'clientIndex') {
        console.log('clientIndex')
        this.$http(
          "CRMQ36",
          {
            parType: this.$params.item.parType,
            type: this.$params.item.type,
            subType: this.$params.item.subType,
            custEcif: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rowid: ''
          },
          {
            onSuccess(data) {
              console.log(data);
              for (let i = 0; i < data.subTypes.length; i++) {
                vm1.newData.push(data.subTypes[i])
              }
              vm1.pageNum += 1;
              vm1.$refs.scroller.end({ nomore: vm1.pageSize > data.subTypes.length });
            },
            loading: 3,
            finally() {
              if (vm1.newData.length > 0) {
                vm1.CRMQ40(vm1.newData);
              }
            }
          }
        );
      } else if (this.$params.from == 'home') {
        console.log('home')
        this.$http(
          "CRMQ36",
          {
            parType: '',
            type: '',
            subType: '',
            custEcif: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            rowid: ''
          },
          {
            onSuccess(data) {
              console.log(data);
              for (let i = 0; i < data.subTypes.length; i++) {
                vm1.newData.push(data.subTypes[i])
              }

              console.log(vm1.newData)
              vm1.pageNum += 1;
              vm1.$refs.scroller.end({ nomore: vm1.pageSize > data.subTypes.length });
            },
            loading: 3,
            finally() {
              if (vm1.newData.length > 0) {
                vm1.CRMQ40(vm1.newData);
              }
            }
          }
        );
      }
    },
    CRMQ40(arr) {
      let vm2 = this
      let custRowIdArr = [];
      console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        custRowIdArr.push(arr[i].custRowId);
      }
      console.log(custRowIdArr)
      // 从工作管理进入销售线索跟进
      if (this.$params.from == 'workManage') {
        this.$http(
          "CRMQ40",
          {
            custRowId: custRowIdArr.join(","), //客户号
            parType: '线索'
          },
          {
            onSuccess(data) {
              // console.log(data);
              for (let i = 0; i < arr.length; i++) {
                for (let q = 0; q < data.subTypes.length; q++) {
                  if (arr[i].custRowId == data.subTypes[q].custRowId) {
                    arr[i].notFinishAmt = data.subTypes[q].notFinishAmt;
                  }
                }
              }
            },
            loading: 1,
            finally() {
              console.log(arr)
              console.log(vm2.listData)
              vm2.listData = arr;
            }
          }
        );
        // 从客户服务进去
      } else if (this.$params.from == 'clientIndex') {
        this.$http(
          "CRMQ40",
          {
            custRowId: custRowIdArr.join(","), //客户号
            parType: this.$params.item.parType
          },
          {
            onSuccess(data) {
              // console.log(data);
              for (let i = 0; i < arr.length; i++) {
                for (let q = 0; q < data.subTypes.length; q++) {
                  if (arr[i].custRowId == data.subTypes[q].custRowId) {
                    arr[i].notFinishAmt = data.subTypes[q].notFinishAmt;
                  }
                }
              }
            },
            loading: 1,
            finally() {
              console.log(arr)
              console.log(vm2.listData)
              vm2.listData = arr;
            }
          }
        );
        // 从首页进去消息提醒
      } else if (this.$params.from == 'home') {
        this.$http(
          "CRMQ40",
          {
            custRowId: custRowIdArr.join(","), //客户号
            parType: ''
          },
          {
            onSuccess(data) {
              // console.log(arr);
              // console.log(data.subTypes);
              for (let i = 0; i < arr.length; i++) {
                for (let q = 0; q < data.subTypes.length; q++) {
                  if (arr[i].custRowId == data.subTypes[q].custRowId) {
                    arr[i].notFinishAmt = data.subTypes[q].notFinishAmt;
                  }
                }
              }
            },
            loading: 1,
            finally() {
              // console.log(arr)
              // console.log(vm2.listData)
              vm2.listData = arr;
            }
          }
        );
      }
    },
    CRMD31(params) {
      console.log(params.join(","));
      let vm3 = this;
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
            vm3.pageNum = 1
            vm3.newData = []
            vm3.listData = []
            vm3.selArr = []
            vm3.CRMQ36()
          },
          loading: 2
        }
      );
    },
    // 错开返回触发上拉后调用接口
    loadmore() {
      if(!this.update) {
        this.CRMQ36()
      }
    },
    divHeight(item) {                 // 任务的总体高度比线索的矮一行
      return item.type === "任务";
    },
    clientClick(item) {
      if ((item.notFinishAmt > 1) && item.custEcif) {
        this.$go({ path: "/personal", params: { item: item } })
      }
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
            vm.$go({ path: "/setSchedule", params: { rowidArr: rowidArr } });
          }
        });
      } else {
        this.$go({ path: "/setSchedule", params: { rowidArr: rowidArr } })
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
            inputMaxlength: 600,
            closable: true,
            callback: () => {
              vm.CRMD31(rowidArr);
            }
          });
          break;
      }
    },
    finishClick(item) {
      console.log(item)
      this.$go({ path: "/finish", params: { item: item } });
    }
  },
  watch: {
    listData() {
      this.$refs.scroller.update()
    }
  },
  activated() {
    console.log(this.$params.success)
    if(this.$params.success == true) {
      console.log(this.$params.success)
      this.update = true
    }
    let vm = this
    setTimeout(function() {
      vm.pageNum = 1
      vm.newData = []
      vm.listData = []
      vm.selArr = []
      vm.CRMQ36();
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
.ui-page>main {
  flex-flow: column;
  display: flex;
  .main {
    overflow: hidden;
    flex: 1;
    .name-margin {
      margin-right: -1.4rem;
    }
    .mission-height {
      // height: 13.2rem !important;
    }
    .clue-group {
      // padding: 0 1rem 2rem;
      &>div {
        &>span {
          position: absolute;
          top: 3.2rem;
          right: 1.4rem;
          padding: 0.1rem;
          min-width: 0.8rem;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 0.1rem;
          text-align: center;
          background: $red-font;
          color: white;
          border-radius: 10rem;
        }
      }
    }
  }
}

.clear {
  clear: both;
}
</style>
