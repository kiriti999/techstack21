<blog_post_details_USER class='mobile_center'>
    
    <div class='content col-md-9' {opts}>
        <div class='container-fluid'>
            <div class='row'>
                <div class="col-md-12 fadeInAnimation" id='blog_post_details' style="padding: 0 5%;">
                    <div class='row blog_item_title_post_details'>
                        <div class='col-md-12 margin_bottom5' style='text-align: justify'>
                            <h4 style="margin-top: 20px;">
                                <a class="blog_item_title" href='#'>{article.title} </a>
                            </h4>
                        </div>
                    </div>

                    <div class='row'>
                        <div class='col-md-12 col-md-12 col-xs-12 mobile_margin_bottom10'>
                            <div class='blog_time'>
                                <h5 class="blog_time">By techstack21 on {article.created_at}</h5>
                            </div>
                        </div>
                    </div>


                    <div class='row'>
                        <div class='col-md-12 col-md-12 col-xs-12'>
                            <raw id="complete_topic_details"></raw>
                        </div>
                    </div>
                    
                        
                    <!--SOCIAL ICONS AND THUMBS UP-->
                    <div class="" style='padding: 7px 1px; margin-top: 10px;'>
                        <div class='flex-container'>
                            <div class='flex-item' style="max-width: 80%;">
                                    <div>
                                        <!--Facebook Share USER-->
                                        <a class='icon social'
                                            id="fb_shareAsUser" 
                                            name="fb_{article.article_id}"
                                            data-title={article.title}
                                            data-details='{article.details}'
                                            data-postImageUrl='{article.url}'
                                            data-url='http://www.techstack21.com/article/{article.url}'
                                            onclick='{fbSharePostAsUser}'>

                                            <i class='fa fa-facebook' 
                                            data-title={article.title}
                                            data-details='{article.details}'
                                            data-postImageUrl='{article.url}'
                                            data-url='http://www.techstack21.com/article/{article.url}'></i>
                                        </a>
                                         <!--Facebook Share USER-->
                                    </div>
                                <div>
                                    <!--twitter share-->
                                    <a id="twitterShare" href='http://twitter.com/share?text={article.title}&url=http://www.techstack21.com/article/{article.url}&hashtags=tech' target="_blank" class='icon social tw' data-event="Twitter">
                                        <i class='fa fa-twitter'></i>
                                    </a>
                                    
                                    <!--twitter share-->
                                </div>
                                <div>
                                    <!--linkedin share-->
                                    <a class="icon social tw" href='https://www.linkedin.com/shareArticle?mini=true&url=http://www.techstack21.com/article/{article.url}+&title={article.title}&summary=""&source=techstack21.com' target="_blank" id="fb_{article.article_id}" >
                                        <i class='fa fa-linkedin'></i>
                                    </a>
                                    <!--linkedin share-->
                                </div>

                                <div>
                                    <!--  google share  -->
                                    <a class="icon social tw" href="//plus.google.com/share?&url=http://www.techstack21.com/article/{article.url}" onclick="window.open(this.href, '','scrollbars=1', 'width=400,height=620'); return false;">
                                        <i class='fa fa-google-plus'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!--DISQUS-->
            <!--DISQUS-->
            
            <div class='' style="margin-top: 50px;">
                <div id="disqus_thread"></div>
            </div>
            
            <!--DISQUS-->
            <!--DISQUS-->
            
        </div>
        <div class="clear"></div>
    </div>
    
    <script>
        var self = this;
        self.data = {};

        if(typeof opts !== 'undefined' && opts !== null) {
            self.article = (opts.article);
            self.complete_topic_details.innerHTML = (opts.article.details);
        }
        
        riot.util.tmpl.errorHandler = function (err) {
            console.error(err.message + ' in ' + err.riotData.tagName); // your error logic here
        }
        
        linkedInShare(e) {
            popupTools.popup('linkedInShare/', "linkedin Authentication", {}, function (err, user) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('user social profile ', user);
                    NProgress.done();
                }
            });
        }
    </script>
</blog_post_details_USER>