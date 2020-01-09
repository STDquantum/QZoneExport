streamSaver.mitm = 'https://github.lvshuncai.com/StreamSaver.js/mitm.html'

/**
 * 下载任务
 */
class DownloadTask {

    /**
     * 
     * @param {string} dir 下载目录
     * @param {string} type 文件名，包含后缀
     * @param {string} tip 文件地址
     */
    constructor(dir, name, url) {
        this.dir = dir
        this.name = name
        this.url = url
    }

}

/**
 * 下载信息
 */
class DownloadInfo {

    /**
     * 
     * @param {string} dir 下载目录
     * @param {DownloadTask} tasks 任务
     * @param {string} tip 文件地址
     */
    constructor(taskGroupName, tasks) {
        this.taskGroupName = taskGroupName
        this.tasks = tasks || []
    }

    /**
    * 添加下载任务
    * @param {DownloadTask} task 任务
    */
    addTask(task) {
        this.tasks.push(task);
    }

    /**
     * 删除指定索引任务
     * @param {integer} index 数组索引
     */
    delTask(index) {
        this.tasks.splice(index, 1);
    }

    /**
     * 根据下载链接删除任务
     * @param {string} url 下载链接
     */
    removeTask(url) {
        this.tasks.remove(url, 'url')
    }
}

/**
 * 备份进度
 */
class StatusIndicator {

    /**
     * 
     * @param {string} id dom的id
     * @param {string} type 导出类型
     * @param {string} tip 提示信息
     */
    constructor(id, type, tip) {
        this.id = id
        this.type = type
        this.tip = tip
        this.total = 0
        this.pageIndex = 0
        this.pageSize = 0
        this.downloaded = 0
        this.downloading = 0
        this.downloadFailed = 0
        this.data = {
            success: [],
            failed: []
        }
    }

    /**
     * 添加数据
     * @param {string} dataType 数据类型
     * @param {string} data 数据
     */
    addData(dataType, data) {
        if (typeof data === 'object') {
            this.data[dataType].push(data)
        } else if (typeof data === 'arrat') {

            this.data[dataType] = this.data[dataType].concat(data)
        }
    }

    /**
     * 获取数据
     */
    getData(dataType) {
        return this.data[dataType] || []
    }


    /**
     * 输出提示信息
     * @param {object} params 格式化参数
     */
    print(params) {
        let $tip_dom = $("#" + this.id);
        $tip_dom.show();
        $tip_dom.html(tip.format(params));
    }

    /**
     * 完成
     * @param {object} params 格式化参数
     */
    complete(params) {
        let $tip_dom = $("#" + this.id);
        $tip_dom.show();
        $tip_dom.html(tip.format(params).replace('请稍后', '已完成'));
    }

    /**
     * 下载
     */
    download() {
        this.downloading++
    }

    /**
     * 下载失败
     */
    failed(item) {
        this.downloadFailed++
        this.addData('failed', item)
    }

    /**
     * 下载成功
     */
    success(item) {
        this.downloaded++
        this.addData('success', item)
    }

    /**
     * 设置总数
     * @param {integer} total
     */
    set total(total) {
        this.total = total;
    }
}

/**
 * 提示信息
 */
const MAX_MSG = {
    Blogs: '正在获取日志，已获取 <span style="color: #1ca5fc;">{0}</span> 篇，总共 <span style="color: #1ca5fc;">{1}</span> 篇，已导出 <span style="color: #1ca5fc;">{2}</span> 篇，请稍后...',
    Blogs_Comments: '正在获取第 <span style="color: #1ca5fc;">{0}</span> 篇日志的评论，已获取 <span style="color: #1ca5fc;">{1}</span> 条，已失败 <span style="color: red">{2}</span> 条，总共 <span style="color: #1ca5fc;">{3}</span> 条，请稍后...',
    Diaries: '正在获取私密日记，已获取 <span style="color: #1ca5fc;">{0}</span> 篇，总共 <span style="color: #1ca5fc;">{1}</span> 篇，已导出 <span style="color: #1ca5fc;">{2}</span> 篇，请稍后...',
    Messages: '正在获取说说，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Messages_Comments: '正在获取第 <span style="color: #1ca5fc;">{0}</span> 页的第 <span style="color: #1ca5fc;">{1}</span> 条说说的评论，已获取 <span style="color: #1ca5fc;">{2}</span> 条，已失败 <span style="color: red">{3}</span> 条，总共 <span style="color: #1ca5fc;">{4}</span> 条，请稍后...',
    Friends: '正在获取QQ好友，已获取好友 <span style="color: #1ca5fc;">{0}</span> 个，总共 <span style="color: #1ca5fc;">{1}</span> 个，已导出 <span style="color: #1ca5fc;">{2}</span> 个，请稍后...',
    Boards: '正在获取留言板，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Photos: '正在获取相册，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Videos: '正在获取视频，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Images: '正在下载图片，已下载 <span style="color: #1ca5fc;">{0}</span> 张图片，已失败 <span style="color: red;"> {1} </span> 张图片...',
}

const MODAL_HTML = `
    <div class="modal fade" id="exampleModalCenter" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">QQ空间备份</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h3 id="backupStatus">正在导出备份，请不要关闭或刷新当前页面和打开新的QQ空间页面。</h3>
                <hr/>
                <div class="container">                    
                    <p id="exportBlogs" style="display: none;margin-bottom: 3px;" >正在获取日志，请稍后...</p>
                    <p id="exportBlogs_Comments" style="display: none;margin-bottom: 3px;" >正在获取日志评论，请稍后...</p>
                    <p id="exportDiaries" style="display: none;margin-bottom: 3px;" >正在获取私密日记，请稍后...</p>
                    <p id="exportMessages" style="display: none;margin-bottom: 3px;" >正在获取说说，请稍后...</p>
                    <p id="exportMessages_Comments" style="display: none;margin-bottom: 3px;" >正在获取说说评论，请稍后...</p>
                    <p id="exportFriends" style="display: none;margin-bottom: 3px;" >正在获取QQ好友信息，请稍后...</p>
                    <p id="exportBoards" style="display: none;margin-bottom: 3px;" >正在获取留言板，请稍后...</p>
                    <p id="exportPhotos" style="display: none;margin-bottom: 3px;" >正在获取相册，请稍后...</p>
                    <p id="exportVideos" style="display: none;margin-bottom: 3px;" >正在获取视频，请稍后...</p>
                    <p id="exportImages">正在下载图片，已下载 <span style="color: #1ca5fc;"> 0 </span> 张图片，已失败 <span style="color: red;"> 0 </span> 张图片...</p>
                </div>
                <br/>
                <div id="progress" class="progress" style="display: none;">
                    <div id="progressbar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">已下载 0%</div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="showFailedImages" type="button" class="btn btn-danger" style="display: none;" data-toggle="modal" data-target="#modalTable">详情</button>
                <button id="downloadBtn" type="button" class="btn btn-primary" style="display: none;" >下载</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            </div>
            </div>
        </div>
    </div>
    <div id="modalTable" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">下载失败的列表</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <table id="table"></table>
        </div>
        <div class="modal-footer">
            <button id="againDownload" type="button" class="btn btn-primary" data-dismiss="modal">重试</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
        </div>
        </div>
    </div>
    </div>
`

const README_TEXT = `
# QQ空间导出助手

> QQ空间导出助手，用于备份日志、私密日志、说说、相册、留言板、QQ好友、视频为文件，供永久保存。

## 简介

落叶随风，青春，稍纵即逝，QQ空间，一个承载了很多人的青春的地方。

然而，新浪博客相册宣布停止运营，网易相册关闭，QQ账号支持注销等等，无不意味着，互联网产品都有着自己的生命周期，但生命周期到了尽头，记录着我们的青春的数据怎么办？

数据，还是掌握到自己手里的好，QQ空间导出助手的谷歌扩展，可以导出备份QQ空间的日志、私密日志、说说、相册、留言板、QQ好友、视频为文件，供永久保存。

## 安装
#### 源码安装
- 下载源码
- 打开[扩展中心](chrome://extensions/)
- 勾选开发者模式
- 点击[加载已解压的扩展程序]按钮
- 选择QZoneExport/src文件夹

#### 在线安装
- [Chrome浏览器](https://chrome.google.com/webstore/detail/aofadimegphfgllgjblddapiaojbglhf)

- [360极速浏览器](https://ext.chrome.360.cn/webstore/detail/dboplopmhoafmbcbmcecapkmcodhcegh)

- [360安全浏览器](https://ext.se.360.cn/webstore/detail/dboplopmhoafmbcbmcecapkmcodhcegh)

## 使用
- 登录QQ空间
- 右上角点击插件图标
 ![](https://i.loli.net/2019/08/11/wpmyPEzFVvBSKra.png)
- 勾选备份内容
- 点击开始备份
- 等待备份完成
- 点击下载备份
![](https://i.loli.net/2019/08/11/EyKZkBcPxgmsqUu.png)
- 等待下载完成
![](https://i.loli.net/2019/08/11/heysLFv2GJAW4kD.png)
- 推荐使用 [Atom](https://atom.io/) Markdown编辑器查看.md备份内容
- 备份目录结构如下
└─QQ空间备份
│  说明.md
├─好友
│      QQ好友.xlsx
├─日志
│  ├─images
│  │      图片名称
│  ├─日志分类
│  │      【日志标题】.md
├─留言板
│      【年份】.md
├─相册
│  ├─相册分类
│  │  ├─相册名称
│  │  │      相片名称
├─私密日记
│  │  【日志标题】.md
│  └─images
│          图片名称
├─视频
│      视频链接.downlist
└─说说
│  【年份】.md
└─images
图片名称

## 注意事项
- 视频导出是导出视频下载链接，链接存在有效期请及时下载。
- 如果存在图片下载失败，一般为Chrome不信任安全证书导致，建议访问链接信任后重新下载。
- 导出他人QQ空间内容时，无法导出私密日志和QQ好友。
- 相册导出的原图为高清原图，不包含Exif信息的。

## 已知问题
- 数据量大小达到4G的时候无法导出，会导致浏览器崩溃。

## 内容预览
![](https://i.loli.net/2019/08/11/U8AJlwxEsHeWrBm.png)



## 配置
- 右键点击插件图标
- 弹出菜单选择【选项】  
- 配置页面可配置备份方式和选项
![](https://i.loli.net/2019/08/11/lDvAcmCuXwbksR8.png)
- 推荐使用默认配置，遇到QQ冻结时，可调整查询间隔
- 无法更改的配置表示尚未支持
- 配置项的值存在最大值的限制，目前尚未加上校验


## TO-DO
- [x] 普通日志导出
- [x] 私密日记导出
- [x] 普通说说导出
- [x] QQ好友导出
- [x] 普通相册导出
- [x] 留言板导出
- [x] 优化插件UI
- [x] 原图相册导出
- [x] 视频导出
- [ ] 支持导出指定相册
- [ ] 支持导出Exif原图
- [ ] 支持JSON导出
- [ ] 支持RTF导出

`

