<template>
    <v-page>
        <v-header>
            <v-back></v-back>
            <h1>工作调整</h1>
        </v-header>
        <main>
            <v-scroller ref="scroller">
                <ul>
                    <li v-for="(item,key) in userData" :key="key">
                        <v-radio-group v-model="myValue">
                            <v-radio :label="key" @click="onChange">
                                <div class="list-item">
                                    <label>组织</label>
                                    <span>{{item.orgName}}</span>
                                </div>
                                <div class="list-item">
                                    <label>职位</label>
                                    <span>{{item.postnName}}</span>
                                </div>
                                <div class="list-item">
                                    <label>职位类型</label>
                                    <span>{{item.postnTypeName}}</span>
                                </div>
                            </v-radio>
                        </v-radio-group>
                    </li>
                </ul>
            </v-scroller>
            <v-button @click="submit()">提交</v-button>
        </main>
    </v-page>
</template>
<script>
export default {
    data() {
        return {
            myValue: 0,
            userData: []
        }
    },
    created() {
        this.userData = this.$params.item
    },
    methods: {
        onChange(){           
        },
        submit() {
            //保存当前职位到本地存储:
            window.localStorage.setItem('currentPosition',JSON.stringify(this.userData[this.myValue]));
            window.location.reload();
        },
        CRMQ01(){
            let vm = this;
            this.$http('CRMQ01', {
                UserNum: '84351811'
            }, {
                onSuccess(data) {
                    console.log(data),
                    vm.userData = data.subTypes
                },
                loading: 1
            })
        },
    }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>

.ui-page>main {
    flex-flow: column;
    button{
        font-size: 1.2rem;
        position: fixed;
        bottom: 1rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 100;
    }
    ul {
        height: 520px !important;
        overflow: scroll;
        li {
            position: relative;
            margin-top: 1px;
            padding-top: .8rem;
            background-color: #fff;
            label{
                width:88%;
                .list-item{
                    clear: both;
                    height: 2rem;
                    margin-bottom: 0.2rem;
                    label{
                        float: left;
                        width: 20%;
                        padding-left: 1rem;
                    }
                    span{
                        float: right;
                        width: 16rem;
                        text-align: right;
                    }
                }
            }  
        }
    }
}

</style>
