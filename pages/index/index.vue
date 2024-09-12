<template>
	<view class="qb">
		<VideoSwiper
			class="video-swiper"
			:index="current_index"
			:video-list="videoList"
			:pageSize="pageSize"
			@updateNextVideo="updateNextVideo"
			@updatePreVideo="updatePreVideo"
			@change="handleCurrentVideoIndex"
		></VideoSwiper>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import VideoSwiper from "../../components/VideoSwiper/index.vue";
import { getVideoList } from "../../utils/api";

const mockList = [
  {
    rowId: '0424c042befca12e',
    username: 'Ivy',
    title: 'Great Performance',
    like: 341,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/710b0cf7-bed9-4805-a2fb-0b703483dbec.MOV',
    sort: 1
  },
  {
    rowId: '087159814e97d2e2',
    username: 'Frank',
    title: 'Cool Show',
    like: 614,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/5017a17a-389b-45e0-8d91-711c9dc76759.mp4',
    sort: 2
  },
  {
    rowId: 'b43f242b6c2fd970',
    username: 'Eve',
    title: 'Amazing Video',
    like: 318,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/97b50a6d-f77d-4418-b38d-844e0b9eec97.mp4',
    sort: 3
  },
  {
    rowId: '2a7798d16e0c2223',
    username: 'Alice',
    title: 'Fantastic Stream',
    like: 182,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/e1cd785e-56ae-4c96-a713-126bf2950e19.mp4',
    sort: 4
  },
  {
    rowId: 'b3ce738a628e5462',
    username: 'Heidi',
    title: 'Cool Show',
    like: 938,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/c8f7a17f-6eb8-453a-9f43-944ecc7a9f11.mp4',
    sort: 5
  },
  {
    rowId: '937cdd884582e0f2',
    username: 'Eve',
    title: 'Amazing Video',
    like: 895,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/c061b07a-4b34-4d6d-aa1a-2cf41679f17c.mp4',
    sort: 6
  },
  {
    rowId: 'c865fc4b1c745b46',
    username: 'Ivy',
    title: 'Great Performance',
    like: 561,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/f905c750-c70e-46b2-aaa6-37778d308f13.mp4',
    sort: 7
  },
  {
    rowId: '8eb47013221ca480',
    username: 'Ivy',
    title: 'Awesome Clip',
    like: 918,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/209180d8-3dfd-42ea-9ef5-5f98ae0d95e1.mp4',
    sort: 8
  },
  {
    rowId: '55755d72eb63407f',
    username: 'Heidi',
    title: 'Cool Show',
    like: 57,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/5017a17a-389b-45e0-8d91-711c9dc76759.mp4',
    sort: 9
  },
  {
    rowId: '108eeecedc2322a0',
    username: 'Heidi',
    title: 'Fantastic Stream',
    like: 610,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/c061b07a-4b34-4d6d-aa1a-2cf41679f17c.mp4',
    sort: 10
  },
  {
    rowId: '88d466083133b678',
    username: 'Charlie',
    title: 'Amazing Video',
    like: 386,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/bfc86ab8-bb3b-4cef-a5d2-8c5edce4ef17.mp4',
    sort: 11
  },
  {
    rowId: '0366a3344892a06c',
    username: 'Bob',
    title: 'Awesome Clip',
    like: 746,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/209180d8-3dfd-42ea-9ef5-5f98ae0d95e1.mp4',
    sort: 12
  },
  {
    rowId: '0346b05dd2cfa95d',
    username: 'Frank',
    title: 'Fantastic Stream',
    like: 496,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/53543262-55f5-4685-a5e3-b56ce75bcb88.mp4',
    sort: 13
  },
  {
    rowId: '37fbf38324e117ed',
    username: 'Dave',
    title: 'Great Performance',
    like: 339,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/710b0cf7-bed9-4805-a2fb-0b703483dbec.MOV',
    sort: 14
  },
  {
    rowId: '026dddde7f0f2e7b',
    username: 'Bob',
    title: 'Fantastic Stream',
    like: 169,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/9392e85c-36db-473f-8ec3-4f8ed83a382a.mp4',
    sort: 15
  },
  {
    rowId: '6986be59275b4682',
    username: 'Heidi',
    title: 'Awesome Clip',
    like: 222,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/e1cd785e-56ae-4c96-a713-126bf2950e19.mp4',
    sort: 16
  },
  {
    rowId: '0973b36fbc163b36',
    username: 'Grace',
    title: 'Cool Show',
    like: 131,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/e1cd785e-56ae-4c96-a713-126bf2950e19.mp4',
    sort: 17
  },
  {
    rowId: '118161c55fdc3528',
    username: 'Ivy',
    title: 'Great Performance',
    like: 765,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/ec383f81-6896-4274-8861-e329ae1376b4.mp4',
    sort: 18
  },
  {
    rowId: 'bdc263af95868927',
    username: 'Bob',
    title: 'Great Performance',
    like: 77,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/9392e85c-36db-473f-8ec3-4f8ed83a382a.mp4',
    sort: 19
  },
  {
    rowId: '3fd8be1b6413bf7f',
    username: 'Jack',
    title: 'Awesome Clip',
    like: 595,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/5017a17a-389b-45e0-8d91-711c9dc76759.mp4',
    sort: 20
  },
  {
    rowId: '79d38670db004996',
    username: 'Bob',
    title: 'Awesome Clip',
    like: 615,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/e1cd785e-56ae-4c96-a713-126bf2950e19.mp4',
    sort: 21
  },
  {
    rowId: 'f36bd116a7e03b89',
    username: 'Eve',
    title: 'Fantastic Stream',
    like: 110,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/53543262-55f5-4685-a5e3-b56ce75bcb88.mp4',
    sort: 22
  },
  {
    rowId: 'cebf3534ae50b88a',
    username: 'Ivy',
    title: 'Awesome Clip',
    like: 934,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/53543262-55f5-4685-a5e3-b56ce75bcb88.mp4',
    sort: 23
  },
  {
    rowId: '2db80c2b0381c45e',
    username: 'Bob',
    title: 'Awesome Clip',
    like: 407,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/f905c750-c70e-46b2-aaa6-37778d308f13.mp4',
    sort: 24
  },
  {
    rowId: 'cbeb295cf5e12541',
    username: 'Alice',
    title: 'Awesome Clip',
    like: 946,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/c061b07a-4b34-4d6d-aa1a-2cf41679f17c.mp4',
    sort: 25
  },
  {
    rowId: '26adab1646bcee94',
    username: 'Bob',
    title: 'Great Performance',
    like: 868,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/97b50a6d-f77d-4418-b38d-844e0b9eec97.mp4',
    sort: 26
  },
  {
    rowId: '1efb568019704caf',
    username: 'Heidi',
    title: 'Amazing Video',
    like: 811,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/ec383f81-6896-4274-8861-e329ae1376b4.mp4',
    sort: 27
  },
  {
    rowId: '23b9136997a8517f',
    username: 'Charlie',
    title: 'Cool Show',
    like: 852,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/53543262-55f5-4685-a5e3-b56ce75bcb88.mp4',
    sort: 28
  },
  {
    rowId: '4ac0e7e2fbd27589',
    username: 'Frank',
    title: 'Awesome Clip',
    like: 88,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/bfc86ab8-bb3b-4cef-a5d2-8c5edce4ef17.mp4',
    sort: 29
  },
  {
    rowId: '72b67d9b3e3be3f8',
    username: 'Alice',
    title: 'Fantastic Stream',
    like: 83,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/bfc86ab8-bb3b-4cef-a5d2-8c5edce4ef17.mp4',
    sort: 30
  },
  {
    rowId: '001def8ec0c1e04e',
    username: 'Grace',
    title: 'Great Performance',
    like: 925,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/97b50a6d-f77d-4418-b38d-844e0b9eec97.mp4',
    sort: 31
  },
  {
    rowId: '0a0615aeae996fab',
    username: 'Bob',
    title: 'Cool Show',
    like: 564,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/209180d8-3dfd-42ea-9ef5-5f98ae0d95e1.mp4',
    sort: 32
  },
  {
    rowId: '16337b9359860ccc',
    username: 'Ivy',
    title: 'Great Performance',
    like: 844,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-2908110e-6da2-4899-8b44-d45c153457ad/710b0cf7-bed9-4805-a2fb-0b703483dbec.MOV',
    sort: 33
  },
  {
    rowId: 'c0ff1a2f7e889897',
    username: 'Heidi',
    title: 'Cool Show',
    like: 166,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/e1cd785e-56ae-4c96-a713-126bf2950e19.mp4',
    sort: 34
  },
  {
    rowId: 'ecd21ec27883d07b',
    username: 'Frank',
    title: 'Great Performance',
    like: 300,
    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0455454d-b373-4768-aa39-dc1226fc1362/209180d8-3dfd-42ea-9ef5-5f98ae0d95e1.mp4',
    sort: 35
  },
];

