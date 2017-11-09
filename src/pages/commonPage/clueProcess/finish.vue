<!--
    线索or任务登记(通用)
    by Zengyc 2017-10-18
-->
<template>
  <v-page>
    <v-header>
      <v-button @click="back">
        <i class="icon-38"></i>
      </v-button>
      <h1>{{ pageTitle }}</h1>
      <v-button @click="save">保存</v-button>
    </v-header>
    <main>
      <v-scroller>
        <ul class="common-ul">
          <li>
            <label>联系日期</label>
            <a class="select" v-date-picker="{model:contactDate,max:maxDate,min:minDate}">请选择</a>
          </li>
          <li>
            <label>联系渠道</label>
            <a class="select" v-picker="{model:callerTypeCd,data:channelData}"></a>
          </li>
          <li>
            <label>回复类型
              <span class="star">*</span>
            </label>
            <a class="select" v-picker="{model:outComeCode,data:typeData}"></a>
          </li>
          <li>
            <v-input placeholder="请输入备注" v-model="comments" :maxlength="200">
              <label>结果备注
                <span class="star">*</span>
              </label>
            </v-input>
          </li>
        </ul>
        <v-button @click="submit">提交</v-button>
      </v-scroller>
    </main>
  </v-page>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      pageTitle: "",
      now: new Date(),
      contactDate: new Date().format("YmdHi"),
      minDate: new Date().add("-1y").format("YmdHi"),
      maxDate: new Date().format("YmdHi"),
      comments: "",

      callerTypeCd: 0,
      channelData: [
        { text: "电话", value: 0 },
        { text: "短信", value: 1 },
        { text: "信函", value: 2 },
        { text: "面谈", value: 3 },
        { text: "E-mial", value: 4 },
        { text: "其他", value: 5 }
      ],
      outComeCode: 0,
      typeData: [
        { text: "有兴趣", value: 0 },
        { text: "不感兴趣", value: 1 },
        { text: "不接受回访", value: 2 },
        { text: "其他", value: 3 },
        { text: "取得联系但非本人", value: 4 },
        { text: "客户不知情", value: 5 },
        { text: "客户本人办理", value: 6 },
        { text: "客户知情", value: 7 },
        { text: "客户知情且愿意参加活动", value: 8 },
        { text: "客户转介他人办理", value: 9 },
        { text: "已到网点咨询服务需考虑", value: 10 },
        { text: "已到网点咨询资金未到位", value: 11 },
        { text: "已联系上未到网点跟进中", value: 12 },
        { text: "无法取得联系", value: 13 },
        { text: "致电三次以上未联系上或空错号", value: 14 }
      ]
    };
  },
  created: function() {
    console.log(this.$params.item)
    this.CRMQ36()
    this.pageTitle = this.$params.type == "任务" ? "任务登记" : "销售线索登记";
  },
  methods: {
    save() {
      if (this.comments) {
        this.CRMD34()
        this.$back({
          transition: this.transition,
          params: { success: true }
        })
        this.$toast('保存成功')
      } else {
        this.$toast('结果备注不能为空')
      }
    },
    submit() {
      if (this.comments) {
        this.CRMD31()
        this.$back({
          transition: this.transition,
          params: { success: true }
        })
        this.$toast('提交成功')
      } else {
        this.$toast('结果备注不能为空')
      }
    },
    CRMD31() {
      let vm = this;
      console.log(vm.typeData[vm.outComeCode].text)
      this.$http(
        "CRMD31",
        {
          operateType: "finish",
          rowid: vm.$params.item.rowid,
          callerTypeCd: vm.channelData[vm.callerTypeCd].text,
          outComeCode: vm.typeData[vm.outComeCode].text,
          comment: vm.comments,
          contactDate: vm.contactDate.timeFormat('m/d/Y'),
          activeContactFlg: 'Y',
          feedbackFlag: 'Y',
          contactedFlag: 'Y'
        },
        {
          onSuccess(data) {
            // console.log(data)
          },
          loading: 2
        }
      );
    },
    CRMD34() {
      let vm = this;
      console.log(vm.$params.item.rowid)
      this.$http(
        "CRMD34",
        {
          rowid: vm.$params.item.rowid,
          startTime: '',
          endTime: '',
          commentDetail: '',
          freeTime: '',
          remind: '',
          callerTypeCd: vm.channelData[vm.callerTypeCd].text,
          outComeCode: vm.typeData[vm.outComeCode].text,
          commentResult: vm.comments,
          contactDate: vm.contactDate.timeFormat('m/d/Y'),
          activeContactFlg: 'Y',
          feedbackFlag: 'Y',
          contactedFlag: 'Y'
        },
        {
          onSuccess(data) {
            // console.log(data)
          },
          loading: 2
        }
      );
    },
    CRMQ36() {
      let vm = this;
      // console.log(this.$params.item.rowid)
      this.$http(
        "CRMQ36",
        {
          parType: this.$params.item.parType,
          type: this.$params.item.type,
          subType: this.$params.item.subType,
          custEcif: this.$params.item.custEcif,
          pageNum: 1,
          pageSize: 1,
          rowid: this.$params.item.rowid
        },
        {
          onSuccess(data) {
            console.log(data)
            console.log(1)
            let callerTypeCd
            let outComeCode
            let contactDate
            // 联系渠道
            console.log(vm.channelData)
            if(data.subTypes[0].callerTypeCd) {
              for(let i=0;i<vm.channelData.length;i++) {
                if(vm.channelData[i].text == data.subTypes[0].callerTypeCd) {
                  callerTypeCd = i
                }
              }
            }else{
              callerTypeCd = 0
            }
            console.log(callerTypeCd)
            // 回复类型
            if(data.subTypes[0].outComeCode) {
              for(let i=0;i<vm.typeData.length;i++) {
                if(vm.typeData[i].text == data.subTypes[0].outComeCode) {
                  outComeCode = i
                }
              }
            }else{
              outComeCode = 0
            }
            // 联系时间
            if(data.subTypes[0].contactDate) {
              contactDate = data.subTypes[0].contactDate.split("/")[2].split(" ")[0] + data.subTypes[0].contactDate.split("/")[0] + data.subTypes[0].contactDate.split("/")[1] + '0000'
            }else{
              contactDate = new Date().format("YmdHi")
            }
            vm.contactDate = contactDate
            vm.callerTypeCd = Number(callerTypeCd)
            vm.outComeCode = Number(outComeCode)
            vm.comments = data.subTypes[0].commentResult
            console.log(data.subTypes[0].commentResult)
          },
          loading: 1
        }
      );
    },
    back() {
      // 有改动改页面表单的，退出时提示是否放弃编辑
      if (this.contactDate == this.now.format("YmdHi") && !this.comments && this.callerTypeCd == 0 && this.outComeCode == 0) {
        this.$back({
          transition: this.transition,
          params: { success: true }
        })
      } else {
        this.$confirm({
          title: "提示",
          text: '是否放弃编辑',
          closable: true,
          callback: () => {
            this.$back({
              transition: this.transition,
              params: { success: true }
            })
          }
        });
      }
    }
  },
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../../common/css/index";

.ui-page>main {
  flex-flow: column;
}

.star {
  color: red
}
</style>
