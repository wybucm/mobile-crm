<!--
    每日战报
    by Pangwz 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <v-back/>
            <h1>每日战报</h1>
        </v-header>
        <div class="nav">
            <div class="navItem" :class="{current:targetCurrent}" v-tap="goTarget">
                <span>指标变动</span>
            </div>
            <div class="navItem" :class="{current:resultCurrent}" v-tap="goResult">
                <span>完成情况</span>
            </div>
            <div class="navItem" :class="{current:rankCurrent}" v-tap="goRank">
                <span>业绩排名</span>
            </div>
        </div>
        <main>
            <div class="main">
                <v-scroller ref="scroller">
                    <div class="tab-content page-target">
                        <div v-show="showTarget">
                            <div class="target-box target-box-aum">
                                <div class="deadline">
                                    <span>截止至{{targetData.eltDate}}数据</span>
                                </div>
                                <h3>AUM</h3>
                                <div class="target-txt">
                                    <div class="item-target">
                                        <div class="item-title">
                                            当日综合AUM
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{targetData.curAum}}
                                            <em>（万元）</em>
                                        </div>
                                    </div>
                                    <div class="item-target">
                                        <div class="item-title">
                                            较昨日增加
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{targetData.curAumGrow}}
                                            <em>（万元）</em>
                                        </div>
                                    </div>
                                    <div class="rank">增量排名第{{targetData.curAumGrowRank}}名</div>
                                </div>
                            </div>
                            <div class="target-box target-box-vip">
                                <h3>VIP有效户</h3>
                                <div class="target-txt">
                                    <div class="item-target">
                                        <div class="item-title">
                                            当日VIP有效户
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{targetData.curVip}}
                                            <em>（户）</em>
                                        </div>
                                    </div>
                                    <div class="item-target">
                                        <div class="item-title">
                                            较昨日增加
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{targetData.curVipGrow}}
                                            <em>（户）</em>
                                        </div>
                                    </div>
                                    <div class="rank">增量排名第{{targetData.curVipGrowRank}}名</div>
                                </div>
                                <div class="rank-detail">
                                    <div class="item-text item-new">
                                        <label>新开{{targetData.newCustAmt}}户</label>
                                        <span>排名第{{targetData.newCustAmtRank}}名</span>
                                    </div>
                                    <div class="item-text item-improve">
                                        <label>提升{{targetData.upCustAmt}}户</label>
                                        <span>排名第{{targetData.upCustAmtRand}}名</span>
                                    </div>
                                    <div class="item-text item-lost">
                                        <label>流失{{targetData.downCustAmt}}户</label>
                                        <span>排名第{{targetData.downCustAmtRand}}名</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-show="showResult" class="page-result">
                            <div class="target-box">
                                <h3>上级评点</h3>
                                <div class="target-txt">
                                    <div class="item-p item-special1">{{resultData.leaderAdvice}}</div>
                                    <div class="item-date">{{resultData.adviseTime}}</div>
                                </div>
                            </div>
                            <div class="target-box target-daily">
                                <h3>日常工作完成情况</h3>
                                <div class="target-txt">
                                    <div class="item-p item-special2">当日电联{{resultCallClient}}名客户</div>
                                    <div class="item-title">
                                        <i class="ico_title"></i>
                                        当日销售
                                        <i class="ico_title"></i>
                                    </div>
                                    <div class="items-collection">
                                        <div class="item-p" v-if="resultData.depositGrow">
                                            <label>
                                                <span class="icon-23">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                </span>存款</label>
                                            <strong><em>{{resultData.depositGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.wealthMngGrow">
                                            <label><span class="icon-20">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                   </span>本外币理财</label>
                                            <strong><em>{{resultData.wealthMngGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.fundGrow">
                                            <label><span class="icon-1">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                   </span>基金</label>
                                            <strong><em>{{resultData.fundGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.bondGrow">
                                            <label><span class="icon-16">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                   </span>国债</label>
                                            <strong><em>{{resultData.bondGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.trustGrow">
                                            <label><span class="icon-35">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                   </span>信托</label>
                                            <strong><em>{{resultData.trustGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.insuranceGrow">
                                            <label><span class="icon-19">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                        <span class="path4"></span>
                                                   </span>保险</label>
                                            <strong><em>{{resultData.insuranceGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.colleBondGrow">
                                            <label><span class="icon-29">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                   </span>券商集合理财</label>
                                            <strong><em>{{resultData.colleBondGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.metalGrow">
                                            <label><span class="icon-25">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                   </span>贵金属</label>
                                            <strong><em>{{resultData.metalGrow}}</em>万元</strong>
                                        </div>
                                        <div class="item-p" v-if="resultData.exchangeGrow">
                                            <label><span class="icon-32">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                   </span>外汇</label>
                                            <strong><em>{{resultData.exchangeGrow}}</em>万元</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-show="showRank" class="page-rank">
                            <div class="target-box target-box-aum">
                                <h3>AUM周通报</h3>
                                <div class="target-txt">
                                    <div class="item-target">
                                        <div class="item-title">
                                            团队排名
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{rankData.curWeekAumRank}}
                                            <em>（名次）</em>
                                        </div>
                                    </div>
                                    <div class="item-target">
                                        <div class="item-title">
                                            较昨日<span v-show="rankData.curWeekAumRank - rankData.lastWeekAumRank>0">提升</span><span v-show="!(rankData.curWeekAumRank - rankData.lastWeekAumRank>0)">下降</span>
                                        </div>
                                        <div class="item-cnt" :class="[{'item-cnt-red':rankData.curWeekAumRank - rankData.lastWeekAumRank>0},{'item-cnt-green':!(rankData.curWeekAumRank - rankData.lastWeekAumRank>0)}]">
                                            {{compareAumRank}}
                                            <em>（名次）</em>
                                        </div>
                                    </div>
                                </div>
                                <div class="tips">（注:较第一名差距{{rankData.curWeekTopAum - rankData.curWeekAum}}万元，较平均差距{{rankData.curWeekAum - rankData.curWeekAvrAum}}万元）</div>
                            </div>
                            <div class="target-box target-box-vip">
                                <h3>VIP有效户周通报</h3>
                                <div class="target-txt">
                                    <div class="item-target">
                                        <div class="item-title">
                                            团队排名
                                        </div>
                                        <div class="item-cnt item-cnt-red">
                                            {{rankData.curWeekVipRank}}
                                            <em>（名次）</em>
                                        </div>
                                    </div>
                                    <div class="item-target">
                                        <div class="item-title">
                                            较上周<span v-show="rankData.curWeekVipRank - rankData.lastWeekVipRank>0">提升</span><span v-show="!(rankData.curWeekVipRank - rankData.lastWeekVipRank>0)">下降</span>
                                        </div>
                                        <div class="item-cnt item-drop" :class="[{'item-cnt-red':rankData.curWeekVipRank - rankData.lastWeekVipRank>0},{'item-cnt-green':!(rankData.curWeekAumRank - rankData.lastWeekAumRank>0)}]">
                                            2
                                            <em>（名次）</em>
                                        </div>
                                    </div>
                                </div>
                                <div class="tips">（注:较第一名差距{{rankData.curWeekVipTopAmt - rankData.curWeekVipCust}}户，较平均差距{{rankData.curWeekVipCust - rankData.curWeekVipAvrAmt}}户）</div>
                            </div>
                        </div>
                    </div>
                </v-scroller>
            </div>
        </main>
    </v-page>
</template>

<script>
export default {
    data() {
        return {
            targetData: {},
            resultData: {},
            resultCallClient: '',
            rankData: {},
            compareAumRank:'',    // AUM较上周
            compareAveRank: '',   // AUM较平均值
            resultCurrent: false,
            rankCurrent: false,
            showTarget: true,
            showResult: false,
            showRank: false,
            targetCurrent: true,
        }
    },
    created () {
        this.CRMQ30()
    },
    methods: {
        CRMQ30() {
            let vm = this;
            this.$http('CRMQ30', {
                UserNum: '01340962'
            }, {
                    onSuccess(data) {
                        console.log(data)
                        vm.targetData = data
                    },
                    loading: 1,
                    finally() {
                        vm.$refs.scroller.update()
                    }
                })
        },
        CRMQ31() {
            let vm = this;
            this.$http('CRMQ31', {
                UserNum: '01340962'
            }, {
                    onSuccess(data) {
                        console.log(data)
                        vm.resultCallClient = data.touchCustAmt
                    },
                    loading: 1,
                    finally() {
                        vm.CRMQ32()
                        vm.$refs.scroller.update()
                    }
                })
        },
        CRMQ32() {
            let vm = this;
            this.$http('CRMQ32', {
                UserNum: '01340962'
            }, {
                    onSuccess(data) {
                        console.log(data)
                        vm.resultData = data
                    },
                    loading: 1,
                    finally() {
                        vm.$refs.scroller.update()
                    }
                })
        },
        CRMQ33() {
            let vm = this;
            this.$http('CRMQ33', {
                UserNum: '84351811'
            }, {
                    onSuccess(data) {
                        console.log(data)
                        vm.rankData = data
                        vm.compareAumRank = Math.abs(data.curWeekAumRank - data.lastWeekAumRank)
                        vm.compareAveRank = Math.abs(data.curWeekAumRank - data.lastWeekAumRank)
                    },
                    loading: 1,
                    finally() {
                        vm.$refs.scroller.update()
                    }
                })
        },
        goTarget() {
            this.CRMQ30()
            this.showTarget = true;
            this.showResult = false;
            this.showRank = false;
            this.targetCurrent = true;
            this.resultCurrent = false;
            this.rankCurrent = false;
        },
        goResult() {
            this.CRMQ31()
            this.showTarget = false;
            this.showResult = true;
            this.showRank = false;
            this.targetCurrent = false;
            this.resultCurrent = true;
            this.rankCurrent = false;
        },
        goRank() {
            this.CRMQ33()
            this.showTarget = false;
            this.showResult = false;
            this.showRank = true;
            this.targetCurrent = false;
            this.resultCurrent = false;
            this.rankCurrent = true;
        }
    },
    mounted () {
        console.log(111)
        console.log(this.targetData)
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '/index';
</style>