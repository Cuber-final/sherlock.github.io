var parr = {
    key_n: Array(),
    key_ntime: Array(),
    key_stime: Array(),
    key_rtime: Array(),
    key_statue: Array(), //0表示等待状态，1表示正在运行,2表示已完成
    key_ztime: Array(),
    key_dqztime: Array(),
}

var aa = [];
var bb = [];
//creatProgress(); //创建进程并显示到table
function creatProgress() {
    aa.length = 0;
    bb.length = 0;
    var max = 10,
        min = 5;
    var size = Math.floor(Math.random() * (+max - +min)) + +min;
    aa.length = size;
    bb.length = size;
    parr.key_ntime.length = size;
    parr.key_stime.length = size;
    parr.key_n.length = size;
    parr.key_statue.length = size;
    parr.key_ztime.length = size;
    parr.key_dqztime.length = size;
    parr.key_rtime.length = size;
    for (var i = 0; i < size; i++) {
        aa[i] = 0;
        bb[i] = 0;
        parr.key_n[i] = i;
        parr.key_ntime[i] = Math.floor(Math.random() * (+10 - +1)) + +1;
        parr.key_stime[i] = Math.floor(Math.random() * (+10 - +0)) + +0;
        parr.key_statue[i] = 0;
        parr.key_ztime[i] = 0;
        parr.key_dqztime[i] = 0;
        parr.key_rtime[i] = parr.key_ntime[i];
    }
    var tbody = document.querySelector('tbody');
    for (var i = 0; i < size; i++) {
        var tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (var j = 0; j < 7; j++) {
            var td = document.createElement('td');
            if (j == 0)
                td.innerHTML = 'P' + parr.key_n[i];
            else if (j == 1)
                td.innerHTML = parr.key_ntime[i];
            else if (j == 2)
                td.innerHTML = parr.key_stime[i];
            else if (j == 4) {
                if (parr.key_statue[i] == 0)
                    td.innerHTML = '等待中';
                else if (parr.key_statue[i] == 1)
                    td.innerHTML = '运行中';
                else td.innerHTML = '已完成';
            } else if (j == 5) td.innerHTML = parr.key_ztime[i];
            else if (j == 6) td.innerHTML = parr.key_dqztime[i];
            else if (j == 3) { //还需时间
                td.innerHTML = parr.key_rtime[i];
            }
            tr.appendChild(td);
        }
    }
}


var numb, fin_time;
var run_time = [];

function start(wh, key) {
    var second = wh;
    if (second == 0 && key == 0) {
        //creatProgress();
        updata(second);
        //updata(second);
        numb = celect(0);
        //fin_time = -1;
        if (numb >= 0) {
            progress_start(numb, 0);
            run_time[numb] = second;
        }
        updata(second);

    }



    function timer() {
        second++;
        //更新响应比
        updata(second);
        var nn = celect(second);
        if (numb >= 0) {
            if (parr.key_rtime[numb] == 0) {
                progress_finish(numb, second);
                numb = nn;
                progress_start(numb, second);
                run_time[numb] = second;
            } else if (parr.key_rtime[nn] < parr.key_rtime[numb]) {
                progress_stop(numb, second);
                //console.log(nn + ' ' + numb);
                numb = nn;
                progress_start(numb, second);
                run_time[numb] = second;
                //console.log(numb + ' ' + parr.key_statue[numb]);

            }

        } else {
            numb = nn;
            progress_start(numb, second);
            run_time[numb] = second;
        }
        updata(second);
        /* if (second >= fin_time) {
            if (second == fin_time)
                progress_finish(numb, second);
            var numbe = celect(second);
            numb = numbe;
            if (numbe != -1) {
                fin_time = progress_start(numbe, second);
            }
        } */

        var time = document.getElementById('time');
        time.innerHTML = second;
    }
    int = setInterval(timer, 1000);
}




function progress_start(num, start_time) { //某个进程开始运行
    parr.key_statue[num] = 1;

    console.log('start任务：' + num + ' 开始时间：' + start_time);
    var p = document.getElementById('infom');
    var em = document.createElement("li");
    em.innerHTML = 'start: P' + num + ' ** 开始时间：' + start_time;
    if (num >= 0)
        p.insertBefore(em, p.nextElementSibling);
    //run_time[num]++;
    //var ik = start_time + parr.key_ntime[num];
    //console.log('start任务：' + num + ' 开始时间：' + start_time + ' 结束时间：' + ik);
    //var p = document.querySelector('body');
    //var em = document.createElement("li");
    //em.innerHTML = 'start : P' + num + ' *** 开始时间：' + start_time + 's *** 结束时间：' + ik + 's';
    //p.insertBefore(em, p.nextElementSibling);
    // return ik;


}

