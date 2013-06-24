$(document).ready(function(){
    var myMap,
        myPlacemark;


    // Дождёмся загрузки API и готовности DOM.
    // ymaps.ready(init);
    $('#newMap').each(function(){
      ymaps.ready(init);
    })

    function init () {
        // Создание экземпляра карты и его привязка к контейнеру с
        // заданным id ("map").
        myMap = new ymaps.Map('newMap', {
            // При инициализации карты обязательно нужно указать
            // её центр и коэффициент масштабирования.
            center:[55.76, 37.64], // Москва
            zoom:10
        });

        myPlacemark = new ymaps.Placemark([55.76, 37.64], { 
            // content: 'Москва!', 
            // balloonContent: 'Столица России' 
        }, {
                hideIconOnBalloonOpen: false,
                iconImageHref: 'ico/map_pin.png',
                iconImageSize: [35,46]

        });

        myMap.geoObjects.add(myPlacemark);

    }
// всплыв попап на имени 2
    $(".hintBoxInfo").each(function() {

        var $this = $(this),
            ico = $('.name_info.product_name', $this),
            popup = $('.content_bg_top.search_popup', $this),
            speed = 400,
            block = false;

        popup.hide();

        ico.mouseenter(function(){

            if(block) return false;
            block = true;

            popup.fadeIn(speed, function(){

                block = false;
            })
        })

        ico.mouseleave(function(){

            popup.fadeOut(speed);
        })

    });
// слайдер на продуктах 2
    $('.itemSlider').each(function(){

        var $self = $(this),
            $controlBlock = $('.slides_control', $self),
            $control = $('.slides_control li', $self),
            $viewImgBlock = $('.slides', $self),
            $viewImg = $('.slides li', $self),
            liWidth = $('.slides li', $self).first().width(),
            controlLength = $control.length,
            block = false,
            blockInt = false,
            pos = 0,
            idx = 0,
            count = $('.slider1 .slides_control li').length,
            slides = '',
            flag_moveSpeed = 1000;
            
        $control.first().addClass('active');
        $viewImg.first().addClass('active');      

        $control.click(function(){

            if( block ) return false; 
            block = true;

            pos = $(this).index();

            navigate();

            return false;
        });

        function navigate() {
            $viewImgBlock.animate({
                'margin-left': - liWidth * pos
            }, flag_moveSpeed, 'swing', function(){
                block = false;
            });

            $control
                .eq(pos).addClass('active')
                .siblings('.active').removeClass('active');
            $viewImg
                .eq(pos).addClass('active')
                .siblings('.active').removeClass('active');
        }

        function pressNextTab(){

            if(blockInt == false){
            
                if( pos == controlLength - 1 ) {
                    $control.eq(0).click();    
                } else {
                    $control.eq(pos).next().click();
                }
            }
                  
        }
    
        var int = setInterval(pressNextTab, 5000);

        $self.mouseenter(function(){
             blockInt = true;
        })
        $self.mouseleave(function(){
             blockInt = false;
        })

    });

// search by disease 
    // иконка инфо

    $(".nameBoxInfo").each(function() {

        var $this = $(this),
            ico = $('.name_info', $this),
            popup = $('.search_info_disease_wrap', $this),
            speed = 400,
            block = false;

        popup.hide();

        ico.click(function(){

            if(block) return false;
            block = true;

            popup.fadeToggle(speed, function(){

                block = false;
            })
        })

    });

// крестик
    $(".nameInFo").each(function() {

        var $this = $(this),
        icoClose = $('.close_filter_second.blue', $this),
        popup = $('.search_info_disease_wrap', $this),
        speed = 400,
        block = false;

        icoClose.click(function(){

            if(block) return false;
            block = true;

            popup.fadeOut(speed, function(){

                block = false;
            })
            return false;
        })
    })

// табы в поиске по заболеванию

    $(".tabsBox").each(function() {

        var $this = $(this),
          tabsControls = $('.sort_disease.radio_style.disease', $this),
          tabsListLi = $('.tabsContent > li', $this),
          attentionBoxBottom = $('.attention_box.bottom', $this);

        tabsListLi.first().siblings().hide();
        attentionBoxBottom.hide();

        $('label', tabsControls).click(function(){
            $('input:radio', $(this)).attr('checked', 'checked');

            if ($.browser.msie && $.browser.version < 9.0) {

                if ( $('input:radio, input:checkbox', $(this)).attr('checked') == 'checked' ){

                    $(this).addClass('checked').parent().siblings().find('label').removeClass('checked');
                    } else {

                        $(this).removeClass('checked').parent().siblings().find('label').removeClass('checked');
                    }
                }


            var pos = $(this).parent().index();
            $(this).parent().addClass('active').siblings().removeClass('active');
            $('.tabsContent > li', $this).eq(pos).css('display', 'block').siblings().hide();
            return false;
        })

// всплывашка в низу поиск по заболеванию

        setTimeout(function(){

            attentionBoxBottom.fadeIn(1000)
        }, 2000);

    })

// прыгающая корзина
    $(".shopping").mouseup(function(event){
        $(this).css('top', 1);
    }).mousedown(function(event){
        $(this).css('top', 2);
    });


// исчезновение всплыв инфо по нажатию
    $('.showBox, .search_info_disease_wrap .close_filter_second').on('click', function(event){
        $('.search_info_disease_wrap').fadeOut(400);
    });
    
    $('.search_info_disease_wrap, .name_info').on('click', function(event){
        event.stopPropagation();
    })

    $('.contentAutorization').each(function(){

        var $this = $(this),
            registration = $('.registration_button.reg_but', $this),
            authorization = $('.authorization_button.reg_but', $this),
            authorizationForm = $('.avtorization_form', $this),
            regFromSecond = $('.regFromSecond', $this),
            speed = 400;

        registration.hide();
        authorization.hide();

        authorizationForm.mouseenter(function(){

            authorization.fadeIn(speed);
        })
        authorizationForm.mouseleave(function(){

            authorization.fadeOut(speed);
        })

        regFromSecond.mouseenter(function(){

            registration.fadeIn(speed);
        })
        regFromSecond.mouseleave(function(){

            registration.fadeOut(speed);
        })

    });
// ---
    $('.content_bg_wrap').each(function(){

        var $this = $(this),
            deliveryList = $('.deliveryList', $this),
            newMap = $('.newMapSecond', $this),
            speed = 400;

        newMap.hide();

        // $('label', $this).click(function(){
        //     $('input:radio', $(this)).attr('checked', 'checked');

        //     var pos = $(this).parent().index();
        //     $(this).parent().addClass('active').siblings().removeClass('active');
        //     $('.tabsContent > li', $this).eq(pos).css('display', 'block').siblings().hide();
        //     return false;
        // })

         $('label', deliveryList).click(function(){
            console.log(1);

            // $('.deliveryList > li').addClass('active').siblings().removeClass('active');

            // if($('.deliveryList > li').hasClass('active')){

            //     newMap.fadeIn(speed);
            // };

            newMap.eq(pos).fadeIn(speed).siblings().fadeOut(speed);
        })


    })

});
