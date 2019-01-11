var signalrClient = null;
var getlocalhostIIS = 'http://192.168.1.133/';//大屏端
// pdf
var pdfJs =  function (){

    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    var url =pdfUrl;
    // var url = "http://bsci1820.dwechat.com/media/1021/convey-2018%E6%96%B0%E7%89%88.pdf";
    // console.log("url",url)
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = './js/pdf.worker.js';
    
    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 3,
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
    var  onPrevPage =function() {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);
    
    /**
     * Displays next page.
     */
    var onNextPage =function () {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);
    
    /**
     * Asynchronously downloads PDF.
     */
    pdfjsLib.getDocument(url).then(function(pdfDoc_) {
      rangeChunkSize =  65536;
      pdfDoc = pdfDoc_;
      document.getElementById('page_count').textContent = pdfDoc.numPages;
    
      // Initial/first page rendering
      renderPage(pageNum);
    });
    }

    $(document).ready(function () {
      // var video1 = document.getElementById("video");
      // console.log(video1,"video1video1video1")
      // video1.play();
      PBtime();
    })

    function PBtime(){
      $("#video").show();
     
      funcName ="pingbao"
      // send();
      var screenlist=[];
      var localMediaScreen=[];
      var storage = window.localStorage;
      // console.log("????!!!!???",storage)
      var dataStorage = storage.getItem("dataStorage");
      var data = JSON.parse(dataStorage);
      // console.log("data",data)
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
      // console.log(screenlist);
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
      // console.log("本地媒体文件",localMediaScreen)
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


// 打开视频
var openVideo = function (args) {
  $(".playBig").show();
  var video1 = document.getElementById("video");
  // console.log(video1,"video1video1video1")
  $("#video").hide();
  video1.pause()
    $(".bigVideo").show();
    $(".bigPdf").hide()
    args =JSON.parse(args)
    // console.log(args)
    if($("#bigvideo").length >0){
        $("#bigvideo").remove();
    }   
    $(".bigVideo").append('<video  id="bigvideo"  src= "' +getlocalhostIIS+ args[0] + '" poster="' + args[1] + '"  style="   width: 100%;;height: 100%;" onended="videoEnd()"></video>');
    $(".videoTitle").html(args[2])
    $(".titleArr").html(args[3])
    // console.log(args[3].replace("/<\/?.+?\/?>/g",''))
    $(".newContent").text(args[3].replace(/<\/?.+?\/?>/g,''))
    var v = document.getElementById('bigvideo');
    v.controls = false;
    $(".videoDesc").show();
// $(".opaticyno").show();
// $(".opaticyno1").show();
// $(".opaticyno2").show();

// console.log("title desc",$(".titleArr").text(),$(".descArr").text())
// if($(".titleArr").text() == "" && $(".descArr").text() != ""){
// $(".opaticyno").hide();
// $(".opaticyno1").hide();
// } else if ($(".descArr").text() == "" &&  $(".titleArr").text() != ""){
// $(".opaticyno1").hide();
// $(".opaticyno2").hide();
// } else if ($(".descArr").text() == "" && $(".titleArr").text() == ""){
// $(".videoDesc").hide();
// } else {
//   $(".videoDesc").show();
// $(".opaticyno").show();
// $(".opaticyno1").show();
// $(".opaticyno2").show();
// }
}
// 播放视频
var playVideo = function (args) {
    var v = document.getElementById('bigvideo');
    v.play();
    $(".playBig").hide();
}
// 暂停视频
var pauseVideo = function (args) {
    var v = document.getElementById('bigvideo');
    v.pause();
    $(".playBig").show();
}
// 大播放按钮
var playIcon = function (args) {
    var v = document.getElementById('bigvideo');

        if (v.paused || v.ended) {
          $(".playBig").hide();
    
          v.play();
        } else {
    
          $(".playBig").show();
          v.pause();
        }
    
  
  }
// 跳转
  var jump = function (args) {
    args =JSON.parse(args)
    var v = document.getElementById('bigvideo');
    // if (v.paused || v.ended) {
    //     $(".playBig").hide();
    //     v.play();
    //   }
      // console.log(args)
    //   enhanceVideoSeek(e);
    v.currentTime = args[0] * v.duration;
}


var openPdf = function (args) { 

  var video1 = document.getElementById("video");
  // console.log(video1,"video1video1video1")
  $("#video").hide();
  video1.pause();
    $(".pdfTitle").show();
    $(".bigPdf").show()
    $(".bigVideo").hide()
    args =JSON.parse(args)
    // console.log(args)
    pdfUrl =getlocalhostIIS+args[0];
    if($("#the-canvas").length >0){
        $("#the-canvas").remove();
    }  
    $(".bigPdf").append('<canvas  id="the-canvas"></canvas>')
    pdfJs();

    $(".pdfTitle").html(args[2])
}

var live = function (args) { 
  var video1 = document.getElementById("video");
  // console.log(video1,"video1video1video1")
  $("#video").hide();
  video1.pause();
  $(".iframe").show();
  args =JSON.parse(args)
  $("iframe").attr("src",args);
  $(".bigPdf").hide();
  $(".bigVideo").hide();
}
var pingbao= function (args) { 
    // var video1 = document.getElementById("video");
    // console.log(video1,"video1video1video1")
    // $("#video").show();
    // video1.play();
}
var pingbaohide = function (args) { 
    var video1 = document.getElementById("video");
    $("#video").hide();
    video1.pause();
}
// var sleep = function (args) { 
//     var video1 = document.getElementById("video");
//     console.log(video1,"video1video1video1")
//     $("#video").show();
//     video1.play();
// }
var close = function (args) { 
  // console.log("close")
  $("#video").show();

    $(".bigPdf").hide();
    $(".bigVideo").hide();
    $(".iframe").hide();
    var video2 = document.getElementById("bigvideo");
    var video1 = document.getElementById("video");
    video1.play()
    video2.pause();

    // console.log(video1,"video1video1video1")

}
var close1 = function (args) { 
  // console.log("close")
  $("#video").show();

    $(".bigPdf").hide();
    $(".bigVideo").hide();
    $(".iframe").hide();
    var video2 = document.getElementById("bigvideo");
    var video1 = document.getElementById("video");
    video1.play()
    video2.pause();

    // console.log(video1,"video1video1video1")

}

var onPrevPage = function (args) { 
  $("#prev").click();
}
var onNextPage = function (args) { 
  $("#next").click();
}


// function enhanceVideoSeek(e) {
//     console.log(document.body.clientWidth, e.pageX, progressWrap.offsetLeft)
//     var length = e.pageX - (document.body.clientWidth - 1000) / 2 - progressWrap.offsetLeft;
//     var percent = length / progressWrap.offsetWidth;
//     playProgress.style.width = percent * (progressWrap.offsetWidth) + "px";
//     v.currentTime = percent * v.duration;
//   }

// function htmlEncode(value) {
//     var encodedValue = $('<div />').text(value).html();
//     return encodedValue;
// }
$(document).ready(function () {
    var createTime = new Date();

    signalrClient = new _RealTimeFunctionServiceClient('aaaa');

    signalrClient.registerFunctionToServer('playVideo', playVideo);
    signalrClient.registerFunctionToServer('openVideo', openVideo);
    signalrClient.registerFunctionToServer('playIcon', playIcon);
    signalrClient.registerFunctionToServer('pauseVideo', pauseVideo);
    signalrClient.registerFunctionToServer('jump', jump);
    signalrClient.registerFunctionToServer('openPdf', openPdf);
    signalrClient.registerFunctionToServer('onPrevPage', onPrevPage);
    signalrClient.registerFunctionToServer('onNextPage', onNextPage);
    signalrClient.registerFunctionToServer('pingbao', pingbao);
    signalrClient.registerFunctionToServer('pingbaohide', pingbaohide);
    // signalrClient.registerFunctionToServer('sleep', sleep);
    signalrClient.registerFunctionToServer('close', close);
    signalrClient.registerFunctionToServer('close1', close1);
    signalrClient.registerFunctionToServer('live', live);
    signalrClient.start(function () {
        // console.log(".......", signalrClient);
        //funcB(args);
    })

});




  