//ページを開いた時にChrome APIを叩く
chrome.runtime.onMessage.addListener((req, _, sendResponse)=>{
    if(req.action == "get_shell"){
        //shellの画像を表側へ送信
        chrome.runtime.getPackageDirectoryEntry((rootPath)=>{
            rootPath.getFile("kero_412.png", {create:false}, (path)=>{
                path.file((file)=>{
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e)=>{
                        sendResponse({
                            "shell": e.target.result
                        });
                    }
                });
            });
        });
    }else if(req.action == "get_context_menu"){
        //コンテキストメニュー一覧を取得
        sendResponse([
            {
                "name":"時刻"
            },
            {
                "name":"タイマー"
            }
        ]);
    }

    //非同期の場合trueにする
    return true;
});