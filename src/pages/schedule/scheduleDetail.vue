<template>
    <v-page>
        <v-header>
            <a class="backBtn" @click="backBtn()">
                <i class="icon-38"></i>
            </a>
            <h1>日程详情</h1>
        </v-header>
        <main>
            <v-form :model="form" :rules="rules">
                <ul class="common-ul">
                    <li>
                        <v-input v-form inList placeholder="请输入标题" v-model="form.eventName">
                            <label><em>标题</em></label>
                        </v-input>
                    </li>
                    <li>
                        <label><em>地点</em></label>
                        <div class="value">{{form.loacation}}</div>
                    </li>
                    <li>
                        <label><em>开始时间</em></label>
                        <a class="select" v-date-picker="{model:startValue,max:maxDate,min:minDate}"></a>
                    </li>
                    <li>
                        <label><em>结束时间</em></label>
                        <a class="select" v-date-picker="{model:endValue,max:maxDate,min:minDate}"></a>
                    </li>
                    <li>
                        <label><em>提醒时间</em></label>
                        <a class="select" v-picker="{model:warmValue,data:warmSelect}">10分钟</a>
                    </li>
                    <li>
                        <v-input v-form inList placeholder="请输入备注" v-model="form.comment">
                            <label><em>事件内容</em></label>
                        </v-input>
                    </li>
                </ul>
                <div class="common-li orange-color">
                    <label @click="moreSchedule()">更多相关提醒</label>
                </div>
                <div v-tap="spreadOut" class="dropdown-msg" :class="{'arrow-switch':isSpreadOut}">
                    <label>客户信息(非必填)
                        <span :class="['icon-41','arrow']"></span>
                    </label>
                </div>
                <ul :class="['common-ul', 'compress',{'spread-out':isSpreadOut}]">
                    <li>
                        <label><em>证件类型</em></label>
                        <div class="value" v-picker="{model:ZJvalue,data:identificationType}" :disabled="inputDisabled">
                            <a>{{form.certType}}</a>
                        </div>
                    </li>
                    <li>
                        <v-input v-form inList placeholder="请输入证件号码" v-model="form.certNum" :disabled="inputDisabled">
                            <label><em>证件号码</em></label>
                        </v-input>
                    </li>
                    <li>
                        <v-input v-form inList placeholder="请输入客户名称" v-model="form.custName" :disabled="inputDisabled">
                            <label><em>客户名称</em></label>
                        </v-input>
                    </li>
                    <li>
                        <v-input v-form inList placeholder="请输入客户号" v-model="form.custName" :disabled="inputDisabled">
                            <label><em>客户号</em></label>
                        </v-input>
                    </li>
                    <li>
                        <v-input v-form inList placeholder="请输入联系电话" v-model="form.phoneNum">
                            <label><em>联系电话</em></label>
                        </v-input>
                    </li>
                </ul>
            </v-form>
        </main>
        <div class="footer">
            <button @click="saveBtn()">保存</button>
            <button @click="deleteBtn()">删除</button>
        </div>
    </v-page>
