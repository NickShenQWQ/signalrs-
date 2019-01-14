var localhostIIS = 'http://192.168.1.133/';//大屏端
var getlocalhostIIS = 'http://192.168.1.133/';//小屏端
var webUrl ='http://iasscreen.bscwin.com/';
var webMediaUrl = 'http://iasscreen.bscwin.com:80'; 
var videoSrc = '';
var imgSrc ='';
var localImgSrc = [];
var localMediaSrc =[]
var mediaSrc =[];
var mediaType =[];
var nameArr =[];
var titleArr =[];
var descArr =[];
var contArr = [];
var filelist =[];
var OnSaleDate = [];
var updateDate =[];
var fileType =[];
var fileLength =[];
var  flag = 1;
var  flag2 = 1;
var       coverImageSrc = [];
var progressFlag;
var t3Flag = true;
var isClick;
var percent= 0;
 var nowTime = document.getElementById('now_time');
 
    // 引入iis站点网址json
  // $.getJSON("/signalrs/LocalIS.json",function(data){

    //你要进行的操作
      // localhostIIS = data.LocalIIS;
      // webUrl =data.webUrl;
      // webMediaUrl = data.webMediaUrl;


var   channel = "aaaa";
var createTime = new Date();
var  args = [createTime];
var signalrClient = new _RealTimeFunctionServiceClient();
console.log("?")
signalrClient.start()
funcName = "addVideo";


  // });
  function mouseDown()
  {
    console.log("click")
    $(".pdfModel").hide();
    $("#the-canvas").remove();
    funcName = "close" ;
    $(".liveModel").hide();
    send();
  }
// 发送及时通讯

function send() {
    console.log("send function")
    if (channel != null) {

    
        signalrClient.invokeServerFunctionByChannel(channel, funcName, args).done(function (e) {
          console.log("获取Server方法成功,当前funcName:" + funcName + "-当前Channel:" + channel);
          console.log(JSON.parse(e));
      }).fail(function (r) {
          console.log("获取Server方法失败!");
      });
   

    } else {
        signalrClient.invokeServerFunction(funcName, args).done(function (e) {
            console.log("获取Server方法成功,当前funcName:" + funcName);
            console.log(JSON.parse(e));
            args = new Array(e);
            console.log(args);
        }).fail(function (r) {
            console.log("获取Server方法失败!");
        });
   
  }
}

// pdf
function pdfJs(){

// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url =pdfUrl;
console.log("url",url)
// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = './js/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 2,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
  console.log("%c pdfDoc.numPages","color:green",pdfDoc.numPages)
  if(pdfDoc.numPages == 1){
    $("#prev").hide();
    $("#next").hide();
  } else {
    $("#prev").show();
    $("#next").show();  
  }
  // Update page counters
  document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
$("#next").unbind().on("click",onNextPage());
function onNextPage(){
    let timer=null;
    return function (){
        clearTimeout(timer);
        timer=setTimeout(function(){
            $("#prev").attr("src","./img/Previous.png")
            funcName ="onNextPage";
            send();
            if(pageNum+ 1 == pdfDoc.numPages){
              $("#next").attr("src","./img/GreyNext.png")
            }
            if (pageNum >= pdfDoc.numPages) {
              $("#next").attr("src","./img/GreyNext.png")
              return;
            }
          
          
            pageNum++;
            queueRenderPage(pageNum);
            console.log("下一页")
        },200);
    }
}

$("#prev").unbind().on("click",onPrevPage());
function onPrevPage(){
    let timer=null;
    return function (){
        clearTimeout(timer);
        timer=setTimeout(function(){
            funcName ="onPrevPage";
            send();
            console.log(pageNum)
            if (pageNum == 2) {
              $("#prev").attr("src","./img/GreyPrevious.png")
              $("#next").attr("src","./img/Next.png")
            }
            if (pageNum-1 < pdfDoc.numPages) {
              $("#next").attr("src","./img/Next.png")
            }
            if (pageNum <= 1) {
              $("#prev").attr("src","./img/GreyPrevious.png")
              return;
            }
          
            pageNum--;
            queueRenderPage(pageNum);
            console.log("上一页")
        },200);
    }
}





/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).then(function(pdfDoc_) {
  console.log("sucess")
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  // Initial/first page rendering
  renderPage(pageNum);
  // setInterval(function(){
  //   console.log(pageNum)
  // },1000)
});


}
$(document).ready(function () {


	
  $(".header,.content").click(function(){
  	 $(".dialog").hide();
  })
  $(".dialog,#setting").click(function(event){
  	event=event||window.event;
    event.stopPropagation();
  })

  var storage = window.localStorage;
  if (storage.dataStorage) {
    var dataStorage = storage.getItem("dataStorage");
    var data = JSON.parse(dataStorage);
    var n = data.length;
    var classList1 = $(".classList1 ul");
    if (classList1.find("li").length > 0) {
      classList1.find("li").remove();
    }
    var time =0;
    for (var i = 0; i < n; i++) {
      // if (data[i].name.replace(/[\u0391-\uFFE5]/g, "aa").length > 17) {
      //   console.log("大于7");
      //   var li = $("<li><marquee   scrollamount='9'  onMouseOut='this.start()' onMouseOver='this.stop()'>" + data[i].name + "</marquee><img src='img/button.png'/></li>");
      // } else {

    var li = $("<li><span>" + data[i].name + "</span><img src='img/button.png'/></li>");
      // }
			time++;
      classList1.append(li);
      liClick1(data, i);
      //显示列表动画
			classList1.find("li").eq(i).animate({opacity:1},time*200);
    }
  } else {
    ajax();
  }

  timeUserFun(300);
  var n=0;
  $("#setting").click(function () {
    setTimeout(function(){
      n = 0
    },10000)
    n++;
    if(n<5){
    console.log("n1",n)
    $(".dialog").hide();
    }else{
    console.log("n2",n)
    $(".dialog").show();
    n=0;
    }
    })
  $("#update").click(function () {
  	$(".schedule").remove();
  	var schedule = $("<div class='schedule'><img id='close1' src='img/closeImg.png'/><p id='upd'>正在更新目录...</p></div>");
		$("body").append(schedule);
		$("body").css("pointer-events","none");
    update();
  })
  //播放屏保
  $("#videoBtn").click(function () {
    // funcName ="pingbao"
    // send();
    // var video1 = document.getElementById("video");
    // console.log(video1,"video1video1video1")
    // $("#video").show();
    // video1.play();
    // progressFlag = setInterval(getProgress(), 60);
    PBtime();
  })
  $("#video").on("click", function () {
    FullScreen();
  })


  function timeUserFun(time) {
    var time = time || 2;
    var userTime = time;
    var objTime = {
      init: 0,
      time: function () {
        objTime.init += 1;
        if (objTime.init == userTime && $("#video1").length == 0 && $("#the-canvas").length ==0 && $("iframe").length ==0 && $(".schedule").length ==0) {
          console.log(123)
          // $("#video").show();
          // var video1 = document.getElementById("video");
          // video1.play();
          // progressFlag = setInterval(getProgress(), 60);
          // funcName ="sleep";
          // send();
          PBtime();
        }


      },
      eventFun: function () {
        clearInterval(testUser);
        objTime.init = 0;
        testUser = setInterval(objTime.time, 1000);
      }
    }

    var testUser = setInterval(objTime.time, 1000);

    var body = document.querySelector('html');
    body.addEventListener("click", objTime.eventFun);
    body.addEventListener("keydown", objTime.eventFun);
    body.addEventListener("mousemove", objTime.eventFun);
    body.addEventListener("mousewheel", objTime.eventFun);
  }

});
function FullScreen() {
  // funcName ="pingbaohide"
  // send();
  $("#video").hide();
  document.getElementById("video").pause();
  clearInterval(progressFlag);
}
//推出全屏方法
function exitScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  if (typeof cfs != "undefined" && cfs) {
    cfs.call(el);
  }
}



