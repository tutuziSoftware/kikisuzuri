"use strict";

var menus = [
    {
        "name":"用事"
    },
    {
        "name":"ゲーム"
    },
    {
        "name":"ニュース"
    },
    {
        "name":"おすすめ/お役立ち"
    },
    {
        "name":"チュートリアル"
    },
    {
        "name":""
    },
    {
        "name":"本体設定"
    },
    {
        "name":"ゴーストの変更"
    },
    {
        "name":"シェルの変更"
    },
    {
        "name":"バルーンの変更"
    },
    {
        "name":""
    },
    {
        "name":"手前に/普通に"
    },
    {
        "name":"どいて"
    },
    {
        "name":"疲れてない？"
    },
    {
        "name":"ニンゲンヤメマスカ",
        event_name:"cancel",
        event:"close_balloon"
    },
    {
        "name":""
    },
    {
        name:"キャンセル",
        event_name:"cancel",
        event:"close_balloon"
    }
];




chrome.runtime.onMessage.addListener((req, _, sendResponse)=>{
    var events = {
        "get_shell":()=>{
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
        },
        "get_context_menu":()=>{
            //コンテキストメニュー一覧を取得
            sendResponse(menus);
        }
    }

    if(events[req.action]) events[req.action]();

    //コンテキストメニューの設定項目に応じて動作を返す。
    menus.filter((menu)=>{
        if(req.action == menu.event_name){
            return menu;
        }
    }).forEach((menu)=>{
        sendResponse({
            method:menu.event
        });
    });

    //非同期の場合trueにする
    return true;
});

chrome.identity.getAuthToken({'interactive':true}, function(){
    debugger;
    console.log(arguments);
});