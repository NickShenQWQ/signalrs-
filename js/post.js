

// function sendClient() {
//     var funcName = "funcName";
//     userName = $("#userName").val();
//     userPhone = $("#userPhone").val();
//     userMessage = $("#userMessage").val();
//     channel = "aaaa";
//     args = [userName, userPhone, userMessage, createTime];
//     console.log(args);
//     signalrClient.start(function () {
//         if (channel != null) {
//                 signalrClient.invokeServerFunctionByChannel(channel, funcName, args).done(function (e) {
//                 console.log("获取Server方法成功,当前funcName:" + funcName + "-当前Channel:" + channel);
//                 console.log(JSON.parse(e));
//             }).fail(function (r) {
//                 console.log("获取Server方法失败!");
//             });
//         } else {
//             signalrClient.invokeServerFunction(funcName, args).done(function (e) {
//                 console.log("获取Server方法成功,当前funcName:" + funcName);
//                 console.log(JSON.parse(e));
//                 args = new Array(e);
//                 console.log(args);
//             }).fail(function (r) {
//                 console.log("获取Server方法失败!");
//             });
//         }
//     });

// }


// var userName;
// var userPhone;
// var userMessage;
// var channel;
// var createTime = new Date();
// var args;
// var signalrClient = new _RealTimeFunctionServiceClient();
// // 点击控制播放
// function playVideo(){
//     $("#play_btn").click(function (e) { 
//         var funcName = "playVideo";
//         args = [createTime];
//         channel = "aaaa";
//         signalrClient.start(function () {
//             if (channel != null) {
//                     signalrClient.invokeServerFunctionByChannel(channel, funcName, args).done(function (e) {
//                     console.log("获取Server方法成功,当前funcName:" + funcName + "-当前Channel:" + channel);
//                     console.log(JSON.parse(e));
//                 }).fail(function (r) {
//                     console.log("获取Server方法失败!");
//                 });
//             } else {
//                 signalrClient.invokeServerFunction(funcName, args).done(function (e) {
//                     console.log("获取Server方法成功,当前funcName:" + funcName);
//                     console.log(JSON.parse(e));
//                     args = new Array(e);
//                     console.log(args);
//                 }).fail(function (r) {
//                     console.log("获取Server方法失败!");
//                 });
//             }
//         });
//     });
// }
// playVideo();
