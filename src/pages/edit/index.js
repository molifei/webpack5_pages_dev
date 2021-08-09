import './index.less';
import $ from 'jquery';

console.log('edit');

import E from 'wangeditor';

const editor = new E('#editor-wrap');
// 配置 server 接口地址
editor.config.uploadImgServer = '/xx'
editor.create();

$('#btn').on('click', function() {
  console.log(editor.txt.html());
});