function liClick1(data, i) {

  var classList2 = $(".classList2 ul");
  var classList3 = $(".classList3 ul");

  $(".classList1 li").click(function () {
    var classList4 = $(".contentList");
    var _this = this;
    var title = $(_this).find("span").text() || $(_this).find("marquee").text();
    console.log("%c title,data",'color:pink',title,data[i].name.replace("<sup>","").replace("</sup>",""))
    activeClick(_this);
    if (title === data[i].name.replace("<sup>","").replace("</sup>","")) {
      var children = data[i].children;
      if (classList2.find("li").length > 0) {
        classList2.find("li").remove();
      }
      if (classList3.find("li").length > 0) {
        classList3.find("li").remove();
      }
      if (classList4.length > 0) {
        classList4.remove();
      }
      $(".classList2 p").remove();
      $(".classList3 p").remove();
      // $(".classList4 p").remove();
      // var p = $("<p class='childrenTitle1'>"+title+"</p>");
      // $(".classList2").prepend(p);
      if (children) {
        var n = children.length;
        var time = 0;
        for (var j = 0; j < n; j++) {
          var childrens = children[j];
          // if (childrens.name.replace(/[\u0391-\uFFE5]/g, "aa").length > 17) {
          //   var li = $("<li><marquee   scrollamount='9'  onMouseOut='this.start()' onMouseOver='this.stop()'>" + childrens.name + "</marquee><img src='img/button.png'/></li>");
          // } else {

          var li = $("<li><span>" + childrens.name + "</span><img src='img/button.png'/></li>");
          // }

          time++;
          classList2.append(li);
          var a = data[i].children[j].name;
          liClick2(children, n,title);
          classList2.find("li").eq(j).animate({opacity:1},time*200);
        }
      }

    }
  })
}

function activeClick(_this) {
  $(_this).addClass("active");
  $(_this).siblings().removeClass("active");
  $(_this).find("img").attr("src", "img/button_active.png");
  $(_this).siblings().find("img").attr("src", "img/button.png");      
  var title = $(_this).find("span").text() || $(_this).find("marquee").text();
  $("#title").text(title);
}


function liClick2(children, n,title2) {
  // console.log("%c children, n,title2","color:green",children, n,title2)
  // var p = "<p class='childrenTitleNew'>"+title2+"</p>";
  // $(".classList4").prepend(p);

  if($(".childrenTitleNew").length >1){
 
    $(".childrenTitleNew").remove ();
    $(".classList4").prepend(p);
  }
  $(".back").remove();
  
  console.log("%c liClick","color:pink",children, n,title2)


  // T3创库
  t3Flag = true
    if(title2 == "T3创库" && t3Flag == true ) {
      t3Flag = false
      console.log("T3创库");
      setTimeout(function(){
        for(let i = 0;i<$(".fontContent").length;i++){
          // document.getElementsByClassName("whiteBlank")[i].style.border-bottom = "1px solid #0082c0";
        }
     
      },10)
    }
 
 


  mediaSrc = [];
  mediaType = [];
  descArr =[];
  contArr = [];
  updateDate =[];
  fileType =[];
  fileLength =[];
  localMediaSrc = [];
  coverImageSrc = []
  for(let i  = 0;i<children.length;i++){

    // console.log("%c children[i].children","color:green",children[i].children)
    if(children[i].children == undefined){
      // console.log("%c no children","color:green")
      // 没有子菜单，显示视频列表
      $(".classList2").hide();
      $(".classList3").hide();
 
      var classList4 = $(".classList4");
 
      // if( $(".back").length < 1){
      //   $(".back").remove();
      // }

      // 直播链接列表
      var liveList = [];
      // 直播
     if(children[i].currentUrl.split("/")[1] == "活动直播") {
        for(let i=0;i<children.length;i++){
       
          liveList.push(children[i].properties.liveLink);
          console.log("直播",children[i]);
          $(".classList4").append( '<div class="back"><div class="newBlank" style="padding-bottom: 0;"><div class="liveTitle modelTitle">'+children[i].properties.liveName+
          '</div><div class="whiteBlank"></div></div>');
        }

        $(".liveTitle").click(function(){
            $(".liveModel").show();
            console.log(liveList);
            // $("liveIframe").attr("src",)
        })
        // <a href='+ children[i].properties.liveLink +'></a>

        // funcName = 'live';
        // args =  [children[i].properties.liveLink]
        // console.log(args)
        // send();
    }





      if(children[i].properties.filePageSections.OnSaleDate != ""){ 
        console.log("%c File","color:yellow",children[i].properties.filePageSections)
        $(".classList4").append( '<div class="back"><div class="newBlank" style="height:80vh"><div class="modelTitle">'+children[i].properties.filePageSections.FileName+
        '</div><div class="whiteBlank" style="border-bottom: 1px solid #0082c0"><div class="yuji">预计上市日期：'+children[i].properties.filePageSections.OnSaleDate+'</div><div class="Desc" style="    line-height: 45vh;"><div class="fontContent">'+
        children[i].properties.filePageSections.Summary+'</div>	</div><div class="blockborderBox"></div></div>		</div></div>');
      console.log("%c length","background:grey",children[i].properties.filePageSections.File.length)
      

      for(let j = 0 ;j<children[i].properties.filePageSections.File.length;j++){
        let file = children[i].properties.filePageSections.File[j].FileInfo
        mediaSrc.push(file.src)
        mediaType.push(file.fileType)
        descArr.push(children[i].properties.filePageSections.FileName)
        contArr.push(children[i].properties.filePageSections.Summary)
        updateDate.push(file.updateDate)
        fileType.push(file.fileType)
        fileLength.push(file.fileLength)
        coverImageSrc.push(file.coverImageSrc)
        
        var reg = new RegExp("%","g");
        var a = encodeURIComponent(file.src);
        var b = file.fileType;
        var c = file.fileLength;
        var d = file.updateDate;
        console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
        realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
        localMediaSrc.push(realSrc);
            console.log("本地媒体文件",localMediaSrc)
        // if($(".blockborder").length < children[i].properties.filePageSections.File.length ){
          if( children[i].properties.filePageSections.File[j].FileInfo.fileType == "pdf"){
            $(".blockborderBox").eq(i).append('<div class="blockborder" style="height: 170px;"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
            '"><div class="littleTitle"><img class="pdfIcons" src="./img/pdf1-01.png"></div></div>')
          } else if ( children[i].properties.filePageSections.File[j].FileInfo.fileType == "mp4"){
            $(".blockborderBox").eq(i).append('<div class="blockborder"  style="height: 170px;"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
            '"><div class="littleTitle"><img class="pdfIcons" src="./img/video-01.png"></div></div>')
          }
        // }
      }

      } else if(children[i].properties.filePageSections.OnSaleDate == "") {
        // console.log("%c File","color:yellow",children[i].properties.filePageSections)
        $(".classList4").append( '<div class="back" ><div class="newBlank" style="height:80vh"><div class="modelTitle">'+children[i].properties.filePageSections.FileName+
        '</div><div class="whiteBlank" style="border-bottom: 1px solid #0082c0"><div class="Desc" style="    line-height: 45vh;"><div class="fontContent">'+
        children[i].properties.filePageSections.Summary+'</div>	</div><div class="blockborderBox"></div></div>		</div></div>');
      // console.log("%c length","background:grey",children[i].properties.filePageSections.File.length)

      for(let j = 0 ;j<children[i].properties.filePageSections.File.length;j++){
        let file = children[i].properties.filePageSections.File[j].FileInfo
        mediaSrc.push(file.src)
        mediaType.push(file.fileType)
        descArr.push(children[i].properties.filePageSections.FileName)
        contArr.push(children[i].properties.filePageSections.Summary)
        updateDate.push(file.updateDate)
        fileType.push(file.fileType)
        fileLength.push(file.fileLength)
        coverImageSrc.push(file.coverImageSrc)
        var reg = new RegExp("%","g");
        var a = encodeURIComponent(file.src);
        var b = file.fileType;
        var c = file.fileLength;
        var d = file.updateDate;
        // console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
        realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
        localMediaSrc.push(realSrc);
        // if($(".blockborder").length < children[i].properties.filePageSections.File.length ){
          if( children[i].properties.filePageSections.File[j].FileInfo.fileType == "pdf"){
            $(".blockborderBox").eq(i).append('<div class="blockborder"  style="height: 170px;"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
            '"><div class="littleTitle"><img class="pdfIcons" src="./img/pdf1-01.png"></div></div>')
          } else if ( children[i].properties.filePageSections.File[j].FileInfo.fileType == "mp4"){
            $(".blockborderBox").eq(i).append('<div class="blockborder"  style="height: 170px;"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
            '"><div class="littleTitle"><img class="pdfIcons" src="./img/video-01.png"></div></div>')
          }
        // }
      }
    } 
    } else {
      console.log("%c have children","color:purple")
      // 有子菜单，显示菜单
      $(".classList2").show();
      $(".classList3").show();
      var classList3 = $(".classList3 ul");

      $(".classList2 li").click(function () {
        
        console.log("%c back","color:red",$(".back").length,flag,flag2);
        if($(".back").length > 0 && flag== 1){
          $(".back").remove();
        }
        
        var classList4 = $(".contentList");
        activeClick(this);
        var title = $(this).find("span").text() || $(this).find("marquee").text();
        for (var x = 0; x < n; x++) {
          if (children[x].name == title) {
            if (classList3.find("li").length > 0) {
              classList3.find("li").remove();
            }
            if (classList4.length > 0) {
              classList4.remove();
            }
            // if($(".childrenTitle2").length ==  0){
            //   var title3 = title2+">"+title;
            //   $(".classList3 p").remove();
            //   // $(".classList4 p").remove();
            //   var p = $("<p class='childrenTitle2'>"+title3+"</p>");
            //   $(".back").before(p);
            // }
         
            if (children[x].children) {
              var child = children[x].children;
              var m = child.length;
              var time = 0;
           
    
              if(flag ==1){    
              for (var i = 0; i < m; i++) {
                // if (child[i].name.replace(/[\u0391-\uFFE5]/g, "aa").length > 17) {
                //   var li = $("<li><marquee   scrollamount='9'  onMouseOut='this.start()' onMouseOver='this.stop()'>" + child[i].name + "</marquee><img src='img/button.png'/></li>");
                // } else {
    
                  var li = $("<li><span>" + child[i].name + "</span><img src='img/button.png'/></li>");
               
                // }
                classList3.append(li);
                var nodeText = child[i].properties.jsonEditor.Sections;

                // liClick3(child,title3);
                liClick3(child)
                time++;
                classList3.find("li").eq(i).animate({opacity:1},time*200);

                flag =2
              }
            }
            }
    
          }
        }
        var that = this;
        var _title = $(that).find("span").text() || $(that).find("marquee").text();
        activeClick(that);
      })


    }
  }

  
}


