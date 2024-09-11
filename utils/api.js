const getVideoList = (data) => {
	return new Promise((resolve) => {
		uni.request({
			url: 'http://0.0.0.0:9000/api/v1/teaching/test/cate',
			method: 'post',
			data,
			success: (res) => {
				resolve(res.data.data);
			}
		});
	});
}

export {
	getVideoList,
}