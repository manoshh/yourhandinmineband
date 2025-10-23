(function() {

    videojs.Embed = videojs.Button.extend({
        init: function(player, options) {
            videojs.Button.call(this, player, options);
            
            this.embedEl_ = new videojs.EmbedWindow(this.player(), {});
            this.player().el().appendChild( this.embedEl_.el() );
            
            this.on('click', this.showEmbedWindow);
        },
        
        showEmbedWindow: function(embedCode) {
            // gather the embed code
            var src = this.player().currentSrc(),
                pluginObj = this.player().options().plugins,
                pluginStr = JSON.stringify(pluginObj),
                embedCode = [
                '<link href="http://vjs.zencdn.net/4.6/video-js.css" rel="stylesheet">',
                '<script src="../vjs.zencdn.net/4.6/video.js"></script>',
                '<video class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" width="640" height="360" poster="'+ (this.player().poster() || '' ) +'" data-setup=\'{}\'>',
                '\t<source src="'+src+'" type="video/mp4" />',
                '</video>'
                ].join('\n');
            
            
            // create embed window element and show it
            
            this.embedEl_.setEmbedCode(embedCode);
            this.embedEl_.show();
            
            [].slice.call(this.embedEl_.el().getElementsByTagName('textarea'))[0].select();
        }
    });

    videojs.Embed.prototype.onClick = function(){};
    
    // Embed Window
    videojs.EmbedWindow = videojs.Component.extend({
        init: function(player, options) {
            
            videojs.Component.call(this, player, options);
            this.hide();
            
            // create the element here
            this.el().className = 'vjs-embed-window';
            this.el().innerHTML = '<h4 class="vjs-embed-title"><span class="icon-code"></span>Embed Code</h4>';
            
            // render exit button
            this.exitEl_ = document.createElement('div');
            this.exitEl_.className = 'vjs-button close';
            this.exitEl_.innerHTML = '<a href="#">Close</a>';
            
            // add listener to remove popup
            this.exitEl_.addEventListener("click", function(e){
                e.preventDefault();
                this.parentNode.style.display = "none";
            }, false);

            this.el().appendChild(this.exitEl_);
            
            // add the textarea
            this.textAreaEl_ = document.createElement('textarea');
            this.el().appendChild(this.textAreaEl_);
        },
        setEmbedCode: function(embedCode) {
            this.textAreaEl_.value = embedCode || "";
        }
    });
    
    // create button html
    var createEmbedButton = function(options) {
        var props = {
            className: 'vjs-embed-button vjs-control',
            innerHTML: '<div class="vjs-control-content"><div class="button">' + ('Embed') + '</div></div>',
            role: 'button', 
            'aria-live': 'polite',
            tabIndex: 0
        };
        
        return videojs.Component.prototype.createEl(null, props);
    };
    
    // attach that plugin
    var embed;
    videojs.plugin('embed', function() {
        
        // get options
        var options = { 'el' : createEmbedButton() };
        
        // create instance of the above and add it to the control bar
        embed = new videojs.Embed(this, options);
        this.controlBar.el().appendChild(embed.el());
    });
})();