<!--
    创建or设置日程(通用)
    by Zengyc 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <v-button @click="back">
                <i class="icon-38"></i>
            </v-button>
            <h1>{{pageTitle}}</h1>
        </v-header>
        <main>
            <v-form :model="form" :rules="rules" ref="form">
                <ul class="common-ul">
                    <li>
                        <v-input placeholder="请输入标题" v-form v-model="form.eventName" :maxlength="50">
                            <label>
                                <em>标题</em>
                                <span class="star">*</span>
                            </label>
                        </v-input>
                    </li>
                    <li>
                        <v-input placeholder="请输入地点" v-form v-model="form.loacation" :maxlength="100">
                            <label>
                                <em>地点</em>
                                <span class="star"></span>
                            </label>
                        </v-input>
                    </li>
                    <li>
                        <label>
                            <em>开始时间</em>
                            <span class="star">*</span>
                        </label>
                        <a class="select" v-date-picker="{model:startTime,max:maxDate,min:minDate}">请选择</a>
                    </li>
                    <li>
                        <label>
                            <em>结束时间</em>
                            <span class="star">*</span>
                        </label>
                        <a class="select" v-date-picker="{model:endTime,max:maxDate,min:minDate}">请选择</a>
                    </li>
                    <li>
                        <label>
                            <em>提醒时间</em>
                            <span class="star"></span>
                        </label>
                        <a class="select" v-picker="{model:remind,data:rtPickerData}">10分钟</a>
                    </li>
                    <li>
                        <v-input placeholder="请输入备注" v-form v-model="form.comment" :maxlength="600">
                            <label>
                                <em>事件内容</em>
                                <span class="star">*</span>
                            </label>
                        </v-input>
                    </li>
                </ul>
                <div v-tap="spreadOut" class="dropdown-msg" :class="{'arrow-switch':isSpreadOut}">
                    <label>客户信息(非必填)
                        <span :class="['icon-41','arrow']"></span>
                    </label>
                </div>
                <ul :class="['common-ul', 'compress',{'spread-out':isSpreadOut}]">
                    <li :class="{disabledSelect: this.$params.from == 'manageClient'}">
                        <label>
                            <em>证件类型</em>
                            <span class="star"></span>
                        </label>
                        <span class="value" :class="{disabledText: this.$params.from == 'manageClient'}" v-tap="goIdentificationType" :disabled="this.$params.from == 'manageClient'">{{form.certType}}</span>
                    </li>
                    <li>
                        <v-input placeholder="请输入证件号码" v-form v-model="form.certNum" :disabled="this.$params.from == 'manageClient'" :maxlength="20">
                            <label>
                                <em>证件号码</em>
                                <span class="star"></span>
                            </label>
                            <i class="icon-40" v-show="!(this.$params.from == 'manageClient')" slot="right" @click="fill"></i>
                        </v-input>
                    </li>
                    <li>
                        <v-input v-form placeholder="请输入客户名称" v-model="form.custName" :disabled="this.$params.from == 'manageClient'" :maxlength="20">
                            <label>
                                <em>客户名称</em>
                                <span class="star"></span>
                            </label>
                        </v-input>
                    </li>
                    <li class="custEcif-gray">
                        <label>
                            <em>客户号</em>
                            <span class="star"></span>
                        </label>
                        <span class="value">{{form.custEcif}}</span>
                    </li>
                    <li>
                        <v-input placeholder="请输入联系电话" v-form v-model="form.custPhoNum" :maxlength="30">
                            <label>
                                <em>联系电话</em>
                                <span class="star"></span>
                            </label>
                        </v-input>
                    </li>
                </ul>
            </v-form>
            <v-button :class="[{'button-down':!isSpreadOut}]" @click="submit">提交</v-button>
        </main>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            now: new Date(),
            startTime: new Date().format("YmdHi"),
            endTime: new Date().format("YmdHi"),
            minDate: new Date().format("YmdHi"),
            maxDate: new Date().add("1y").format("YmdHi"),
            pageTitle: '设置日程',
            remind: 0,
            isSpreadOut: false,
            form: {
                eventName: '',
                loacation: '',
                comment: '',
                certType: '请选择证件类型',
                custName: '',
                custEcif: '',
                certNum: '',
                custPhoNum: '',
            },
            rules: {
                eventName: ["required"],
                comment: ["required"],
            },
            rtPickerData: [
                { text: "10分钟前", value: 0 },
                { text: "15分钟前", value: 1 },
                { text: "30分钟前", value: 2 },
                { text: "1小时前", value: 3 },
                { text: "2小时前", value: 4 },
                { text: "24小时前", value: 5 },
                { text: "2天前", value: 6 },
                { text: "1周前", value: 7 }
            ],
            credeList: [{ text: "居民身份证", value: 1 }, { text: "临时身份证", value: 2 }],
            credeType: 1
        };
    },
    created() {
        
    },
    methods: {
        spreadOut() {
            this.isSpreadOut = !this.isSpreadOut;
        },
        submit() {
            // 当this.$refs.form.isValid()里面已经没有可显示的内容以后执行下面
            if (this.$refs.form.isValid() != true) {
                this.$toast(this.$refs.form.isValid())
            } else if (this.startTime > this.endTime) {
                this.$toast('开始日期不可大于结束日期')
            } else {
                if (this.form.certNum) {
                    if (this.form.certType != '请选择证件类型') {
                        this.CRMD30()
                        this.$toast('创建成功')
                        this.$back({
                            transition: this.transition
                        })
                    } else {
                        this.$toast('请选择证件类型')
                    }
                } else {
                    this.CRMD30()
                    this.$toast('创建成功')
                    this.$back({
                        transition: this.transition
                    })
                }
            }
        },
        goIdentificationType() {
            this.$go("/identificationType");
        },
        CRMD30() {
            let vm = this;
            let certIdType              // 重新定义证件类型
            let rowidArr                // 重新定义客户提醒主键
            if (this.form.certType == '请选择证件类型') {
                certIdType = ''         // 判断证件类型是否有被选择
            } else {
                certIdType = this.form.certType
            }
            if (this.$params.rowidArr) {  // 判断究竟是不是创建空白日程
                rowidArr = this.$params.rowidArr.join(",")
            } else {
                rowidArr = ''
            }
            this.$http('CRMD30', {
                eventRowId: rowidArr,
                eventName: this.form.eventName,
                loacation: this.form.loacation,
                comment: this.form.comment,
                remind: this.rtPickerData[this.remind].text,
                startTime: this.startTime.timeFormat(),
                endTime: this.endTime.timeFormat(),
                custEcif: this.form.custEcif,
                custName: this.form.custName,
                phoneNum: this.form.phoneNum,
                certType: certIdType,
                certNum: this.form.certNum,

            }, {
                    onSuccess(data) {
                        vm.CRMQ34();
                        vm.createData = data;
                        vm.$toast('新建日程成功');
                        vm.$go("/schedule");
                    },
                    loading: 1
                })
        },
        CRMQ34(){
            let vm = this;
            let _startTime = this.startTime.timeFormat().split(" ")[0];
            this.$http('CRMQ34', {
                UserNum: '01340962',
                queryDate: _startTime,
                pageNum: 1,
                pageSize: 5
            }, {
                onSuccess(data) {
                    vm.workData = data.subTypes
                    for (let i = 0;i < vm.workData.length;i++){
                        if(vm.workData[i].startTime.split(" ")[1] <12){
                            vm.workData[i].period = '上午'
                        }else{
                            vm.workData[i].period = '下午'
                        }
                    }
                },
                loading: 1
            })
        },
        back() {
            // 判断用户是否有更改页面内容
            if (
                !this.form.eventName && !this.form.loacation && this.startTime == this.now.format("YmdHi") && this.endTime == this.now.format("YmdHi")
                && this.remind == 0 && !this.form.comment && !this.form.custName && !this.form.custEcif && this.form.certType == '请选择证件类型'
                && !this.form.certNum && !this.form.custPhoNum
            ) {
                this.$back({
                    transition: this.transition
                })
            } else {
                this.$confirm({
                    text: "放弃编辑内容吗？",
                    closable: true,
                    callback: () => {
                        this.$back({
                            transition: this.transition
                        })
                    }
                });
            }
        },
        // 根据证件和证件号码查询信息
        fill() {
            this.CRMQ38()
        },
        CRMQ38() {
            let vm = this;
            if (this.form.certType == '请选择证件类型') {
                this.$toast('请选择证件类型')
                return
            } else {
                if (this.form.certNum == '') {
                    this.$toast('证件号码不能为空')
                    return
                }
            }
            this.$http('CRMQ38', {
                queryType: '证件号码',
                certType: this.form.certType,
                number: this.form.certNum,
                pageNum: 1,
                pageSize: 5
            }, {
                    onSuccess(data) {
                        console.log(data)
                        vm.form.eventName = data.subTypes[0].eventName
                        vm.form.custEcif = data.subTypes[0].custEcif
                        vm.form.certType = data.subTypes[0].certType
                        vm.form.certNum = data.subTypes[0].certNum
                    },
                    loading: 1,
                })
        },
    },
    activated() {
        if (this.$params.certType) {
            this.form.certType = this.$params.certType;
        }
    }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../../common/css/index";

