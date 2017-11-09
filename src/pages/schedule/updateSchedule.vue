<!--
    修改日程
    by WenPeng 2017-10-29
-->
<template>
    <v-page>
        <v-header>
            <a class="backBtn" @click="backBtn()">
                <i class="icon-38"></i>
            </a>
            <h1>修改日程</h1>
        </v-header>
        <main>
            <v-scroller ref="scroller">
                <v-form :model="form" :rules="rules" ref="form"
                    <ul class="common-ul">
                        <li>
                            <label>开始时间<span class="star">*</span></label>
                            <a class="select" v-date-picker="{model:startTime,max:maxDate,min:minDate}">请选择</a>
                        </li>
                        <li>
                            <label>结束时间<span class="star">*</span></label>
                            <a class="select" v-date-picker="{model:endTime,max:maxDate,min:minDate}">请选择</a>
                        </li>
                        <li>
                            <label>提醒时间</label>
                            <a class="select" v-picker="{model:remind,data:rtPickerData}">10分钟</a>
                        </li>
                    </ul>
                </v-form>
                <v-button :class="[{'button-down':!isSpreadOut}]" @click="submit">保存</v-button>
            </v-scroller>
        </main>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            minDate: new Date().format("YmdHi"),
            maxDate: new Date().add("1y").format("YmdHi"),
            remind: 1,
            rowid: '',
            startTime: '',
            endTime: '',
            contactDate: '',
            freeTime: '',
            isSpreadOut: false,
            rules: {
                eventName: ["required"],
                comment: ["required"],
            },
            form: {
                eventName: '',
                loacation: '',
                remind: '',
                comment: '',
                certType: '',
                certNum: '',
                custName: '',
                phoneNum: ''
            },
            beginTime: "201710231130",
            overTime: "201710231130",
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
        };
    },
    created() {
        // 获取当前时间
        let now = new Date
        let dateArr1 = now.format().split(" ")[0].split("-")
        let dateArr2 = now.format().split(" ")[1].split(":")
        this.startTime = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]
        this.endTime = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]
        this.freeTime = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]
        this.contactDate = dateArr1[1] +'/'+ dateArr1[2] +'/'+ dateArr1[0]
        
        if (this.$params.from == 'schedule') {
            this.rowid = this.$params.rowid
        }
        console.log(this.$params.workData)
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
        submit() {
            if (this.startTime > this.endTime) {
                this.$toast('开始时间不能大于结束时间')
            }else{
                this.CRMD34()
                this.$back({
                    transition: this.transition
                })
            }
            
        },
        CRMD34() {
            let vm = this;
            this.$http(
                "CRMD34",
                {
                    rowid: this.$params.workData[0].rowid,
                    startTime: this.startTime.timeFormat(),
                    endTime: this.endTime.timeFormat(),
                    activeContactFlg: 'Y',
                    feedbackFlag: 'Y',
                    contactedFlag: 'Y'
                },
                {
                    onSuccess(data) {

                    },
                    loading: 2
                }
            );
        },
    }
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import '../../common/css/index';
.backBtn{
    margin-left: 1rem;
}
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
    }
    .arrow {
        margin-top: 1.3rem;
        margin-left: 0.6rem;
        -webkit-transform: rotate(0);
        transform: rotate(0);
        transition: transform 0.2s;
    }
    .down {
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }
    button {
        -webkit-transform: translateY(0%);
        transform: translateY(0%);
        transition: transform 0.2s;
    }
    .button-down {
        -webkit-transform: translateY(-550%);
        transform: translateY(-550%);
    }
    .disabledSelect {
        background-color: $disabled-bg;
        .disabledText {
            color: $disabled-font;
        }
    }
    .star{
        color: red;
    }
    .common-ul{
        height: 70vh;
    }
}
</style>
