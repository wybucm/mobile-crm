<template>
    <v-page>
        <v-header>
            <v-back></v-back>
            <h1>营销活动</h1>
        </v-header>
        <main>
            <div class="main">
                <v-scroller ref="scroller" :toLoadMore="true" @loadmore="CRMQ37">
                    <v-radio-group v-model="myValue">
                        <div class="list-box" v-for="(item,key) in allData" :key="key">
                            <v-radio :label="key">
                                <div class="list-item">
                                    <label>名称</label>
                                    <span>{{item.name}}</span>
                                </div>
                                <div class="list-item">
                                    <label>类型</label>
                                    <span>{{item.type}}</span>
                                </div>
                                <div class="list-item">
                                    <label>子类型</label>
                                    <span>{{item.subType}}</span>
                                </div>
                                <div class="list-item">
                                    <label>计划结束时间</label>
                                    <span>{{item.endTime}}cc</span>
                                </div>
                                <div class="list-item">
                                    <label>详细信息</label>
                                    <span>{{item.custEcif}}</span>
                                </div>
                            </v-radio>
                        </div>
                    </v-radio-group>
                </v-scroller>
            </div>
        </main>
        <button class="btn" v-tap="select">确定</button>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            pageNum: 1,
            pageSize: 5,
            allData: [],
            myValue: 0,
        }
    },
    created() {
        this.CRMQ37()
    },
    methods: {
        CRMQ37() {
            let vm = this;
            this.$http('CRMQ37', {
                type: '',
                subType: '',
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }, {
                    onSuccess(data) {
                        console.log(data)
                        for (let i = 0; i < data.subTypes.length; i++) {
                            vm.allData.push(data.subTypes[i])
                        }
                        console.log(vm.allData)
                        vm.pageNum += 1
                        vm.$refs.scroller.end({ nomore: vm.pageSize > data.subTypes.length });
                    },
                    // finally() {
                    //     vm.$refs.scroller.update()
                    // },
                    loading: 3,
                })
        },
        select() {
            this.$back({
                params: {
                    srcCamp: this.allData[this.myValue].name,
                    srcCampRowid: this.allData[this.myValue].rowid
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/css/index";

.ui-page>main {
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
        .list-box {
            margin-bottom: 15px;
            padding-top: .8rem;
            background-color: #fff;
            .list-item {
                clear: both;
                label {
                    float: left;
                    width: 20%;
                    padding-left: 1rem;
                }
                span {
                    float: right;
                }
            }
        }
    }
}

.btn {
    width: 100%;
    background: #fff;
    color: $orange-font;
    text-align: center;
    line-height: 45px;
    font-size: 20px;
    border-top: 1px solid $light-border
}
</style>