</template>
<script>
import {formatDate} from '../../common/js/dateFormat';
export default {
    data() {
        return {
            minDate: new Date().format("YmdHi"),
            maxDate: new Date().add("1y").format("YmdHi"),
            startValue: '',
            endValue: '',
            warmValue: '',
            isSpreadOut: false,
            inputDisabled: false,
            buttonList: ["保存", "删除"],
            isReadOnly: true,
            form: {
                eventName: '',
                loacation: '',
                remind: '',
                comment: '',
                certType: '',
                certNum: '',
                custName: '',
                phoneNum: '',
                rowid: ''
            },
            rules: {
                title: ['required'],
                place: ['required'],
                content: ['required'],
                name: ['required'],
                number: ['required'],
                cerNo: ['required'],
                tel: ['required'],
            },
            identificationType: [ // 证件类型下拉列表死数据
                { text: '居民身份证', value: '0' },
                { text: '临时身份证', value: '1' },
                { text: '户口本', value: '2' },
                { text: '护照', value: '3' },
                { text: '普通护照', value: '4' },
                { text: '外交护照', value: '5' },
                { text: '公务护照', value: '6' },
                { text: '因公普通护照', value: '7' },
                { text: '香港特别行政区护照', value: '8' },
                { text: '澳门特别行政区护照', value: '9' }
            ],
            warmSelect: [
                { text: '10分钟前', value: '0' },
                { text: '15分钟前', value: '1' },
                { text: '30分钟前', value: '2' },
                { text: '1小时前', value: '3' },
                { text: '2小时前', value: '4' },
                { text: '24小时前', value: '5' },
                { text: '2天前', value: '6' },
                { text: '1周前', value: '7' }
            ],
            ZJvalue: '',
        }
    },
    filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy/MM/dd hh : mm');
        }
    },
    mounted() {
        // 获取当前时间
        let now = new Date
        let dateArr1 = now.format().split(" ")[0].split("-")
        let dateArr2 = now.format().split(" ")[1].split(":")
        this.startValue = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1] + dateArr2[2]
        this.endValue = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]+ dateArr2[2]
    },
    created(){
        if (this.$params.from == 'schedule') {
            this.form.eventName = this.$params.eventName
            this.form.loacation = this.$params.loacation
            this.warmValue = this.$params.remind
            this.form.comment = this.$params.comment
            this.form.certType = this.$params.certType
            this.form.certNum = this.$params.certNum
            this.form.custName = this.$params.custName
            this.form.phoneNum = this.$params.phoneNum
            this.form.rowid = this.$params.rowid
        }
    },
    methods: {
        backBtn(){
            this.$confirm({
                text: "确定放弃编辑日程？",
                closable: true,
                callback: () => {
                    this.$back({
                        transition: this.transition
                    })
                }
            });
        },
        spreadOut() {
            this.isSpreadOut = !this.isSpreadOut
        },
        moreSchedule(){
            this.$go({
                path: "/moreSchedule",
                params: {
                    from: 'scheduleDetail',
                    rowid: this.form.rowid
                }
            })
        },
        CRMD34(){
            let vm = this;
            this.$http('CRMD34', {
                UserNum: '01340962',
                eventName: this.form.eventName,
                rowid: this.form.rowid,
                loacation: this.form.loacation,
                startTime: this.startValue.timeFormat(),
                endTime: this.endValue.timeFormat(),
                remind: this.form.remind,
                comment: this.form.comment,
                pageNum: 1,
                pageSize: 5
            }, {
                    onSuccess(data) {
                        vm.$back({
                            transition: vm.transition
                        })
                    },
                    loading: 1
                })
        },
        saveBtn() {
            this.CRMD34();
        },
        deleteBtn(){
            this.$confirm({
                title: "请填写关闭原因",
                inputValue: "",
                inputType: "text",
                inputMaxlength: 600,
                closable: true,
                callback: () => {
                    this.CRMD31();
                    this.$back({
                        transition: this.transition
                    })
                }
            });
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
        CRMQ34(){
            let vm = this;
            let dateArr0 = this.$params.startTime.split(" ")[0]
            this.$http('CRMQ34', {
                UserNum: '01340962',
                queryDate: dateArr0,
                pageNum: 1,
                pageSize: 5
            }, {
                onSuccess(data) {
                    vm.workData = data.subTypes
                },
                loading: 1
            })
        },
    }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import '../../common/css/index';
.backBtn{
    margin-left: 1rem;
}
.ui-page>main {
    flex-flow: column;
    .common-ul{
        label {
            width: 5.5rem;
        }
    }
    input {
        padding: 0;
    }
    li {
        a {
            float: left;
        }
    }
    .compress {
        -webkit-transform: scaleY(0);
        -webkit-transform-origin-y: top;
        transform: scaleY(0);
        transition: transform 0.1s;
    }
    .spread-out {
        transform: scaleY(1);
    }
    .gray-color {
        background-color: #f2f2f2
    }
    .orange-color {
        margin-left: 1rem;
        color: rgb(217, 80, 61);
    }
    .arrow {
        margin-left: 0.6rem;
        -webkit-transform: rotate(0);
        transform: rotate(0);
        transition: transform 0.2s;
        display: inline-block;
    }
    .down {
        -webkit-transform: rotate(90deg) translateX(15%);
        transform: rotate(90deg) translateX(15%);
    }
    .common-ul{
        li{
            em{
                display: inline-block;
                width: 4.5rem;
                text-align: justify;
                text-align-last: justify;
                font-style: normal;
            }
        }
    }
    .dropdown-msg{
        height: 3.5rem;
        line-height: 3.5rem;
        background: #fff;
        border-bottom: solid 1px #ddd;
        label{
            margin: 1rem 0 0 1rem;
        }
        &.arrow-switch{
            background: transparent;
            .arrow{
                transform: rotate(180deg);
            }
        }
    }
    .common-li{
        margin-left: 0;
        a{
            float: left;
        }
    }
}
.ui-page > .footer {
  overflow: hidden;
  background-color: white;
  & > button {
    float: left;
    padding: .8rem 1rem;
    width: 50%;
    background-color: $orange-bg;
    color: white;
  }
  & > button:nth-child(2) {
    background-color: $gray-btn;
  }
}
</style>