function PBtime(){
  $("#video").show();
 
  // funcName ="pingbao"
  // send();
  var screenlist=[];
  var localMediaScreen=[];
  var storage = window.localStorage;
  var dataStorage = storage.getItem("dataStorage");
  var data = JSON.parse(dataStorage);
  console.log("data",data)
  for(var i=0;i<data.length;i++){
    if(data[i].name=="Others"){
      var OthersChild=data[i].children;
      for(var k=0;k<OthersChild.length;k++){
        var screenChild=OthersChild[k].properties.screenSaverSections.ScreenSaverVideo;
        for(var n=0;n<screenChild.length;n++){
          screenlist.push(
            {
              "fileType":screenChild[n].ScreenSaverFileInfo.fileType,
              "updateDate":screenChild[n].ScreenSaverFileInfo.updateDate,
              "fileLength":screenChild[n].ScreenSaverFileInfo.fileLength,
              "srcUrl":screenChild[n].ScreenSaverFileInfo.src,
            }
          )
        }
      }
    }


  }
  console.log(screenlist);
  for(var j=0;j<screenlist.length;j++){
    var a = encodeURIComponent(screenlist[j].srcUrl);
    var b = screenlist[j].fileType;
    var c = screenlist[j].fileLength;
    var d = screenlist[j].updateDate;
    var reg = new RegExp("%","g");
    // console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
    var realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
    localMediaScreen.push(getlocalhostIIS+realSrc);
  }
  console.log(localMediaScreen)
  $("#video").attr("src",localMediaScreen[0])
  var video1 = document.getElementById("video");
  video1.play();
  var vList =localMediaScreen;
  var vLen = vList.length; 
  var curr = 1;
  var video1 = document.getElementById("video");
  video1.addEventListener('ended', function(){
    video1.src = vList[curr];
    video1.load();
    video1.play();
    curr++;  
    if(curr >= vLen){
        curr = 0;
    }
  },false);
}







function ajax() {
  $.ajax({
    type: "get",
    url: webUrl +"umbraco/api/DtModuleContent/getNode?maxLevel=5&hasProperties=true",
    async: true,
    success: function (data) {
      // console.log("?",data);

      var n = data.length;
      var classList2 = $(".classList2 ul");
      var classList3 = $(".classList3 ul");
      var classList1 = $(".classList1 ul");
      var classList4 = $(".contentList");
      if (classList1.find("li").length > 0) {
        classList1.find("li").remove();
      }
      if (classList2.find("li").length > 0) {
        classList2.find("li").remove();
      }
      if (classList3.find("li").length > 0) {
        classList3.find("li").remove();
      }
      if (classList4.length > 0) {
        classList4.remove();
      }
      $(".classList2 p").remove();
      $(".classList3 p").remove();
      // $(".classList4 p").remove();
      if (!window.localStorage) {
        return false;
      } else {
        var storage = window.localStorage;
        var _data = JSON.stringify(data);
        storage.setItem("dataStorage", _data);
      }
      var time = 0;
      for (var i = 0; i < n; i++) {
        var li = $("<li><span>" + data[i].name + "</span><img src='img/button.png'/></li>");
        classList1.append(li);
        liClick1(data, i);
        li.fadeIn(3000);
        time++;
        classList1.find("li").eq(i).animate({opacity:1},time*200);
      }
      $("#upd").text("目录更新完成");

      $("#close1").css("visibility","visible");
      $("#close1").css("pointer-events","auto");
			$("#close1").on("click",function(){
					$(".schedule").remove();
			    $("body").css("pointer-events","auto");
			})
      $(".ulTopLeft li").eq(0).css("display","none");
      $(".back").hide();
    }
  });
}

