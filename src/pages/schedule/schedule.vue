<template>
    <v-page>
        <v-header>
            <v-back></v-back>
            <h1>工作日程</h1>
            <!--<v-button @click="cancle1" v-show="cancleBtn1">取消</v-button>
            <v-button @click="cancle2" v-show="cancleBtn2">取消</v-button>
            <v-button @click="edit1" v-show="editBtn1">编辑</v-button>
            <v-button @click="edit2" v-show="editBtn2">编辑</v-button>-->
        </v-header>
        <main>
            <calendar-input @getValue="dateValue"></calendar-input>
            <template>
                <div class="nav">
                    <div class="navItem" :class="{current:processCurrent}" v-tap="goProcess">
                        <span>已安排日程</span>
                    </div>
                    <div class="navItem" :class="{current:planCurrent}" v-tap="goPlan">
                        <span>待安排日程</span>
                    </div>
                </div>
                <div class="mission-list">
                </div>
                <div class="tab-content mission-list">
                    <div v-show="showProcess">
                        <v-checkbox-group v-model="selArr" class="events">
                            <div v-for="(event,key) in workData" v-model="myValue" :key="event.key" class="test">
                                <v-checkbox :label="event.rowid" class="value"></v-checkbox>
                                <div class="mission-item event-item mission-allocated" @click="scheduleDetail(key)">
                                    <div class="mission-time wrapper">
                                        <label>{{event.period}}</label>
                                        <p>{{event.startTime | formatDate}}-{{event.endTime | formatDate}}</p>
                                    </div>
                                    <div class="mission">{{event.eventName}}</div>
                                </div>
                            </div>
                        </v-checkbox-group>
                    </div>
                    <div v-show="showPlan">
                        <v-checkbox-group v-model="unselArr" class="events">
                            <div v-for="(event,key) in missionData" v-model="myValue" :key="event.key" class="test">
                                <v-checkbox :label="event.rowid" class="value"></v-checkbox>
                                <div class="mission-item event-item mission-unallocated" v-link="'/clientIndex'">
                                    <div class="mission">{{event.name}}</div>
                                </div>
                            </div>
                        </v-checkbox-group>
                    </div>
                </div>
            </template>
        </main>
        <div class="footer">
            <button @click="jump">{{btnTxt}}</button>
        </div>
    </v-page>
</template>

