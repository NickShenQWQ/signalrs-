


// 连接对象构造函数

function _RealTimeFunctionServiceClient(channelName) {
    var INIT_CALL_URL = "/signalr/hubs";
    var _this = this;

    this._functionsToRegisterOnServer = [];

    // 需要在ready之前调用
    // fn = {funcName:"abc",func:function(){}}
    this.registerFunctionToServer = function (funcName, func) {
        _this._functionsToRegisterOnServer.push({ funcName: funcName, func: func });
    }

    this.start = function (callback) {

        $.when(AjaxFile(INIT_CALL_URL, 'script')).then(function () {
            //连接
            _this._connection = getConnection('RealTimeFunction');


            _this.invokeServerFunction = function (funcName, args) {
                return getServerFunctionByFuncName(_this._connection, "invokeServerFunction")(funcName, args);
            };

            _this.invokeServerFunctionByChannel = function (_channelName, funcName, args) {

                return getServerFunctionByFuncName(_this._connection, "invokeServerFunctionByChannel")(_channelName, funcName, args);
            }

            //_this.invoke = _this.invokeServerFunction;



            // 注册方法到服务器
            for (var i = 0; i < _this._functionsToRegisterOnServer.length; i++) {
                registerFunctionToServer(_this._connection, _this._functionsToRegisterOnServer[i].funcName, _this._functionsToRegisterOnServer[i].func);
            }

            console.log("SingalrClient: start!");
            $.connection.hub.start()
                .fail(function (res) {
                    console.log("SingalrClient: Connection start failed!", res);
                })
                .done(function (res) {
                    //连接成功
                    console.log("SingalrClient: Connection established!");

                    if (channelName)
                        getServerFunctionByFuncName(_this._connection, "assignChannel")(channelName);

                    //注册后执行后调
                    if (callback) { callback(); }
                });
        });
    }

    return this;


}





// #region 工具方法

function getFunctionName(func, notNameIsThrow) {
    var res = null;

    if (is.not.null(func))
        res = func.name || func.toString().match(/function\s*([^(]*)\(/)[1] || null;

    if (!res && notNameIsThrow)
        throw { "functionObject": func, "msg": "获取function名称失败" };

    return res;
}

function getObjectInFunctionNames(obj) {
    var funcs = [];
    if (obj) {
        for (var funcName in obj) {
            funcs.push(is.function(obj[funcName]) ? funcName : []);
        }
    }

    return funcs;
}

function getObjectInFunctions(obj) {
    var funcs = [];
    if (obj) {
        for (var funcName in obj) {
            var fun = obj[funcName];
            if (is.function(fun))
                funcs.push({ "name": funcName, "function": fun });
        }
    }

    return funcs;
}

function getArrayObjectInFunctions(objs) {
    var funcs = [];
    if (objs) {
        for (var i = 0; i < objs.length; i++) {
            var item = objs[i];

            var res = is.function(item) ? [{ "name": getFunctionName(item, true), "function": item }]
                : is.object(item) ? getObjectInFunctions(item) : [];
            Array.prototype.push.apply(funcs, res);
        }
    }

    return funcs;
}

function log() {
    if (this.debug) {
        if (!console || !console.log) return;

        console.log(arguments);
    }
}

// #endregion

//根据连接对象名称与服务器进行连接
function getConnection(connectionName) {
    console.log("进入connection");
    return $.connection[connectionName];
}

//注册方法到服务器
function registerFunctionToServer(conn, funcName, func) {
    if (conn && funcName && is.function(func)) {
        conn.client[funcName] = func;
    }
}

//注册方法到服务器
function registerFunctionToServerByFunc(conn, func) {
    if (conn && func) {
        var regFuns = is.function(func) ? [{ "name": getFunctionName(func, true), "function": func }] :
            is.array(func) ? getArrayObjectInFunctions(func) :
                is.object(func) ? getObjectInFunctions(func) : [];

        for (var i = 0; i < regFuns.length; i++) {
            var funcInfo = regFuns[i];
            if (funcInfo.name)
                registerFunctionToServer(conn, funcInfo.name, funcInfo.function);
            else
                throw "registerFunctionToServerByFunc:没有获取到参数func的方法名";
        }
    }
}

//获取服务器的方法
function getServerFunctionNames(conn) {
    var res = (conn && conn.server) ? getObjectInFunctionNames(conn.server) : [];
    return res;
}

//获取服务器的方法
function getServerFunction(conn) {
    var res = (conn && conn.server) ? getObjectInFunctions(conn.server) : [];

    return res;
}

//根据方法名称获取服务器的方法
function getServerFunctionByFuncName(conn, funcName) {
    if (!conn || !funcName)
        return function () { };
    var func = conn.server[funcName];
    if (is.function(func))
        return func;
    return function () { };
}

function getClientFunction(conn) {
    var res = (conn && conn.client) ? getObjectInFunctions(conn.client) : [];

    return res;
}

function getClientFunctionNames(conn) {
    var res = (conn && conn.client) ? getObjectInFunctionNames(conn.client) : [];
    return res;
}

// helpers


// Helpers

function AjaxFile(url, dataType, callback) {
    var call = jQuery.ajax({
        url: url,
        dataType: dataType,
        //success: function(){callback();},
        async: true
    });
    call.done(function (data, textStatus, jqXHR) {
        //appLog(url + " loaded. Code "+jqXHR.status);
    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    });
    return call;
}