$(document).on("click",".classList2 li",function(){
  flag =1 ;
  flag2 =1 ;
})
function liClick3(children) {

  console.log("%c child","color:pink",children)

  var _this = this;
  // $(".classList3 li").click(function () {
    videoSrc = '';
    imgSrc ='';
   localImgSrc = [];
   localMediaSrc =[]
   mediaSrc =[];
   mediaType =[];
   nameArr =[];
   titleArr =[];
   descArr =[];
   contArr = [];
   filelist =[];
   OnSaleDate = [];
   coverImageSrc= []
    activeClick(this);
    var title = $(this).find("span").text() || $(this).find("marquee").text();
    var n = children.length;

      var classList4 = $(".classList4");
 
        $(".classList3").hide();
        // mediaSrc.push(children[i].properties.filePageSections.File[j].FileInfo.src)
      console.log(flag2)
      $(".back").remove();
      // console.log("%c liClick","color:pink",children, n,title2)
      mediaSrc = [];
      mediaType = [];
      descArr =[];
      contArr = [];
      updateDate =[];
      fileType =[];
      fileLength =[];
      localMediaSrc = [];
      coverImageSrc = []
    if(flag2 ==1 ){

        for (var i = 0; i < n; i++) {
          if(children[i].properties.filePageSections.OnSaleDate != ""){ 
            console.log("%c File","color:yellow",children[i].properties.filePageSections)
            $(".classList4").append( '<div class="back"><div class="newBlank"><div class="modelTitle">'+children[i].properties.filePageSections.FileName+
            '</div><div class="whiteBlank"><div class="yuji">预计上市日期：'+children[i].properties.filePageSections.OnSaleDate+'</div><div class="Desc"><div class="fontContent">'+
            children[i].properties.filePageSections.Summary+'</div>	</div><div class="blockborderBox"></div></div>		</div></div>');
          console.log("%c length","background:grey",children[i].properties.filePageSections.File.length)
          
    
          for(let j = 0 ;j<children[i].properties.filePageSections.File.length;j++){
            let file = children[i].properties.filePageSections.File[j].FileInfo
            mediaSrc.push(file.src)
            mediaType.push(file.fileType)
            descArr.push(children[i].properties.filePageSections.FileName)
            contArr.push(children[i].properties.filePageSections.Summary)
            updateDate.push(file.updateDate)
            fileType.push(file.fileType)
            fileLength.push(file.fileLength)
            coverImageSrc.push(file.coverImageSrc)
            
            var reg = new RegExp("%","g");
            var a = encodeURIComponent(file.src);
            var b = file.fileType;
            var c = file.fileLength;
            var d = file.updateDate;
            console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
            realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
            localMediaSrc.push(realSrc);
                console.log("本地媒体文件",localMediaSrc)
            // if($(".blockborder").length < children[i].properties.filePageSections.File.length ){
              if( children[i].properties.filePageSections.File[j].FileInfo.fileType == "pdf"){
                $(".blockborderBox").eq(i).append('<div class="blockborder"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
                '"><div class="littleTitle"><img class="pdfIcons" src="./img/pdf1-01.png"></div></div>')
              } else if ( children[i].properties.filePageSections.File[j].FileInfo.fileType == "mp4"){
                $(".blockborderBox").eq(i).append('<div class="blockborder"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
                '"><div class="littleTitle"><img class="pdfIcons" src="./img/video-01.png"></div></div>')
              }
             
            // }
          }
    
          } else {
            console.log("%c File","color:yellow",children[i].properties.filePageSections)
            $(".classList4").append( '<div class="back"><div class="newBlank"><div class="modelTitle">'+children[i].properties.filePageSections.FileName+
            '</div><div class="whiteBlank"><div class="Desc"><div class="fontContent">'+
            children[i].properties.filePageSections.Summary+'</div>	</div><div class="blockborderBox"></div></div>		</div></div>');
          console.log("%c length","background:grey",children[i].properties.filePageSections.File.length)
    
          for(let j = 0 ;j<children[i].properties.filePageSections.File.length;j++){
            let file = children[i].properties.filePageSections.File[j].FileInfo
            mediaSrc.push(file.src)
            mediaType.push(file.fileType)
            descArr.push(children[i].properties.filePageSections.FileName)
            contArr.push(children[i].properties.filePageSections.Summary)
            updateDate.push(file.updateDate)
            fileType.push(file.fileType)
            fileLength.push(file.fileLength)
            coverImageSrc.push(file.coverImageSrc)
            var reg = new RegExp("%","g");
            var a = encodeURIComponent(file.src);
            var b = file.fileType;
            var c = file.fileLength;
            var d = file.updateDate;
            console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
            realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
            localMediaSrc.push(realSrc);
            if( children[i].properties.filePageSections.File[j].FileInfo.fileType == "pdf"){
              $(".blockborderBox").eq(i).append('<div class="blockborder"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
              '"><div class="littleTitle"><img class="pdfIcons" src="./img/pdf1-01.png"></div></div>')
            } else if ( children[i].properties.filePageSections.File[j].FileInfo.fileType == "mp4"){
              $(".blockborderBox").eq(i).append('<div class="blockborder"><img src="'+children[i].properties.filePageSections.File[j].FileInfo.photocropper+
              '"><div class="littleTitle"><img class="pdfIcons" src="./img/video-01.png"></div></div>')
            }
          }
        }
                                        
        }
      }


  //       $(".classList4 p").remove();
	//       var p = $("<p class='childrenTitle3'>"+title4+"</p>");
	//       classList4.append(p);
  //       // 循环child[i].properties.jsonEditor,第四列下的目录
  //       var videoid = child[i].properties.jsonEditor.Sections;
  //       for(var j = 0; j < videoid.length; j++){
  //         // console.log("files",videoid[j])
          
  //         if (videoid[j]) {
  //           if (videoid[j].FileInfo.hasOwnProperty("coverImageSrc")) {
  //             imgSrc = videoid[j].FileInfo.coverImageSrc;
  //             localImgSrc.push(videoid[j].FileInfo.coverImageSrc)
  //             // console.log("图片",localImgSrc)
  //           } else {
  //             imgSrc = "";
  //             // console.log("预览图片不存在",imgSrc);
  //           }
  //           // console.log("有文本")
  //         } else {
  //           // console.log("没有内容,需要创建");
  //           return false;
  //         }
  //         //							console.log(child[i].properties.jsonEditor.Sections[0]);
  //         // if (classList4.find("div").length > 0) {
  //         //   classList4.find("div").remove();
  //         // }
  //         var title = videoid[j].TherapeuticAreas;
  //        titleArr.push(videoid[j].TherapeuticAreas)
  //         var p = videoid[j].ProductDescription;
  //         descArr.push(videoid[j].ProductDescription);
  //         var productName = videoid[j].ProductName;
  //         nameArr.push(videoid[j].ProductName)
  //         mediaType.push(videoid[j].FileInfo.fileType)
  //         var SaleDate = videoid[j].OnSaleDate
  //         OnSaleDate.push(videoid[j].SaleDate)

  //         // var fils
  //         // console.log(mediaType)
  //         if (videoid[j].FileInfo.src) {
  //           videoSrc = videoid[j].FileInfo.src;
  //           // console.log("媒体文件:" + videoSrc);
  //           mediaSrc.push(videoSrc)
  //           var pattern = webMediaUrl;
  //           var realSrc = videoSrc.replace(new RegExp(pattern), "");
 
  //   //视频

  //                     var a = encodeURIComponent(videoid[j].FileInfo.src);
  //                     var b = videoid[j].FileInfo.fileType;
  //                     var c = videoid[j].FileInfo.fileLength;
  //                     var d = videoid[j].FileInfo.updateDate;
                      
  //                     var reg = new RegExp("%","g");
  //                     // console.log((a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25"));
  //                     realSrc = "Media/"+ (a+"_"+b+"_"+c+"_"+d+"."+b).replace(reg,"%25");
  //                                localMediaSrc.push(localhostIIS+realSrc);
  //           // console.log("本地媒体文件",localMediaSrc)
  //         } else {
  //           // console.log("没有媒体文件");
  
  //         }
          
  //         var contentList = "";
  // // 添加第四列
  //           if(SaleDate==undefined){
  //             if(title == "" && p != "" ){
  //               // alert(1);
  //               contentList = "<div class='contentList'><div class='videoAddress'><img  class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>"+ "<h2>产品描述特点</h2>" + p + "</div>";
  //             } else if (title != "" && p == ""){
  //               // alert(2);
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div><h2>治疗领域</h2>" + title  + "</div>";
  //             } else if (title == "" && p == ""){
  //               // alert(3);
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>" + "</div>";
  //             }else if (title == undefined && p ==undefined){
  //               // alert(5);
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>" + "</div>";
  //             }else {
  //               // alert(6);
  //               // console.log(title,p);
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div><h2>治疗领域</h2>" + title + "<h2>产品描述特点</h2>" + p + "</div>";
  //               // contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               // productName +"</div>";
  //             }
  //           }else if(SaleDate==""){
  //             // console.log(title,p)
  //             if(title == "" && p != "" ){
  //               contentList = "<div class='contentList'><div class='videoAddress'><img  class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>"+ "<h2>产品描述特点</h2>" + p + "</div>";
  //             } else if (title != "" && p == ""){
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div><h2>治疗领域</h2>" + title  + "</div>";
  //             } else if (title == "" && p == ""){
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>" + "</div>";
  //             }else if (title == undefined && p ==undefined){
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div>" + "</div>";
  //             }else {
  //               contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><h1 class='FL'>" +
  //               productName + "</h1></div></div><h2>治疗领域</h2>" + title + "<h2>产品描述特点</h2>" + p + "</div>";
  //             }
  //           }else{
  //                 // console.log("777",contentList)
  //           if(title == "" && p != "" ){
  //             contentList = "<div class='contentList'><div class='videoAddress'><img  class='FL' src=" + imgSrc + "><div class='FR'><div class='FL yuji'>预计上市日期：<span class='upDay'>"+SaleDate +"</span></div><h1 class='FL'>" +
  //             productName + "</h1></div></div>"+ "<h2>产品描述特点</h2>" + p + "</div>";
  //           } else if (title != "" && p == ""){
  //             contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><div class='FL yuji'>预计上市日期：<span class='upDay'>"+SaleDate +"</span></div><h1 class='FL'>" +
  //             productName + "</h1></div></div><h2>治疗领域</h2>" + title  + "</div>";
  //           } else if (title == "" && p == ""){
  //             contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><div class='FL yuji'>预计上市日期：<span class='upDay'>"+SaleDate +"</span></div><h1 class='FL'>" +
  //             productName + "</h1></div></div>" + "</div>";
  //           }else {
  //             contentList = "<div class='contentList'><div class='videoAddress'><img class='FL' src=" + imgSrc + "><div class='FR'><div class='FL yuji'>预计上市日期：<span class='upDay'>"+SaleDate +"</span></div><h1 class='FL'>" +
  //             productName + "</h1></div></div><h2>治疗领域</h2>" + title + "<h2>产品描述特点</h2>" + p + "</div>";
  //           }
  //           }
  //         classList4.append(contentList);
          
        // }
       
        
      // }
    // }
  // })
}
//更新目录
function update() {

  ajax();

  if (!window.localStorage) {
    return false;
  } else {
    var storage = window.localStorage;
    var dataStorage = storage.getItem("dataStorage");
    var data = JSON.parse(dataStorage);
    console.log(data);
    localImgSrc = [];
    localMediaSrc =[]
    mediaType =[];
  }

}



