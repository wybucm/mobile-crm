<!--
    创建线索(通用)
    by Zengyc 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <v-button @click="back">
                <i class="icon-38"></i>
            </v-button>
            <h1>创建线索</h1>
        </v-header>
        <main>
            <v-scroller>
                <v-form :model="form" :rules="rules" ref="form">
                    <ul class="common-ul">
                        <li>
                            <v-input v-form v-model="form.custName" placeholder="请输入客户名称" :disabled="this.$params.from == 'manageClient'" :maxlength="20">
                                <label>客户名称</label>
                            </v-input>
                        </li>
                        <li class="custEcif-gray">
                            <label>客户号</label>
                            <span class="value">{{form.custEcif}}</span>
                        </li>
                        <li :class="{disabledSelect: this.$params.from == 'manageClient'}">
                            <label>证件类型</label>
                            <span class="value" :class="{disabledText: this.$params.from == 'manageClient'}" v-tap="goIdentificationType" :disabled="this.$params.from == 'manageClient'">{{form.certType}}</span>
                        </li>
                        <li>
                            <v-input placeholder="请输入证件号码" v-form v-model="form.certNum" :disabled="this.$params.from == 'manageClient'" :maxlength="20">
                                <label>证件号码</label>
                                <i v-show="!(this.$params.from == 'manageClient')" class="icon-40" slot="right" @click="fill"></i>
                            </v-input>
                        </li>
                        <li>
                            <v-input placeholder="请输入联系电话" v-form v-model="form.custPhoNum" :maxlength="30">
                                <label>联系电话</label>
                            </v-input>
                        </li>
                        <li>
                            <label>营销活动</label>
                            <span class="value" v-tap="goActivity">{{form.srcCamp}}</span>
                        </li>
                        <li>
                            <label>开始日期
                                <span class="star">*</span>
                            </label>
                            <a class="select" v-date-picker="{model:startTime,max:maxDate,min:minDate}">请选择</a>
                        </li>
                        <li>
                            <label>结束日期
                                <span class="star">*</span>
                            </label>
                            <a class="select" v-date-picker="{model:endTime,max:maxDate,min:minDate}">请选择</a>
                        </li>
                        <li>
                            <label>方便联系时间</label>
                            <a class="select" v-date-picker="{model:freeTime,max:maxDate,min:minDate}">请选择</a>
                        </li>
                        <li>
                            <v-input placeholder="请输入转介" v-form v-model="form.comment" :maxlength="600">
                                <label>转介说明</label>
                            </v-input>
                        </li>
                    </ul>
                </v-form>
                <v-button @click="submit">提交</v-button>
            </v-scroller>
        </main>
    </v-page>
</template>
<script type="text/ecmascript-6">
export default {
    data() {
        return {
            form: {
                now: '',
                custName: '',
                custEcif: '',
                certType: '请选择证件类型',
                certNum: '',
                custPhoNum: '',
                srcCamp: '请选择营销活动',
                comment: ''
            },
            startTime: new Date().format("YmdHi"),
            endTime: new Date().format("YmdHi"),
            minDate: new Date().format("YmdHi"),
            maxDate: new Date().add("1y").format("YmdHi"),
            freeTime: new Date().format("YmdHi"),
            rules: {

            },
            activeData: [
                { text: "活动1", value: 1 },
                { text: "活动2", value: 2 },
                { text: "活动3", value: 3 }
            ],
            rtPickerData: [
                { text: "10分钟前", value: 1 },
                { text: "15分钟前", value: 2 },
                { text: "30分钟前", value: 3 },
                { text: "1小时前", value: 4 },
                { text: "2小时前", value: 5 },
                { text: "24小时前", value: 6 },
                { text: "2天前", value: 7 },
                { text: "1周前", value: 8 }
            ],
            certType: "请选择证件类型"
        };
    },
    created() {
        // console.log(new Date().format("YmdHi"))
        console.log(this.endTime)
        console.log(this.endTime.timeFormat())
        console.log(this.$params.from)
        if (this.$params.from == 'manageClient') {
            this.form.custName = this.$params.custName
            this.form.custEcif = this.$params.custEcif
            this.form.certType = this.$params.certType
            this.form.certNum = this.$params.certNum
            this.form.custPhoNum = this.$params.custPhoNum
        }
        this.now = new Date().format("YmdHi")
    },
    methods: {
        submit() {
            if (this.startTime > this.endTime) {
                this.$toast('开始日期不可大于结束日期')
            } else {
                if (this.form.certNum) {
                    if (this.form.certType != '请选择证件类型') {
                        this.CRMD32()
                        this.$toast('创建成功')
                        this.$back({
                            transition: this.transition
                        })
                    } else {
                        this.$toast('请选择证件类型')
                    }
                } else {
                    this.CRMD32()
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
        goActivity() {
            this.$go("/activity");
        },
        fill() {
            this.CRMQ38()
        },
        CRMD32() {
            let vm = this;
            let certIdType              // 重新定义证件类型
            let srcCampType             // 重新定义营销活动
            if (this.form.certType == '请选择证件类型') {
                certIdType = ''         // 判断证件类型是否有被选择
            } else {
                certIdType = this.form.certType
            }
            if (this.form.srcCamp == '请选择营销活动') {
                srcCampType = ''         // 判断营销活动是否有被选择
            } else {
                srcCampType = this.form.srcCamp
            }

            let createTime = new Date().format("m/d/Y H:m:s")
            this.$http('CRMD32', {
                name: this.form.custName + '-' + '移动手工创建' + '-' + createTime,
                parType: '线索',
                type: '移动手工创建',
                startTime: this.startTime.timeFormat(),
                endTime: this.endTime.timeFormat(),
                custEcif: this.form.custEcif,
                custName: this.form.custName,
                phoneNum: this.form.phoneNum,
                certType: certIdType,
                certNum: this.form.certNum,
                comment: this.form.comment,
                freeTime: this.freeTime.timeFormat(),
                srcCamp: srcCampType,
                srcCampRowid: this.$params.srcCampRowid
            }, {
                    onSuccess(data) {
                        console.log(data)
                    },
                    loading: 2,
                })
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
                        if (data.subTypes.length == 0) {
                            vm.$alert('没有相关数据');
                        } else {
                            console.log(data)
                            vm.form.custName = data.subTypes[0].custName
                            vm.form.custEcif = data.subTypes[0].custEcif
                            vm.form.certType = data.subTypes[0].certType
                            vm.form.certNum = data.subTypes[0].certNum
                        }
                    },
                    loading: 1,
                })
        },
        back() {
            // 有改动改页面表单的，退出时提示是否放弃编辑
            if (!this.form.custName && this.form.certType == '请选择证件类型' &&
                !this.form.certNum && !this.form.custPhoNum && !this.form.comment &&
                this.form.srcCamp == '请选择营销活动' && this.startTime == this.now &&
                this.endTime == this.now && this.freeTime == this.now) {
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
        }
    },
    activated() {
        if (this.$params.certType) {
            this.form.certType = this.$params.certType;
        }
        if (this.$params.srcCamp) {
            this.form.srcCamp = this.$params.srcCamp
        }
    }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../../common/css/index";

.ui-page>main {
    flex-flow: column;
    .color-red {
        color: $red-font;
    }
}

.disabledSelect {
    background-color: $disabled-bg;
    .disabledText {
        color: $disabled-font;
    }
}

.star {
    color: red;
}

.custEcif-gray {
    background-color: $disabled-bg;
}
</style>
