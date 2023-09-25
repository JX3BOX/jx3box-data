const Axios = require('axios').default;

const TYPE_LIST = ['perfect', 'normal', 'pet'];
const CLIENT_LIST = ['std', 'origin'];

const main = async () => {
  for (let i = 0; i < TYPE_LIST.length; i++) {
    const type = TYPE_LIST[i];
    for (let j = 0; j < CLIENT_LIST.length; j++) {
      const client = CLIENT_LIST[j];
      let list = [];
      let page = 1;
      while (true) {
        const res = await Axios({
          url: `https://node.jx3box.com/serendipities?type=${type}&page=${page}&client=${client}&per=50`,
        });
        list = [...list, ...res.data.list];
        if (res.data.page >= res.data.pages) {
          page = 1;
          break;
        } else {
          page += 1;
        }
      }
      console.log(`${type} ${client}: ${list.reverse().map(d => d.szName).join(', ')}`);
    }
  }
};

main();