// 下载文件
function post() {
  $("#download").click(function(){
  	// $("body").css("pointer-events","none");
    var storage = window.localStorage;
    var dataStorage = storage.getItem("dataStorage");
    var data = JSON.parse(dataStorage);
    console.log(data);
    filelist = [] 
    // 循环三次遍历出文件目录
    for(var i=0;i<data.length;i++){
      // console.log(data[i],"data[i]");
      var dataChild = data[i].children;
      for(var j=0;j<dataChild.length;j++){
        // console.log(dataChild[j]);
        if(dataChild[j].name=="Screen Saver"){
          var VideoChild=dataChild[j].properties.screenSaverSections.ScreenSaverVideo
            for(var n=0;n<VideoChild.length;n++){
            filelist.push(
              {
                "fileType":VideoChild[n].ScreenSaverFileInfo.fileType,
                "updateDate":VideoChild[n].ScreenSaverFileInfo.updateDate,
                "fileLength":VideoChild[n].ScreenSaverFileInfo.fileLength,
                "srcUrl":VideoChild[n].ScreenSaverFileInfo.src,
              }
            )
            }
        }else{
          if(dataChild[j].children!=undefined){
            // console.log("????!!!!!",dataChild[j])
            var mostChild=dataChild[j].children;
            for(var x=0;x<mostChild.length;x++){
              console.log(mostChild[x],"mostChild")
              var lostChild = mostChild[x].properties.filePageSections.File;
                for(var m=0;m<lostChild.length;m++){
                  filelist.push(
                    {
                      "fileType":lostChild[m].FileInfo.fileType,
                      "updateDate":lostChild[m].FileInfo.updateDate,
                      "fileLength":lostChild[m].FileInfo.fileLength,
                      "srcUrl":lostChild[m].FileInfo.src,
                    }
                )
              }
              
            }

          }else{
            // console.log("??????????????????????????",dataChild[j])
            if(dataChild[j].name!="LiveTest"){
              console.log(dataChild[j],"dataChild")
              var SectionsBTN = dataChild[j].properties.filePageSections.File;
              for (var l=0 ;l <SectionsBTN.length;l++){
                filelist.push(
                  {
                    "fileType":SectionsBTN[l].FileInfo.fileType,
                    "updateDate":SectionsBTN[l].FileInfo.updateDate,
                    "fileLength":SectionsBTN[l].FileInfo.fileLength,
                    "srcUrl":SectionsBTN[l].FileInfo.src,
                  }
                )
              }
            }
        }
      }
      }
    }
    function sortFilelength(a,b){
      return parseInt(a.fileLength)-parseInt(b.fileLength);
    }
    var file = {"filelist":filelist.sort(sortFilelength)};
    console.log("???",filelist);
    function obj2key(obj, keys){
      console.log("第二步")
      var n = keys.length,  
          key = [];  
      while(n--){  
          key.push(obj[keys[n]]);  
      }  
      return key.join('|');  
  } 


  function uniqeByKeys(file,keys){
    console.log("第一步")
    var arr = [];  
    var hash = {};  
    console.log("???",file,keys)
    for (var i = 0;i<file.length; i++) {
      console.log("!!!!!!!!!",file[i])
        var k = obj2key(file[i], keys);
        // console.log("k",k)
        if (!(k in hash)) {  
            hash[k] = true;  
            arr.push(file[i]);  
        }  
    }  
    return arr ;  
  } 

    var arr = uniqeByKeys(file.filelist,['srcUrl']);
    filelist=arr;
    // 文件列表filelist
    console.log("%c文件列表","background:#000;color:#fff",filelist);
    // 1、比对所有文件、删除多余以及过期文件
    //下载到显示端本地
    //首先弹出一个弹框初始化0/0
    var n=0,m=0,o=0,p=0;
    downChild(filelist,o,p);
    var schedule = $("<div class='schedule' style='position:relative'><p class='smallPM'>正在下载媒体库文件到显示端本地... <span class='number'>"+n+"</span>/"+m+"</p><p class='bigPM'>正在下载媒体库文件到控制端本地... <span class='number'>"+o+"</span>/"+p+"</p></div>");
    $("body").append(schedule);

    //bug
    console.log("%c file","color:green",file)
    $.ajax({
      type: "post",
      url: localhostIIS+"/api/filecache/GetDownloadList",
      data: file,
      success: function (res2) {
        $("body").css("pointer-events","none");
        // 2、再次比对，获取所需下载文件列表(返回前端)
        // $()
        console.log("%cres2","background:#ccc",res2);
        m = res2.Data.length;
        if(m>0){
            for (i=0;i<m;i++) {
              var listfile = [res2.Data[i]];
              var files = {"filelist":listfile};
              $.ajax({
                type: "post",
                url: localhostIIS+"/api/filecache/DownLoadOne",
                data: files,
                success: function (res3) {
                  // 3、按照下载文件列表，依次下载文件到本地,进度条
                  console.log("%cres3","background:#ccc",res3);
                  $(".smallPM").remove();
                  n++;
                  var schedule = $("<p class='smallPM' >正在下载媒体库文件到显示端本地... <span class='number'>"+n+"</span>/"+m+"</p>");
                  $(".schedule").append(schedule);
                  if(n===m){
                    $(".smallPM").remove();
                    var schedule = $("<p class='smallPM' '>显示端下载媒体资源库完成</p>");
                    $(".schedule").append(schedule);		
                  }
                  console.log(1111111111111111111111,$(".bigPM").html(),$(".smallPM").html());
                  if($(".bigPM").html()=="控制端下载媒体资源库完成"&&$(".smallPM").html()=="显示端下载媒体资源库完成"){
                    $(".schedule").remove();
                    var schedule = $("<div class='schedule' style='position:relative'><img id='close' src='img/closeImg.png'/><p class='smallPM'>显示端下载媒体资源库完成<p class='bigPM' >控制端下载媒体资源库完成 </div>");
                    $("body").append(schedule);
                    $("body").css("pointer-events","auto");
                    $('#close').on("click",function(){
                      console.log(1111);
                      $(".schedule").remove();
                      $("body").css("pointer-events","auto");
                  })
                }
                }
              });
            }
        }else{
          $("body").css("pointer-events","auto");
          $(".smallPM").remove();
          var schedule = $("<p id='upd' class='smallPM' >显示端无文件更新</p>");
          $(".schedule").append(schedule);
          downChild(filelist,o,p)
          console.log(22222222222222222222222,$(".bigPM").html(),$(".smallPM").html());
          if($(".bigPM").html()=="控制端下载媒体资源库完成"&&$(".smallPM").html()=="显示端下载媒体资源库完成"){
            $(".schedule").remove();
            var schedule = $("<div class='schedule' style='position:relative'><img id='close' src='img/closeImg.png'/><p class='smallPM'>显示端下载媒体资源库完成<p class='bigPM' >控制端下载媒体资源库完成 </div>");
            $("body").append(schedule);
            $("body").css("pointer-events","auto");
            $('#close').on("click",function(){
              console.log(1111);
              $(".schedule").remove();
              $("body").css("pointer-events","auto");
          })
        }
        }
      }
    });
  })
}
post();

