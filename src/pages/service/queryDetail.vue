<!--
    客户信息详情
    by Pangwz 2017-10-16
-->
<template>
    <v-page>
        <main>
            <v-header>
                <v-back></v-back>
                <h1>客户信息详情</h1>
            </v-header>
            <div class="main">
                <v-scroller>
                    <ul class="common-ul">
                        <li>
                            <label>客户号：</label>
                            <span class="value">{{custEcif}}</span>
                        </li>
                        <li>
                            <label>姓名：</label>
                            <span class="value">{{custName}}</span>
                        </li>
                        <li>
                            <label>证件类型：</label>
                            <span class="value">{{certType}}</span>
                        </li>
                        <li>
                            <label>证件号码：</label>
                            <span class="value">{{certNum}}</span>
                        </li>
                        <li>
                            <label>性别：</label>
                            <span class="value">{{custSex}}</span>
                        </li>
                        <li>
                            <label>客户类型：</label>
                            <span class="value">{{custType}}</span>
                        </li>
                        <li>
                            <label>管户客户经理：</label>
                            <span class="value">{{custManager}}</span>
                        </li>
                        <li>
                            <label>服务等级：</label>
                            <span class="value">{{custSvrLevel}}</span>
                        </li>
                        <li>
                            <label>身份签约状态：</label>
                            <span class="value">{{custSignVIP}}</span>
                        </li>
                        <li>
                            <label>客服星级：</label>
                            <span class="value">{{custValue}}</span>
                        </li>
                        <li>
                            <label>所属机构：</label>
                            <span class="value">{{custBelongOrg}}</span>
                        </li>
                        <li>
                            <label>风险评级：</label>
                            <span class="value">{{custRiskPrefer}}</span>
                        </li>
                        <li>
                            <label>主要联系地址：</label>
                            <span class="value">{{custAddress}}</span>
                        </li>
                        <li>
                            <label>主要联系电话号码：</label>
                            <span class="value">{{custPhoNum}}</span>
                        </li>
                        <li>
                            <label>时点综合AUM：</label>
                            <span class="value">{{totalAUM}}</span>
                        </li>
                        <li>
                            <label>上月月日均综合AUM：</label>
                            <span class="value">{{totalAUMLastM}}</span>
                        </li>
                    </ul>
                </v-scroller>
            </div>
        </main>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            custEcif: '',
            custName: '',
            certType: '',
            certNum: '',
            custSex: '',
            custType: '',
            custManager: '',
            custSvrLevel: '',
            custSignVIP: '',
            custValue: '',
            custBelongOrg: '',
            custRiskPrefer: '',
            custAddress: '',
            custPhoNum: '',
            totalAUM: '',
            totalAUMLastM: ''
        }
    },
    mounted() {
        console.log(this.$params)
        this.custEcif = this.$params.custEcif
        this.custName = this.$params.custName
        this.certType = this.$params.certType
        this.certNum = this.$params.certNum
        this.custSex = this.$params.custSex
        this.custType = this.$params.custType
        this.custManager = this.$params.custManager
        this.custSvrLevel = this.$params.custSvrLevel
        this.custSignVIP = this.$params.custSignVIP
        this.custValue = this.$params.custValue
        this.custBelongOrg = this.$params.custBelongOrg
        this.custRiskPrefer = this.$params.custRiskPrefer
        this.custAddress = this.$params.custAddress
        this.custPhoNum = this.$params.custPhoNum
        this.totalAUM = this.$params.totalAUM
        this.totalAUMLastM = this.$params.totalAUMLastM
    },
}
</script>
<style lang="scss" scoped>
@import '../../common/css/index';
main {
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
    }
}
</style>


