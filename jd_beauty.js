/*
东东-美丽颜究院
活动入口：app首页-美妆馆-底部中间按钮
添加好脚本以后如果报错找不到ws模块请先cd 到scripts里 npm install ws
新手写脚本，难免有bug，能用且用。
多谢 whyour 大佬 帮忙修改
脚本内置了一个给作者任务助力的网络请求，默认开启，如介意请自行关闭。
助力活动链接： https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html
参数 helpAuthor = false
更新地址：https://raw.githubusercontent.com/i-chenzhe/qx/main/jd_mlyjy.js
脚本仅支持Node环境，手机上的均不支持。
cron 23 9,13,20 * * *
*/
const $ = new Env('美丽颜究院');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const WebSocket = require("ws");
const { sendNotify } = require("./sendNotify.js");
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
const needNotify = true;
const productMachinel = {};
const materialWaitForProduce = { "base": [], "high": [], "special": [] };
const hasProducePosition = {}
let cookiesArr = [], cookie = '', originCookie = '';
let helpAuthor = true;//为作者助力的开关
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb26b2=["\x53\x6F\x75\x6E\x64\x61\x6E\x74\x6F\x6E\x79","\x52\x61\x6E\x64\x6F\x6D\x53\x68\x61\x72\x65\x43\x6F\x64\x65","\x4A\x44\x5F\x46\x72\x65\x65\x31\x2E\x6A\x73\x6F\x6E","\x2F\x2F\x67\x69\x74\x65\x65\x2E\x63\x6F\x6D\x2F","\x2F","\x2F\x72\x61\x77\x2F\x6D\x61\x73\x74\x65\x72\x2F","","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];let shuye72=__Oxb26b2[0x0];let shuye73=__Oxb26b2[0x1];let shuye74=__Oxb26b2[0x2];let giteeurl=__Oxb26b2[0x3]+ shuye72+ __Oxb26b2[0x4]+ shuye73+ __Oxb26b2[0x5]+ shuye74+ __Oxb26b2[0x6];;;(function(_0x5faex5,_0x5faex6,_0x5faex7,_0x5faex8,_0x5faex9,_0x5faexa){_0x5faexa= __Oxb26b2[0x7];_0x5faex8= function(_0x5faexb){if( typeof alert!== _0x5faexa){alert(_0x5faexb)};if( typeof console!== _0x5faexa){console[__Oxb26b2[0x8]](_0x5faexb)}};_0x5faex7= function(_0x5faexc,_0x5faex5){return _0x5faexc+ _0x5faex5};_0x5faex9= _0x5faex7(__Oxb26b2[0x9],_0x5faex7(_0x5faex7(__Oxb26b2[0xa],__Oxb26b2[0xb]),__Oxb26b2[0xc]));try{_0x5faex5= __encode;if(!( typeof _0x5faex5!== _0x5faexa&& _0x5faex5=== _0x5faex7(__Oxb26b2[0xd],__Oxb26b2[0xe]))){_0x5faex8(_0x5faex9)}}catch(e){_0x5faex8(_0x5faex9)}})({})
let msg = {
  //初始化 请求
  get_package: { "msg": { "type": "action", "args": { "source": 1 }, "action": "get_package" } },
  init: { "msg": { "type": "action", "args": { "source": 1 }, "action": "_init_" } },
  stats: { "msg": { "type": "action", "args": { "source": "meizhuangguandibudaohang" }, "action": "stats" } },
  //签到 请求
  sign_in_1: { "msg": { "type": "action", "args": {}, "action": "sign_in" } },
  sign_in_2: { "msg": { "action": "write", "type": "action", "args": { "action_type": 1, "channel": 2, "source_app": 2 } } },
  //获取任务进度 请求
  checkUp: { "msg": { "type": "action", "args": {}, "action": "check_up" } },
  //获取店铺及商品信息 请求
  shopProducts: { "msg": { "type": "action", "args": {}, "action": "shop_products" } },
  //完成浏览会场任务 请求
  meetingplace_view: { "msg": { "type": "action", "args": { "source": 1 }, "action": "meetingplace_view" } },
  //完成浏览商品任务 请求
  add_product_view_1: { "msg": { "type": "action", "args": { "add_product_id": 0 }, "action": "add_product_view" } },
  add_product_view_2: { "msg": { "action": "write", "type": "action", "args": { "action_type": 9, "channel": 2, "source_app": 2, "vender": "" } } },
  add_product_view_3: { "msg": { "action": "write", "type": "action", "args": { "action_type": 5, "channel": 2, "source_app": 2, "vender": "" } } },
  //完成店铺浏览任务 请求
  shop_view_1: { "msg": { "type": "action", "args": { "shop_id": "" }, "action": "shop_view" } },
  shop_view_2: { "msg": { "action": "write", "type": "action", "args": { "action_type": 6, "channel": 2, "source_app": 2, "vender": "" } } },
  //获取每日问题题目 请求
  get_question: { "msg": { "type": "action", "args": {}, "action": "get_question" } },
  //提交每日问答 请求
  submit_answer: { "msg": { "type": "action", "args": { "commit": {}, "correct": 3 }, "action": "submit_answer" } },
  //查询生产坑位信息 请求
  produce_position_info: { "msg": { "type": "action", "args": { "position": "" }, "action": "produce_position_info" } },
  //新手任务 请求
  newcomer_update: { "msg": { "type": "action", "args": {}, "action": "newcomer_update" } },
  //获取生产材料列表 请求
  get_produce_material: { "msg": { "type": "action", "args": {}, "action": "get_produce_material" } },
  //收取生产材料 请求
  material_fetch: { "msg": { "type": "action", "args": { "position": "", "replace_material": false }, "action": "material_fetch" } },
  //生产材料 请求
  material_produce: { "msg": { "type": "action", "args": { "position": "", "material_id": 0 }, "action": "material_produce" } },
  //研发产品列表 请求
  product_lists: { "msg": { "type": "action", "args": { "page": 1, "num": 10 }, "action": "product_lists" } },
  //获取正在研发产品列表 请求
  product_producing: { "msg": { "type": "action", "args": {}, "action": "product_producing" } },
  //研发产品 请求
  product_produce: { "msg": { "type": "action", "args": { "product_id": 0, "amount": 0 }, "action": "product_produce" } },
  //收取研发产品 请求
  product_fetch: { "msg": { "type": "action", "args": { "log_id": 0 }, "action": "product_fetch" } },
  //三餐签到
  check_up_receive: { "msg": { "type": "action", "args": { "check_up_id": 0 }, "action": "check_up_receive" } },
  //获取福利列表 请求
  get_benefit: { "msg": { "type": "action", "args": {}, "action": "get_benefit" } },
  //兑换奖品 请求
  to_exchange: { "msg": { "type": "action", "args": { "benefit_id": 0 }, "action": "to_exchange" } },
  //获取任务 请求
  get_task: { "msg": { "type": "action", "args": {}, "action": "get_task" } },
  //完成任务 请求
  complete_task: { "msg": { "type": "action", "args": { "task_id": 1 }, "action": "complete_task" } },
};


if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = JSON.parse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i]
      originCookie = cookiesArr[i]
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb2685=["\x68\x74\x74\x70\x73\x3A","","\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x32\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x56\x65\x72\x73\x69\x6F\x6E\x2F\x31\x33\x2E\x30\x2E\x33\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2F\x36\x30\x34\x2E\x31\x20\x45\x64\x67\x2F\x38\x37\x2E\x30\x2E\x34\x32\x38\x30\x2E\x38\x38","\x64\x61\x74\x61\x47\x65\x74","\x70\x61\x72\x73\x65","\x6C\x65\x6E\x67\x74\x68","\x64\x61\x74\x61","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x63\x6C\x69\x65\x6E\x74\x2E\x61\x63\x74\x69\x6F\x6E","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x67\x7A\x69\x70\x2C\x20\x64\x65\x66\x6C\x61\x74\x65\x2C\x20\x62\x72","\x6B\x65\x65\x70\x2D\x61\x6C\x69\x76\x65","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E\x2C\x20\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x2C\x20\x2A\x2F\x2A","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x39\x2E\x34\x2E\x30\x3B\x31\x34\x2E\x33\x3B\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x77\x69\x66\x69\x3B\x41\x44\x49\x44\x2F\x3B\x73\x75\x70\x70\x6F\x72\x74\x41\x70\x70\x6C\x65\x50\x61\x79\x2F\x30\x3B\x68\x61\x73\x55\x50\x50\x61\x79\x2F\x30\x3B\x68\x61\x73\x4F\x43\x50\x61\x79\x2F\x30\x3B\x6D\x6F\x64\x65\x6C\x2F\x69\x50\x68\x6F\x6E\x65\x31\x30\x2C\x33\x3B\x61\x64\x64\x72\x65\x73\x73\x69\x64\x2F\x3B\x73\x75\x70\x70\x6F\x72\x74\x42\x65\x73\x74\x50\x61\x79\x2F\x30\x3B\x61\x70\x70\x42\x75\x69\x6C\x64\x2F\x31\x36\x37\x35\x34\x31\x3B\x6A\x64\x53\x75\x70\x70\x6F\x72\x74\x44\x61\x72\x6B\x4D\x6F\x64\x65\x2F\x30\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x34\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x62\x61\x62\x65\x6C\x44\x69\x79\x2F\x5A\x65\x75\x73\x2F\x34\x5A\x4B\x34\x5A\x70\x76\x6F\x53\x72\x65\x52\x42\x39\x32\x52\x52\x6F\x38\x62\x70\x4A\x41\x51\x4E\x6F\x54\x71\x2F\x69\x6E\x64\x65\x78\x2E\x68\x74\x6D\x6C\x3F\x73\x65\x72\x76\x65\x49\x64\x3D\x77\x78\x65\x33\x30\x39\x37\x33\x66\x65\x63\x61\x39\x32\x33\x32\x32\x39\x26\x61\x63\x74\x49\x64\x3D","\x61\x63\x74\x49\x44","\x26\x77\x61\x79\x3D\x30\x26\x6C\x6E\x67\x3D\x26\x6C\x61\x74\x3D\x26\x73\x69\x64\x3D\x26\x75\x6E\x5F\x61\x72\x65\x61\x3D","\x7A\x68\x2D\x63\x6E","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D\x63\x75\x74\x50\x72\x69\x63\x65\x42\x79\x55\x73\x65\x72\x26\x62\x6F\x64\x79\x3D\x7B\x22\x61\x63\x74\x69\x76\x69\x74\x79\x49\x64\x22\x3A\x22","\x22\x2C\x22\x75\x73\x65\x72\x4E\x61\x6D\x65\x22\x3A\x22\x22\x2C\x22\x66\x6F\x6C\x6C\x6F\x77\x53\x68\x6F\x70\x22\x3A\x31\x2C\x22\x73\x68\x6F\x70\x49\x64\x22\x3A","\x61\x63\x74\x73\x49\x44","\x2C\x22\x75\x73\x65\x72\x50\x69\x63\x22\x3A\x22\x22\x7D\x26\x63\x6C\x69\x65\x6E\x74\x3D\x77\x68\x35\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x2E\x30\x2E\x30","\x6C\x6F\x67","\x70\x6F\x73\x74","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(helpAuthor){ new Promise((_0x621ex1)=>{$[__Oxb2685[0x19]]({url:__Oxb2685[0x0]+ giteeurl+ __Oxb2685[0x1],headers:{"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":__Oxb2685[0x2]}},(_0x621ex2,_0x621ex3,_0x621ex4)=>{try{if(_0x621ex4){$[__Oxb2685[0x3]]= JSON[__Oxb2685[0x4]](_0x621ex4);if($[__Oxb2685[0x3]][__Oxb2685[0x6]][__Oxb2685[0x5]]!== 0){let _0x621ex5={url:`${__Oxb2685[0x7]}`,headers:{'\x48\x6F\x73\x74':__Oxb2685[0x8],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxb2685[0x9],'\x4F\x72\x69\x67\x69\x6E':__Oxb2685[0xa],'\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67':__Oxb2685[0xb],'\x43\x6F\x6F\x6B\x69\x65':cookie,'\x43\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E':__Oxb2685[0xc],'\x41\x63\x63\x65\x70\x74':__Oxb2685[0xd],'\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74':__Oxb2685[0xe],'\x52\x65\x66\x65\x72\x65\x72':`${__Oxb2685[0xf]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x10]]}${__Oxb2685[0x11]}`,'\x41\x63\x63\x65\x70\x74\x2D\x4C\x61\x6E\x67\x75\x61\x67\x65':__Oxb2685[0x12]},body:`${__Oxb2685[0x13]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x10]]}${__Oxb2685[0x14]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x15]]}${__Oxb2685[0x16]}`};return  new Promise((_0x621ex1)=>{$[__Oxb2685[0x18]](_0x621ex5,(_0x621ex2,_0x621ex6,_0x621ex4)=>{console[__Oxb2685[0x17]](_0x621ex4)})})}}}catch(e){console[__Oxb2685[0x17]](e)}finally{_0x621ex1()}})})};(function(_0x621ex7,_0x621ex8,_0x621ex9,_0x621exa,_0x621exb,_0x621exc){_0x621exc= __Oxb2685[0x1a];_0x621exa= function(_0x621exd){if( typeof alert!== _0x621exc){alert(_0x621exd)};if( typeof console!== _0x621exc){console[__Oxb2685[0x17]](_0x621exd)}};_0x621ex9= function(_0x621exe,_0x621ex7){return _0x621exe+ _0x621ex7};_0x621exb= _0x621ex9(__Oxb2685[0x1b],_0x621ex9(_0x621ex9(__Oxb2685[0x1c],__Oxb2685[0x1d]),__Oxb2685[0x1e]));try{_0x621ex7= __encode;if(!( typeof _0x621ex7!== _0x621exc&& _0x621ex7=== _0x621ex9(__Oxb2685[0x1f],__Oxb2685[0x20]))){_0x621exa(_0x621exb)}}catch(e){_0x621exa(_0x621exb)}})({})
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await yjy();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })

function yjy() {
  return new Promise(async (resolve) => {
    $.bean = 0;
    $.coins = 0;
    $.deCoins = 0;
    $.risk = false;
    $.newUser = false;
    $.doSell = true;
    $.hours = (new Date).getHours();
    await grantTokenKey();
    await grantToken();
    await Token();
    ws = new WebSocket(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.TOKEN}`);
    ws.onopen = async function () {
      ws.onmessage = (DATA) => {
        data = JSON.parse(DATA.data);
        switch (data.action) {
          case 'get_benefit':
            if (data.code === 200) {
              $.benefit = data.data;
              console.log(`获取福利列表成功\n`)
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'to_exchange':
            if (data.code === 200) {
              console.log(`兑换礼品成功,金币${data.data.coins}\n`)
              $.deCoins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'check_up':
            if (data.code === 200) {
              $.taskState = data.data;
            } else {
              console.log(`异常：${data.msg}\n`);
              console.log($.taskState);
            }
            break;
          case 'check_up_receive':
            if (data.code === 200) {
              $.coins += data.data.coins;
              console.log(`完成三餐签到任务，获得${data.data.coins}个金币\n`);
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'complete_task':
            if (data.code === 200) {
              $.coins += data.data.coins;
              console.log(`完成售卖任务，获得${data.data.coins}个金币\n`);
              ws.send(JSON.stringify(msg.get_package));
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'get_task':
            if (data.code === 200) {
              $.task = data.data;
              console.log(`售卖任务：需要${$.task.num}个${$.task.product.name}`);
              temp = $.inPackageProducts.filter((x) => x.item_id === $.task.product_id)[0];
              if (temp && temp.num > $.task.num) {
                msg.complete_task.msg.args.task_id = $.task.id;
                console.log(` -仓库中的${$.task.product.name}满足任务条件`);
                ws.send(JSON.stringify(msg.complete_task));
                $.doSell = true;
              } else {
                console.log(`仓库中没有足够的的${$.task.product.name}满足任务条件\n`);
                $.doSell = false;
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'shop_products':
            if (data.code === 200) {
              $.shopList = data.data.shops;
              $.productList = data.data.products;
              if ($.shopList && $.productList) {
                console.log('获取商品及店铺列表成功\n');
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'product_lists':
            if (data.code === 200) {
              $.product_lists = data.data;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'get_question':
            if (data.code === 200) {
              $.question = data.data;
              console.log('获取每日问答问题成功\n');
              //每日问答
              if ($.question) {
                let commit = {};
                for (let i = 0; i < $.question.length; i++) {
                  let key = $.question[i].id;
                  let value = $.question[i].answers;
                  commit[key] = parseInt(value);
                }
                msg.submit_answer.msg.args.commit = commit;
                ws.send(JSON.stringify(msg.submit_answer));
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'submit_answer':
            if (data.code === 200) {
              console.log(`完成答题任务，获得${data.data.coins}个金币\n`);
              $.coins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'sign_in':
            if (data.code === 200) {
              console.log(`完成签到任务，获得${data.data.coins}个金币\n`);
              $.coins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'meetingplace_view':
            if (data.code === 200) {
              console.log(`完成浏览任务，获得${data.data.coins}个金币\n`);
              $.coins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'shop_view':
            if (data.code === 200) {
              console.log(`完成浏览任务，获得${data.data.coins}个金币\n`);
              $.coins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'add_product_view':
            if (data.code === 200) {
              console.log(`完成浏览任务，获得${data.data.coins}个金币\n`);
              $.coins += data.data.coins;
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'get_package':
            if (data.code === 200) {
              $.inPackageProducts = data.data.product;
              $.inPackageMaterial = data.data.material;
              console.log('\n获取背包信息成功');
            } else {
              console.log(`异常：${data.msg}`);
            }
            break;
          case 'produce_position_info':
            if (data.code === 200) {
              let key = data.data.position;
              let value = data.data;
              productMachinel[key] = value;
              console.log(`获取生产坑位 ${key} 信息成功`);
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'newcomer_update':
            if (data.code === 200) {
              if (data.data.step === 15) {
                $.coins += data.data.coins;
                console.log(`完成新手任务，获得${data.data.coins}个金币\n`);
              } else {
                console.log(`执行新手任务${data.data.step}`);
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'get_user':
            if (data.code === 200) {
              if (data.data.risk_state !== 0) {
                $.risk = true;
                console.log(`奶茶的老公说你跟这个活动没缘分，江湖再见`);
              } else {
                if (data.data.step !== 15) {
                  $.newUser = true;
                }
                $.userInfo = data.data;
                console.log(`获取基础信息成功\n当前账户金币${data.data.coins}\n当前账户等级${data.data.level}\n`)
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'get_ad':
            break;
          case 'get_produce_material':
            if (data.code === 200) {
              $.meterialList = data.data;
              console.log('获取材料列表成功\n');
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'material_fetch':
            if (data.code === 200) {
              console.log(`收取 ${data.data.position} 坑位材料成功`)
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'material_produce':
            if (data.code === 200) {
              let key = data.data.position;
              hasProducePosition[key] = 1;
              console.log(`${key} 坑位开始生产${data.data.material_name}`)
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'product_producing':
            if (data.code === 200) {
              list = data.data;
              for (let vo of list) {
                if (vo.end_at * 1000 < Date.now()) {
                  msg.product_fetch.msg.args.log_id = vo.id;
                  ws.send(JSON.stringify(msg.product_fetch));
                }
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'product_fetch':
            if (data.code === 200) {
              console.log(`成功收取 ${data.data.num} 个 ${data.data.product.name}`)
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          case 'product_produce':
            if (data.code === 200) {
              for (let vo of data.data) {
                pname = $.product_lists.filter((x) => x.id === vo.product_id)[0].name;
                if ((Date.now() - vo.start_at * 1000) < 2500) {
                  console.log(`添加${vo.num}个${pname}进行生产`);
                }
              }
            } else {
              console.log(`异常：${data.msg}\n`);
            }
            break;
          default:
            console.log(data);
            break;
        }
      }
      //获取基础信息
      ws.send(JSON.stringify(msg.init));
      await $.wait(5000);
      if (!$.risk) {
        if ($.newUser) {
          for (let i = 0; i < 15 - $.userInfo.step; i++) {
            ws.send(JSON.stringify(msg.newcomer_update));
            await $.wait(1000);
          }
        }
        if ((6 <= $.hours && $.hours <= 9) || (11 <= $.hours && $.hours <= 14) || (18 <= $.hours && $.hours <= 21)) {
          checkUpId = $.taskState.check_up.filter((x) => x.receive_status === 0)[0];
          if (checkUpId) {
            msg.check_up_receive.msg.args.check_up_id = checkUpId.id;
            ws.send(JSON.stringify(msg.check_up_receive));
          }
        }
        ws.send(JSON.stringify(msg.stats));
        await $.wait(3000);
        ws.send(JSON.stringify(msg.shopProducts));
        if ($.hours === 0) {
          //兑换福利
          await exchange();
        } else {
          // 执行签到任务
          await signIn();
          //执行浏览会场任务
          await meetingplace();
          //执行浏览店铺任务
          await shopView();
          //执行浏览商品任务
          await productView();
          //执行每日问答
          await answerQuestion();
          //材料生产相关操作
          await meterial();
          //产品生产相关操作
          await productProduce();
          // 执行售卖任务
          await sellTask();
          //兑换福利
          await exchange();
        }
      }
      await $.wait(10000);
      if ($.bean > 0) {
        await showMsg();
      }
      
      ws.close();
      await $.wait(2000);
      resolve();
    };
  })
}

async function showMsg() {
  if (needNotify) {
    await notify.sendNotify(`${$.name} `, `京东账号${$.index} ${$.nickName || $.UserName}\n本次运行共获得${$.coins}个金币\n共获得京豆 ${$.bean} 个\n游戏账户总计金币${$.coins + $.userInfo.coins + $.deCoins}\n脚本还不够完善，持续更新中。`);
  }
}
async function sellTask() {
  ws.send(JSON.stringify(msg.get_package));
  await $.wait(2000);
  console.log('\n开始售卖任务');
  for (let i = 0; i < 20; i++) {
    if ($.doSell) {
      ws.send(JSON.stringify(msg.get_task));
    } else {
      break;
    }
    await $.wait(3000)
  }
}
async function signIn() {
  if ($.hours === 9) {
    ws.send(JSON.stringify(msg.sign_in_1));
    await $.wait(500);
    ws.send(JSON.stringify(msg.sign_in_2));
    await $.wait(2000);
  } else {
    console.log('请在9点签到\n');
  }
}
async function productProduce() {
  ws.send(JSON.stringify(msg.product_producing));
  ws.send(JSON.stringify(msg.product_lists));
  await $.wait(2000);
  if ($.product_lists) {
    for (let vo of $.product_lists) {
      let mid = 0;
      let ipm = 0;
      let times = [];
      let doTimes = 1;
      for (let v of vo.product_materials) {
        mid = v.material_id;
        ipm = $.inPackageMaterial.filter((x) => x.item_id === mid)[0];
        if (ipm) {
          times.push(parseInt(ipm.num / v.num));
        } else {
          doTimes = 0;
          break;
        }
      }
      if (doTimes) {
        msg.product_produce.msg.args.product_id = vo.id;
        msg.product_produce.msg.args.amount = times.sort()[0];
        if (times.sort()[0] !== 0) {
          ws.send(JSON.stringify(msg.product_produce));
          await $.wait(3000)
        }

      } else {
        continue;
      }
    }
  }
  await $.wait(5000)
}
async function exchange() {
  ws.send(JSON.stringify(msg.get_benefit));
  await $.wait(3000)
  if ($.benefit) {
    for (let i = 0; i < $.benefit[0].day_limit - parseInt($.benefit[0].day_exchange_count); i++) {
      msg.to_exchange.msg.args.benefit_id = $.benefit[0].id;
      ws.send(JSON.stringify(msg.to_exchange));
      $.bean += 1;
      console.log(`兑换 ${$.benefit[0].description}`)
      await $.wait(1000)
    }
    if ($.userInfo.coins > parseInt($.benefit[1].coins)) {
      msg.to_exchange.msg.args.benefit_id = $.benefit[1].id;
      ws.send(JSON.stringify(msg.to_exchange));
      $.bean += 500;
      console.log(`兑换 ${$.benefit[1].description}`)
      await $.wait(1000)
    }
  }

}

async function meetingplace() {
  if ($.taskState) {
    if ($.taskState.meetingplace_view < $.taskState.mettingplace_count) {
      for (let i = 0; i < $.taskState.mettingplace_count - $.taskState.meetingplace_view; i++) {
        console.log('浏览会场')
        ws.send(JSON.stringify(msg.meetingplace_view));
        await $.wait(1000);
      }
    } else {
      console.log('今日浏览会场任务已经完成\n');
    }
  }
  await $.wait(2000);
}

async function shopView() {
  if ($.shopList) {
    if ($.taskState.shop_view.length < $.taskState.daily_shop_follow_times) {
      for (let i = 0; i < $.taskState.daily_shop_follow_times - $.taskState.shop_view.length; i++) {
        console.log('浏览店铺-' + $.shopList[i].name + '\n');
        msg.shop_view_1.msg.args.shop_id = $.shopList[i].id;
        msg.shop_view_2.msg.args.vender = $.shopList[i].vender_id;
        ws.send(JSON.stringify(msg.shop_view_1));
        ws.send(JSON.stringify(msg.shop_view_2));
        await $.wait(1000)
      }
      console.log('今日浏览店铺任务已经完成\n');
    } else {
      console.log('今日浏览店铺任务已经完成\n');
    }
  }
  await $.wait(2000);
}

async function productView() {
  if ($.productList) {
    if ($.taskState.product_adds.length < $.taskState.daily_product_add_times) {
      for (let i = 0; i < $.taskState.daily_product_add_times - $.taskState.product_adds.length; i++) {
        console.log('浏览商品-' + $.productList[i].name + '\n');
        msg.add_product_view_1.msg.args.add_product_id = $.productList[i].id;
        msg.add_product_view_2.msg.args.vender = $.productList[i].shop_id;
        msg.add_product_view_3.msg.args.vender = $.productList[i].shop_id;
        ws.send(JSON.stringify(msg.add_product_view_1));
        ws.send(JSON.stringify(msg.add_product_view_2));
        ws.send(JSON.stringify(msg.add_product_view_3));
        await $.wait(1000)
      }
      console.log('今日浏览商品任务已经完成\n');
    } else {
      console.log('今日浏览商品任务已经完成\n');
    }
  }
  await $.wait(2000);
}

async function answerQuestion() {
  if ($.taskState.today_answered == 0) {
    ws.send(JSON.stringify(msg.get_question));
    await $.wait(2000);
  } else {
    console.log('今日问答任务已经完成\n')
  }

}

async function getWaitForPrudeceList(type) {
  mIdList = [];
  list = $.meterialList[type];
  for (let i = 0; i < list.length; i++) {
    vList = list[i].items;
    for (let vo of vList) {
      mIdList.push(vo.id);
    }
  }
  for (let i = 0; i < mIdList.length; i++) {
    id = mIdList[i];
    if ($.inPackageMaterial.length > 0) {
      for (let item of $.inPackageMaterial) {
        if (item.item_id === id && item.num < 100) {
          materialWaitForProduce[type].push(item.item_id);
        }
      }
    } else {
      materialWaitForProduce[type].push(id);
    }
  }
  materialWaitForProduce[type].reverse();
}

async function meterial() {
  let position = ['b1', 'b2', 'h1', 'h2', 's1', 's2'];
  ws.send(JSON.stringify(msg.get_produce_material));
  await $.wait(5000);
  await getWaitForPrudeceList('special');
  await getWaitForPrudeceList('high');
  await getWaitForPrudeceList('base');
  await $.wait(3000);
  for (let i = 0; i < position.length; i++) {
    let key = position[i];
    msg.produce_position_info.msg.args.position = position[i];
    ws.send(JSON.stringify(msg.produce_position_info));
    await $.wait(3000);
    //可以生产新材料
    if (productMachinel[key].is_valid === 1 && productMachinel[key].valid_electric > 0) {
      if ($.meterialList.special.length > 0) {
        console.log('可以生产特殊材料')
        if (key === 's1' || key === 's2') {
          for (let s = 0; s < materialWaitForProduce.special.length; s++) {
            if (hasProducePosition.hasOwnProperty(key)) {
              break;
            }
            msg.material_produce.msg.args.position = key;
            msg.material_produce.msg.args.material_id = materialWaitForProduce.special[i];
            ws.send(JSON.stringify(msg.material_produce));
            await $.wait(2000);

          }
        }
      }
      if ($.meterialList.high.length > 0) {
        if (key === 'h1' || key === 'h2') {
          for (let h = 0; h < materialWaitForProduce.high.length; h++) {
            if (hasProducePosition.hasOwnProperty(key)) {
              break;
            }
            msg.material_produce.msg.args.position = key;
            msg.material_produce.msg.args.material_id = materialWaitForProduce.high[i];
            ws.send(JSON.stringify(msg.material_produce));
            await $.wait(2000);
          }
        }
      }
      if ($.meterialList.base.length > 0) {
        for (let b = 0; b < materialWaitForProduce.base.length; b++) {
          if (hasProducePosition.hasOwnProperty(key)) {
            break;
          }
          msg.material_produce.msg.args.position = key;
          msg.material_produce.msg.args.material_id = materialWaitForProduce.base[i];
          ws.send(JSON.stringify(msg.material_produce));
          await $.wait(2000);
        }
      }
    }
    //可以收取已生产的材料
    if (productMachinel[key].produce_num > 0) {
      msg.material_fetch.msg.args.position = key;
      ws.send(JSON.stringify(msg.material_fetch));
    }
    //今日已完成材料生产任务
    if (productMachinel[key].valid_electric === 0) {
      console.log(`当前生产坑位已经完成今日材料生产任务。`);
    }
  }
  await $.wait(3000);
}

function Token() {
  let opt = {
    url: 'https://xinruimz-isv.isvjcloud.com/api/auth',
    headers: {
      'Connection': `keep-alive`,
      'Accept-Encoding': `gzip, deflate, br`,
      'Source': `02`,
      'Content-Type': `application/json;charset=utf-8`,
      'Origin': `https://xinruimz-isv.isvjcloud.com`,
      'User-Agent': `jdapp;iPhone;9.4.0;14.4;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone13,3;addressid/138474561;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
      'Authorization': `Bearer undefined`,
      'Cookie': `IsvToken=${$.token};`,
      'Host': `xinruimz-isv.isvjcloud.com`,
      'Referer': `https://xinruimz-isv.isvjcloud.com/logined_jd/`,
      'Accept-Language': `zh-cn`,
      'Accept': `application/x.jd-school-island.v1+json`
    },
    body: `{"token":"${$.token}","source":"01"}`
  }
  return new Promise(resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          data = JSON.parse(data);
          $.TOKEN = data.access_token;
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function grantToken() {
  let opt = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    headers: {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Cookie': cookie,
      'User-Agent': 'JD4iPhone/167538 (iPhone; iOS 14.3; Scale/3.00)',
      'Accept-Language': 'zh-Hans-CN;q=1',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: `body=%7B%22url%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&openudid=385f383ec315d8d01c64a09021df04ef9930c99d&sign=a8b19433e2357d5f4d427e5e92c4dd6c&st=1613690555566&sv=120`
  }
  return new Promise(resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          data = JSON.parse(data);
          if (data.code === '0') {
            $.token = data.token;
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve();
      }
    })
  })
}

function grantTokenKey() {
  let opt = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    headers: {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Cookie': cookie,
      'User-Agent': 'JD4iPhone/167538 (iPhone; iOS 14.3; Scale/3.00)',
      'Accept-Language': 'zh-Hans-CN;q=1',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: `&body=%7B%22to%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%5C/?channel%3Dmeizhuangguandibudaohang%22%2C%22action%22%3A%22to%22%7D&build=167541&client=apple&clientVersion=9.4.0&joycious=2&lang=zh_CN&openudid=385f383ec315d8d01c64a09021df04ef9930c99d&osVersion=14.3&partner=apple&rfs=0000&scope=01&sign=ff9e3cc104fc534bd5b598440e88e21a&st=1613687727991&sv=102`
  }
  return new Promise(resolve => {
    $.post(opt, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          data = JSON.parse(data);
          if (data.code === '0') {
            $.tokenKey = data.tokenKey;
            cookie = `${cookie}IsvToken=${$.tokenKey}`
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// prettier-ignore
function Env(t, e) {class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