function downChild(filelist,o,p){
  function sortFilelength(a,b){
    return parseInt(a.fileLength)-parseInt(b.fileLength);
  }
  var file = {"filelist":filelist.sort(sortFilelength)};
  //下载到控制端本地
  $.ajax({
    type: "post",
    url: getlocalhostIIS+"/api/filecache/GetDownloadList",
    data: file,
    success: function (modelTitleres2) {
      $("body").css("pointer-events","none");
      // 2、再次比对，获取所需下载文件列表(返回前端)
      console.log("%cres4","background:#ccc",res2);
      p = res2.Data.length;
      if(p>0){
         for (i=0;i<p;i++) {
            var listfile = [res2.Data[i]];
            var files = {"filelist":listfile};
            $.ajax({
              type: "post",
              url: getlocalhostIIS+"/api/filecache/DownLoadOne",
              data: files,
              success: function (res3) {
                console.log("%cres5","background:red",res3);
                $(".bigPM").remove();
                o++;
                var schedule = $("<p class='bigPM' >正在下载媒体库文件到控制端本地... <span class='number'>"+o+"</span>/"+p+"</p></div>");
                $(".schedule").append(schedule);
                if(o===p){
                  $(".bigPM").remove();
                  var schedule = $("<p class='bigPM' >控制端下载媒体资源库完成</p>");
                  $(".schedule").append(schedule);		
                }
                console.log(333333333333333333333333,$(".bigPM").html(),$(".smallPM").html());
                if($(".bigPM").html()=="控制端下载媒体资源库完成"&&$(".smallPM").html()=="显示端下载媒体资源库完成"){
                  $(".schedule").remove();
                  var schedule = $("<div class='schedule' style='position:relative'><img id='close' src='img/closeImg.png'/><p class='smallPM'>显示端下载媒体资源库完成<p class='bigPM' >控制端下载媒体资源库完成 </div>");
                  $("body").append(schedule);
                  $("body").css("pointer-events","auto");
                  $('#close').on("click",function(){
                    console.log(222);
                    $(".schedule").remove();
                    $("body").css("pointer-events","auto");
                 })
              }
              }
            });
          }
      }else{
        $("body").css("pointer-events","auto");
        $(".bigPM").remove();
        var schedule = $("<p id='upd' class='bigPM' >控制端无文件更新</p>");
        $(".schedule").append(schedule);
        console.log($(".bigPM").html(),$(".smallPM").html());
        if($(".bigPM").html()=="控制端无文件更新"&&$(".smallPM").html()=="显示端无文件更新"){
          console.log(444444444444444444444444444);  
          $(".schedule").remove();
            var schedule = $("<div class='schedule' style='position:relative'><img id='close' src='img/closeImg.png'/><p class='smallPM'>显示端无文件更新<p class='bigPM' '>控制端无文件更新 </div>");
            $("body").append(schedule);
            $('#close').on("click",function(){
              $(".schedule").remove();
              $("body").css("pointer-events","auto");
          })
        }
      }
    }
  }); 
}