/**
 * 操作类型
 */
const OperatorType = {
    /**
     * 初始化
     */
    INIT: 'INIT',
    /**
     * 显示弹窗
     */
    SHOW: 'SHOW',

    /**
     * 等待日志图片下载完成
     */
    AWAIT_IMAGES: 'AWAIT_IMAGES',

    /**
     * 获取日志所有列表
     */
    BLOG_LIST: 'BLOG_LIST',

    /**
     * 获取私密日记所有列表
     */
    DIARY_LIST: 'DIARY_LIST',

    /**
     * 获取所有说说列表
     */
    MESSAGES_LIST: 'MESSAGES_LIST',

    /**
    * 获取好友列表
    */
    FRIEND_LIST: 'FRIEND_LIST',

    /**
    * 获取留言板列表
    */
    BOARD_LIST: 'BOARD_LIST',

    /**
    * 获取相册照片
    */
    PHOTO_LIST: 'PHOTO_LIST',

    /**
    * 获取视频列表
    */
    VIDEO_LIST: 'VIDEO_LIST',

    /**
     * 压缩
     */
    ZIP: 'ZIP'
};


var operator = createOperator();
var statusIndicator = createStatusIndicator();
// 转换MarkDown
var turndownService = new TurndownService();

(function () {
    // 消息监听
    chrome.runtime.onConnect.addListener(function (port) {
        console.debug("消息发送者：", port);
        switch (port.name) {
            case 'popup':
                port.onMessage.addListener(function (request) {
                    switch (request.subject) {
                        case 'startBackup':
                            QZone.Common.ExportType = request.exportType;
                            operator.next(OperatorType.SHOW);
                            port.postMessage({
                                data: []
                            });
                            break;
                        case 'initUin':
                            // 获取QQ号
                            let res = API.Utils.initUin();
                            port.postMessage(res);
                            break;
                        case 'initDiaries':
                            // 获取私密日志
                            API.Diaries.getDiaries(0).then((data) => {
                                port.postMessage(API.Utils.toJson(data, /^_Callback\(/));
                            });
                        default:
                            break;
                    }
                });
                break;
            default:
                break;
        }
    });
    operator.next(OperatorType.INIT);
})()

/**
 * 创建备份流程控制者
 */
function createOperator() {
    let operator = new Object();
    operator.next = async function (type) {
        switch (type) {
            case OperatorType.INIT:
                init();
                await API.Utils.sleep(500);
                break;
            case OperatorType.SHOW:
                // 显示模态对话框
                showModal();
                await initFolder();
                await API.Utils.sleep(500);
                operator.next(OperatorType.BLOG_LIST);
                break;
            case OperatorType.BLOG_LIST:
                // 获取日志所有列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.DIARY_LIST, () => {
                    API.Blogs.fetchAllList();
                });
                break;
            case OperatorType.DIARY_LIST:
                // 获取私密日记所有列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.MESSAGES_LIST, () => {
                    API.Diaries.fetchAllList();
                });
                break;
            case OperatorType.MESSAGES_LIST:
                // 获取说说列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.FRIEND_LIST, () => {
                    API.Messages.hadlerAllList();
                });
                break;
            case OperatorType.FRIEND_LIST:
                // 获取并下载QQ好友Excel
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.BOARD_LIST, () => {
                    API.Friends.fetchAllList();
                });
                break;
            case OperatorType.BOARD_LIST:
                // 获取留言板列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.PHOTO_LIST, () => {
                    API.Boards.hadlerAllList();
                });
                break;
            case OperatorType.PHOTO_LIST:
                // 获取相册列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.VIDEO_LIST, () => {
                    API.Photos.fetchAllList();
                });
                break;
            case OperatorType.VIDEO_LIST:
                // 获取视频列表
                await API.Utils.sleep(500);
                operator.checkedNext(type, OperatorType.AWAIT_IMAGES, () => {
                    API.Videos.hadlerAllList();
                });
                break;
            case OperatorType.AWAIT_IMAGES:
                // 如果图片还没下载完，弄个会动的提示，让用户知道不是页面卡死
                let isComplate = (statusIndicator.Images.downloadFailed + statusIndicator.Images.downloaded) >= statusIndicator.Images.total;
                while (statusIndicator.Images.downloading > 0 && isComplate) {
                    var dot = '';
                    if (Math.random() > 0.5) {
                        dot = '...'
                    };
                    $("#backupStatus").html("还没下载完图片， 等一等..." + dot);
                    await API.Utils.sleep(500);
                }
                // 压缩
                await API.Utils.Zip(FOLDER_ROOT);
                operator.next(OperatorType.ZIP);
                break;
            case OperatorType.ZIP:
                // 延迟3秒，确保压缩完
                await API.Utils.sleep(500);
                $("#downloadBtn").show();
                if (statusIndicator.Images.downloadFailed > 0) {
                    $("#showFailedImages").show();
                }
                $("#backupStatus").html("备份完成，请下载。");
                API.Utils.notification("QQ空间导出助手通知", "空间数据已获取完成，请点击下载！");
                break;
            default:
                break;
        }
    };

    operator.checkedNext = function (operatorType, nextOperatorType, nextFun) {
        if (QZone.Common.ExportType[operatorType]) {
            nextFun.call();
        } else {
            operator.next(nextOperatorType);
        }
    }

    operator.downloadImage = async function (imageInfo) {
        let url = imageInfo.url || '';
        if (url.indexOf('//p.qpimg.cn/cgi-bin/cgi_imgproxy') > -1) {
            imageInfo.url = API.Utils.toParams(url)['url'] || imageInfo.url;
            imageInfo.url = imageInfo.url.replace(/http:\//, "https:/");
        }
        statusIndicator.download();
        await API.Utils.writeImage(imageInfo.url, imageInfo.filepath, imageInfo.isMimeType).then((fileEntry) => {
            imageInfo.filepath = fileEntry.fullPath;
            statusIndicator.downloadSuccess();
            statusIndicator.Images.data.success.push(imageInfo);
        }).catch((e) => {
            statusIndicator.Images.data.failed.push(imageInfo);
            console.error("下载失败", e, imageInfo);
            statusIndicator.downloadFailed();
        });
        return imageInfo;
    };
    return operator;
};

/**
 * 创建状态更新指示器
 */