const windowWidth = ref(0);
const windowHeight = ref(0);

const videoList = ref([]); // 全部视频
const afterHasMore = ref(true);
const beforeHasMore = ref(true);


const current_index = ref(0); // 这个参数可以控制从第几个视频开始播放（可以从onLoad动态修改这个参数）
const currentId = '182b2568d7a2c52a'; // 模拟的当前视频的 ID 926b1872a7881a11
const pageSize = 10;

onMounted(async () => {
	windowWidth.value = uni.getSystemInfoSync().windowWidth;
	windowHeight.value = uni.getSystemInfoSync().windowHeight;
	
	const [beforeVideosErr, beforeVideosRet] = await fetchVideos(currentId, 0); // 获取 currentId 之前的数据
	const [afterVideosErr, afterVideosRet] = await fetchVideos(currentId, 1, 1); // 获取 currentId 之后的数据（ 包含 currentId)

	if (beforeVideosRet && afterVideosRet) {
		const { list: beforeVideosList, hasMore: bHasMore } = beforeVideosRet;
		const { list: afterVideosList, hasMore: aHasMore } = afterVideosRet;
		// 将数据合并到 videoList 中
		videoList.value = [...beforeVideosList, ...afterVideosList];
		beforeHasMore.value = bHasMore;
		afterHasMore.value = aHasMore;
		current_index.value = videoList.value.findIndex(v => v.rowId === currentId);
	}
	
	// windowWidth.value = uni.getSystemInfoSync().windowWidth;
	// windowHeight.value = uni.getSystemInfoSync().windowHeight;
	
	// videoList.value = mockList;
	// beforeHasMore.value = false;
	// afterHasMore.value = false;
	// current_index.value = videoList.value.findIndex(v => v.rowId === currentId);

});

