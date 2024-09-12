<template>
	<view class="container">
		<swiper class="video-swiper" :circular="circular" :easing-function="easingFunction" vertical
			:current="swiperCurrent" :duration="duration" @animationfinish="animationfinish">
			<!-- curQueue 循环会导致video重新插入，objectFit 不可变更 -->
			<swiper-item v-for="(item, index) in curQueue" :key="item.rowId">
				<video :id="`video_${item.rowId}`" class="video" :loop="loop" enable-play-gesture
					enable-progress-gesture :show-center-play-btn="false" :controls="false" :src="item.url"
					:data-id="item.rowId" :object-fit="item.objectFit || 'cover'" :data-index="index">
				</video>
				<view class="color-view">
					<view class="item">视频名称: {{item.title}}</view>
					<view class="item">视频序号: {{item.sort}}</view>
					<view class="item">idxKey: {{item.idxKey}}</view>
					<view class="item">rowId: {{item.rowId}}</view>
					<view class="item">swiperCurrentIndex: {{swiperCurrent}}</view>
					<view class="item">余数: {{videoList.length % 3}}</view>
					<view class="item">videoList: [{{videoList.map((v, idx) => v.idxKey).join(',')}}],
						个数:{{videoList.length}}</view>
					<view class="item">prevQueue: [{{prevQueue?.map((v, idx) => v.idxKey).join(',')}}],
						个数:{{prevQueue.length}}</view>
					<view class="item">curQueue: [{{curQueue?.map((v, idx) => v.idxKey).join(',')}}],
						个数:{{curQueue.length}}</view>
					<view class="item">nextQueue: [{{nextQueue?.map((v, idx) => v.idxKey).join(',')}}],
						个数:{{nextQueue.length}}</view>
					<view class="item">_last: {{ _last }}</view>
					<view class="item">_change: {{ _change }}</view>
					<view class="item">后边没有了_invalidUp: {{ _invalidUp }}</view>
					<view class="item">前边没有了_invalidDown: {{ _invalidDown }}</view>
					<view class="item">_pop: {{ _pop }}</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { ref, watch, onMounted } from 'vue';

	const emit = defineEmits(['change', 'updateNextVideo', 'play', 'pause', 'ended', 'error', 'timeupdate', 'wait',
		'progress', 'loadedmetadata', 'updatePreVideo'
	]);

	// Props
	const props = defineProps({
		duration: {
			type: Number,
			default: 500
		},
		easingFunction: {
			type: String,
			default: 'default'
		},
		loop: {
			type: Boolean,
			default: false
		},
		index: {
			type: Number,
			default: 0
		},
		videoList: {
			type: Array,
			default: () => []
		},
		bufferNumber: {
			type: Number,
			default: 4,
		},
		pageSize: {
			type: Number,
			default: 10,
		},
	});

	// Data
	const nextQueue = ref([]);
	const prevQueue = ref([]);
	const curQueue = ref([]);
	const circular = ref(false);
	const _last = ref(1);
	const _change = ref(-1);
	const _invalidUp = ref(0);
	const _invalidDown = ref(0);
	const _videoContexts = ref([]);
	const total = ref(0);
	const videoBol = ref([false, false, false, false]);
	const swiperCurrent = ref(0);
	const _pop = ref(null);
	const isFirstLoad = ref(true);
	
	

	// Watch videoList changes
	watch(() => props.videoList, (newVal = [], oldVal = []) => {
		if (newVal.length) {
			newVal.map((item, index) => {
				item.idxKey = index + 1;
				return item;
			});
			if (isFirstLoad.value) {
				isFirstLoad.value = false;
				videoListChanged(newVal);
				total.value = newVal.length;
			}
		}
	});

	// Mount lifecycle for video contexts
	onMounted(() => {
		_videoContexts.value = [uni.createVideoContext('video_0'), uni.createVideoContext('video_1'), uni
			.createVideoContext('video_2'), uni.createVideoContext('video_3')
		];
	});

	// Methods
	const videoListChanged = (newVal, newIndex = undefined) => {
		newVal.map((item, index) => {
			item.idxKey = index + 1;
			return item;
		});
		let index = newIndex ?? props.index;
		let totalPure = newVal.length;
		// 如果传入的index大于总数，则默认从0开始播放
		if (index + 1 > totalPure) index = 0;

		let remainder = index % 3; // 3的余数--当前轮播位置（10 余数 1, 20 余数 2，22 余数 1)
		console.log({
			"preList": prevQueue.value,
			"curList": curQueue.value,
			"nextList": nextQueue.value,
			"videoList": props.videoList,
			"传入索引 index": newIndex ?? props.index,
			"传入索引index % 3的余数": remainder,
			"当前 videoList 总数 % 3 的余数": props.videoList.length % 3,
		});
		let curQueuePure = [];
		let _popPure = [];
		let swiperCurrentPure = remainder;
		newVal.forEach(function(item, idx) {
			item.index = idx;
			nextQueue.value.push(item);
		});
		if (curQueue.value.length >= -1) {
			let curIndex = index > 0 ? index - 1 : 0;
			_change.value = ((index % 3) + 1) % 3;
			// 假设直接从顶部滑下来
			// _this.data._last = index === 0 ? 0 : // 如果初始播放第0个视频
			//     // index不是0，刚好是3的倍数，上一个swiper-item的索引是2(最后一个)
			//     _this.data._change === 0 ? 2 : _this.data._change - 1;// 其他情况直接用_change - 1就行
			_last.value = remainder;
			_invalidDown.value = index === 0 ? 1 : 0; // 如果刚好是第0个，不允许下滑
			_invalidUp.value = totalPure - curIndex < 2 ? 1 : 0; // 这个比较复杂了

			// 设置前后还剩多少数据
			prevQueue.value = newVal.slice(0, curIndex);
			nextQueue.value = newVal.slice(curIndex + 3);

			let circularPure = true;
			if (nextQueue.value.length === 0 && _change.value !== 0) circularPure = false;
			if (prevQueue.value.length === 0 && _change.value !== 2) circularPure = false;

			// 当前swiper展示的数组顺序
			let indexAdd = index + 1;
			let indexAdd2 = index + 2;
			let indexSub = index - 1;

			if (totalPure > 4 && totalPure % 3 == 1 && (totalPure - 1) - index <= 2) { // 除以3余1
				curQueuePure = [
					...newVal.slice(totalPure - 1, totalPure),
					...newVal.slice(totalPure - 3, totalPure - 2),
					...newVal.slice(totalPure - 2, totalPure - 1),
					...newVal.slice(totalPure - 1, totalPure),
				];
				circular.value = circularPure = false;

				if (totalPure - 1 - index == 0) {
					_change.value = 0;
					_invalidDown.value = 0;
					_invalidUp.value = 1;
					_last.value = 3;
					swiperCurrentPure = 3;
					prevQueue.value = newVal.slice(0, curIndex - 1);
				} else if (totalPure - 1 - index == 1) {
					_change.value = 0;
					_invalidDown.value = 0;
					_invalidUp.value = 0;
					_last.value = 2;
				} else if (totalPure - 1 - index == 2) {
					_change.value = 2;
					_invalidDown.value = 0;
					_invalidUp.value = 0;
					_last.value = 1;
					circular.value = circularPure = true;

					curQueuePure = [
						...newVal.slice(indexSub, index),
						...newVal.slice(index, indexAdd),
						...newVal.slice(indexAdd, indexAdd2),
					]
				}
			} else if (totalPure > 4 && totalPure % 3 == 2 && totalPure - index - 1 <= 1) { // 除以3余2
				_popPure = newVal.slice(totalPure - 3, totalPure - 2);
				_popPure = _popPure[0];
				if (totalPure - index - 1 == 0 || totalPure == index + 2) {
					if (totalPure == index + 2) { // 当直接定位到倒数第二个播放
						_change.value = 1;
						_invalidDown.value = 0;
						_invalidUp.value = 0;
						_last.value = 0;
						circularPure = false;
						curQueuePure = [
							...newVal.slice(totalPure - 2, totalPure - 1),
							...newVal.slice(totalPure - 1, totalPure),
							// ...newVal.slice(totalPure - 3, totalPure - 2),
						];
					} else {
						_change.value = 1;
						_invalidDown.value = 0;
						_invalidUp.value = 1;
						_last.value = 1;
						circularPure = false;
						curQueuePure = [
							...newVal.slice(totalPure - 2, totalPure - 1),
							...newVal.slice(totalPure - 1, totalPure),
						];
					}
					prevQueue.value = newVal.slice(0, totalPure - 3);
				} else if (totalPure - index - 1 == 1) {
					_change.value = 1;
					_invalidDown.value = 0;
					_invalidUp.value = 0;
					_last.value = 0;
					circularPure = true;
					curQueuePure = [
						...newVal.slice(totalPure - 2, totalPure - 1),
						...newVal.slice(totalPure - 1, totalPure),
						...newVal.slice(totalPure - 3, totalPure - 2),
					];
				}
			} else {
				if (totalPure <= 4) { // 当从第一个视频播放不需要其他操作
					// 当轮播第一次 初始化值
					_change.value = -1;
					_last.value = 1;
					_invalidDown.value = 0;
					_invalidUp.value = 0;
					// curQueue = newVal.slice(curIndex, curIndex + 3);
					curQueuePure = newVal;
					circularPure = false;
				} else {
					if (remainder == 0 && totalPure > 4) {
						let lastArr = newVal.slice(indexSub,
						index); // 当这是第N轮的第一个swiper，需要裁剪上一个尾的数据				  if (totalPure === index + 1) { // 当这是最后一个视频时，只需要裁剪前2个
						if (index == 0) { // 当这是第一个swiper位置视频，当前最后一个视频为下2个
							_change.value = -1;
							_last.value = 1;
							_invalidDown.value = 0;
							_invalidUp.value = 0;
							lastArr = newVal.slice(indexAdd2, indexAdd2 + 1);
						}
						curQueuePure = [
							...newVal.slice(index, indexAdd),
							...newVal.slice(indexAdd, indexAdd2),
							...lastArr
						];
					} else if (remainder == 1 && totalPure > 4) {
						curQueuePure = [
							...newVal.slice(indexSub, index),
							...newVal.slice(index, indexAdd),
							...newVal.slice(indexAdd, indexAdd2)
						]
					} else if (remainder == 2 && totalPure > 4) {
						let homeArr = newVal.slice(indexAdd, indexAdd2); // 当这是第三个swiper，需要裁剪将来一个
						if (totalPure === index + 1) { // 当这是最后一个视频时，只需要裁剪前2个
							circularPure = false;
							homeArr = newVal.slice(index - 2, indexSub);
						}
						curQueuePure = [
							...homeArr,
							...newVal.slice(indexSub, index),
							...newVal.slice(index, indexAdd)
						]
					}
				}
			}
			if (totalPure <= 4) {
				swiperCurrentPure = index;
			}

			curQueue.value = curQueuePure;
			total.value = totalPure;
			circular.value = circularPure;
			swiperCurrent.value = swiperCurrentPure;
			_pop.value = _popPure;

			playCurrent(swiperCurrent.value);
		}
	};

	const playCurrent = (current) => {
		swiperCurrent.value = current;
		_videoContexts.value.forEach((item, index) => {
			if (current === index) {
				item.play();
			} else {
				item.stop();
			}
		});
	};

	const animationfinish = (e) => {
		const current = e.detail.current;
		const diff = current - _last.value;
		const direction = diff === 1 || diff === -2 || (diff === 0 && [1, 2, 3].includes(_last.value)) ? 'up' : 'down';
		console.log({
			diff,
			_last: _last.value,
			direction,
		});
		
		// if (curQueue.value[swiperCurrent.value].rowId === props.videoList[props.videoList.length - 1].rowId && direction === 'up') return;
		// if (curQueue.value[0].rowId === props.videoList[0].rowId && direction === 'down') return;

		swiperCurrent.value = current;
		playCurrent(current);

		// down:
		// diff: -1, _last: 1
		// diff: 2, _last: 0
		// diff: -1, _last: 2
		// diff: -1, _last: 1
		// diff: 2, _last: 0
		// diff: -1, _last: 2
		// diff: 0, _last: 0

		//   up:
		// diff: -2, _last: 2
		// diff: 1, _last: 0
		// diff: 1, _last: 1
		// diff: -2, _last: 2
		// diff: 1, _last: 0
		// diff: 1, _last: 1
		// diff: 0, _last: 1,2,3

		// 判断总数据是否大于等于pageSize，并且下滑剩下4个视频开始请求接口拿数据；这里大小可以根据自己需求修改
		if (total.value >= 10 && nextQueue.value.length < 5 && direction === 'up') {
			emit('updateNextVideo', curQueue.value[swiperCurrent.value].rowId, (newList, currentIndex) => {
				videoListChanged(newList, currentIndex);
			});
		}

		if (total.value >= 10 && prevQueue.value.length < 5 && direction === 'down') {
			emit('updatePreVideo', curQueue.value[swiperCurrent.value].rowId, (newList, currentIndex) => {
				videoListChanged(newList, currentIndex);
			});
		}

		if (diff === 0 || total.value <= 4) return;

		// if (
		// 	curQueue.value[swiperCurrent.value].rowId === props.videoList[props.videoList.length - 1].rowId && direction === 'up'
		// 	||
		// 	curQueue.value[0].rowId === props.videoList[0].rowId && direction === 'down'
		// ) {
		// 	videoListChanged(props.videoList, props.videoList.findIndex(v => v.rowId === curQueue.value[current].rowId));
		// }
		_last.value = current;
		
		emit('change', {
			activeId: curQueue.value[current].rowId,
			direction
		});



		if (direction === 'up') { // 向上滑
			handleUpScroll();
		} else if (direction === 'down') { // 向下滑
			handleDownScroll();
		}

		let circularPure = true;
		if (nextQueue.value.length === 0 && current !== 0) {
			circularPure = false;
		}
		if (prevQueue.value.length === 0 && current !== 2) {
			circularPure = false;
		}
		circular.value = circularPure;
	};

	const handleUpScroll = () => {
		console.log('handleUpScroll');
		if (_invalidDown.value === 0) {
			const change = (_change.value + 1) % 3;
			const add = nextQueue.value.shift();
			const remove = curQueue.value[change];
			if (add) {
				prevQueue.value.push(remove);
				curQueue.value[change] = add;
				_change.value = change;
				// strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
				if ((total.value % 3) === 1 && nextQueue.value.length === 0) {
					let timers = new Date();
					let addItem = JSON.parse(JSON.stringify(add));
					addItem.idxKey = timers.getTime();
					curQueue.value[3] = addItem;
				} else if ((total.value % 3) === 2 && nextQueue.value.length === 0) {
					let _popItem = curQueue.value.pop();
					_pop.value = _popItem;
				}
				// end
			} else {
				_invalidUp.value += 1;
			}
		} else {
			_invalidDown.value -= 1;
		}
	};

	const handleDownScroll = () => {
		console.log('handleDownScroll');
		if (_invalidUp.value === 0) {
			const change = _change.value;
			const remove = curQueue.value[change];
			const add = prevQueue.value.pop();
			if (add) {
				curQueue.value[change] = add;
				nextQueue.value.unshift(remove);
				const repeatItemIndex = curQueue.value.findIndex(v => v.rowId === remove.rowId);
				if (repeatItemIndex > -1) {
					curQueue.value.splice(repeatItemIndex, 1);
				}
				_change.value = (change - 1 + 3) % 3;
			} else {
				_invalidDown.value += 1;
			}
		} else {
			// strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
			if ((total.value % 3) === 1 && curQueue.value.length === 4) {
				curQueue.value.pop();
			} else if ((total.value % 3) === 2 && nextQueue.value.length === 0) {
				curQueue.value.push(_pop.value);
			}
			// end
			_invalidUp.value -= 1;
		}
	};

	// Play, pause, and other video events
	const onPlay = (e) => {
		const index = e.currentTarget.dataset.index;
		videoBol.value[index] = true;
		emit('play', {
			activeId: curQueue.value[index].id
		});
	};

	const onPause = (e) => {
		const index = e.currentTarget.dataset.index;
		videoBol.value[index] = false;
		emit('pause', {
			activeId: curQueue.value[index].id
		});
	};

	const onEnded = (e) => {
		const index = e.currentTarget.dataset.index;
		videoBol.value[index] = false;
		emit('ended', {
			activeId: curQueue.value[index].id
		});
	};

	const onError = (e) => {
		const index = e.currentTarget.dataset.index;
		videoBol.value[index] = false;
		emit('error', {
			activeId: curQueue.value[index].id
		});
	};

	const trigger = (type, e, ext = {}) => {
		const activeId = e.target.dataset.id;
		emit(type, {
			activeId,
			...ext,
			...e.detail
		});
	};

	// 点击视频播放或暂停
	const clickVideo = (e) => {
		let current = swiperCurrent.value;
		let index = e.currentTarget.dataset.index;
		var videoContextPrev = uni.createVideoContext(`video_${current}`);
		if (videoBol.value[index]) {
			videoContextPrev.pause();
		} else {
			videoContextPrev.pause();
			setTimeout(function() {
				//将点击视频进行播放
				videoContextPrev.play();
			}, 300)
		}
	};
</script>

<style scoped>
	.container {
		width: 100%;
		height: 100%
	}

	.video-swiper {
		width: 100%;
		height: 100%
	}

	.video_item {
		height: 100%;
		width: 100%
	}

	.video {
		width: 100vw;
		height: 100vh;
	}

	.img {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 82rpx;
		height: 84rpx;
		margin: auto;
		z-index: 5;
	}

	.color-view {
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(4, 10, 2, 0.5);
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		color: white;
	}

	.color-view .item {
		flex: 1;
	}
</style>