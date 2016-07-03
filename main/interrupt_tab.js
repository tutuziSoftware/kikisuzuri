//ページを開いた時
$(()=>{
    var shell_space = $("<div>")
                        .css("position", "fixed")
                        .css("bottom", 0)
                        .css("right", 0);

    chrome.runtime.sendMessage({action: "get_shell"}, function(res){
        console.dir(res);

        var shell = $("<img>")
                        .attr("src", res.shell)
                        .bind('contextmenu', create_get_context_menu_listener())
                        .draggable({ axis: "x" });

        shell_space
            .append(shell)
            .appendTo("body");
    });

    function create_get_context_menu_listener(){
        var is_show = false;
        var $menu = $("<ul>");

        return function(){
            if(is_show == false){
                chrome.runtime.sendMessage({action: "get_context_menu"}, function(menus){
                    menus.forEach((menu)=>{
                        $menu.append($("<li>").text(menu.name));
                    });

                    $menu
                        .css("position", "relative")
                        .appendTo(shell_space);
                });
            }else{
                $menu.remove();
                $menu = $("<ul>");
            }

            is_show = !is_show;

            return false;
        };
    }
});