function videoModal() {
  var _this = this;
  for(let i=0;i<mediaSrc.length;i++){
    mediaSrc[i] = mediaSrc[i].replace(new RegExp(webMediaUrl), "");
  }
  $(document).on("click", ".blockborder", function () {
    // $("#video1").currentTime = 0;

    $(".videoModel").css("pointer-events","none")
    // console.log("%c webMediaUrl","color:purple",webMediaUrl)

  //   console.log("%c mediaSrc","color:purple",mediaSrc)
  //   console.log("%c mediaType","color:purple",mediaType)
  //  console.log("%c Description","color:purple",descArr)
  //  console.log("%c contArr","color:purple",contArr)
  //  console.log("%c localMediaSrc","color:purple",localMediaSrc)
  //  console.log("%c coverImageSrc ","color:pink",coverImageSrc)

    $("#prev").attr("src","./img/GreyPrevious.png");
  $("#next").attr("src","./img/Next.png");
    // $("#controlWrap").prepend('    <div id="progressWrap"><div id="playProgress"></div></div>'); 
      // $(".videoModel .whiteBG").find("video").remove();
    console.log("%c 节点index","background:#000;color:#fff",$(".blockborder").index(this))
    var videoIndex = $(".blockborder").index(this)
    // console.log(mediaType[videoIndex])
    $(".fl").html(descArr[videoIndex])  
    if(mediaType[videoIndex] == "mp4"){

    // 显示视频弹窗
      $(".videoModel").show();
      $(".videoModel .whiteBG").prepend('	<video  id="video1" class="playTheVideo" src="" poster=""  style="   width: 873px;;height: 76%;" onended="videoEnd()"></video>')
      $("#video1").attr("src",getlocalhostIIS+ localMediaSrc[videoIndex]);
      $("#video1").attr("poster",coverImageSrc[videoIndex]);
      // $("#video1").load();
      $("#video1").currentTime = 0;
      var v = document.getElementById('video1');
      v.currentTime = 0
      // console.log($("#video1").currentTime)
      _this.openVideo();
    // 添加video
   
    nowTime.textContent = "00:00";
        funcName = "openVideo";
        args = [localMediaSrc[videoIndex],coverImageSrc[videoIndex],descArr[videoIndex],contArr[videoIndex]]
        send();
    
    }
    if(mediaType[videoIndex] == "pdf"){
    // 显示pdf弹窗
      $(".pdfCenter").append('<canvas  id="the-canvas"></canvas>')
      $(".pdfModel").show();
      pdfUrl = getlocalhostIIS+ localMediaSrc[videoIndex];

      funcName = "openPdf";
//      args= [localMediaSrc[videoIndex],localImgSrc[videoIndex],nameArr[videoIndex],titleArr[videoIndex],descArr[videoIndex]];
      args = [localMediaSrc[videoIndex],coverImageSrc[videoIndex],descArr[videoIndex],contArr[videoIndex]]

      send();
      // pdfUrl = "http://bsci1820.dwechat.com/media/1021/convey-2018%E6%96%B0%E7%89%88.pdf"
      pdfJs();

    }
    setTimeout(() => {
      $(".videoModel").css("pointer-events","auto")
    }, 200);
  })
  
}
videoModal()