<script>
import calendarInput from '../../components/calendar-plugin/calendar-input';
import {formatDate} from '../../common/js/dateFormat';
export default {
    components: {
      calendarInput
    },
    data() {
        return {
            myValue: 0,
            pageNum: 1,
            pageSize: 50,
            showProcess: true,
            showPlan: false,
            processCurrent: true,
            planCurrent: false,
            dateVal: '',
            workData: [],
            missionData: [],
            selected: false,
            selArr: [],
            unselArr: [],
            btnTxt: '创建日程',
            scheduleLink: '/setSchedule',
            cancleBtn1: false,
            cancleBtn2: false,
            editBtn1: true,
            editBtn2: false
            }
        },
        filters: {
            formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'hh : mm');
            }
        },
        methods:{
            done() {                          // 提示有多少条任务/线索已设置
                let vm = this
                let count = 0
                for (let i = 0; i < this.selArr.length; i++) {
                    if (this.listData[this.selArr[i]].scheduleFlag == 'Y') {
                    count++
                    }
                }
                // 创一个放客户号的数组
                let rowidArr = []
                for (let i = 0;i < this.selArr.length;i++){
                    rowidArr.push(this.listData[this.selArr[i]].rowid)
                }
                if (count > 0) {
                    this.$confirm({
                    title: "提示",
                    text: '你有' + count + '条【任务/线索】已设置日程，请确认是否变更日程安排？',
                    closable: true,
                    callback: () => {
                        vm.$go({ path: "/updateSchedule", params: {rowidArr: rowidArr} });
                    }
                    });
                } else {
                    this.$go({ path: "/updateSchedule", params: {rowidArr: rowidArr} })
                }
            },
            goProcess() {
                this.showProcess = true;
                this.showPlan = false;
                this.processCurrent = true;
                this.planCurrent = false;
                this.editBtn1= true;
                this.cancleBtn1= false;
                this.editBtn2= false;
                this.cancleBtn2= false;
                this.btnTxt = '创建日程';
                let missionLength = document.getElementsByClassName('mission-allocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-allocated')[i].style.left = 0 + 'rem';
                }
                this.scheduleLink = '/setSchedule';
            },
            goPlan() {
                this.showProcess = false;
                this.showPlan = true;
                this.processCurrent = false;
                this.planCurrent = true;
                this.editBtn1= false;
                this.cancleBtn1= false;
                this.editBtn2= true;
                this.cancleBtn2= false;
                this.btnTxt = '设置日程';
                let missionLength = document.getElementsByClassName('mission-unallocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-unallocated')[i].style.left = 0 + 'rem';
                }
                this.scheduleLink = '/setSchedule';
            },
            dateValue(dataDate){
                this.dateVal = dataDate
                let vm = this;
                this.$http('CRMQ34', {
                    UserNum: '01340962',
                    queryDate: this.dateVal,
                    pageNum: 1,
                    pageSize: 20
                }, {
                    onSuccess(data) {
                        vm.CRMQ36();
                        vm.workData = data.subTypes
                        for (let i = 0;i < vm.workData.length;i++){
                            if(vm.workData[i].startTime.split(" ")[1].split(":")[0] <12){
                                vm.workData[i].period = '上午'
                            }else{
                                vm.workData[i].period = '下午'
                            }
                        }
                    },
                    loading: 1
                })
            },
            CRMQ36(){
                let vm = this;
                this.$http("CRMQ36",{
                        parType: '',
                        type: '',
                        subType: '',
                        custEcif: '',
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        rowid: ''
                    }, {
                        onSuccess(data) {
                            vm.missionData = data.subTypes
                            vm.pageNum += 1;
                            // vm.$refs.scroller.end({ nomore: vm.pageSize > data.subTypes.length });
                        },
                        loading: 3,
                    });
            },
            edit1(){
                this.editBtn1= false;
                this.cancleBtn1= true;
                this.editBtn2= false;
                this.cancleBtn2= false;
                this.btnTxt = '修改日程';
                let missionLength = document.getElementsByClassName('mission-allocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-allocated')[i].style.left = 4 + 'rem';
                }
                this.scheduleLink = '/updateSchedule';
            },
            cancle1(){
                this.editBtn1= true;
                this.cancleBtn1= false;
                this.editBtn2= false;
                this.cancleBtn2= false;
                this.btnTxt = '设置日程';
                let missionLength = document.getElementsByClassName('mission-allocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-allocated')[i].style.left = 0 + 'rem';
                }
                this.scheduleLink = '/setSchedule';
            },
            edit2(){
                this.editBtn1= false;
                this.cancleBtn1= false;
                this.editBtn2= false;
                this.cancleBtn2= true;
                this.btnTxt = '设置日程';
                let missionLength = document.getElementsByClassName('mission-unallocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-unallocated')[i].style.left = 4 + 'rem';
                }
                this.scheduleLink = '/setSchedule';
            },
            cancle2(){
                this.editBtn1= false;
                this.cancleBtn1= false;
                this.editBtn2= true;
                this.cancleBtn2= false;
                this.btnTxt = '设置日程';
                let missionLength = document.getElementsByClassName('mission-unallocated').length;
                for (let i = 0; i < missionLength; i ++) {
                    document.getElementsByClassName('mission-unallocated')[i].style.left = 0 + 'rem';
                }
                this.scheduleLink = '/setSchedule';
            },
            scheduleDetail(key){
                this.$go({
                    path: "/scheduleDetail",
                    params: {
                        from: 'schedule',
                        eventName: this.workData[key].eventName,
                        loacation: this.workData[key].loacation,
                        startTime: this.workData[key].startTime,
                        endTime: this.workData[key].endTime,
                        remind: this.workData[key].remind,
                        comment: this.workData[key].comment,
                        certType: this.workData[key].certType,
                        certNum: this.workData[key].certNum,
                        custName: this.workData[key].custName,
                        phoneNum: this.workData[key].phoneNum,
                        rowid: this.workData[key].rowid
                    }
                })
            },
            jump(key){
                if (this.cancleBtn1 == true) {
                    if (this.selArr.length == 0) {
                        this.$alert({ title: "提示", text: "请选择任务或线索" });
                        return;
                    }
                    this.$go({
                        path: "/updateSchedule",
                        params: {
                            from: 'schedule',
                            workData: this.workData,
                        }
                    });
                    this.cancle1()
                }else if(this.editBtn1 == true){
                    this.pageTitle = '设置日程';
                    this.$go({
                        path: this.scheduleLink
                    });
                }else if( this.cancleBtn2 == true){
                    if (this.unselArr.length == 0) {
                        this.$alert({ title: "提示", text: "请选择任务或线索" });
                        return;
                    }
                    this.$go({
                        path: "/setSchedule",
                        params: {
                            from: 'schedule',
                            workData: this.workData
                        }
                    });
                    this.cancle2()
                }else{
                    if (this.unselArr.length == 0) {
                        this.$alert({ title: "提示", text: "请选择任务或线索" });
                        return;
                    }
                    this.pageTitle = '设置日程';
                    this.$go({
                        path: this.scheduleLink
                    });
                }
            },
            CRMQ41(){
                let vm = this;
                this.$http('CRMQ41', {
                    UserNum: '01340962',
                    pageNum: 1,
                    pageSize: 5
                }, {
                        onSuccess(data) {
                            vm.searchData = data
                        },
                        loading: 1,
                        finally() {
                            vm.$refs.scroller.update()
                        }
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
@import '/index';
</style>