function createStatusIndicator() {
    var status = {
        Blogs: {
            id: 'exportBlogs',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Blogs_Comments: {
            id: 'exportBlogs_Comments',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Images: {
            id: 'exportImages',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            data: {
                success: [],
                failed: [],
                downloading: []
            },
            total: 0
        },
        Diaries: {
            id: 'exportDiaries',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Messages: {
            id: 'exportMessages',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Messages_Comments: {
            id: 'exportMessages_Comments',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Photos: {
            id: 'exportPhotos',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Videos: {
            id: 'exportVideos',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Boards: {
            id: 'exportBoards',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Friends: {
            id: 'exportFriends',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        }
    };

    status.start = function (type) {
        type = type || 'Images';
        let obj = this[type];
        if (type && obj.id !== 'exportImages') {
            $("#" + obj.id).show();
            this.update(type);
        }
    };

    status.update = function (type) {
        type = type || 'Images';
        let obj = this[type];
        if (type && obj.id !== 'exportImages') {
            $("#" + obj.id).show();
            let getCount = QZone[type].Data.length;
            if ("Photos" == type) {
                getCount = QZone.Photos.Album.length;
            }
            let tip = MAX_MSG[type].format(getCount, obj.total, obj.downloaded);
            if (obj.downloaded + obj.downloadFailed === obj.total) {
                tip = tip.replace('请稍后', '已完成');
            }
            $("#" + obj.id).html(tip);
        }
        let imgTip = MAX_MSG.Images.format(this.Images.downloaded, this.Images.downloadFailed);
        if (this.Images.downloaded + this.Images.downloadFailed === this.Images.total) {
            imgTip = imgTip.replace('请稍后', '已完成');
        }
        $("#exportImages").html(imgTip);
    };

    status.typeComplete = function (type) {
        type = type || 'Images';
        let obj = this[type];
        if (type && obj.id !== 'exportImages') {
            $("#" + obj.id).show();
            let getCount = QZone[type].Data.length;
            if ("Photos" == type) {
                getCount = QZone.Photos.Album.length;
            }
            let tip = MAX_MSG[type].format(getCount, obj.total, obj.downloaded);
            tip = tip.replace('请稍后', '已完成');
            $("#" + obj.id).html(tip);
        }
        let imgTip = MAX_MSG.Images.format(this.Images.downloaded, this.Images.downloadFailed);
        imgTip = imgTip.replace('请稍后', '已完成');
        $("#exportImages").html(imgTip);
    };

    status.updateImages = function () {
        let imgTip = MAX_MSG.Images.format(this.Images.downloaded, this.Images.downloadFailed);
        if (this.Images.downloaded + this.Images.downloadFailed === this.Images.total) {
            imgTip = imgTip.replace('请稍后', '已完成');
        }
        $("#exportImages").html(imgTip);
    };

    status.download = function (type) {
        type = type || 'Images';
        this[type].downloading += 1;
        if ('Images' === type) {
            this[type].total += 1;
        }
        this.update(type);
    };

    status.downloadFailed = function (type, count) {
        type = type || 'Images';
        this[type].downloadFailed += (count || 1);
        this[type].downloading -= (count || 1);
        this.update(type);
    };

    status.downloadSuccess = function (type) {
        type = type || 'Images';
        this[type].downloaded += 1;
        this[type].downloading -= 1;
        this.update(type);
    };

    status.total = function (total, type) {
        type = type || 'Images';
        this[type].total = total;
        this.update(type);
    };
    return status;
}

/**
 * 初始化
 */
function init() {
    if (window.location.href.indexOf("qzone.qq.com") == -1 || window.location.protocol == 'filesystem:') {
        return;
    }

    // 读取配置项
    chrome.storage.sync.get(Default_Config, function (item) {
        Qzone_Config = item;
    })

    // 获取gtk
    API.Utils.initGtk();
    // 获取Token
    API.Utils.getQzoneToken();
    // 获取QQ号
    API.Utils.initUin();
    // 获取用户信息
    API.Utils.getOwnerProfile();

    // 初始化文件夹
    QZone.Common.Filer = new Filer();
    QZone.Common.Filer.init({ persistent: false, size: 10 * 1024 * 1024 * 1024 }, function (fs) {
        QZone.Common.Filer.ls(FOLDER_ROOT, function (entries) {
            console.debug('当前子目录：', entries);
            QZone.Common.Filer.rm(FOLDER_ROOT, function () {
                console.debug('清除历史数据成功！');
            });
        });
    });

    // 初始化压缩工具
    QZone.Common.Zip = new JSZip();
}

/**
 * 显示模态对话框
 *
 * 状态显示，错误信息，下载都在这里显示
 */
function showModal() {

    $('body').append(MODAL_HTML);

    $('#exampleModalCenter').modal({})

    $('#downloadBtn').click(() => {

        $('#progress').show();
        $("#progressbar").css("width", "0%");
        $("#progressbar").attr("aria-valuenow", "0");
        $('#progressbar').text('已下载0%');

        $('#showFailedImages').attr('disabled', true);
        $('#downloadBtn').attr('disabled', true);
        $('#downloadBtn').text('正在下载');

        let zipName = QZone.Common.Config.ZIP_NAME + "_" + QZone.Common.Target.uin + ".zip";
        QZone.Common.Filer.df(function (used, free, cap) {
            let usedSize = API.Utils.bytesToSize(used);
            console.debug("已使用：", API.Utils.bytesToSize(used));
            console.debug("剩余：", API.Utils.bytesToSize(free));
            console.debug("总容量：", API.Utils.bytesToSize(cap));

            // 1G
            let usedMax = 1024 * 1024 * 1024;
            if (usedMax > used) {
                QZone.Common.Zip.generateAsync({ type: "blob" }, (metadata) => {
                    $("#progressbar").css("width", metadata.percent.toFixed(2) + "%");
                    $("#progressbar").attr("aria-valuenow", metadata.percent.toFixed(2));
                    $('#progressbar').text('已下载' + metadata.percent.toFixed(2) + '%');
                }).then(function (content) {
                    saveAs(content, zipName);
                    $("#progressbar").css("width", "100%");
                    $("#progressbar").attr("aria-valuenow", 100);
                    $('#progressbar').text('已下载' + '100%');
                    $('#downloadBtn').text('已下载');
                    $('#showFailedImages').attr('disabled', false);
                    $('#downloadBtn').attr('disabled', false);
                    API.Utils.notification("QQ空间导出助手通知", "你的QQ空间数据下载完成！");
                });
            } else {
                let writeStream = streamSaver.createWriteStream(zipName).getWriter()
                QZone.Common.Zip.generateInternalStream({
                    type: "blob",
                    streamFiles: usedSize.endsWith('MB')
                }).on('data', (data, metadata) => {
                    $("#progressbar").css("width", metadata.percent.toFixed(2) + "%");
                    $("#progressbar").attr("aria-valuenow", metadata.percent.toFixed(2));
                    $('#progressbar').text('已下载' + metadata.percent.toFixed(2) + '%');
                    writeStream.write(data)
                }).on('error', (e) => {
                    console.error(e);
                    writeStream.abort(e);
                    $('#downloadBtn').text('下载失败，请重试。');
                    $('#showFailedImages').attr('disabled', false);
                    $('#downloadBtn').attr('disabled', false);
                }).on('end', () => {
                    writeStream.close();
                    $("#progressbar").css("width", "100%");
                    $("#progressbar").attr("aria-valuenow", 100);
                    $('#progressbar').text('已下载' + '100%');
                    $('#downloadBtn').text('已下载');
                    $('#showFailedImages').attr('disabled', false);
                    $('#downloadBtn').attr('disabled', false);
                    API.Utils.notification("QQ空间导出助手通知", "你的QQ空间数据下载完成！");
                }).resume();
            }
        });

    });

    //进度模式窗口隐藏后
    $('#exampleModalCenter').on('hidden.bs.modal', function () {
        $("#exampleModalCenter").remove();
        $("#modalTable").remove();
        statusIndicator = createStatusIndicator();
    })

    //显示下载失败的图片
    $('#modalTable').on('shown.bs.modal', function () {
        $("#table").bootstrapTable('destroy').bootstrapTable({
            undefinedText: '-',
            toggle: 'table',
            locale: 'zh-CN',
            search: true,
            searchAlign: 'left',
            height: "50%",
            pagination: true,
            pageList: [10, 25, 50, 100, 200, 'All'],
            paginationHAlign: 'left',
            clickToSelect: true,
            paginationDetailHAlign: 'right',
            columns: [{
                field: 'state',
                checkbox: true,
                align: 'left'
            }, {
                field: 'name',
                title: '名称',
                titleTooltip: '名称',
                align: 'left',
                width: '30%',
                visible: true
            }, {
                field: 'desc',
                title: '描述',
                titleTooltip: '描述',
                align: 'left',
                width: '30%',
                visible: true
            }, {
                field: 'source',
                title: '来源',
                titleTooltip: '来源',
                align: 'left',
                width: '30%',
                visible: true,
                formatter: function (value, row, index, field) {
                    return value + "[" + row.className + "]";
                }
            }, {
                field: 'className',
                title: '分类',
                visible: false
            }, {
                field: 'url',
                title: '地址',
                titleTooltip: '地址',
                align: 'left',
                width: '5%',
                visible: true,
                formatter: function (value, row, index, field) {
                    return '<a target="_blank" class="like" href="' + value + '" title="访问">访问</a>';
                }
            }, {
                field: 'uid',
                visible: false
            }, {
                field: 'filename',
                visible: false
            }, {
                field: 'filepath',
                visible: false
            }, {
                field: 'isMimeType',
                visible: false
            }],
            data: statusIndicator.Images.data.failed
        })
        $('#table').bootstrapTable('resetView')

        $("#againDownload").click(async function () {
            let selects = $('#table').bootstrapTable('getSelections');
            let faileds = statusIndicator.Images.data.failed;
            let tasks = [];
            for (let index = 0; index < selects.length; index++) {
                const element = selects[index];
                statusIndicator["Images"].downloadFailed -= 1;
                faileds.splice(faileds.findIndex(item => item.uuid === element.uuid), 1)
                tasks.push(operator.downloadImage(element));
            }
            await Promise.all(tasks);
            operator.next(OperatorType.AWAIT_IMAGES);
        })
    })
}

/**
 * 创建在Filesystem临时文件夹
 */
async function initFolder() {

    console.debug('所有模块信息', QZone);

    // 切换到根目录
    QZone.Common.Filer.cd('/', async (root) => {
        console.debug("切换到根目录", root);
        // 创建模块文件夹
        let createModuleFolder = () => {
            return new Promise(async function (resolve, reject) {
                // 创建所有模块的目录
                for (x in QZone) {
                    let obj = QZone[x];
                    if (typeof (obj) !== "object") {
                        continue;
                    }
                    let rootPath = obj['IMAGES_ROOT'] || obj['ROOT'];
                    if (!rootPath) {
                        continue;
                    }
                    let entry = await API.Utils.createFolder(rootPath);
                    console.debug('创建目录成功', entry);
                }
                resolve();
            });
        }

        // 创建模块文件夹
        await createModuleFolder();

        // 创建说明文件
        QZone.Common.Filer.write(FOLDER_ROOT + "说明.md", { data: README_TEXT, type: "text/plain" }, (entry) => {
            console.debug('创建文件成功', entry);
            return true;
        });
        return true;
    });
    return true;
};

/**
 * 获取一页的日志列表
 *
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Blogs.fetchList = function (page, nextFunc) {
    API.Blogs.getBlogs(page).then((data) => {

        // 去掉函数，保留json
        data = API.Utils.toJson(data, /^_Callback\(/);

        // 设置总数
        QZone.Blogs.total = data.data.totalNum || 0;

        let list = data.data.list || [];
        QZone.Blogs.Data = QZone.Blogs.Data.concat(list);

        // 提示信息
        statusIndicator.total(QZone.Blogs.total, 'Blogs');
        statusIndicator.update('Blogs');
        nextFunc(page);
    }).catch((e) => {
        nextFunc(page);
        console.error("获取日志列表异常，当前页：" + page);
    })
}

/**
 * 获取全部日志列表
 */
API.Blogs.fetchAllList = function () {

    // 提示信息
    statusIndicator.start("Blogs");

    // 重置数据
    QZone.Blogs.Data = [];
    QZone.Blogs.Images = [];

    // 获取数据
    var nextList = function (page) {
        if (QZone.Blogs.Data.length < QZone.Blogs.total && page * Qzone_Config.Blogs.pageSize < QZone.Blogs.total) {
            // 总数不相等时继续获取
            API.Blogs.fetchList(page + 1, arguments.callee);
        } else {
            // 获取日志所有信息
            API.Blogs.fetchAllInfo();
        }
    }
    API.Blogs.fetchList(0, nextList);
};

/**
 * 获取一篇日志的内容
 * 
 * @param {integer} idx 日志列表中的第几篇日志
 * @param {function} nextFunc 获取完后执行的函数
 */
API.Blogs.fetchInfo = function (idx, nextFunc) {
    let item = QZone.Blogs.Data[idx];
    statusIndicator.download("Blogs");
    API.Blogs.getInfo(item.blogId).then((blogPage) => {
        API.Blogs.contentToFile(blogPage, idx, item.title, item.pubTime, nextFunc);
    }).catch((e) => {
        console.error("获取日志异常", item, e);
        nextFunc(idx, e);
    })
}

/**
 * 获得所有日志的内容
 */
API.Blogs.fetchAllInfo = function () {
    // 获取数据
    var nextBlogFunc = function (idx, err) {
        if (QZone.Blogs.total > idx + 1) {
            API.Blogs.fetchInfo(idx + 1, arguments.callee);
        } else {
            statusIndicator.typeComplete('Blogs');
            // 告知完成获取所有日志，并开始等待日志图片下载完成
            operator.next(OperatorType.DIARY_LIST);
        }
    }
    nextBlogFunc(-1, null);
};

/**
 * 读取日志内容到文件
 * @param {html} data 日志详情页
 * @param {integer} idx 
 * @param {string} title 标题
 * @param {string} postTime 创建时间
 * @param {funcation} nextFunc 回调函数
 */
API.Blogs.contentToFile = function (data, idx, title, postTime, nextFunc) {
    let blogPage = jQuery(data);
    let blogData = null;
    let blogInfo = {};
    // 获得网页里的JSON数据
    blogPage.find('script').each(function (index) {
        let t = $(this).text();
        if (t.indexOf('g_oBlogData') !== -1) {
            let dataM = /var g_oBlogData\s+=\s+({[\s\S]+});\s/;
            blogData = dataM.exec(t);
            if (blogData != null) {
                return false;
            }
        }
    })
    if (blogData != null) {
        blogInfo = JSON.parse(blogData[1]);
    }
    // 获得日志正文
    let blogContentHtml = blogPage.find("#blogDetailDiv:first").html();
    let markdown = turndownService.turndown(blogContentHtml);
    if (markdown) {
        // 是否获取全部评论
        if (Qzone_Config.Blogs.Comments.isFull) {
            // 获取日志的全部评论
            API.Blogs.getAllComments(blogInfo.data, (type, item, page) => {
                let $comment_tip = $("#exportBlogs_Comments");
                // 显示获取评论的进度
                $comment_tip.show();
                let comments_tip = MAX_MSG['Blogs_Comments'];
                let comments_obj = statusIndicator['Blogs_Comments'];
                if (type === "error") {
                    comments_obj.downloadFailed = comments_obj.downloadFailed + Qzone_Config.Blogs.Comments.pageSize;
                }
                let tips = comments_tip.format(idx + 1, item.comments.length, comments_obj.downloadFailed, item.replynum);
                if (type === 'end') {
                    tips = tips.replace('请稍后', '已完成');
                    // 添加评论
                    let item = blogInfo.data;
                    item.comments = item.comments || [];
                    // 合并标题正文评论
                    API.Blogs.constructContent(title, postTime, markdown, item, (content) => {
                        let label = API.Blogs.getBlogLabel(item);
                        API.Blogs.writeFile(idx, label, title, postTime, content, item);
                        nextFunc(idx, null);
                    });
                }
                $comment_tip.html(tips);
            });
        } else {
            // 合并标题正文评论
            API.Blogs.constructContent(title, postTime, markdown, blogInfo.data, (content) => {
                let label = API.Blogs.getBlogLabel(blogInfo.data);
                API.Blogs.writeFile(idx, label, title, postTime, content, blogInfo.data);
                nextFunc(idx, null);
            });
        }
    } else {
        nextFunc(idx, err);
    }
};

/**
 * 拼接出一篇markdown格式的日志，包含标题，正文，评论等; 会将网络图片下载下来作为本地图片
 * 
 * @param {string} title 日志标题
 * @param {string} postTime 日志发表时间，从QQ空间API里获得的
 * @param {string} markdown 转换为 mardown 格式的日志
 * @param {dictionary} blogInfo 日志的信息，用于获取评论 
 */
API.Blogs.constructContent = function (title, postTime, markdown, item, doneFun) {
    // 拼接标题，日期，内容
    let result = "# " + title + "\r\n\r\n";
    result = result + "> " + postTime + "\r\n\r\n";
    result = result + markdown.replace(/\n/g, "\r\n") + "\r\n\r\n\r\n";

    // 拼接评论
    result = result + "> 评论(" + item.replynum + "):\r\n\r\n";
    let comments = item.comments;
    for (let index = 0; index < comments.length; index++) {
        const comment = comments[index];
        let poster = API.Utils.formatContent(comment.poster.name, 'MD');
        let mdContent = API.Utils.formatContent(comment.content, 'MD');
        let content = '* [{0}](https://user.qzone.qq.com/{1})：{2}'.format(poster, comment.poster.id, mdContent) + "\r\n";

        comment.replies.forEach(function (rep) {
            let repPoster = API.Utils.formatContent(rep.poster.name, 'MD');
            let repContent = API.Utils.formatContent(rep.content, 'MD');
            let c = '\t* [{0}](https://user.qzone.qq.com/{1})：{2}'.format(repPoster, rep.poster.id, repContent) + "\r\n";
            content = content + c;
        });
        result = result + content;
    }

    // 转为本地图片
    let imageLinkM = /!\[.*?\]\((.+?)\)/g;
    let match;
    let tmpResult = result;
    while (match = imageLinkM.exec(tmpResult)) {
        let orgUrl = match[1];
        let url = orgUrl.replace(/http:\//, "https:/");
        let uid = API.Utils.newUid();
        let fileName = uid;
        var imageInfo = {
            uid: uid,
            url: url,
            filename: fileName,
            filepath: QZone.Blogs.IMAGES_ROOT + "/" + fileName,
            isMimeType: false,
            name: title,
            desc: title,
            source: title,
            className: item.category
        };

        result = result.split(orgUrl).join("../images/" + imageInfo.filename);
        QZone.Blogs.Images.push(imageInfo);
        operator.downloadImage(imageInfo);
    }
    doneFun(result);
};

/**
 * 保存日志到 HTML5 filesystem
 * 
 * @param {string} title 
 * @param {string} postTime 
 * @param {string} content 
 */
API.Blogs.writeFile = function (idx, label, title, postTime, content, item) {
    let filename, filepath;
    postTime = new Date(postTime).format('yyyyMMddhhmmss');
    let orderNum = API.Utils.prefixNumber(idx + 1, QZone.Blogs.total.toString().length);
    filename = API.Utils.filenameValidate(orderNum + "_" + postTime + "_【" + title + "】");
    if (label && label != "") {
        filename = API.Utils.filenameValidate(orderNum + "_" + postTime + "_" + label + "【" + title + "】");
    }
    filepath = QZone.Blogs.ROOT + "/" + item.category;
    API.Utils.createFolder(filepath).then(() => {
        filepath += '/' + filename + ".md";
        API.Utils.writeFile(content, filepath, (fileEntry) => {
            statusIndicator.downloadSuccess('Blogs');
        }, (error) => {
            statusIndicator.downloadFailed('Blogs');
        });
    });

};


/**
 * 获取一页的私密日记列表
 *
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Diaries.fetchList = function (page, nextFunc) {
    API.Diaries.getDiaries(page).then((data) => {

        // 去掉函数，保留json
        data = API.Utils.toJson(data, /^_Callback\(/);

        QZone.Diaries.total = data.data.total_num;
        data.data.titlelist.forEach(function (item) {
            var i = {
                blogId: item.blogid,
                pubTime: new Date(1E3 * item.pubtime).format('yyyy-MM-dd hh:mm:ss'),
                title: item.title
            };
            QZone.Diaries.Data.push(i);
        });
        // 开始获取日志内容
        statusIndicator.total(QZone.Diaries.total, 'Diaries');
        statusIndicator.update('Diaries');
        nextFunc(page);
    }).catch((e) => {
        nextFunc(page);
        console.error("获取私密日志列表异常，当前页：" + page);
    })
}


/**
 * 获取全部私密日记列表
 */
API.Diaries.fetchAllList = function () {
    // 重置数据
    QZone.Diaries.Data = [];
    QZone.Diaries.Images = [];

    statusIndicator.start("Diaries");

    // 获取数据
    var nextListFunc = function (page) {
        if (QZone.Diaries.Data.length < QZone.Diaries.total && page * Qzone_Config.Diaries.pageSize < QZone.Diaries.total) {
            // 总数不相等时继续获取
            API.Diaries.fetchList(page + 1, arguments.callee);
        } else {
            // 获取私密日记所有信息
            API.Diaries.fetchAllInfo();
        }
    }
    API.Diaries.fetchList(0, nextListFunc);
};

/**
 * 获取一篇私密日记的内容
 * 
 * @param {integer} idx 日志列表中的第几篇私密日记
 * @param {function} nextFunc 获取完后执行的函数
 */
API.Diaries.fetchInfo = function (idx, nextFunc) {
    let blogid = QZone.Diaries.Data[idx].blogId;
    let postTime = QZone.Diaries.Data[idx].pubTime;
    let title = QZone.Diaries.Data[idx].title;

    statusIndicator.download("Diaries");
    API.Diaries.getInfo(blogid).then((data) => {
        API.Diaries.contentToFile(data, idx, title, postTime, nextFunc);
    }).catch((e) => {
        console.error("获取私密日志异常，日志标题=" + title);
        nextFunc(idx, "获取私密日志异常，日志标题=" + title);
    })
};

/**
 * 获得所有私密日记的内容
 */
API.Diaries.fetchAllInfo = function () {
    // 获取数据
    var nextFun = function (idx, err) {
        if (QZone.Diaries.Data.length > idx + 1) {
            API.Diaries.fetchInfo(idx + 1, arguments.callee);
        } else {
            // 下一步，获取说说列表
            operator.next(OperatorType.MESSAGES_LIST);
        }
    }
    nextFun(-1, null);
};

/**
 * 读取私密日记内容到文件
 * @param {html} data 私密日记详情页
 * @param {integer} idx 
 * @param {string} title 标题
 * @param {string} postTime 创建时间
 * @param {funcation} nextFunc 回调函数
 */
API.Diaries.contentToFile = function (data, idx, title, postTime, nextFunc) {
    let blogPage = jQuery(data);
    let blogData = null;
    let blogInfo = {};
    // 获得网页里的JSON数据
    blogPage.find('script').each(function (index) {
        let t = $(this).text();
        if (t.indexOf('g_oBlogData') !== -1) {
            let dataM = /var g_oBlogData\s+=\s+({[\s\S]+});\s/;
            blogData = dataM.exec(t);
            if (blogData != null) {
                return false;
            }
        }
    });
    if (blogData != null) {
        blogInfo = JSON.parse(blogData[1]);
    }
    // 获得私密日记正文
    let blogContentHtml = blogPage.find("#blogDetailDiv:first").html();
    let markdown = turndownService.turndown(blogContentHtml);
    if (markdown) {
        // 合并标题正文评论
        let content = API.Diaries.constructContent(idx, title, postTime, markdown, blogInfo);
        API.Diaries.writeFile(idx, title, postTime, content);
        nextFunc(idx, null);
    } else {
        nextFunc(idx, err);
    }
};

/**
 * 拼接出一篇markdown格式的私密日记，包含标题，正文，评论等; 会将网络图片下载下来作为本地图片
 * 
 * @param {string} title 私密日记标题
 * @param {string} postTime 私密日记发表时间，从QQ空间API里获得的
 * @param {string} markdown 转换为 mardown 格式的私密日记
 * @param {dictionary} blogInfo 私密日记的信息，用于获取评论
 */
API.Diaries.constructContent = function (index, title, postTime, markdown, blogInfo) {
    // 拼接标题，日期，内容
    let result = "# " + title + "\r\n\r\n";
    result = result + "> " + postTime + "\r\n\r\n";
    result = result + markdown.replace(/\n/g, "\r\n") + "\r\n\r\n\r\n";

    // 转为本地图片
    let imageLinkM = /!\[.*?\]\((.+?)\)/g;
    let match;
    let tmpResult = result;
    while (match = imageLinkM.exec(tmpResult)) {
        let orgUrl = match[1];
        let url = orgUrl.replace(/http:\//, "https:/");
        let uid = API.Utils.newUid();
        let fileName = uid;
        var imageInfo = {
            uid: uid,
            url: url,
            filename: fileName,
            filepath: QZone.Diaries.IMAGES_ROOT + "/" + fileName,
            isMimeType: false,
            name: title,
            desc: title,
            source: title,
            className: "私密日志"
        };
        result = result.split(orgUrl).join("images/" + imageInfo.filename);
        QZone.Diaries.Images.push(imageInfo);
        operator.downloadImage(imageInfo);
    }
    return result;
};

/**
 * 保存私密日记到 HTML5 filesystem
 * 
 * @param {string} title 
 * @param {string} postTime 
 * @param {string} content 
 */
API.Diaries.writeFile = function (idx, title, postTime, content) {
    let filename, filepath;
    postTime = new Date(postTime).format('yyyyMMddhhmmss');
    let orderNum = API.Utils.prefixNumber(idx + 1, QZone.Diaries.total.toString().length);
    filename = API.Utils.filenameValidate(orderNum + "_" + postTime + "_【" + title + "】");
    filepath = QZone.Diaries.ROOT + '/' + filename + ".md";

    API.Utils.writeFile(content, filepath, (fileEntry) => {
        statusIndicator.downloadSuccess('Diaries');
    }, (error) => {
        statusIndicator.downloadFailed('Diaries');
    });
};


/**
 * 获取全部说说列表
 */
API.Messages.fetchAllList = async function (pageIndex) {
    statusIndicator.start("Messages");
    // 获取数据
    var nextPage = async function (pageIndex) {
        console.debug("开始获取说说列表，当前页：", pageIndex + 1);
        return await API.Messages.getMessages(pageIndex).then(async (data) => {
            // 去掉函数，保留json
            data = API.Utils.toJson(data, /^_preloadCallback\(/);

            console.debug("已获取说说列表，当前页：", pageIndex + 1, data);

            // 返回的总数包括无权限的说说的条目数，这里返回为空时表示无权限获取其它的数据
            if (data.msglist == null || data.msglist.length == 0) {
                return QZone.Messages.Data;
            }

            QZone.Messages.total = data.total;
            // 提示信息
            statusIndicator.total(QZone.Messages.total, 'Messages');

            let tasks = [];
            let dataList = data.msglist || [];

            // 转换数据
            dataList = await API.Messages.convert(dataList, (type, item) => {
                let $msg_comment_tip = $("#exportMessages_Comments");
                // 显示获取评论的进度
                $msg_comment_tip.show();
                let message_comments_tip = MAX_MSG['Messages_Comments'];
                let message_comments_obj = statusIndicator['Messages_Comments'];
                if (type === "error") {
                    message_comments_obj.downloadFailed = message_comments_obj.downloadFailed + Qzone_Config.Messages.Comments.pageSize;
                }
                let tips = message_comments_tip.format(pageIndex + 1, item.index + 1, item.custom_comments.length, message_comments_obj.downloadFailed, item.custom_comment_total);
                if (type === 'end') {
                    tips = tips.replace('请稍后', '已完成');
                }
                $msg_comment_tip.html(tips);
            });

            for (const item of dataList) {
                // 下载说说配图
                for (const entry of item.custom_images) {
                    let uid = API.Utils.newUid();
                    let url = entry.url2 || entry.url1;
                    url = url.replace(/http:\//, "https:/");
                    let imageInfo = {
                        uid: uid,
                        url: url,
                        filename: uid,
                        filepath: QZone.Messages.IMAGES_ROOT + "/" + uid,
                        isMimeType: false,
                        name: item.content,
                        desc: item.content,
                        source: item.content,
                        className: "说说"
                    };

                    entry.custom_url = imageInfo.url;
                    entry.custom_uid = imageInfo.uid;
                    entry.custom_filepath = imageInfo.filepath;

                    // 下载图片
                    tasks.push(operator.downloadImage(imageInfo));
                }

                // 下载视频预览图
                for (const entry of item.custom_video) {
                    let uid = entry.video_id || API.Utils.newUid();
                    let url = entry.url1.replace(/http:\//, "https:/");
                    let imageInfo = {
                        uid: uid,
                        url: url,
                        filename: uid,
                        filepath: QZone.Messages.IMAGES_ROOT + "/" + uid,
                        isMimeType: false,
                        name: item.content,
                        desc: item.content,
                        source: item.content,
                        className: "说说"
                    };

                    entry.custom_url = imageInfo.url;
                    entry.custom_uid = imageInfo.uid;
                    entry.custom_filepath = imageInfo.filepath;
                    // 下载图片
                    tasks.push(operator.downloadImage(imageInfo));
                }

                // 下载音乐预览图
                for (const entry of item.custom_audio) {
                    let uid = entry.albumid || entry.id || API.Utils.newUid();;
                    let url = entry.image.replace(/http:\//, "https:/");
                    let imageInfo = {
                        uid: uid,
                        url: url,
                        filename: uid,
                        filepath: QZone.Messages.IMAGES_ROOT + "/" + uid,
                        isMimeType: false,
                        name: item.content,
                        desc: item.content,
                        source: item.content,
                        className: "说说"
                    };

                    entry.custom_url = imageInfo.url;
                    entry.custom_uid = imageInfo.uid;
                    entry.custom_filepath = imageInfo.filepath;
                    // 下载图片
                    tasks.push(operator.downloadImage(imageInfo));
                }
            }

            QZone.Messages.Data = QZone.Messages.Data.concat(dataList);

            statusIndicator.update("Messages");

            // 先下载完成当前页的所有图片后再获取下一页
            await Promise.all(tasks);

            // 是否还有下一页
            let hasNextPage = API.Utils.hasNextPage(pageIndex, Qzone_Config.Messages.pageSize, QZone.Messages.total, QZone.Messages.Data);
            if (hasNextPage) {
                // 请求一页成功后等待一秒再请求下一页
                let min = Qzone_Config.Messages.randomSeconds.min;
                let max = Qzone_Config.Messages.randomSeconds.max;
                let seconds = API.Utils.randomSeconds(min, max);
                await API.Utils.sleep(seconds * 1000);
                // 总数不相等时继续获取
                return await arguments.callee(pageIndex + 1);
            } else {
                return QZone.Messages.Data;
            }
        }).catch(async (e) => {
            console.error("获取说说列表异常，当前页：", pageIndex + 1, e);
            // 当前页失败后，跳过继续请求下一页
            let min = Qzone_Config.Messages.randomSeconds.min;
            let max = Qzone_Config.Messages.randomSeconds.max;
            let seconds = API.Utils.randomSeconds(min, max);
            await API.Utils.sleep(seconds * 1000);
            // 总数不相等时继续获取
            return await arguments.callee(pageIndex + 1);
        });
    }
    return await nextPage(pageIndex);
};

/**
 * 处理所有说说
 */
API.Messages.hadlerAllList = function () {

    // 重置数据
    QZone.Messages.Data = [];
    QZone.Messages.Images = [];

    API.Messages.fetchAllList(0).then((data) => {
        // 写入说说到文件
        API.Messages.contentToFiles();
        statusIndicator.typeComplete('Messages');
        // 下一步，获取QQ好友信息
        operator.next(OperatorType.FRIEND_LIST);
    }).catch((msg) => {
        console.error(msg);
        statusIndicator.typeComplete('Messages');
        // 下一步，获取QQ好友信息
        operator.next(OperatorType.FRIEND_LIST);
    });
};

/**
 * 构建说说文件内容
 */
API.Messages.contentToFiles = function () {
    const yearMap = API.Utils.groupedByTime(QZone.Messages.Data, "custom_create_time");
    yearMap.forEach((monthMap, year) => {
        let content = "# " + year + "年\r\n\r\n";
        monthMap.forEach((items, month) => {
            content += "## " + month + "月\r\n\r\n";
            items.forEach((item) => {
                statusIndicator.download("Messages");
                content = content + "\r\n---\r\n" + API.Messages.writeFiles(item);
                statusIndicator.downloadSuccess("Messages");
            });
        });
        const yearFilePath = QZone.Messages.ROOT + "/" + year + "年.md";
        API.Utils.writeFile(content, yearFilePath, (fileEntry) => {
            console.info("已下载：", fileEntry);
        });
    });
};

/**
 * 写入说说到文件
 */
API.Messages.writeFiles = function (item) {
    //console.debug("说说信息：", item);

    statusIndicator.download('Messages');

    // 地理位置
    let location = item.custom_location['name'];
    var result = "> " + item.custom_create_time;
    if (location && location !== "") {
        result += "【" + location + "】";
    }

    // 转发标示
    let isRt = item.rt_uin;
    if (isRt) {
        result += "【转发】";
    }

    // 转换主内容
    let content = API.Utils.formatContent(item, "MD", false);

    result += "\r\n\r\n" + content;

    if (!isRt) {
        // 说说为转发说说时，对应的图片，视频，歌曲信息属于源说说的
        result += API.Messages.formatMedia(item);
    }

    // 添加转发内容
    if (isRt) {
        result += "> 原文:\r\n";
        let rt_uinname = API.Utils.formatContent(item.rt_uinname, 'MD');
        let rt_content = API.Utils.formatContent(item, 'MD', true);
        // 转换内容
        rtContent = '[{0}](https://user.qzone.qq.com/{1})：{2}'.format(rt_uinname, item.rt_uin, rt_content)
        result += "\r\n" + rtContent + "\r\n";

        // 说说为转发说说时，对应的图片，视频，歌曲信息属于源说说的
        result += API.Messages.formatMedia(item);
    }

    // 评论内容
    let comments = item.custom_comments || [];
    result += "> 评论(" + item.custom_comment_total + ")：\r\n\r\n";
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        let contentName = API.Utils.formatContent(comment.name, 'MD');
        let content = API.Utils.formatContent(comment.content, 'MD');
        result += "*  [{0}](https://user.qzone.qq.com/{1})：{2}".format(contentName, comment.uin, content) + "\r\n";

        // 评论包含图片
        var comment_images = comment.pic || [];
        for (let j = 0; j < comment_images.length; j++) {
            const img = comment_images[j];
            let commentImgUid = API.Utils.newUid();
            let commentImgUrl = img.hd_url.replace(/http:\//, "https:/");
            let comImageInfo = {
                uid: commentImgUid,
                url: commentImgUrl,
                filename: commentImgUid,
                filepath: QZone.Messages.IMAGES_ROOT + "/" + commentImgUid,
                isMimeType: false,
                name: comment.content,
                desc: comment.content,
                source: comment.content,
                className: "评论"
            };

            // 替换URL
            result += "![](images/" + comImageInfo.uid + ")" + '\r\n';
            // 下载图片
            operator.downloadImage(comImageInfo);
        }

        // 评论的回复
        var replies = comment.list_3 || [];
        for (let k = 0; k < replies.length; k++) {
            const repItem = replies[k];
            let repName = API.Utils.formatContent(repItem.name, 'MD');
            let content = API.Utils.formatContent(repItem.content, 'MD');
            let repContent = "\t* [{0}](https://user.qzone.qq.com/{1})：{2}".format(repName, repItem.uin, content) + "\r\n";
            var repImgs = repItem.pic || [];
            repImgs.forEach(function (repImg) {
                // 回复包含图片，理论上回复现在不能回复图片，兼容一下
                let repImgUid = API.Utils.newUid();
                let repImgUrl = repImg.hd_url.replace(/http:\//, "https:/");
                let repImgageInfo = {
                    uid: repImgUid,
                    url: repImgUrl,
                    filename: repImgUid,
                    filepath: QZone.Messages.IMAGES_ROOT + "/" + repImgUid,
                    isMimeType: false,
                    name: repItem.content,
                    desc: repItem.content,
                    source: repItem.content,
                    className: "回复"
                };
                // 替换URL
                result += "![](" + comImageInfo.uid + ")" + '\r\n';
                // 下载图片
                operator.downloadImage(repImgageInfo);
            });

            result += repContent;
        }
    }
    result = result + "\r\n"
    return result;
};


/**
 * 获取QQ好友列表
 */
API.Friends.fetchAllList = function () {

    // 重置数据
    QZone.Friends.Data = [];
    QZone.Friends.Images = [];

    statusIndicator.start("Friends");

    API.Friends.getFriends().then((data) => {
        data = data.replace(/^_Callback\(/, "");
        data = data.replace(/\);$/, "");
        result = JSON.parse(data);
        QZone.Friends.total = result.data.items.length;
        QZone.Friends.Data = result.data.items;
        statusIndicator.total(QZone.Friends.total, "Friends");


        // 将QQ分组进行分组
        let groups = result.data.gpnames;
        let groupMap = new Map();
        groups.forEach(group => {
            groupMap.set(group.gpid, group.gpname);
        });

        // Excel数据
        let ws_data = [
            ["QQ号", "备注名称", "QQ昵称", "所在分组", "成为好友时间"],
        ];

        let writeToExcel = function (ws_data) {
            // 创建WorkBook
            let workbook = XLSX.utils.book_new();

            let worksheet = XLSX.utils.aoa_to_sheet(ws_data);

            XLSX.utils.book_append_sheet(workbook, worksheet, "QQ好友");

            // 写入XLSX到HTML5的FileSystem
            let xlsxArrayBuffer = API.Utils.toArrayBuffer(XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' }));
            API.Utils.writeExcel(xlsxArrayBuffer, QZone.Friends.ROOT + "/QQ好友.xlsx", (fileEntry) => {
                console.info("创建文件成功", fileEntry);
                // 下一步，下载留言板
                operator.next(OperatorType.BOARD_LIST);
            }, (error) => {
                // 下一步，下载留言板
                operator.next(OperatorType.BOARD_LIST);
                console.error(error);
            });
        }

        // 处理QQ好友
        let friends = result.data.items;
        for (let index = 0; index < friends.length; index++) {
            var friend = friends[index];
            statusIndicator.download("Friends");
            let groupId = friend.groupid;
            let groupName = groupMap.get(groupId) || "默认分组";
            friends[index]['groupName'] = groupName;
            let rowData = [friend.uin, friend.remark, friend.name, groupName];
            API.Friends.getFriendshipTime(friend.uin).then((timeData) => {
                timeData = timeData.replace(/^_Callback\(/, "");
                timeData = timeData.replace(/\);$/, "");
                let timeInfo = JSON.parse(timeData);
                let addTime = 0;
                if (timeInfo.data && timeInfo.data.hasOwnProperty('addFriendTime')) {
                    addTime = timeInfo.data.addFriendTime || 0;
                } else {
                    console.warn(timeData);
                }
                addTime = addTime == 0 ? "老朋友啦" : new Date(addTime * 1000).format("yyyy-MM-dd hh:mm:ss");
                friends[index]['addFriendTime'] = addTime;
                rowData[4] = addTime;
                ws_data.push(rowData);
                statusIndicator.downloadSuccess("Friends");
                if (friends.length == ws_data.length - 1) {
                    writeToExcel(ws_data);
                }
            }).catch((e) => {
                console.error("获取好友添加时间异常", friend);
            })
        }
    }).catch((e) => {
        // 下一步，下载留言板
        operator.next(OperatorType.BOARD_LIST);
        console.error("获取好友列表异常");
    })
};

/**
 * 获取全部留言列表
 */
API.Boards.fetchAllList = async function (page) {
    statusIndicator.start("Boards");
    return new Promise(async function (resolve, reject) {
        // 获取数据
        var nextList = async function (page) {

            let data = await API.Boards.getBoards(page);

            // 去掉函数，保留json
            data = API.Utils.toJson(data, /^_Callback\(/);

            let commentList = data.data.commentList || [];
            QZone.Boards.Data = QZone.Boards.Data.concat(commentList);
            QZone.Boards.total = data.data.total || 0;

            // 提示信息
            statusIndicator.total(QZone.Boards.total, 'Boards');

            statusIndicator.update("Boards");

            if (QZone.Boards.Data.length < QZone.Boards.total && page * Qzone_Config.Boards.pageSize < QZone.Boards.total) {
                // 请求一页成功后等待一秒再请求下一页
                await API.Utils.sleep(Qzone_Config.Boards.querySleep * 1000);
                // 总数不相等时继续获取
                await arguments.callee(page + 1);
            } else {
                resolve(QZone.Boards.Data);
            }
        }
        await nextList(page);
    });
};

/**
 * 处理所有留言
 */
API.Boards.hadlerAllList = function () {

    // 重置数据
    QZone.Boards.Data = [];
    QZone.Boards.Images = [];

    API.Boards.fetchAllList(0).then((data) => {
        // 写入留言板到文件
        API.Boards.contentToFile();
        statusIndicator.typeComplete('Boards');
        // 下一步，下载相册
        operator.next(OperatorType.PHOTO_LIST);
    }).catch((msg) => {
        console.error("获取留言异常！", msg);
        statusIndicator.typeComplete('Boards');
        operator.next(OperatorType.PHOTO_LIST);
    });
};

/**
 * 将留言写入到文件
 */
API.Boards.contentToFile = function () {
    let newline = '\r\n\r\n';

    let total = QZone.Boards.Data.length;
    const yearMap = API.Utils.groupedByTime(QZone.Boards.Data, "pubtime");
    yearMap.forEach((monthMap, year) => {
        let content = "# " + year + "年" + newline;
        monthMap.forEach((items, month) => {
            content += "## " + month + "月" + newline;

            for (let index = 0; index < items.length; index++) {
                const borad = items[index];

                // 提示信息，下载数+1
                statusIndicator.download("Boards");
                content += "---\r\n";

                content += '#### 第' + (total--) + '楼\r\n';

                let nickname = QZone.Common.Owner.uin == borad.uin ? "我" : borad.nickname;
                nickname = nickname || '匿名用户';
                nickname = API.Utils.formatContent(nickname, "MD");

                content += '> {0} 【{1}】'.format(borad.pubtime, nickname) + newline;
                content += '> 正文：' + newline;
                if (borad.secret == 1 && !borad.htmlContent) {
                    // 私密留言
                    content += '主人收到一条私密留言，仅彼此可见' + newline;
                    // 提示信息，下载数+1
                    statusIndicator.downloadSuccess("Boards");
                    continue;
                }
                let htmlContent = borad.htmlContent.replace(/src=\"\/qzone\/em/g, 'src=\"http://qzonestyle.gtimg.cn/qzone/em');
                htmlContent = htmlContent.replace(/\n/g, "\r\n");
                let mdContent = turndownService.turndown(htmlContent);
                mdContent = API.Utils.formatContent(mdContent, "MD");
                content += '- [{0}](https://user.qzone.qq.com/{1})：{2}'.format(nickname, borad.uin, mdContent) + newline;

                content += '> 回复：' + newline;

                let replyList = borad.replyList || [];
                replyList.forEach(reply => {
                    let replyName = QZone.Common.Owner.uin == reply.uin ? "我" : reply.nick;
                    replyName = API.Utils.formatContent(replyName, "MD");
                    let replyContent = API.Utils.formatContent(reply.content, "MD");
                    let replyTime = new Date(reply.time * 1000).format('yyyy-MM-dd hh:mm:ss');
                    let replyMd = '- [{0}](https://user.qzone.qq.com/{1})：{2} 【*{3}*】'.format(replyName, reply.uin, replyContent, replyTime);
                    content += replyMd + newline;
                });
                content += '---' + newline;
                // 提示信息，下载数+1
                statusIndicator.downloadSuccess("Boards");
            };
        });
        const yearFilePath = QZone.Boards.ROOT + "/" + year + "年.md";
        API.Utils.writeFile(content, yearFilePath, (fileEntry) => {
            console.info("已下载：", fileEntry);
        });
    });
};

/**
 * 获取相册一页的照片
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Photos.fetchOneList = async function (albumItem, page, nextList) {
    await API.Photos.getImages(albumItem.id, page).then((imgData) => {

        // 去掉函数，保留json
        imgData = API.Utils.toJson(imgData, /^shine0_Callback\(/);

        let photoList = imgData.data.photoList || [];
        QZone.Photos.Data = QZone.Photos.Data.concat(photoList);
        let albumnIdList = QZone.Photos.Images.get(albumItem.id) || [];
        QZone.Photos.Images.set(albumItem.id, albumnIdList.concat(photoList));
        nextList(albumItem, page, nextList);
    }).catch(() => {
        console.error('获取照片异常，当前页：' + page, albumItem);
        nextList(albumItem, page, nextList);
    });
};


/**
 * 获取单个相册的全部照片
 */
API.Photos.fetchOneAllList = function (albumItem) {
    return new Promise(async function (resolve, reject) {
        // 重置数据
        QZone.Photos.Images.set(albumItem.id, []);

        if (albumItem.allowAccess == 0) {
            console.warn("当前登录用户没权限访问该相册", albumItem);
            // 没权限的跳过不获取
            resolve(QZone.Photos.Images.get(albumItem.id));
        }

        // 获取数据
        var nextList = async function (albumItem, page) {
            if (QZone.Photos.Images.get(albumItem.id).length < albumItem.total && page * Qzone_Config.Photos.pageSize < albumItem.total) {
                // 请求一页成功后等待一秒再请求下一页
                await API.Utils.sleep(Qzone_Config.Photos.querySleep * 1000);
                // 总数不相等时继续获取
                await API.Photos.fetchOneList(albumItem, page + 1, arguments.callee);
            } else {
                resolve(QZone.Photos.Images.get(albumItem.id));
            }
        }
        // 获取单个相册的第一页相片列表
        await API.Photos.fetchOneList(albumItem, 0, nextList);
    });
};


/**
 * 获取所有的相册
 */
API.Photos.fetchAllAlbums = function () {
    return new Promise(async function (resolve, reject) {

        statusIndicator.start("Photos");

        // 获取数据
        var nextList = async function (page) {
            let albumData = await API.Photos.getPhotos(page);

            // 去掉函数，保留json
            albumData = API.Utils.toJson(albumData, /^shine0_Callback\(/);

            // 相册分类
            let classList = albumData.data.classList || [];
            classList.forEach(classItem => {
                QZone.Photos.ClassMap[classItem.id] = classItem.name;
            });

            // 相册列表
            let albumList = albumData.data.albumList || [];
            let total = albumData.data.albumsInUser;
            QZone.Photos.Album = QZone.Photos.Album.concat(albumList);

            statusIndicator['Photos'].total = total;
            statusIndicator.update("Photos");

            if (QZone.Photos.Album.length < total && page * Qzone_Config.Photos.pageSize < total) {
                // 请求一页成功后等待一秒再请求下一页
                await API.Utils.sleep(Qzone_Config.Photos.querySleep * 1000);
                // 总数不相等时继续获取
                await arguments.callee(page + 1);
            } else {
                resolve(QZone.Photos.Album);
            }
        }
        // 获取第一页相册列表
        await nextList(0);
    });
};

/**
 * 获取相册列表
 */
API.Photos.fetchAllList = async function () {
    // 重置数据
    QZone.Photos.Album = [];
    QZone.Photos.Data = [];
    QZone.Photos.ClassMap = {};
    QZone.Photos.Images = new Map();

    // 获取所有相册
    let albumList = await API.Photos.fetchAllAlbums();

    // 下载相片
    for (let i = 0; i < albumList.length; i++) {

        statusIndicator.download("Photos");

        const album = albumList[i];
        // 获取每个相册的相片列表
        const photoList = await API.Photos.fetchOneAllList(album);
        // 分类名称
        let className = QZone.Photos.ClassMap[album.classid] || "其它";

        const _photoList = _.chunk(photoList, Qzone_Config.Photos.downloadThread);

        let photoOrder = 1;
        for (let j = 0; j < _photoList.length; j++) {

            const list = _photoList[j];
            let tasks = [];
            for (let k = 0; k < list.length; k++) {

                const photo = list[k];

                // 创建文件夹
                let folderName = QZone.Photos.ROOT + "/" + className + "/" + album.name;
                await API.Utils.createFolder(folderName);

                // 下载相片
                // 自动识别，默认原图优先
                let url = photo.url;
                if (Qzone_Config.Photos.exifType === "hd") {
                    url = API.Photos.getDownloadUrl(photo);
                }
                url = url.replace(/http:\//, "https:/");
                let preNum = API.Utils.prefixNumber(photoOrder, photoList.length.toString().length);
                let photoName = preNum + "_" + photo.name;
                photoName = API.Utils.filenameValidate(photoName);
                let filepath = QZone.Photos.ROOT + "/" + className + "/" + album.name + "/" + photoName;

                let imageInfo = {
                    uid: photoName,
                    filename: photoName,
                    filepath: filepath,
                    isMimeType: true,
                    name: photo.name,
                    desc: photo.desc,
                    url: url,
                    source: album.name,
                    className: className
                };
                tasks.push(operator.downloadImage(imageInfo));

                photoOrder++;
            }

            await Promise.all(tasks);
        }

        statusIndicator.downloadSuccess("Photos");

        // 请求完一个相册后，等待1秒再请求下一个相册
        await API.Utils.sleep(Qzone_Config.Photos.querySleep * 1000);
    }

    statusIndicator.typeComplete('Photos');
    //下一步，下载视频
    operator.next(OperatorType.VIDEO_LIST);
}

/**
 * 获取所有视频列表
 */
API.Videos.fetchAllList = function (page) {
    statusIndicator.start("Videos");
    return new Promise(async function (resolve, reject) {
        // 获取数据
        var nextList = async function (page) {

            statusIndicator['Videos'].downloading += Qzone_Config.Videos.pageSize;
            statusIndicator.update('Videos');
            let videoPageData = await API.Videos.getVideos(page);

            // 去掉函数，保留json
            videoPageData = API.Utils.toJson(videoPageData, /^shine0_Callback\(/);

            let videos = videoPageData.data.Videos;
            if (videos && videos.length == 0) {
                // 100个视频，只有95个有权限的场景
                resolve(QZone.Videos.Data);
                return;
            }

            statusIndicator['Videos'].downloading -= videoPageData.data.Videos.length;
            statusIndicator['Videos'].downloaded += videoPageData.data.Videos.length;
            statusIndicator.update('Videos');

            QZone.Videos.total = videoPageData.data.total;
            QZone.Videos.Data = QZone.Videos.Data.concat(videoPageData.data.Videos);

            // 提示信息
            statusIndicator.total(QZone.Videos.total, 'Videos');
            statusIndicator.update('Videos');

            if (QZone.Videos.Data.length < QZone.Videos.total && page * Qzone_Config.Videos.pageSize < QZone.Videos.total) {
                // 请求一页成功后等待一秒再请求下一页
                await API.Utils.sleep(Qzone_Config.Videos.querySleep * 1000);
                // 总数不相等时继续获取
                await arguments.callee(page + 1);
            } else {
                resolve(QZone.Videos.Data);
            }
        }
        await nextList(page);
    });
};

/**
 * 处理所有视频
 */
API.Videos.hadlerAllList = function () {
    // 重置数据
    QZone.Videos.Data = [];

    API.Videos.fetchAllList(0).then((data) => {
        let videoUrls = [];
        for (let index = 0; index < data.length; index++) {
            const videoInfo = data[index];
            videoUrls.push(videoInfo.url);
        }
        let filepath = QZone.Videos.ROOT + '/视频链接.downlist';
        API.Utils.writeFile(videoUrls.join("\r\n"), filepath, (fileEntry) => {
            //下一步，等待图片下载完成
            statusIndicator.typeComplete('Videos');
            operator.next(OperatorType.AWAIT_IMAGES);
        }, (error) => {
            //下一步，等待图片下载完成
            statusIndicator.typeComplete('Videos');
            operator.next(OperatorType.AWAIT_IMAGES);
        });
    }).catch((msg) => {
        console.error(msg);
        //下一步，等待图片下载完成
        statusIndicator.typeComplete('Videos');
        operator.next(OperatorType.AWAIT_IMAGES);
    });
}

/**
 * 递归获取所有收藏列表
 */
API.Favorites.getAllList = async function () {
    // 获取一页的收藏列表
    var nextPage = async function (pageIndex) {

        console.debug('正在获取收藏夹列表，当前页：', pageIndex)

        // 收藏夹配置项
        let option = Qzone_Config.Favorites;

        // 递归获取所有收藏列表
        return await API.Favorites.getFavorites(pageIndex).then(async (data) => {

            // 去掉函数，保留json
            data = API.Utils.toJson(data, /^_Callback\(/);

            console.debug('已获取收藏夹列表，当前页：', pageIndex, data)

            // 总数
            QZone.Favorites.total = data.data.total_num || 0;

            // 转换数据
            let dataList = API.Favorites.convert(data.data.fav_list);

            // 添加到全局变量
            QZone.Favorites.Data = QZone.Favorites.Data.concat(dataList);

            // 是否还有下一页
            let hasNextPage = API.Utils.hasNextPage(pageIndex, option.pageSize, QZone.Favorites.total, QZone.Favorites.Data);
            if (hasNextPage) {
                // 请求一页成功后等待一秒再请求下一页
                let min = option.randomSeconds.min;
                let max = option.randomSeconds.max;
                let seconds = API.Utils.randomSeconds(min, max);
                await API.Utils.sleep(seconds * 1000);
                // 总数不相等时继续获取
                return await arguments.callee(pageIndex + 1);
            } else {
                return QZone.Favorites.Data;
            }
        }).catch(async (e) => {
            console.error('获取收藏列表异常,当前页：', pageIndex, e);
            // 请求一页成功后等待一秒再请求下一页
            let min = option.randomSeconds.min;
            let max = option.randomSeconds.max;
            let seconds = API.Utils.randomSeconds(min, max);
            await API.Utils.sleep(seconds * 1000);
            // 总数不相等时继续获取
            return await arguments.callee(pageIndex + 1);
        });
    }
    // 开始请求
    return await nextPage(0);
};


/**
 * 处理所有收藏
 */
API.Favorites.hadlerAllList = function () {
    // 重置数据
    QZone.Favorites.Data = [];

    API.Favorites.fetchAllList().then((data) => {
        // 处理数据
        console.info('所有收藏夹列表完成：', data);
    }).catch((e) => {
        console.error("获取收藏列表异常：", e);
    });
}