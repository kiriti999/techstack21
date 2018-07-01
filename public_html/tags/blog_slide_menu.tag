<blog_slide_menu>
    <nav class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right" id="cbp-spmenu-s2">
        <div style="background: #fff;display: flex;">
            <div style="flex:1">
                <h3>techstack21</h3>
            </div>
            <div id="menuClose" class="fa fa-close"></div>
        </div>
        <ul id="main-menu-list">
            <li class="main-menu-item" if="{(typeof DataMixin !== 'undefined' && DataMixin !== null) && (DataMixin.getRole() === 'ROLE_ADMIN')}">
                <a>
                    <span class="create_button btn btn-xs btn-default" id='post_new_topic_btn' data-toggle="modal" data-target="#blog_posting_modal">+ CREATE POST</span>
                </a>
            </li>
        
        <!--  <a href="/#blog_topic_title">Home</a>  -->
        <!--  <a href="#">About me</a>  -->
        <!--  <a href="#">Use cases</a>  -->
        <!--  <a href="#">Interview Preparations</a>  -->
        <!--  <a href="#">Latest Blogs</a>  -->
        <!--  <a href="#">Videos</a>  -->
        <!--  <a href="#">Contact us</a>  -->

            <li><a href="http://www.techstack21.com">Home</a></li>
            <li><a onclick="{getArticleByCategory}" href="#">Javascript</a></li>
            <li><a onclick="{getArticleByCategory}" href="#">NodeJs</a></li>
            <li><a onclick="{getArticleByCategory}" href="#">Jquery</a></li>
            <li><a onclick="{getArticleByCategory}" href="#">Latest Tech</a></li>

        </ul>

        <!--  <a href="#" id="adminLogin" onclick="{authenticate}" if="{opts.role == 'ROLE_USER' || DataMixin.getRole() != 'ROLE_ADMIN'}">ADMIN LOGIN</a>  -->
        <li class="main-menu-item" if="{(typeof DataMixin !== 'undefined' && DataMixin !== null) && (DataMixin.getRole() === 'ROLE_ADMIN')}">
            <a data-toggle="collapse" id='logout' data-target=".navbar-collapse.in" href="#" onclick="{logout}">LOGOUT</a>
        </li>
    </nav>

    <script>
        this.mixin(SharedMixin);
        var self = this;
        

        getArticleByCategory(e) {
            //classie.toggle($('#cbp-spmenu-s2'), 'cbp-spmenu-open');
            //$('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
            console.log('e.target.innerText', e.target.innerText);
            $.ajax({
                url:'/get_post_by_category/' + encodeURIComponent(e.target.innerText),
                success: function(articles) {
                    console.log('success postByCategories: ', articles);
                    DataMixin.data.topics = articles;
                    self.observable.trigger('set_data_on_load');
                },
                error: function(err){
                    console.log('error ', err);
                }
            })
        }
        
        
        self.on('mount', function () {
            if(document.getElementById) {
                var menuRight = document.getElementById('cbp-spmenu-s2');
                var showRightPush = document.getElementById('nav-icon3');
                var menuClose = document.getElementById('menuClose');
                var mainMenuList = document.getElementById('main-menu-list');
                var body = document.body;

                showRightPush.onclick = function() {
                    classie.toggle(menuRight, 'cbp-spmenu-open');
                };
                
                menuClose.onclick = function(){
                    classie.toggle(menuRight, 'cbp-spmenu-open');
                    $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                }
            }
        });
        
        
        authenticate(){
            self.currentState = DataMixin.state;
            self.observable.trigger('previous_state', self.currentState);
            riot.route('signup_popup');
        }

        logout() {
            $.ajax({
                url:"/logout",
                success: function(res){
                    DataMixin.setAuthentication(res);
                    $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                    riot.route(res.redirect); 
                },
                error: function(err){
                    console.error('err ', err);
                }
            });
        }

    </script>
</blog_slide_menu>
