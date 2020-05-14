# Data


## 在线加载
```javascript 
const {__dataPath} = require('@jx3box/jx3box-common/js/jx3box')
const yoururl = __dataPath + '$filepath'
const fbmap = __dataPath + 'data/fb/fb_map.json'
//output https://data.jx3box.com/data/fb/fb_map.json
```

## 本地加载
```javascript
npm install @jx3box/jx3box-data
const data = require('@jx3box/jx3box-data')
```
