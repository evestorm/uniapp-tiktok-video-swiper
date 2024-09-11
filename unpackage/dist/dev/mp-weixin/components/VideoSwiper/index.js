"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    duration: {
      type: Number,
      default: 500
    },
    easingFunction: {
      type: String,
      default: "default"
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
      default: 4
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: [
    "change",
    "updateNextVideo",
    "play",
    "pause",
    "ended",
    "error",
    "timeupdate",
    "wait",
    "progress",
    "loadedmetadata",
    "updatePreVideo"
  ],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const nextQueue = common_vendor.ref([]);
    const prevQueue = common_vendor.ref([]);
    const curQueue = common_vendor.ref([]);
    const circular = common_vendor.ref(false);
    const _last = common_vendor.ref(1);
    const _change = common_vendor.ref(-1);
    const _invalidUp = common_vendor.ref(0);
    const _invalidDown = common_vendor.ref(0);
    const _videoContexts = common_vendor.ref([]);
    const total = common_vendor.ref(0);
    common_vendor.ref([false, false, false, false]);
    const swiperCurrent = common_vendor.ref(0);
    const _pop = common_vendor.ref(null);
    const isFirstLoad = common_vendor.ref(true);
    common_vendor.watch(() => props.videoList, (newVal = [], oldVal = []) => {
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
    common_vendor.onMounted(() => {
      _videoContexts.value = [
        common_vendor.index.createVideoContext("video_0"),
        common_vendor.index.createVideoContext("video_1"),
        common_vendor.index.createVideoContext("video_2"),
        common_vendor.index.createVideoContext("video_3")
      ];
    });
    const videoListChanged = (newVal, newIndex = void 0) => {
      newVal.map((item, index2) => {
        item.idxKey = index2 + 1;
        return item;
      });
      let index = newIndex ?? props.index;
      let totalPure = newVal.length;
      if (index + 1 > totalPure)
        index = 0;
      let remainder = index % 3;
      console.log({
        "preList": prevQueue.value,
        "curList": curQueue.value,
        "nextList": nextQueue.value,
        "videoList": props.videoList,
        "传入索引 index": newIndex ?? props.index,
        "传入索引index % 3的余数": remainder,
        "当前 videoList 总数 % 3 的余数": props.videoList.length % 3
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
        _change.value = (index % 3 + 1) % 3;
        _last.value = remainder;
        _invalidDown.value = index === 0 ? 1 : 0;
        _invalidUp.value = totalPure - curIndex < 2 ? 1 : 0;
        prevQueue.value = newVal.slice(0, curIndex);
        nextQueue.value = newVal.slice(curIndex + 3);
        let circularPure = true;
        if (nextQueue.value.length === 0 && _change.value !== 0)
          circularPure = false;
        if (prevQueue.value.length === 0 && _change.value !== 2)
          circularPure = false;
        let indexAdd = index + 1;
        let indexAdd2 = index + 2;
        let indexSub = index - 1;
        if (totalPure > 4 && totalPure % 3 == 1 && totalPure - 1 - index <= 2) {
          curQueuePure = [
            ...newVal.slice(totalPure - 1, totalPure),
            ...newVal.slice(totalPure - 3, totalPure - 2),
            ...newVal.slice(totalPure - 2, totalPure - 1),
            ...newVal.slice(totalPure - 1, totalPure)
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
              ...newVal.slice(indexAdd, indexAdd2)
            ];
          }
        } else if (totalPure > 4 && totalPure % 3 == 2 && totalPure - index - 1 <= 1) {
          _popPure = newVal.slice(totalPure - 3, totalPure - 2);
          _popPure = _popPure[0];
          if (totalPure - index - 1 == 0 || totalPure == index + 2) {
            if (totalPure == index + 2) {
              _change.value = 1;
              _invalidDown.value = 0;
              _invalidUp.value = 0;
              _last.value = 0;
              circularPure = false;
              curQueuePure = [
                ...newVal.slice(totalPure - 2, totalPure - 1),
                ...newVal.slice(totalPure - 1, totalPure)
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
                ...newVal.slice(totalPure - 1, totalPure)
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
              ...newVal.slice(totalPure - 3, totalPure - 2)
            ];
          }
        } else {
          if (totalPure <= 4) {
            _change.value = -1;
            _last.value = 1;
            _invalidDown.value = 0;
            _invalidUp.value = 0;
            curQueuePure = newVal;
            circularPure = false;
          } else {
            if (remainder == 0 && totalPure > 4) {
              let lastArr = newVal.slice(
                indexSub,
                index
              );
              if (index == 0) {
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
              ];
            } else if (remainder == 2 && totalPure > 4) {
              let homeArr = newVal.slice(indexAdd, indexAdd2);
              if (totalPure === index + 1) {
                circularPure = false;
                homeArr = newVal.slice(index - 2, indexSub);
              }
              curQueuePure = [
                ...homeArr,
                ...newVal.slice(indexSub, index),
                ...newVal.slice(index, indexAdd)
              ];
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
      swiperCurrent.value = current;
      playCurrent(current);
      const direction = diff === 1 || diff === -2 || diff === 0 && [1, 2, 3].includes(_last.value) ? "up" : "down";
      console.log({
        diff,
        _last: _last.value,
        direction
      });
      if (total.value >= props.pageSize && nextQueue.value.length < 5 && direction === "up") {
        emit("updateNextVideo", curQueue.value[swiperCurrent.value].rowId, (newList, currentIndex) => {
          videoListChanged(newList, currentIndex);
        });
      }
      if (total.value >= props.pageSize && prevQueue.value.length < 5 && direction === "down") {
        emit("updatePreVideo", curQueue.value[swiperCurrent.value].rowId, (newList, currentIndex) => {
          videoListChanged(newList, currentIndex);
        });
      }
      if (diff === 0 || total.value <= 4)
        return;
      _last.value = current;
      emit("change", {
        activeId: curQueue.value[current].rowId,
        direction
      });
      if (direction === "up") {
        handleUpScroll();
      } else if (direction === "down") {
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
      console.log("handleUpScroll");
      if (_invalidDown.value === 0) {
        const change = (_change.value + 1) % 3;
        const add = nextQueue.value.shift();
        const remove = curQueue.value[change];
        if (add) {
          prevQueue.value.push(remove);
          curQueue.value[change] = add;
          _change.value = change;
          if (total.value % 3 === 1 && nextQueue.value.length === 0) {
            let timers = /* @__PURE__ */ new Date();
            let addItem = JSON.parse(JSON.stringify(add));
            addItem.idxKey = timers.getTime();
            curQueue.value[3] = addItem;
          } else if (total.value % 3 === 2 && nextQueue.value.length === 0) {
            let _popItem = curQueue.value.pop();
            _pop.value = _popItem;
          }
        } else {
          _invalidUp.value += 1;
        }
      } else {
        _invalidDown.value -= 1;
      }
    };
    const handleDownScroll = () => {
      console.log("handleDownScroll");
      if (_invalidUp.value === 0) {
        const change = _change.value;
        const remove = curQueue.value[change];
        const add = prevQueue.value.pop();
        if (add) {
          curQueue.value[change] = add;
          nextQueue.value.unshift(remove);
          _change.value = (change - 1 + 3) % 3;
        } else {
          _invalidDown.value += 1;
        }
      } else {
        if (total.value % 3 === 1 && curQueue.value.length === 4) {
          curQueue.value.pop();
        } else if (total.value % 3 === 2 && nextQueue.value.length === 0) {
          curQueue.value.push(_pop.value);
        }
        _invalidUp.value -= 1;
      }
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return {
        a: common_vendor.f(curQueue.value, (item, index, i0) => {
          return {
            a: `video_${item.rowId}`,
            b: item.url,
            c: item.rowId,
            d: item.objectFit || "cover",
            e: index,
            f: common_vendor.t(item.title),
            g: common_vendor.t(item.sort),
            h: common_vendor.t(item.idxKey),
            i: common_vendor.t(item.rowId),
            j: item.rowId
          };
        }),
        b: __props.loop,
        c: common_vendor.t(swiperCurrent.value),
        d: common_vendor.t(__props.videoList.length % 3),
        e: common_vendor.t(__props.videoList.map((v, idx) => v.idxKey).join(",")),
        f: common_vendor.t(__props.videoList.length),
        g: common_vendor.t((_a = prevQueue.value) == null ? void 0 : _a.map((v, idx) => v.idxKey).join(",")),
        h: common_vendor.t(prevQueue.value.length),
        i: common_vendor.t((_b = curQueue.value) == null ? void 0 : _b.map((v, idx) => v.idxKey).join(",")),
        j: common_vendor.t(curQueue.value.length),
        k: common_vendor.t((_c = nextQueue.value) == null ? void 0 : _c.map((v, idx) => v.idxKey).join(",")),
        l: common_vendor.t(nextQueue.value.length),
        m: common_vendor.t(_last.value),
        n: common_vendor.t(_change.value),
        o: common_vendor.t(_invalidUp.value),
        p: common_vendor.t(_invalidDown.value),
        q: common_vendor.t(_pop.value),
        r: circular.value,
        s: __props.easingFunction,
        t: swiperCurrent.value,
        v: __props.duration,
        w: common_vendor.o(animationfinish)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c35a514c"]]);
wx.createComponent(Component);
