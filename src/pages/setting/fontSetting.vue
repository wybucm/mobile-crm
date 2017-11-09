<template>
	<v-page>
		<v-header>
			<v-back></v-back>
			<h1>字号设置</h1>
		</v-header>
		<main>
			<div class="font-setting">
				<ul>
					<li v-for="(font,key) in fontSize" :key="key" :class="font.class" @click="setFont(font.size)">{{font.text}}</li>
				</ul>
			</div>
		</main>
	</v-page>
</template>

<script>
export default {
	data() {
		return {
			fontSize: [
				{class:'immense-size', text:'极大', size: 1.3},
				{class:'huge-size', text:'巨大', size: 1.2},
				{class:'large-size', text:'超大', size: 1.1},
				{class:'big-size', text:'大', size: 1},
				{class:'medimun-size', text:'中', size: 0.9},
				{class:'small-size', text:'小', size: 0.8}
			]
		}
	},
	created: function () {
        // this.checkCookie();
    },
	methods: {
		//设置字体大小
		setFont(size) {
			let fontSize = (innerWidth * 100 / 414 * size).toFixed(0);
    		document.getElementsByTagName('html')[0].style.fontSize = fontSize + '%';
			window.localStorage.setItem('localFont', size);
		},
	}
};

</script>

<style lang="scss" scoped>
.font-setting{
	background: #fff;
	li{
		height: 4rem;
		line-height: 4rem;
		padding: 0 1rem;
		border-bottom: 1px solid #eee;
		&.small-size{
			font-size: 0.8rem;
		}
		&.medimun-size{
			font-size: 1rem;
		}
		&.big-size{
			font-size: 1.2rem;
		}
		&.large-size{
			font-size: 1.5rem;
		}
		&.huge-size{
			font-size: 1.8rem;
		}
		&.immense-size{
			font-size: 2rem;
		}
	}
}
</style>