function openVideo() {
  var v = document.getElementById('video1');
  // console.log(v)
  v.controls = false;
  var playBtn = document.getElementById('play_btn');
  /*播放、暂停
   * play, paused
   */
  playBtn.addEventListener("click", function () {

    // progressFlag = setInterval(getProgress(), 60);
  });

function exit(){
   // 关闭弹窗
   $(".exit").mousedown(function () {
     percent = 0;
     var nowTime = document.getElementById('now_time');
     var duration = document.getElementById('duration');
     nowTime.textContent = "00:00";
     duration.textContent = "00:00";
     console.log("关闭")
    var v = document.getElementById('video1');
    // v.currentTime = 0;
    // v.load();
    //  console.log("click")
     playProgress.style.width = "0px";
     v.pause();
     $("#video1").remove();
    $(".model").hide();

    // 去除视频
    $(".videoModel .whiteBG").find("video").remove();
 
    $(".playBig").show();
    funcName = 'close'
    send();
    getProgress()
    v.pause();

    clearInterval(timeInter)
  })
  // $("#progressWrap").remove();
}


$(document).on("onmousedown", ".pdfModel .exit", function () {
  
  v.pause();
  // console.log("click")
  $(".pdfModel").hide();
  funcName = 'close1'
  send();
  // $("#progressWrap").remove();
})
exit();

$("#pause_btn").on("click",pauseBtn());
function pauseBtn(){
    let timer=null;
    return function (){
        clearTimeout(timer);
        timer=setTimeout(function(){
            v.pause();
            // clearInterval(progressFlag);
            $(".playBig").show();
            funcName ="pauseVideo"
            send();
            console.log("暂停")
        },200);
    }
}

  // $("#pause_btn").click(function () {
 
  //   v.pause();
  //   clearInterval(progressFlag);
  //   $(".playBig").show();
  //   funcName ="pauseVideo"
  //   send();
  // });

  // 视频中播放按钮消失出现，点击视频暂停播放

  $(".playTheVideo").on("click",playTheVideos());
function playTheVideos(){
  var v = document.getElementById('video1');
    console.log("flag")
    let timer=null;
    return function (){
        clearTimeout(timer);
        
         timer=setTimeout(function(){
            if (v.paused || v.ended) {
              $(".playBig").hide();
              
              v.play();
              // progressFlag = setInterval(getProgress(), 60);
              // getProgress();
            } else {
              v.pause();
              // clearInterval(progressFlag);
              $(".playBig").show();
            
              // getProgress();
            }
        
              funcName = "playIcon";
              send();
          console.log("点击视频播放暂停")
          // $("#video1").pause()
        },200);
    }
}
  // $(".playTheVideo").unbind().click(function () {
    
  //   if (v.paused || v.ended) {
  //     $(".playBig").hide();

  //     v.play();
  //     progressFlag = setInterval(getProgress(), 60);
  //   } else {
  //     v.pause();
  //     clearInterval(progressFlag);
  //     $(".playBig").show();
    
  //     // getProgress();
  //   }
 
  //     funcName = "playIcon";
  //     send();
  

  // })

  if (v.ended) {
    $(".playBig").show();

  }
  // 视频暂停时显示播放按钮
  function videoEnd() {
    $(".playBig").show();
  }


  var nowTime = document.getElementById('now_time');
  var duration = document.getElementById('duration');
  // nowTime.textContent = "00:00";
  // duration.textContent = "00:00";

  function parseTime(time) {
    time = Math.floor(time);
    var _m, _s;
    _m = Math.floor(time / 60);
    _s = time - _m * 60;
    if (_m < 10) {
      _m = '0' + _m;
    }
    if (_s < 10) {
      _s = '0' + _s;
    }
    return _m + ':' + _s
  }

  /**进度条
   *
   */
  var progressWrap = document.getElementById("progressWrap");
  var playProgress = document.getElementById("playProgress");
  console.log("%c current","color:green",v.currentTime)
  var flagTime =true
 



  v.addEventListener('loadedmetadata', function () {
    duration.textContent = parseTime(v.duration);
  })

 

  function getProgress() {
    console.log(123)
    var v = document.getElementById('video1');
    // if ( v.paused || v.ended) {
      // if(){

      // }
     percent = v.currentTime / v.duration;
    // if(!v.currentTime){
    //   // v.pause();
    //   v.currentTime = 0;
    // }
    console.log("%c percent","color:pink",percent)
    if(duration.textContent == "00:00" || nowTime.textContent =="00:00"){
      percent=0;
    }
    playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";

  // }
  }

  $(".exit").click(function(){
    console.log("1111")
    playProgress.style.width = "0px";
  })
  // 鼠标在播放条上点击时进行捕获并进行处理
  function videoSeek(e) {

 
  }

  function enhanceVideoSeek(e) {

  }
  $("#progressWrap").unbind().on("click",jindutiao());
  function jindutiao(){
    let timer=null;
    return function (e){
      $(".videoModel").css("pointer-events","none")
        clearTimeout(timer);
         timer=setTimeout(function(){
          console.log( $("#progressWrap").length);
          // clearInterval(progressFlag);
          console.log('jump');
          videoSeek(e);
          console.log("document.body.clientWidth",document.body.clientWidth, e.pageX, progressWrap.offsetLeft)
          var length = e.pageX - (document.body.clientWidth - 1000) / 2 - progressWrap.offsetLeft;
          console.log("%clength","background:#ccc",length)
          var percent = length / progressWrap.offsetWidth;
          // if (v.paused || v.ended  ) {
          //   $(".playBig").hide();
          //   v.play();
          //   progressFlag = setInterval(getProgress(), 60);
          getProgress()
          // }
          console.log("%ctextContent","background:#ccc",duration.textContent,  nowTime.textContent)
          if( duration.textContent =="00:00"){
            percent=0;
          }
          console.log("percent",percent)
          playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";
          v.currentTime = percent * v.duration;
          // progressFlag = setInterval(getProgress(), 10);
          funcName = "jump";
          args =[percent]
           send();
       
        },200);
    }
}

//  $("#progressWrap").unbind().click(function (e) {
//   // $("#progressWrap").one('keyup',function(e){
//         console.log( $("#progressWrap").length);
//         clearInterval(progressFlag);
//         console.log('jump');
//         videoSeek(e);
//         console.log("document.body.clientWidth",document.body.clientWidth, e.pageX, progressWrap.offsetLeft)
//         var length = e.pageX - (document.body.clientWidth - 1000) / 2 - progressWrap.offsetLeft;
//         console.log("%clength","background:#ccc",length)
//         var percent = length / progressWrap.offsetWidth;
//         // if (v.paused || v.ended  ) {
//         //   $(".playBig").hide();
//         //   v.play();
//         //   progressFlag = setInterval(getProgress(), 60);
        
//         // }
//         console.log("%ctextContent","background:#ccc",duration.textContent,  nowTime.textContent)
//         if( duration.textContent =="00:00"){
//           percent=0;
//         }
//         console.log("percent",percent)
//         playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";
//         v.currentTime = percent * v.duration;
//         progressFlag = setInterval(getProgress(), 60);
//         funcName = "jump";
//         args =[percent]
    
//           send();
     
//         // if(duration.textContent !="00:00"){

//         //   }
//         // }
//       })
  

  /**加载状态
  /*
  */
  // var loadState = document.getElementById('load_state');

  // v.addEventListener('loadstart', function(){
  //   loadState.textContent = '视频加载中。。。';
  // })

  // v.addEventListener('loadeddata', function(){
  //   loadState.textContent = '加载完毕。';
  // })

  // v.addEventListener('error', function(){
  //   loadState.textContent = '加载失败。';
  // })

  


// 添加video
// $(document).on("click", ".videoAddress", function () {
//   send();
// })

// 点击控制播放


}
$("#play_btn").on("click",checkEmail());
function checkEmail(){

    let timer=null;
    return function (){
        clearTimeout(timer);
         timer=setTimeout(function(){
            funcName = "playVideo"
            send();
            console.log('执行检查');
            var v = document.getElementById('video1');
            if (v.paused || v.ended) {
              $(".playBig").hide();
              v.play();
              console.log("no bug")
            }
             else {
              console.log("playing")
            }
        },200);
    }
}

$(document).ready(function(){
  console.log($(".ulTopLeft li").length)
  $(".ulTopLeft li").eq(0).css("display","none");
})

$(document).on("click",".ulTopLeft li",function(){
$('.classList4').scrollTop(0);
})




// setInterval(function(){
// console.log($("#the-canvas").style.height)
// },1000)


// PDFJS.getDocument({ url: pdfUrl }, false, null, function(progress) {
// 	var percent_loaded = (progress.loaded/progress.total)*100;
// }).then(function(pdf_doc) {
//   // success
//   console.log("success")
// }).catch(function(error) {
// 	// error
// });
  // $(".blockborder").click(function () {
  //   clearInterval(timeInter)
  // })
   

   // setInterval(function(){
    // v.addEventListener('timeupdate', function () {
      setInterval(function(){
        // if(v.currentTime != 0 ){
  
        $(".videoModel").css("pointer-events","auto")
        // setInterval(function(){
          var v = document.getElementById('video1');
          nowTime.textContent = parseTime(v.currentTime);
          getProgress();
        
        // },1000)
        // percent = 0
   
        // playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";
        if(v.played){
          // console.log("played")
        }
    
        if (v.paused || v.ended) {
          // console.log(33)
          // v.currentTime = v.currentTime;
          // if(flagTime =true) {
          //   flagTime = false;
          //   nowTime.textContent = parseTime(v.currentTime);
          // }
        
        } else {
          // console.log(44)
          // v.currentTime = v.currentTime
         
        }
      // }
      },1000)
   
    // },1000) 
     function parseTime(time) {
    time = Math.floor(time);
    var _m, _s;
    _m = Math.floor(time / 60);
    _s = time - _m * 60;
    if (_m < 10) {
      _m = '0' + _m;
    }
    if (_s < 10) {
      _s = '0' + _s;
    }
    return _m + ':' + _s
  }


  function getProgress() {
    console.log(123)
    var v = document.getElementById('video1');
    // if ( v.paused || v.ended) {
      // if(){

      // }
     percent = v.currentTime / v.duration;
    // if(!v.currentTime){
    //   // v.pause();
    //   v.currentTime = 0;
    // }
    console.log("%c percent","color:pink",percent)
    if(duration.textContent == "00:00" || nowTime.textContent =="00:00"){
      percent=0;
    }
    playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";

  // }
  }