/**
 * @description 加载后边的数据
 * @param nowSwiperRowId 需要预加载新数据的此刻，当前页面应该展示的视频的 rowId
 * @param callback 回调函数, 用来根据最新 videoList 编写展示逻辑
 */
const updateNextVideo = async (nowSwiperRowId, callback) => {
    let oldList = videoList.value;
	let oldLastVideoItem = oldList[oldList.length - 1];
	if (!afterHasMore.value) {
		if (nowSwiperRowId === oldLastVideoItem.rowId) {
			uni.showToast({
				title: '没有最新视频了~'
			});
		}
		return;
	}
	const [afterVideosErr, afterVideosRet] = await fetchVideos(oldLastVideoItem.rowId, 1); // 获取 currentId 之后的数据
	const { list: afterVideosList, hasMore } = afterVideosRet;
	videoList.value = [...videoList.value, ...afterVideosList];
	afterHasMore.value = hasMore;
	console.log(`加载${currentId}之后的最新 videoList 数据:`, videoList.value);
	callback(videoList.value, videoList.value.findIndex(v => v.rowId === nowSwiperRowId));
};

/**
 * @description 加载前边的数据
 * @param nowSwiperRowId 需要预加载新数据的此刻，当前页面应该展示的视频的 rowId
 * @param callback 回调函数, 用来根据最新 videoList 编写展示逻辑
 */
const updatePreVideo = async (nowSwiperRowId, callback) => {
	let oldList = videoList.value;
	let oldFirstVideoItem = oldList[0];
	if (!beforeHasMore.value) {
		if (nowSwiperRowId === oldFirstVideoItem.rowId) {
			uni.showToast({
				title: '没有历史视频了~'
			});
		}
		return;
	}
	const [beforeVideosErr, beforeVideosRet] = await fetchVideos(oldFirstVideoItem.rowId, 0); // 获取 currentId 之前的数据
	const { list: beforeVideosList, hasMore } = beforeVideosRet;
	videoList.value = [...beforeVideosList, ...videoList.value];
	beforeHasMore.value = hasMore;
	console.log(`加载${currentId}之前的最新 videoList 数据:`, videoList.value);
	callback(videoList.value, videoList.value.findIndex(v => v.rowId === nowSwiperRowId));
}

const handleCurrentVideoIndex = payload => {
	console.log(payload);
}

/**
 * 获取目标视频列表前后的列表数据
 * @param {number} currentId 锚点视频 id
 * @param {number} direction  获取方向: 0 向上翻页获取数据 1 向下翻页获取数据
 * @param {string} containCurrentRowId 获取锚点视频之后的数据时，后端返回的 list 是否包含锚点数据
 */
function fetchVideos(currentId, direction, containCurrentRowId = 0) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'http://10.27.10.42:9000/api/v1/teaching/test/cate',
			method: 'POST',
			data: {
				currentRowId: currentId,
				pageSize,
				direction,
				containCurrentRowId,
			},
			success: (res) => {
				if (res.data?.success) {
					resolve([null, res.data?.data]);
				} else {
					resolve([res, null]);
				}
			}
		});
	});
}
</script>

<style scoped>
.qb {
	width: 100vw;
	height: 100vh;
	background: pink;
}

.video-swiper {
    width: 100%;
    height: 100%;
}
</style>