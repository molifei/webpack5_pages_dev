__webpack_public_path__ = '/';

import './index.less';
import './other.less';
import '../../common/css/base.less';
import $ from 'jquery';
import dayjs from 'dayjs';

console.log('index');

const test = () => {
  console.log(12345);
};

test();

$('#text').html(dayjs().format('YYYY-MM-DD hh:mm:ss'));

console.log(dayjs());
