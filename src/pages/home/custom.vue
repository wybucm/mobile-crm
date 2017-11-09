<template>
    <v-page>
        <v-header class="header">
            <v-back></v-back>
            <h1>核心功能区</h1>
            <v-button class="btn-submit" @click="submit()">完成</v-button>
        </v-header>
        <main class="mainBox">
            <div class="block_fixed">
                <div class="block_header">
                    <div class="block_title">已添加功能</div>
                </div>
                <div class="block_cnt">
                    <div class="ui-grid editable">
                        <ul>
                            <li v-for="(item,i) in currentFunction">
                                <span :class="'icon-'+item.icon">
                                    <span v-for="i in item.count" :class="'path'+i"></span>
                                </span>
                                <label>{{item.text}}</label>
                            </li>
                        </ul>
                    </div>
                    <v-grid :items="todos" :editable="editable" @click="removeToDown"></v-grid>
                </div>
            </div>
            </div>
            <div class="block_fixing">
                <div class="block_header">
                    <div class="block_title">未添加功能</div>
                </div>
                <div class="block_cnt" style="border:none;">
                    <v-grid :items="idles" :editable="editable" @click="removeToUp"></v-grid>
                </div>
            </div>
        </main>
    </v-page>
</template>

<script>
export default {
    data() {
        return {
            editable: true,
            form: {
                phone: '',
                user: '',
                other: '-1'
            },
            rules: {
                phone: ['phone', 'required'],
                user: [{
                    type: this.vv
                }, 'required'],
                other: ['required', 'money']
            },
            currentFunction: [{ text: "每日战报", icon: 13, count: 6, iconFunc: 28, link: 'dailyWork' },
            { text: "工作日程", icon: 10, count: 4, iconFunc: 28, link: 'schedule' },
            { text: "客户提醒", icon: 12, count: 7, iconFunc: 28, link: 'clientIndex' }],
            todos: [{ text: "营销目标", icon: 50, count: 2, iconFunc: 28, link: '' },
            { text: "重要信息", icon: 4, count: 3, iconFunc: 28, link: '' },
            { text: "待跟进需求", icon: 8, count: 2, iconFunc: 28, link: '' },
            { text: "通用工单", icon: 2, count: 4, iconFunc: 28, link: '' },
            { text: "最新活动", icon: 5, count: 2, iconFunc: 28, link: '' },
            { text: "市场咨询", icon: 14, count: 6, iconFunc: 28, link: '' }],
            idles: [

            ]
        }
    },
    created() {
        let resetData = JSON.parse(localStorage.getItem('testData'));
        if (resetData == null) {
            console.log(4321);
            this.todos = this.todos;
            console.log(this.todos);
        } else {
            console.log(1234);
            this.todos = JSON.parse(localStorage.getItem('testData'));
            console.log(this.todos);
        }
        let resetData2 = JSON.parse(localStorage.getItem('testData2'));
        if (resetData2 == null) {
            console.log(9876);
            this.idles = this.idles;
            console.log(this.idles);
        } else {
            console.log(6789);
            this.idles = JSON.parse(localStorage.getItem('testData2'));
            console.log(this.idles);
        }
    },
    methods: {
        submit() {
            window.localStorage.setItem('testData',JSON.stringify(this.todos));
            window.localStorage.setItem('testData2',JSON.stringify(this.idles));
            window.location.reload();
        },
        reset() {
            this.form = {
                phone: '',
                user: '',
                other: '123'
            };
        },
        vv(v) {
            if (v.length == 3) return true;
            return '{0}我的错！';
        },
        removeToDown(item, index) {
            this.idles.push(this.todos.splice(index, 1)[0])
            for (var i = 0; i < this.idles.length; i++) {
                this.idles[i].iconFunc = 26
            }
            // window.localStorage.setItem('testData',JSON.stringify(this.todos));
            // window.localStorage.setItem('testData2',JSON.stringify(this.idles));
            // localStorage.clear();
        },
        removeToUp(item, index) {
            this.todos.push(this.idles.splice(index, 1)[0])
            console.log(this.todos.length)
            for (var i = 0; i < this.todos.length; i++) {
                this.todos[i].iconFunc = 28
            }
            // window.localStorage.setItem('testData',JSON.stringify(this.todos));
            // window.localStorage.setItem('testData2',JSON.stringify(this.idles));
            // localStorage.clear();
        }
    },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../common/css/index';

.ui-page {
    .link {
        color: $blue-font;
    }
}

.block_fixed,
.block_fixing {
    // height: 50%;
}

.block_header {
    font-size: 1rem;
    border-bottom: 1px solid #B80C0C;
    padding: 0 1rem;
    height: 3rem;
    line-height: 3rem;
    .block_title {
        display: inline-block;
        float: left;
    }
    .block_tip {
        display: inline-block;
        float: right;
    }
}

.block_cnt {
    color: #333;
    border-bottom: 2px solid #B80C0C;
    min-height: 6.3rem;
    .home_link {
        text-align: center;
        width: 33%;
        height: 1.8rem;
        float: left;
        margin-bottom: .5rem;
        background-position: center top;
        background-repeat: no-repeat;
        background-size: 40%;
        padding-top: 4rem;
    }
}
</style>