function progress_stop(num, second) {
    parr.key_statue[num] = 0;
    var h = document.getElementById('body');
    //var child = h.childNodes;
    var tr = h.querySelectorAll('tr');
    var td = tr[num].querySelectorAll('td');
    td[4].innerHTML = '等待中';
    tr[num].className = 'nono';



}

function progress_finish(num, second) { //进程结束改变statue
    parr.key_statue[num] = 2;
    //计算周转时间
    parr.key_ztime[num] = second - parr.key_stime[num];
    parr.key_dqztime[num] = (parr.key_ztime[num] / parr.key_ntime[num]).toFixed(2);
    var h = document.getElementById('body');
    //var child = h.childNodes;
    var tr = h.querySelectorAll('tr');
    var td = tr[num].querySelectorAll('td');
    td[5].innerHTML = parr.key_ztime[num];
    td[6].innerHTML = parr.key_dqztime[num];
    //某个进程结束时加入echarts_process条形图中并显示出来

}


//一个进程结束时挑选响应比最高的进程为其分配CPU,返回进程的序号
function celect(second) {
    var h = document.getElementById('body');
    var child = h.childNodes;
    var minn = 100,
        num = -1;
    for (var i = child.length - 1; i >= 0; i--) {
        if (parr.key_statue[i] == 0 && parr.key_stime[i] <= second) {
            if (parr.key_rtime[i] < minn) {
                minn = parr.key_rtime[i];
                num = i;

            } else if (parr.key_rtime[i] == minn) {
                if (parr.key_stime[i] < parr.key_stime[num]) {
                    num = i;
                }
            }
        }
    }
    return num;
}


function dele() {
    //清除table中的数据
    var h = document.getElementById('body');
    var child = h.childNodes;
    for (var i = child.length - 1; i >= 0; i--)
        h.removeChild(child[i]); //删除节点
}


//动态更新表格数据，进程信息
function updata(second) {
    var h = document.getElementById('body');
    var child = h.childNodes;
    var tr = h.querySelectorAll('tr');
    var finish_num = 0;
    finish_num -= child.length;
    for (var i = child.length - 1; i >= 0; i--) {


        if (parr.key_statue[i] > 0) {
            var td = tr[i].querySelectorAll('td');
            if (parr.key_statue[i] == 1) {
                td[4].innerHTML = '运行中';
                tr[i].className = 'slid';
                if (!aa[i]) {
                    parr.key_rtime[i]--;
                    td[3].innerHTML = parr.key_rtime[i];
                    aa[i] = 1;
                } else aa[i] = 0;

            } else if (parr.key_statue[i] == 2) {
                td[4].innerHTML = '已完成';
                tr[i].className = 'over';
                finish_num++;
                if (finish_num == 0) {
                    clearInterval(int); //完成后结束所有进程
                    alert('所有进程都执行完毕！！！');
                }
            }
        }
    }
}


//开始按钮事件
var btn_start = document.getElementById('btn_time');
btn_start.onclick = function() { //开始启动计时
    document.getElementById("btn_time").setAttribute("disabled", true); //设置不可点击
    document.getElementById("pause").removeAttribute("disabled");
    // //开始前先清除表格中的所有条数据
    // var h = document.getElementById('body');
    // var child = h.childNodes;
    // for (var i = child.length - 1; i >= 0; i--)
    //     h.removeChild(child[i]); //删除节点
    start(0, 0);
    star = 1;
}

//随机生成进程事件
var btn_random = document.getElementById('random');
btn_random.onclick = function() { //开始启动计时

    //开始前先清除表格中的所有条数据
    var h = document.getElementById('body');
    var child = h.childNodes;
    for (var i = child.length - 1; i >= 0; i--)
        h.removeChild(child[i]); //删除节点
    document.getElementById("random").setAttribute("disabled", true); //设置不可点击
    document.getElementById("btn_time").removeAttribute("disabled"); //去掉不可点击
    creatProgress();
}

