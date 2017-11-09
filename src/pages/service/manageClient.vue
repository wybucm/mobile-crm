<!--
    客户查询
    by Pangwz 2017-10-14
-->
<template>
    <v-page>
        <main>
            <v-header>
                <v-back></v-back>
                <h1>客户查询</h1>
            </v-header>
            <div class="main-content">
                <p class="tips">请选择精确查询类型，并输入相应的查询条件</p>
                <div class="common-li">
                    <label>精确查询类型:</label>
                    <div class="value select" v-picker="{model:type,data:options}"></div>
                </div>
                <div v-show="type == '证件号码'">
                    <div class="common-li">
                        <label>证件类型:</label>
                        <span class="value select" v-tap="goIdentificationType">{{certType}}</span>
                    </div>
                    <v-input v-model="getIdentification" :maxlength="30">
                        <label>证件号码:</label>
                    </v-input>
                </div>
                <div v-show="type == '手机号码'" :maxlength="30">
                    <v-input v-model="getPhone">
                        <label>电话号码:</label>
                    </v-input>
                </div>
                <div v-show="type == '账号'">
                    <v-input v-model="getAccount" :maxlength="30">
                        <label>账号:</label>
                    </v-input>
                </div>
                <div v-show="type == '卡号'">
                    <v-input v-model="getCard" :maxlength="30">
                        <label>卡号:</label>
                    </v-input>
                </div>

                <div class="btn-operate">
                    <v-button class="btn" @click="query">查询</v-button>
                    <v-button class="btn" @click="reset">重置</v-button>
                </div>
            </div>
            <div class="main" v-show="allData.length !=0">
                <v-scroller ref="scroller">
                    <v-radio-group :class="{grayBG: key%2==1}" v-model="myValue" v-for="(list,key) in allData" :key="key">
                        <v-radio :label="key">
                            <ul v-tap="goQueryDetail">
                                <li>
                                    <span class="text">客户号</span>
                                    <span class="content">{{list.custEcif}}</span>
                                </li>
                                <li>
                                    <span class="text">姓名</span>
                                    <span class="content">{{list.custName}}</span>
                                </li>
                            </ul>
                        </v-radio>
                    </v-radio-group>
                </v-scroller>
            </div>
            <div class="nothing" v-show="allData.length == 0 && querying">暂无数据</div>
        </main>
        <div class="footer" v-show="allData.length !=0">
            <button v-for="(item,i) in buttonList" :key="i" v-tap="[toolsClick,i]">{{item}}</button>
        </div>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            querying: false,
            allData: [],
            options: [ // 精确查询类型下拉死数据
                { text: '证件号码', value: '证件号码' },
                { text: '电话号码', value: '手机号码' },
                { text: '账号', value: '账号' },
                { text: '卡号', value: '卡号' }
            ],
            buttonList: ["创建线索", "创建日程"],
            myValue: 0,
            // 所有输入框的值
            getIdentification: '',
            getPhone: '',
            getAccount: '',
            getCard: '',
            type: '证件号码',  // 精确查询类型下拉列表值
            identificationSelect: '0',      // 证件类型下拉列表值
            certType: '请选择证件类型'
        }
    },
    methods: {
        defaultData() {
            let vm = this;
            let selCertType
            if(this.certType == '请选择证件类型'){
                selCertType = ''
            }else{
                selCertType = this.certType
            }
            this.$http('CRMQ38', {
                queryType: this.type,
                certType: selCertType,
                number: this.getIdentification + this.getPhone + this.getAccount + this.getCard,
                pageNum: 1,
                pageSize: 10
            }, {
                    onSuccess(data) {
                        vm.allData = data.subTypes
                        console.dir(data.subTypes)
                    },
                    finally() {
                        vm.$refs.scroller.update()
                    },
                    loading: 1
                })
        },
        query() {                         // 查询按钮事件
            if (this.type == '证件号码') {
                if (this.certType !== '请选择证件类型') {
                    if (this.getIdentification) {
                        this.defaultData()
                        this.querying = true
                    } else {
                        this.$toast('请输入身份证号')
                    }
                } else {
                    this.$toast('请选择证件类型')
                }
            } else if (this.type == '手机号码') {
                if (this.getPhone) {
                    this.querying = true
                    this.defaultData()
                } else {
                    this.$toast('请输入电话号码')
                }
            } else if (this.type == '账号') {
                if (this.getAccount) {
                    this.querying = true
                    this.defaultData()
                } else {
                    this.$toast('请输入账号')
                }
            } else if (this.type == '卡号') {
                if (this.getCard) {
                    this.querying = true
                    this.defaultData()
                } else {
                    this.$toast('请输入卡号')
                }
            }
        },
        reset() {                     // 重置按钮事件
            this.allData = [],
                // 所有输入框的值
                this.getIdentification = '',
                this.getPhone = '',
                this.getAccount = '',
                this.getCard = '',
                this.certType = '请选择证件类型'
                this.type = '证件号码',
                this.identificationSelect = '0'
        },
        toolsClick(i) {
            switch (i) {
                case 0:
                    this.$go({
                        path: "/createClue",
                        params: {
                            from: 'manageClient',
                            custName: this.allData[this.myValue].custName,
                            custEcif: this.allData[this.myValue].custEcif,
                            certType: this.allData[this.myValue].certType,
                            certNum: this.allData[this.myValue].certNum,
                            custPhoNum: this.allData[this.myValue].custPhoNum
                        }
                    });
                    break;
                case 1:
                    this.$go({
                        path: "/setSchedule",
                        params: {
                            from: 'manageClient',
                            custName: this.allData[this.myValue].custName,
                            custEcif: this.allData[this.myValue].custEcif,
                            certType: this.allData[this.myValue].certType,
                            certNum: this.allData[this.myValue].certNum,
                            custPhoNum: this.allData[this.myValue].custPhoNum
                        }
                    })
                    break;
            }
        },
        goQueryDetail() {
            this.$go({
                path: '/queryDetail',
                params: {
                    custName: this.allData[this.myValue].custName,
                    custEcif: this.allData[this.myValue].custEcif,
                    certType: this.allData[this.myValue].certType,
                    certNum: this.allData[this.myValue].certNum,
                    custSex: this.allData[this.myValue].custSex,
                    custType: this.allData[this.myValue].custType,
                    custManager: this.allData[this.myValue].custManager,
                    custSvrLevel: this.allData[this.myValue].custSvrLevel,
                    custSignVIP: this.allData[this.myValue].custSignVIP,
                    custValue: this.allData[this.myValue].custValue,
                    custBelongOrg: this.allData[this.myValue].custBelongOrg,
                    custRiskPrefer: this.allData[this.myValue].custRiskPrefer,
                    custAddress: this.allData[this.myValue].custAddress,
                    custPhoNum: this.allData[this.myValue].custPhoNum,
                    totalAUM: this.allData[this.myValue].totalAUM,
                    totalAUMLastM: this.allData[this.myValue].totalAUMLastM,
                }
            })
        },
        goIdentificationType() {
            this.$go('/identificationType')
        }
    },
    activated() {
        if (this.$params.certType) {
            this.certType = this.$params.certType
        }
    },
    watch: {
        selected(val) {                     // 监听精确查询类型下拉列表值的变化
            // 所有输入框的值
            this.getIdentification = '',
                this.getPhone = '',
                this.getAccount = '',
                this.getCard = '',
                this.allData = []
        },
        allData() {
            if (this.allData != 0) {
                console.log(this.allData.length)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/css/index';
main {
    background: #fff;
    display: flex;
    flex-flow: column;
    .main-content {
        background-color: #fff;
        .tips {
            color: $gray-font;
            background: $gray-bg;
            padding: 0.5rem 0 0.5rem 1.2rem;
        }
        .btn-operate {
            text-align: center;
            border-bottom: solid 1px $gray-border;
            .btn {
                width: 30%;
                display: inline-block;
            }
            ;
            .btn:nth-of-type(2) {
                margin-left: 20px;
                background: $gray-btn;
            }
        }
    }
    .main {
        flex: 1;
        overflow: hidden;
        .ui-scroller {
            background: #fff;
            .ui-radio-group {
                padding: 10px 0;
                .ui-radio {
                    ul {
                        li {
                            line-height: 35px;
                            .text {
                                margin-left: 10px;
                            }
                            .content {
                                float: right;
                            }
                        }
                    }
                }
            }
        }
    }
    .nothing {
        text-align: center;
    }
}

.grayBG {
    background: $gray-bg;
}

.footer {
    overflow: hidden;
    background-color: #fff;
    &>button {
        float: left;
        padding: 0.8rem 1rem;
        width: 50%;
        background-color: #fa6159;
        color: #fff;
    }
    &>button:nth-child(2) {
        background-color: $gray-btn;
    }
}
</style>


