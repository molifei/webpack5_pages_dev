__webpack_public_path__ = '/';

import './index.less';
import './other.less';
import '../../common/css/base.less';

import $ from 'jquery';

document.title = 'INDEX';

layui.use(['layer', 'form'], function() {
  var layer = layui.layer,
    form = layui.form;

  // layer.msg('Hello World');
});

layui.use('carousel', function() {
  var carousel = layui.carousel;
  // 建造实例
  carousel.render({
    elem: '#test1',
    width: '100%',
    height: '500px',
    arrow: 'always', // 始终显示箭头
  });
});

layui.use('element', function() {
  var element = layui.element;

  //…
});

