# Data
静态数据库，自动同步至OSS，但仍需手动处理CDN

## 项目引入方式
jx3box-common库v1.0.66+

```javascript 
const {dataPath} = require('@jx3box/jx3box-common/js/utils')
const yoururl = dataPath('fb/fb_list.json')

```