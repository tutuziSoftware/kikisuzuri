//シェルの表示、イベントの設定
$(()=>{
    //シェルの表示領域。
    //シェルの表示領域は左右に移動できる。
    var shell_space = $("<div>")
                        .css("position", "fixed")
                        .css("bottom", 0)
                        .css("right", 0)
                        .draggable({ axis: "x" });

    //シェルの画像をbackground.jsから取得 & 設定
    chrome.runtime.sendMessage({action: "get_shell"}, function(res){
        var shell = $("<img>")
                        .attr("src", res.shell)
                        .bind('contextmenu', create_get_context_menu_listener());

        shell_space
            .append(shell)
            .appendTo("body");
    });

    /**
     * シェルを右クリックした時のイベントリスナー。
     * @returns {Function}
     */
    function create_get_context_menu_listener(){

        /**
         * メニューを表示する為のクラスです。
         * メニューの表示・操作はこのクラスで行います。
         */
        class MenuAPI{
            constructor() {
                this.$menu = $("<ul>");
                this.is_show = false;
            }

            /**
             * メニューを表示します。
             * メニューの項目、および
             */
            open_balloon(){
                var self = this;

                chrome.runtime.sendMessage({action: "get_context_menu"}, (menus)=>{
                    menus.forEach(function(menu){
                        var li = $("<li>").text(menu.name);
                        if(menu.event_name){
                            li.click(()=>{
                                chrome.runtime.sendMessage({action:menu.event_name}, (ret)=>{
                                    self[ret.method]();
                                });
                            });
                        }
                        this.$menu.append(li);
                    }, this);

                    //バルーン基本CSS
                    this.$menu
                        .css("position", "absolute")
                        .css("display", "inline-block")
                        .css("top", "-250%")
                        .css("left", "-150%")
                        .css("list-style-type", "square")
                        .css("padding", "0px 20px 0px 25px")
                        .css("border", "1px solid black")
                        .css("border-radius", 10)
                        .css("text-align", "left")
                        .find(":empty")
                        .css("list-style-type", "none")
                        .css("height", 20)

                    //バルーン追加CSS
                    this.$menu
                        .css("background-color", "rgb(61,58,63)")
                        .css("color", "white")
                        .appendTo(shell_space);
                });

                this.is_show == true;
            }

            close_balloon(){
                this.$menu.remove();
                this.$menu = $("<ul>");
                this.is_show == false;
            }

            toggle_balloon(){
                if(this.is_show == false){
                    this.open_balloon();
                }else{
                    this.close_balloon();
                }
            }
        };
        var menu_api = new MenuAPI;

        return function(){
            menu_api.toggle_balloon();

            return false;
        };
    }
});


$(()=>{
    //gapiのロード確認
    $("<script>")
        .attr("src", "https://apis.google.com/js/client.js?onload=callbackFunction")
        .appendTo("head");
});

function callbackFunction(){
    console.log(arguments);
    debugger;
}