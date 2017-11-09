<template>
    <v-page>
        <v-header>
            <h1>通话记录</h1>
        </v-header>
        <div class="precise" v-tap="spreadOut">
            <p>查询条件</p>
            <p :class="['icon-41',{'up':isSpreadOut}]"></p>
            <p class="replay" v-tap="reset">重置</p>
        </div>
        <ul :class="['common-ul', 'compress',{'spread-out':isSpreadOut}]">
            <li>
                <v-input v-model="custName" placeholder="请输入客户姓名" :maxlength="20">
                    <label>客户姓名</label>
                </v-input>
            </li>
            <li>
                <v-input v-model="PhoneNum" placeholder="请输入客户电话" :maxlength="30">
                    <label>客户电话</label>
                </v-input>
            </li>
            <li>
                <label>开始时间</label>
                <a class="select" v-date-picker="{model:startTime,max:maxDate,min:minDate,clearBtn:true}"></a>
            </li>
            <li>
                <label>结束时间</label>
                <a class="select" v-date-picker="{model:endTime,max:maxDate,min:minDate,clearBtn:true}"></a>
            </li>
            <li class="btn-li">
                <v-button @click='query'>查询</v-button>
            </li>
        </ul>
        <main>
            <div class="main">
                <v-scroller v-show="!nothing" ref="scroller" :toLoadMore="true" @loadmore="CRMQ39">
                    <div v-for="(list,key) in filterData" :key="key">
                        <ul class="simple-ul">
                            <li>
                                <label>客户姓名：</label>
                                <span class="value">{{list.custName}}</span>
                            </li>
                            <li>
                                <label>客户号：</label>
                                <span class="value">{{list.custEcif}}</span>
                            </li>
                            <li>
                                <label>客户电话</label>
                                <span class="value">{{list.PhoneNum}}</span>
                            </li>
                            <li>
                                <label>通话时长：</label>
                                <span class="value">{{list.duration}}分钟</span>
                            </li>
                            <li>
                                <label>通话时间：</label>
                                <span class="value">{{list.startTime}} 至 {{list.endTime}}</span>
                            </li>
                        </ul>
                    </div>
                </v-scroller>
                <div v-show="nothing">暂无数据</div>
            </div>
        </main>
        <v-footer :tabs="tabs" :index="tabIndex" @switch="switchTab"></v-footer>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            pageNum: 1,
            pageSize: 5,
            custName: '',
            PhoneNum: '',
            filterData: [],
            isSpreadOut: false,
            startTime: '',
            endTime: '',
            minDate: new Date().add("-1y").format("YmdHi"),
            maxDate: new Date().add("1y").format("YmdHi"),
            nothing: false,
            tabs: [{
                icon: '15',
                text: '首页',
                class: 'home'
            }, {
                icon: '9',
                text: '工作管理',
                class: 'work'
            }, {
                icon: '11',
                text: '客户服务',
                class: 'service'
            }, {
                icon: '6',
                text: '现场支持',
                class: 'support'
            },
            {
                icon: '7',
                text: '通话管理',
                class: 'line'
            }],
            tabIndex: 4
        }
    },
    created() {
        this.CRMQ39()
    },
    methods: {
        CRMQ39() {
            let vm = this;
            let beginTime
            let EndTime
            if (this.startTime) {
                beginTime = this.startTime.timeFormat()
            } else {
                beginTime = null
            }
            if (this.endTime) {
                EndTime = this.endTime.timeFormat()
            } else {
                EndTime = null
            }
            console.log(this.custName)
            this.$http('CRMQ39', {
                phoEventType: '外呼',
                custEcif: '',
                custName: this.custName,
                PhoneNum: this.PhoneNum,
                startTimeBegin: beginTime,
                startTimeEnd: EndTime,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }, {
                    onSuccess(data) {
                        if (data.subTypes.length == 0) {
                            vm.nothing = true
                        } else {
                            vm.nothing = false
                            for (let i = 0; i < data.subTypes.length; i++) {
                                vm.filterData.push(data.subTypes[i])
                            }
                            vm.pageNum += 1
                            console.log(vm.filterData.length)
                            console.log(data)
                            vm.$refs.scroller.end({ nomore: vm.pageSize > data.subTypes.length });
                        }
                    },
                    loading: 3,
                    // scroller: this.$refs.scroller
                })
        },
        query() {                   // 条件查询
            if (this.endTime) {
                if (this.startTime > this.endTime) {
                    this.$toast('开始日期不可大于结束日期')
                } else {
                    this.pageNum = 1
                    this.filterData = []
                    this.CRMQ39()
                }
            } else {
                this.pageNum = 1
                this.filterData = []
                this.CRMQ39()
            }


        },
        reset() {                   // 重置
            this.filterData = []
            this.isSpreadOut = false
            this.custName = '',
                this.PhoneNum = '',
                this.startTime = '',
                this.endTime = ''
            this.CRMQ39()
        },
        spreadOut() {
            this.isSpreadOut = !this.isSpreadOut;
            this.$refs.scroller.update()
        },
        switchTab: function(index) {
            switch (index) {
                case 0:
                    this.$go({ path: '/home', transition: 'none', back: 'empty' });
                    break;
                case 1:
                    this.$go({ path: '/workManageIndex', transition: 'none', back: 'empty' });
                    break;
                case 2:
                    this.$go({ path: '/service', transition: 'none', back: 'empty' });
                    break;
                case 3:
                    this.$toast('开发中，敬请期待')
                    break;
                case 4:
                    this.$go({ path: '/record', transition: 'none', back: 'empty' });
                    break;
            }
        }
    },
    watch: {
        isSpreadOut(v) {
            let vm = this
            setTimeout(function() {
                vm.$refs.scroller.update()
            }, 200);
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/css/index';
.precise {
    text-align: center;
    color: $orange-font;
    position: relative;
    .replay {
        height: 2rem;
        position: absolute;
        top: 0;
        right: 10px;
    }
}

ul {
    .btn-li {
        background: $gray-bg
    }
}

.compress {
    // -webkit-transform: scaleY(0);
    // -webkit-transform-origin-y: top;
    display: none; // max-height: 0px; 
    // transition: max-height linear 0.2s;
}

.spread-out {
    // max-height: 300px;
    // transition: max-height linear 0.2s;
    display: block;
}

main {
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
        .ui-scroller {
            &>div {
                padding: 10px 10px 0 10px;
            }
        }
    }
}

.up {
    transform: rotate(180deg)
}
</style>


