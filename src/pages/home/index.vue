<template>
    <v-page>
        <!-- 遮罩层 -->
        <div class="backdrop" :class="coverShow" @click="coverDisappear"></div>
        <v-header @click="coverDisappear" style="zIndex: 1000;">
            <!-- 遮罩层 -->
            <div class="backdrop" :class="coverShow" @click="coverDisappear"></div>
            <h1>移动CRM</h1>
            <v-button class="btn_menu" @click="dropdown()">
                <i class="icon-36"></i>
            </v-button>
            <v-button class="btn_msg" @click="goMsg">
                <i class="icon-42"></i>
            </v-button>
            <ul class="dropdownWrapper" v-show='dropdownActive'>
                <li>
                    <a @click="manageClient">客户查询</a>
                </li>
                <li>
                    <a @click="createClue">创建线索</a>
                </li>
                <li>
                    <a @click="setSchedule">创建日程</a>
                </li>
                <li>
                    <a @click="sellingSupport">知识库</a>
                </li>
                <li>
                    <a @click="setting">设置</a>
                </li>
            </ul>
        </v-header>
        <main>
            <div class="welcome">
                <div class="welcome-text">
                    <div class="welcome-msg">欢迎
                        <span>{{userCurrentData.userName}}</span>登录广发银行个人移动CRM平台</div>
                    <div class="info-block" @click="versionMsg">
                        <div class="date">{{month}}/{{day}}<br/>
                            <span>YEAR {{year}}</span>
                        </div>
                        <div class="user-info">
                            <div class="usrInfo">
                                <label>用户号码</label>
                                <span style="color:#ed7753;">{{userCurrentData.userNum}}</span>
                            </div>
                            <div class="usrInfo">
                                <label>当前机构</label>
                                <span>{{userCurrentData.orgName}}</span>
                            </div>
                            <div class="usrInfo">
                                <label>当前职位</label>
                                <span>{{userCurrentData.postnName}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main">
                <div v-for="(element,i) in currentFunction" class="home_link" v-hold="[onHold,i,$e]" v-bind:class="element.class" v-tap="[go,element.link]">
                    <span :class="'icon-'+element.icon">
                        <span v-for="i in element.count" :class="'path'+i"></span>
                    </span>
                    {{element.text}}
                </div>
                <div v-show="resetData.length !=0">
                    <div v-for="(element,i) in list" class="home_link" v-hold="[onHold,i,$e]" v-bind:class="element.class" v-tap="[go,element.link]">
                        <span :class="'icon-'+element.icon">
                            <span v-for="i in element.count" :class="'path'+i"></span>
                        </span>
                        {{element.text}}
                    </div><div class="home_link" v-hold="onHold" v-link="'/custom'">
                        <span class="icon-17">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                        </span>
                        自定义布局
                    </div>
                </div>

            </div>
        </main>
        <v-footer :tabs="tabs" :index="tabIndex" @switch="switchTab"></v-footer>
    </v-page>
</template>

<script>
export default {
    data() {
        return {
            resetData: [],
            userCurrentData: {},
            coverShow: 'coverNoDisplay',
            toastCreated: false,
            dropdownActive: false,
            year: '',
            month: '',
            day: '',
            currentFunction: [{ text: "每日战报", icon: 13, count: 6, iconFunc: 28, link: 'dailyWork' },
            { text: "工作日程", icon: 10, count: 4, iconFunc: 28, link: 'schedule' },
            { text: "客户提醒", icon: 12, count: 7, iconFunc: 28, link: 'clientIndex' }],
            list: [{ text: "营销目标", icon: 50, count: 2, iconFunc: 28, link: '' },
            { text: "重要信息", icon: 4, count: 3, iconFunc: 28, link: '' },
            { text: "待跟进需求", icon: 8, count: 2, iconFunc: 28, link: '' },
            { text: "通用工单", icon: 2, count: 4, iconFunc: 28, link: '' },
            { text: "最新活动", icon: 5, count: 2, iconFunc: 28, link: '' },
            { text: "市场咨询", icon: 14, count: 6, iconFunc: 28, link: '' }],
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
            tabIndex: 0
        }
    },
    created() {
        // 获取url的参数
        if (JSON.parse(localStorage.getItem('testData'))) {
            this.resetData = JSON.parse(localStorage.getItem('testData'));
        } else {
            this.resetData = [1]
        }
        console.log(this.resetData)
        if (this.resetData == null) {
            this.list = this.list;
        } else {
            this.list = JSON.parse(localStorage.getItem('testData'));
        }
        this.CRMQ01();
        let now = new Date
        let dateArr1 = now.format().split(" ")[0].split("-")
        this.year = dateArr1[0]
        this.month = dateArr1[1]
        this.day = dateArr1[2]
        // alert(this.getQuery())
    },
    methods: {
        go(parmas) {
            if (parmas) {
                this.$go('/' + parmas)
            } else {
                this.$toast('开发中，敬请期待');
            }
        },
        onHold() {
            setTimeout(() => {
                this.$go('/custom');
            }, 100);
        },
        versionMsg() {
            setTimeout(() => {
                this.$toast('当前版本为 V201711072027_2');
            }, 100);
        },
        dropdown() {
            this.dropdownActive = !this.dropdownActive;
            if (this.dropdownActive) {
                this.coverShow = 'coverDisplay'
            } else {
                this.coverShow = 'coverNoDisplay'
            }
        },
        coverDisappear() {
            this.coverShow = 'coverNoDisplay',
                this.dropdownActive = false
        },
        dropdownClick() {
            this.coverShow = 'coverNoDisplay',
                this.dropdownActive = false
        },
        goMsg() {
            this.$go({
                path: '/messageWarm',
                params: {
                    title: '消息提醒',
                    from: 'home'
                }
            });
            this.hideCover();
        },
        manageClient() {
            this.$go({
                path: '/manageClient',
                params: { title: '客户查询' }
            });
            this.hideCover();
        },
        createClue() {
            this.$go({
                path: '/createClue'
            });
            this.hideCover();
        },
        setSchedule() {
            this.$go({
                path: '/setSchedule'
            });
            this.hideCover();
        },
        sellingSupport() {
            this.$go({
                path: '/sellingSupport'
            });
            this.hideCover();
        },
        setting() {
            this.$go({
                path: '/setting',
                params: {
                    item: this.userData
                }
            });
            this.hideCover();
        },
        hideCover() {
            setTimeout(() => {
                this.coverShow = 'coverNoDisplay',
                    this.dropdownActive = false
            }, 200);
        },
        getdata(evt) {
            // console.log(evt.draggedContext.element.id)
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
        },
        CRMQ01() {
            let vm = this;
            this.$http('CRMQ01', {
                userNum: '01340962',
                param: this.getQuery()
            }, {
                    onSuccess(data) {
                        console.log(data),
                            vm.userData = data.subTypes
                        for (var i = 0; i < vm.userData.length; i++) {
                            if (vm.userData[i].primaryFlag == 'Y') {
                                vm.userCurrentData = vm.userData[i];
                            }
                            //读取本地职位覆盖前面的取值
                            var currentPosition = JSON.parse(
                              localStorage.getItem("currentPosition")
                            );
                            if (currentPosition) {
                              vm.userCurrentData = currentPosition;
                              }
                        }
                    },
                    loading: 1
                })
        },
        getQuery() {
            let query = window.location.search.substring(1);
            let pair = query.split("=")[1];
            return pair;
        }
    }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$border: 0.4rem solid #f4f4f4;

header {
    .dropdownWrapper {
        background: #fff;
        color: #333;
        text-align: center;
        width: 9rem;
        position: absolute;
        top: 3rem;
        right: 0;
        box-shadow: 0px 1px 8px #bbb;
        border-radius: 0.3rem;
        li {
            border-bottom: 2px solid #fafafa;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.1rem;
            &:last-child {
                border-bottom: none;
            }
        }
    }
}

.ios {
    header {
        .dropdownWrapper {
            top: 4.5rem;
        }
    }
}

.btn_msg {
    display: inline-block;
    background-size: 60%;
    width: 2rem;
}

.btn_menu {
    display: inline-block;
    background-size: 60%;
    width: 2rem;
}

.welcome {
    padding: 0.8rem;
    font-size: 1rem;
    margin-bottom: 0.8rem;
    line-height: 1.6rem;
    background: #fff;
    .welcome-text {
        background: url('../../common/images/bg_split.png') repeat scroll;
        border-radius: 0.6rem;
        padding: 0.8rem;
        .welcome-msg {
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
            text-align: justify;
            text-align-last: justify;
            span {
                color: #f75b45;
                padding: 0 0.2rem;
            }
        }
        .info-block {
            .date {
                color: #f75b45;
                font-weight: bold;
                font-size: 2rem;
                display: inline-block;
                width: 25%;
                span {
                    font-size: 1rem;
                }
            }
            .user-info {
                display: inline-block;
                width: 73%;
                .usrInfo {
                    line-height: 1.2rem;
                    label {
                        width: 28%;
                        display: inline-block;
                    }
                    span {
                        width: 69%;
                        text-align: right;
                        display: inline-block;
                    }
                }
            }
        }
    }
}

.main {
    padding: 1rem;
    font-size: 0.8rem;
    color: #333;
    font-weight: bold;
    background: #fff;
    .home_link {
        text-align: center;
        width: 33%;
        display: inline-block;
        margin-bottom: 1rem;
        background-position: center top;
        background-repeat: no-repeat;
        background-size: 40%;
        padding-top: 1rem;
        [class^="icon-"] {
            display: block;
            margin-bottom: 0.8rem;
            font-size: 3rem;
        }
    }
}

.ui-carousel-item {
    font-size: 2rem;
    text-align: center;
}

.backdrop {
    background-color: #000;
    opacity: 0.3;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
}

.dropdownWrapper {
    z-index: 1000;
    a {
        display: block;
    }
}

.coverNoDisplay {
    display: none;
}

.coverDisplay {
    display: block;
}
</style>