.ui-page>main {
    flex-flow: column;
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
        background-color: #f2f2f2;
    }
    .orange-color {
        margin-left: 1rem;
        color: rgb(217, 80, 61);
        display: inline-block;
    }
    .arrow {
        margin-left: 0.6rem;
        display: inline-block;
    }
    .up {
        transform: rotate(180deg)
    }
    button {
        -webkit-transform: translateY(0%);
        transform: translateY(0%);
        transition: transform 0.2s;
        height: 3rem;
    }
    .button-down {
        -webkit-transform: translateY(-550%);
        transform: translateY(-550%);
        height: 3rem;
    }
    .disabledSelect {
        background-color: $disabled-bg;
        .disabledText {
            color: $disabled-font;
        }
    }
    .star {
        color: red;
        width: 0.2rem;
    }
    .common-ul {
        .custEcif-gray {
            background-color: $disabled-bg;
        }
        li {
            label{
                width: 5.4rem;
                em {
                    display: inline-block;
                    width: 4.5rem;
                    text-align: justify;
                    text-align-last: justify;
                    font-style: normal;
                }
            }
        }
    }
    .dropdown-msg {
        height: 3.5rem;
        line-height: 3.5rem;
        background: #fff;
        border-bottom: 1px solid #ddd;
        &.arrow-switch{
            background: transparent;
            .arrow{
                transform: rotate(180deg);
            }
        }
        label{
            margin: 1rem 0 0 1rem;
        }
    }
}
</style>
