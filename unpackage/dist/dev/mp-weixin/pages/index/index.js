"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  VideoSwiper();
}
const VideoSwiper = () => "../../components/VideoSwiper/index.js";
const currentId = "caab09c36d34bf37";
const pageSize = 10;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const windowWidth = common_vendor.ref(0);
    const windowHeight = common_vendor.ref(0);
    const videoList = common_vendor.ref([]);
    const afterHasMore = common_vendor.ref(true);
    const beforeHasMore = common_vendor.ref(true);
    const current_index = common_vendor.ref(0);
    common_vendor.onMounted(async () => {
      windowWidth.value = common_vendor.index.getSystemInfoSync().windowWidth;
      windowHeight.value = common_vendor.index.getSystemInfoSync().windowHeight;
      const [beforeVideosErr, beforeVideosRet] = await fetchVideos(currentId, 0);
      const [afterVideosErr, afterVideosRet] = await fetchVideos(currentId, 1, 1);
      if (beforeVideosRet && afterVideosRet) {
        const { list: beforeVideosList, hasMore: bHasMore } = beforeVideosRet;
        const { list: afterVideosList, hasMore: aHasMore } = afterVideosRet;
        videoList.value = [...beforeVideosList, ...afterVideosList];
        beforeHasMore.value = bHasMore;
        afterHasMore.value = aHasMore;
        current_index.value = videoList.value.findIndex((v) => v.rowId === currentId);
      }
    });
    const updateNextVideo = async (nowSwiperRowId, callback) => {
      let oldList = videoList.value;
      let oldLastVideoItem = oldList[oldList.length - 1];
      if (!afterHasMore.value) {
        if (nowSwiperRowId === oldLastVideoItem.rowId) {
          common_vendor.index.showToast({
            title: "没有最新视频了~"
          });
        }
        return;
      }
      const [afterVideosErr, afterVideosRet] = await fetchVideos(oldLastVideoItem.rowId, 1);
      const { list: afterVideosList, hasMore } = afterVideosRet;
      videoList.value = [...videoList.value, ...afterVideosList];
      afterHasMore.value = hasMore;
      console.log(`加载${currentId}之后的最新 videoList 数据:`, videoList.value);
      callback(videoList.value, videoList.value.findIndex((v) => v.rowId === nowSwiperRowId));
    };
    const updatePreVideo = async (nowSwiperRowId, callback) => {
      let oldList = videoList.value;
      let oldFirstVideoItem = oldList[0];
      if (!beforeHasMore.value) {
        if (nowSwiperRowId === oldFirstVideoItem.rowId) {
          common_vendor.index.showToast({
            title: "没有历史视频了~"
          });
        }
        return;
      }
      const [beforeVideosErr, beforeVideosRet] = await fetchVideos(oldFirstVideoItem.rowId, 0);
      const { list: beforeVideosList, hasMore } = beforeVideosRet;
      videoList.value = [...beforeVideosList, ...videoList.value];
      beforeHasMore.value = hasMore;
      console.log(`加载${currentId}之前的最新 videoList 数据:`, videoList.value);
      callback(videoList.value, videoList.value.findIndex((v) => v.rowId === nowSwiperRowId));
    };
    const handleCurrentVideoIndex = (payload) => {
      console.log(payload);
    };
    function fetchVideos(currentId2, direction, containCurrentRowId = 0) {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "http://10.27.10.42:9000/api/v1/teaching/test/cate",
          method: "POST",
          data: {
            currentRowId: currentId2,
            pageSize,
            direction,
            containCurrentRowId
          },
          success: (res) => {
            var _a, _b;
            if ((_a = res.data) == null ? void 0 : _a.success) {
              resolve([null, (_b = res.data) == null ? void 0 : _b.data]);
            } else {
              resolve([res, null]);
            }
          }
        });
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(updateNextVideo),
        b: common_vendor.o(updatePreVideo),
        c: common_vendor.o(handleCurrentVideoIndex),
        d: common_vendor.p({
          index: current_index.value,
          ["video-list"]: videoList.value,
          pageSize
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