function insert(st, nt) {
    var lon = parr.key_n.length;
    parr.key_ntime.length++;
    parr.key_stime.length++;
    parr.key_n.length++;
    parr.key_statue.length++;
    parr.key_ztime.length++;
    parr.key_dqztime.length++;
    aa.length++;
    bb.length++;
    parr.key_rtime.length++;

    parr.key_ntime[lon] = nt;
    parr.key_stime[lon] = st;
    parr.key_n[lon] = lon;
    parr.key_statue[lon] = 0;
    parr.key_ztime[lon] = 0;
    parr.key_dqztime[lon] = 0;
    parr.key_rtime[lon] = parr.key_ntime[lon];
    aa[lon] = 0;
    bb[lon] = 0;

    var tbody = document.querySelector('tbody');

    var tr = document.createElement('tr');
    tbody.appendChild(tr);
    for (var j = 0; j < 7; j++) {
        var td = document.createElement('td');
        if (j == 0)
            td.innerHTML = 'P' + parr.key_n[lon];
        else if (j == 1)
            td.innerHTML = parr.key_ntime[lon];
        else if (j == 2)
            td.innerHTML = parr.key_stime[lon];
        else if (j == 4) {
            if (parr.key_statue[lon] == 0)
                td.innerHTML = '等待中';
            else if (parr.key_statue[lon] == 1)
                td.innerHTML = '运行中';
            else td.innerHTML = '已完成';
        } else if (j == 5) td.innerHTML = parr.key_ztime[lon];
        else if (j == 6) td.innerHTML = parr.key_dqztime[lon];
        else if (j == 3) { //还需时间
            td.innerHTML = parr.key_rtime[lon];
        }
        tr.appendChild(td);
    }
}

$(document).ready(function() {
    document.getElementById("inputt").onclick = function() {
        $('#loginModalId').modal('show');
    }
    document.getElementById("loginModalYesId").onclick = function() {
        $('#loginModalId').modal('hide');
        //alert("登录功能未实现！");

        var st = document.getElementById("p_stime").value;
        var nt = document.getElementById("p_ntime").value;
        st = parseInt(st);
        nt = parseInt(nt);
        insert(st, nt);
        document.getElementById("btn_time").removeAttribute("disabled"); //去掉不可点击
    }
});

//暂停继续按钮事件
var a = false; //区分是暂停还是继续
var btn_stop = document.getElementById('pause');
btn_stop.onclick = function() {
    a = !a;
    if (a) { //暂停
        clearInterval(int);
        this.innerHTML = '继续';
    } else { //继续
        var time = document.getElementById('time');
        var con = time.innerHTML;
        this.innerHTML = '暂停';
        start(con, 1);
    }
}


var star = 0;
//重置开始，重新开始，重置按钮响应事件
var btn_re = document.getElementById('time_restart');
btn_re.onclick = function() {

    run_time.length = 0;
    //document.getElementById("btn_time").removeAttribute("disabled"); //去掉不可点击
    document.getElementById("random").removeAttribute("disabled"); //去掉不可点击
    document.getElementById("btn_time").setAttribute("disabled", true); //设置不可点击
    document.getElementById("pause").setAttribute("disabled", true);
    //停止 setInterval() 方法
    if (star)
        clearInterval(int);


    //清除进程开始信息的列表数据
    /* var lii = document.querySelectorAll('li');
    for (var j = 0; j < lii.length; j++)
        document.querySelector('body').removeChild(lii[j]); */
    //时间计时器清零
    var time = document.getElementById('time');
    time.innerHTML = 0;
    //清除table中的数据
    var h = document.getElementById('body');
    var child = h.childNodes;
    for (var i = child.length - 1; i >= 0; i--)
        h.removeChild(child[i]); //删除节点

    parr.key_ntime.length = 0;
    parr.key_stime.length = 0;
    parr.key_n.length = 0;
    parr.key_statue.length = 0;
    parr.key_ztime.length = 0;
    parr.key_dqztime.length = 0;
    parr.key_rtime.length = 0;
    aa.length = 0;
    bb.length = 0;

    //清除进程开始信息的列表数据
    var kk = document.getElementById('infom');
    var lii = kk.querySelectorAll('li');
    for (var j = 0; j < lii.length; j++)
        document.getElementById('infom').removeChild(lii[j]);
}

//学习算法
var btn_learn = document.getElementById('learn');
btn_learn.onclick = function() { //开始启动计时
    alert("最短剩余时间优先算法,是抢占的，出现剩余时间更低的进程则发生抢占。");
}