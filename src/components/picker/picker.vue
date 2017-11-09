<template>
    <transition name="v-picker">
        <div class="ui-picker" v-if="visible" v-tap="close">
            <div @touchend.stop="$tools.noop">
                <h3 v-if="title">{{title}}</h3>
                <div>
                    <v-scroller>
                        <v-radio-group v-model="myValue" @input="onChange">
                            <v-radio v-for="item in data" :key="item[valueField]" :label="item[valueField]">{{item[textField]}}</v-radio>
                        </v-radio-group>
                    </v-scroller>
                </div>
                <div class="btns">
                    <v-button @click="close">取消</v-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'vPicker',
    props: {
        title: String, //标题
        data: Array, //数据集
        value: null, //默认值
        textField: { //data中用于显示文本的属性
            type: String,
            default: 'text'
        },
        valueField: { //data中用于表示值的属性
            type: String,
            default: 'value'
        }
    },
    data() {
        return {
            visible: false
        }
    },
    computed: {
        myValue: {
            get() {
                return this.value;
            },
            set(v) {
                this.$emit('input', v);
            }
        }
    },
    methods: {
        onChange(v) {
            if (this.myValue != v) {
                let obj;
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i][this.valueField] == v) {
                        obj = this.data[i];
                    }
                }
                this.$emit('change', obj, v);
            }
            this.close();
        },
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        }
    }
}
</script>

<style lang="scss">
@import "./picker";

.ui-picker {
    @extend %ui-picker;
    & > div {
        .ui-scroller-wrap {
            max-height: 50vh;
            .ui-radio-group {
                .ui-radio {
                    border-top: solid 1px $gray-border;
                    @include bg(#fff);
                    & > i {
                        left: inherit;
                        right: 1rem;
                        margin: 0;
                    }
                    & > label {
                        display: block;
                        @extend %no-break;
                        padding-left: 1rem;
                        line-height: 3;
                    }
                    &:after {
                        left: 1rem;
                        right: 1rem;
                        width: auto;
                    }
                    &:first-child {
                        &:after {
                            content: none;
                        }
                    }
                }
            }
        }
    }
}
</style>