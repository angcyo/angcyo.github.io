/**
 * Created by angcyo on 15-06-30-030.
 */
$(document).ready(function () {
    var card_count = 26;//注意,本身还有一个,所以总数应该+1;
    var card_box;

    //追加卡片布局
    for (var i = card_count; i >= 0; i--) {
        //var card_box =  $("div.container").children().first().clone();//ok
        card_box = $("div.container").find("div.card-box").eq(0).clone();//ok
        $("div.container").append(card_box);
    }

    //设置卡片内容
    for (var i = 0; i <= card_count; i++) {
        $("div.container").find("div.card-box").eq(i).find(".card-img").attr({src: getRandomImgSrc()});//设置卡片的图片
        $("div.container").find("div.card-box").eq(i).find(".card-title").text(getRandomTitle());
        $("div.container").find("div.card-box").eq(i).find(".card-desc").text(getRandomDesc());
        $("div.container").find("div.card-box").eq(i).find(".card-other").text(getRandomOtherText());
        $("div.container").find("div.card-box").eq(i).fadeIn(1000 + i * 100);
    }

    $("span.nav-time").css("transform", " rotate(45deg)");//旋转时间45度
    $("a.nav-a").hover(function () {
        $(this).css({background: "#7a43b6"});
        //$(this).children().first().text("123");
        $(this).children().first().css({color: createRandomColor(), transform: "scale(1.3)"})
        //$(this).find(".nav-a-title").eq(0).css({transform:"scale(1.3)"});
    }, function () {
        $(this).css({background: "none"});
        $(this).children().first().css({transform: "scale(1)", color: "#fff"})
    });

    startTime();//显示时间
});

//每个一秒设置一次时间文本
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    //document.getElementById('txt').innerHTML = h + ":" + m + ":" + s;
    //$("span.nav-time").text(createRandomColor());
    $("span.nav-time").text(h + ":" + m + ":" + s);
    $("span.nav-time").css({color: createRandomColor()});

    t = setTimeout('startTime()', 500);
}

//检查时间是否是2位数
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//创建一个随机的颜色
function createRandomColor() {
    var col1 = "#00F5FF";
    var col2 = "#00FF7F";
    var col3 = "#436EEE";
    var col4 = "#8A2BE2";
    var col5 = "#CD3278";
    var col6 = "#EEB422";
    var col7 = "#FF00FF";
    var col8 = "#FFD700";
    var num = Math.round(Math.random() * 10) % 8;//0-7

    if (num == 7) {
        return col8;
    }
    if (num == 6) {
        return col7;
    }
    if (num == 5) {
        return col6;
    }
    if (num == 4) {
        return col5;
    }
    if (num == 3) {
        return col4;
    }
    if (num == 2) {
        return col3;
    }
    if (num == 1) {
        return col2;
    }
    if (num == 0) {
        return col1;
    }
}

//获取随机图片组
function getItemImgs(count) {
    var imgs = new Array();
    for (var i = 0; i < count; i++) {
        imgs[i] = getRandomImgSrc();
    }
    return imgs;
}

//获取随机图片存放的路径
function getRandomPath() {
    var num = Math.random();
    if (num > 0.6) {
        return "./monster_src/img/lovers/lovers_shirt_pic0";
    }
    if (num > 0.3) {
        return "./monster_src/img/doll/doll_pic0";
    }
    return "./monster_src/img/bed/bed_pillow_pic0";
}

//获取一张随机的图片
function getRandomImgSrc() {
    var item = Math.round(Math.random() * 10);//1-10
    var name = item % 8 + 1; // 0-9
    var img = getRandomPath() + name + ".png";
    return img;
}

//获取随机的标题
function getRandomTitle() {
    var num = Math.random();
    if (num > 0.9) {
        return "桂南风格发蝴蝶结款发货";
    }
    if (num > 0.8) {
        return "桂林无敌爆款";
    }
    if (num > 0.7) {
        return "南昌爆款,收藏送礼物";
    }
    if (num > 0.6) {
        return "杭州爆款,买即送";
    }
    if (num > 0.5) {
        return "全国爆款服饰立买,立送";
    }
    if (num > 0.4) {
        return "买买买.....";
    }
    if (num > 0.3) {
        return "送女票必备...";
    }
    if (num > 0.2) {
        return "爆款....";
    }
    if (num > 0.1) {
        return "火热爆款,全场8折";
    }
    return "大出血甩卖";
}

//获取随机的描述
function getRandomDesc() {
    var num = Math.random();
    if (num > 0.9) {
        return "桂南风格淑女必备";
    }
    if (num > 0.8) {
        return "桂林火热降价售";
    }
    if (num > 0.7) {
        return "必送礼物....";
    }
    if (num > 0.6) {
        return "杭州来了,快来买";
    }
    if (num > 0.5) {
        return "全国免费送";
    }
    if (num > 0.4) {
        return "看中相中拿走";
    }
    if (num > 0.3) {
        return "该送人的了.";
    }
    if (num > 0.2) {
        return "- - - - -.";
    }
    if (num > 0.1) {
        return "清仓大甩;";
    }
    return "大出血甩卖";
}


function getRandomOtherText() {
    var num = Math.random();
    if (num > 0.9) {
        return "最后一天";
    }
    if (num > 0.8) {
        return "最后三天";
    }
    if (num > 0.7) {
        return "最后二天";
    }
    if (num > 0.6) {
        return "最后1小时";
    }
    if (num > 0.5) {
        return "最后2小时";
    }
    if (num > 0.4) {
        return "最后3小时";
    }
    if (num > 0.3) {
        return "限时抢购";
    }
    if (num > 0.2) {
        return "火热进行中";
    }
    if (num > 0.1) {
        return "还剩10分钟";
    }
    return "还剩30分钟";
}