$(document).ready(function(){
    
    // ----------------------------------------------------КАРТА-------------------------------------------------

    // Как только будет загружен API и готов DOM, выполняем инициализацию
    $('#map').each(function(){
      ymaps.ready(init);
    })

    function init () {
        var myMap = new ymaps.Map('map', {
                // При инициализации карты, обязательно нужно указать ее центр и коэффициент масштабирования
                center: [55.76, 37.64], // Москва
                zoom: 10,
                behaviors: ["default", "scrollZoom"]
            }),
            myCollection = new ymaps.GeoObjectArray();

        function makePlacemarker( number, coordinates, content ){
            return new ymaps.Placemark(coordinates, {
                // Контент балуна
                balloonContentBody: content,
                iconContent: number
            }, {
                // Не скрывать иконку метки при открытии балуна
                hideIconOnBalloonOpen: false,
                // Изображение иконки метки
                iconImageHref: 'ico/marker.png',
                iconImageSize: [28,41],
                // Задаем макет балуна - пользовательская картинка с контентом
                balloonShadow: false,
                balloonOffset: [120, 0]
            });

        }
      
        $('.map_list > li').each(function(){
            var $this = $(this),
                lat = $('.coordsLat', $this).text()*1,
                lng = $('.coordsLng', $this).text()*1,
                coords = [lat, lng],
                title = $('h3', $this).text(),
                bubleContent = $('.mapInfo', $(this)).html();

            myCollection.add( makePlacemarker(  
                            '<b class="markerNum">' + ( $(this).index() + 1)  + '</b>', 
                            coords,
                            '<div class="small_popup">\
                                    <h3 class="title_popup dark">'+ title +'</h3>'
                                    + bubleContent + 
                            ' <div class="small_wrap_shadow"></div>\
                            </div>'
                            ))

        })

        myMap.geoObjects.add(myCollection);

        $('.map_list > li').on('click', function(event) {
          var $this = $(this);

            myCollection.get( $(this).attr('id') ).balloon.open();

        });


        var mapHeight = $('.map_list').height(),
            mapListli = $('.map_list li'),
            mapListLiHeight = $('.map_list li').first().outerHeight(),
            mapScrollHeight =  $('.mapScroll').height(),
            maxScroll = mapHeight - mapScrollHeight,
            dragHeigth = $('.mapScroll .mCSB_dragger').height(),
            maxDrag = mapScrollHeight - dragHeigth;

        myCollection.events.add('click', function(event){

          // var scrollPos = ( '#' + myCollection.indexOf(event.get('target')) );
          // $('.mapScroll').mCustomScrollbar('scrollTo', scrollPos);

          var scrollPos = ( myCollection.indexOf(event.get('target')) );

          if ( (scrollPos * mapListLiHeight) > maxScroll ){
            $('.mapScroll .mCSB_container').animate({
              top: -maxScroll
            })
          } else {
            $('.mapScroll .mCSB_container').animate({
              top: -(scrollPos * mapListLiHeight)
            })
          }

          var dragCoefficient = mapScrollHeight / mapListli.length;

          if ( (scrollPos * dragCoefficient) > maxDrag ){
            $('.mapScroll .mCSB_dragger').animate({
              top: maxDrag
            })
          } else {
            $('.mapScroll .mCSB_dragger').animate({
              top: (scrollPos * dragCoefficient)
            })
          }

        })

        $('body').on('mouseenter', function(event){
          var scrollTool = $('.mapScroll .mCSB_scrollTools');
          if ($.browser.msie && $.browser.version == 8.0) scrollTool.hide();
        })


        $('.mapScroll').each(function(){
          var $this = $(this),
              scrollTool = $('.mCSB_scrollTools', $this);

          if ($.browser.msie && $.browser.version == 8.0){

            $this.mouseenter(function(){
             scrollTool.show();
            })

            $this.mouseleave(function(){
             scrollTool.hide();
            })

          }

        })


        $('.map_list > li .button').on('click', function(event){
          event.stopPropagation();
        })

        myMap.controls
            // Кнопка изменения масштаба
            .add('zoomControl')
            // Список типов карты
            .add('typeSelector')
            // Стандартный набор кнопок
            .add('mapTools'); 

    };

    // ----------------------------------------------------КОНЕЦ КАРТЫ-------------------------------------------------

    $('.results_list > li:nth-child(3n+4)').css('clear', 'left');

    // Радиобатоны для ИЕ

   if ($.browser.msie && $.browser.version < 9.0) {

    function checkInputs(target){
      if ( $('input:radio, input:checkbox', target).attr('checked') == 'checked' ){

          if ( target.parent().hasClass('small_table_title') ){
            target.addClass('checked');
            $('.big_table_wrap .big_table input:checkbox').parent().addClass('checked');
          } else {
            target.addClass('checked').parent().siblings().find('label').removeClass('checked');
          }

       } else {

          if ( target.parent().hasClass('small_table_title') ){
            target.removeClass('checked');
            $('.big_table_wrap .big_table input:checkbox').parent().removeClass('checked');
          } else {
            target.removeClass('checked').parent().siblings().find('label').removeClass('checked');
          }

       }
    }

    checkInputs($('label'));

       $('label').each(function(){

          var $this = $(this);
           var mainCheckbox = $('.small_table_title label input:checkbox');

           $(this).click(function(){
               checkInputs($this);
           })
       })

       $('.radio_style').each(function(){
        var $this = $(this);
          $('li:first-child label', $this).addClass('checked');
       })
   }

    // Главный чекбокс
    $('.big_table_wrap').each(function(){
      var $this = $(this),
          mainCheckbox = $('.small_table_title label input:checkbox', $this);

      mainCheckbox.click(function(){

        if (mainCheckbox.attr('checked') == 'checked'){
          $('.big_table input:checkbox', $this).prop('checked', 'checked');
        } else {
          $('.big_table input:checkbox', $this).prop('checked', '');
        }

      })

    })

    // Редактирование полей ввода
    $('.form_line').each(function(){
      var $this = $(this),
        input = $('input:text, input:password', $this),
        inp_text = $('.inp_text', $this),
        passOne = $('.passOne', $this),
        passTwo = $('.passTwo', $this);

      input.val('');

      inp_text.click(function(){
        $(this).hide().next(input).focus();
      })

      input.focusout(function(){

        if ( $(this).val() == '' ){
          $(this).prev(inp_text).show();
        } else {
          $(this).prev(inp_text).hide();
        }

        if ( passOne.val() == '' || passTwo.val() == '' ) return false;

        if ( passOne.val() != passTwo.val() ){
          passTwo.prev(inp_text).show();
        } else {
          passTwo.prev(inp_text).hide();
        }

      })

      input.focus(function(){

          $(this).prev(inp_text).hide();

      })

    })

    // Поиск
    $('.simple_search').on('click keyup', '.search_button, input[type="text"]', function(event){
        event.preventDefault();
        event.stopPropagation();

        var target = $(event.currentTarget);
        if( (event.type == 'keyup' && event.keyCode !== 13) || (event.type == 'click' && target.attr( 'type' ) == 'text' ) ) return false;

      })

    $('.simple_search').each(function(){

        var $this = $(this),
            input = $('input:text', $this),
            inpVal = input.val();

        input.click(function(){

          if ( $(this).val() == inpVal ){
           input.val('');
          }

        })

        input.focusout(function(){

          if ( $(this).val() == '' ){
            $(this).val(inpVal);
          } 
          
        })
    })

    $('.simple_search .search_popup').each(function(){
      var $this = $(this);
  
      var block = false; if (block) return false;
      $(this).show();
      block = true;
    })

    $('.close_small_popup').click(function(event){

      $(this).closest('.small_popup').fadeOut(400);
      return false;
    })

    $('.article_box .small_popup_box').each(function(){
      var $this = $(this),
          small_popup = $('.small_popup', $this);

      $this.mouseleave(function(){
        small_popup.css('display', '');
      })

    })

    // Валидация форм
    $('.registrationForm').on('change', function(){
      var $this = $(this),
          passOne = $('.passOne', $this),
          passTwo = $('.passTwo', $this),
          passSuccess = $('.pass_sucses', $this);

      if ( (passTwo.val() != '') ){
        passTwo.prev().hide();
        passTwo.prev().text('повторите пароль');
      }

      if ( passOne.val() == '' || passTwo.val() == ''  ){
        passSuccess.hide();
        passTwo.parent().removeClass('no_match_pass');
        passTwo.prev().text('повторите пароль');
        return false;
      }

      if ( passOne.val() == '' || passTwo.val() == '' ) return false;

      if ( passOne.val() == passTwo.val() ){
        passSuccess.show();
        passTwo.parent().removeClass('no_match_pass');
        passTwo.prev().hide().text('повторите пароль');
      } else {
        passSuccess.hide();
        passTwo.parent().addClass('no_match_pass');
        passTwo.prev().text('повторите пароль');
        passTwo.prev().show().text('введенные пароли несовпадают');
      }

    })

    // Скролл

    $('.scroll_box').mCustomScrollbar({
      scrollInertia: 150,
       advanced:{
        updateOnContentResize: true
        }
    })

   $('.mapScroll').mCustomScrollbar({
      scrollInertia: 150,
      autoHideScrollbar: true,
       advanced:{
        updateOnContentResize: true
        }
  
    })
    
    $('.scroll_box, .mapScroll').each(function(){
      $(this).mousewheel(function(event){
         event.preventDefault();
         event.stopPropagation();
      })
    })

    $('.category_wrap').each(function(){
      var $this = $(this),
          scroll = $('.scroll_box', $this),
          scrollTool = $('.mCSB_scrollTools', $this);

      if ($.browser.msie && $.browser.version == 8.0) {

        $('.product_nav .arise_box').hover(function(){
          scrollTool.hide();
        })

        scrollTool.hide();

        $this.mouseover(function(){
          scrollTool.show();
        })

        $this.mouseleave(function(){
          scrollTool.hide();
        })

      } else {
        scroll.mCustomScrollbar({
          scrollInertia: 150,
          autoHideScrollbar: true
        })
      }
      
    })
     


    // Табы
    $('.tabsWrap').each(function(){
      var $this = $(this)
          tabsControls = $('.tabsControls', $this),
          tabsListLi = $('.tabsList > li', $this);

      tabsListLi.first().siblings().hide();

      $('a', tabsControls).click(function(){
        var pos = $(this).parent().index();
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.tabsList > li', $this).eq(pos).css('display', 'block').siblings().hide();
        return false;
      })

    })

    // Сортировка
    $('.sortBox').each(function(){
      var $this = $(this),
          sortList = $('.category_list', $this),
          button = $('.up', $this);

      button.click(function() {

        if ( $(this).hasClass('down') ){
          SORTER.sort(sortList, 'desc');
          $(this).removeClass('down');
        } else {
          SORTER.sort(sortList);
          $(this).addClass('down');
        }

        return false;
      });

      var SORTER = {};
      SORTER.sort = function(which, dir) {
        SORTER.dir = (dir == "desc") ? -1 : 1;
        $(which).each(function() {
          // Find the list items and sort them
          var sorted = $(this).find("> dd").sort(function(a, b) {
            return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? SORTER.dir : -SORTER.dir; 
          });
          $(this).append(sorted);
        });
      }

    })

    // Скролл

    $(window).scroll(function(){
      var fixHeader = $('.header_fixed'),
          speed = 400,
          popup = $('.fly_block');

      if ( window.pageYOffset > 145 || document.documentElement.scrollTop > 145 ){
        popup.addClass('fixed');
        fixHeader.css('display', 'block');
      } else {
        popup.removeClass('fixed');
        fixHeader.css('display', 'none');
      }

     });

    // Сортировка результатов поиска
    $('.filtrSearch').each(function(){
      var $this = $(this),
          list = $('.section_list', $this);

      $('li:gt(5)', list).hide();

      $('li', $this).each(function(){
        var $this = $(this),
            lis = $('.section_list li', $this);

        if ( $('li', $(this)).length > 6 ){
          $(this).find('.close_all').show();
          $(this).find('.close_all .txt').text('Показать все результаты ('+ (( lis.length ) - 6) +')');
          $('.up', $this).css('display', 'none');
          $('.name_box', $this).removeClass('active');
        }

      })

      $this.on('click', '.up, .close_all, .name', function(event){
        event.preventDefault();
        event.stopPropagation();


        var close = $(this).closest('li'),
            li = $(this).closest('li').find('.section_list li:gt(5)'),
            up = $(this).closest('li').find('.up'),
            listLi = $(this).closest('li').find('.section_list');

        if ( li.is(':hidden') ){
          li.slideDown();
          $('.txt', close).text('Свернуть результаты');
          $('.up', close).css('display', 'inline-block');
          $('.name_box', close).addClass('active');
        } else {
          li.slideUp();
          $('.txt', close).text('Показать все результаты ('+ (( $('li', listLi).length ) - 6) +')');
          $('.up', close).css('display', 'none');
          $('.name_box', close).removeClass('active');
        }

      })


    })

    $(document).on('keyup', function(event) { 
        if (event.keyCode == 27) {
          $('.showBox').fadeOut(400);
          $('.deleted_list').hide();
          $('.deleted_items .arrow').addClass('up');
        } 
    });

    $('body').on('click', function(event){
      $('.showBox').fadeOut(400);
    });
    
    $('.showBox').on('click', function(event){
      event.stopPropagation();      
    })

    // Попап + Слайдер в попапе
    $('.arise_box').each(function(event){
      var $this = $(this),
          close = $('.close_filter', $this),
          speed = 400,
          ariseSlider = $('.ariseSlider', $this),
          ariseSliderLi = $('.slides li', ariseSlider)
          paginator = $('.paginator', $this),
          pos = 0,
          block = false;

      close.click(function(){
        $(this).closest($this).fadeOut(speed);
        return false;
      })

      ariseSliderLi.first().css('position','relative').siblings().hide();

      for ( i = 0; i < ariseSliderLi.length; i++){
        $('<a href="#"></a>').appendTo(paginator);
      }

      $('a', paginator).first().addClass('active');


      $('a', paginator).click(function(){
        pos = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        if (block) return false; block = true;
        ariseSliderLi.eq(pos).fadeIn(speed, function(){block = false}).css('position','relative').siblings().fadeOut(speed).css('position','absolute');
        return false;
      })


    })

    // Избранное
    $('.favorite_box').each(function(){
      var $this = $(this),
          link = $('> a', $this),
          favIco = $('.favorite_ico');

      link.click(function(){

        if ($(this).parent().hasClass('active')){
          $(this).parent().removeClass('active');
          $(this).text('Удалить из Избранного');
          favIco.show();
        } else {
          $(this).parent().addClass('active');
          $(this).text('Добавить в Избранное');
          favIco.hide()
        }

        return false;
      })

    })

    // Аккордеон
    $('.info_list').each(function(){
      var $this = $(this),
          link = $('h3 a', $this),
          block = false;

      $('.text', $this).hide();

      link.click(function(){
        if (block) return false; block = true;
        // $(this).closest('li').addClass('active').siblings().removeClass('active');
        $(this).closest('li').siblings().find('.text').slideUp();
        $(this).closest('li').find('.text').slideDown(function(){
          block = false;
        });
        return false;
      })

    })

    // Карусель
    $('.scroll-pane').each(function(){
      var $this = $(this),
          lis = $('.scroll-content li', $this),
          needWidth = 0,
          content = $('.scroll-content', $this),
          prev = $('.prev', $this),
          next = $('.next', $this),
          scrollPane = $this,
          scrollContent = $( ".scroll-content", $this ),
          block = false,
          shift = ($('li', scrollContent).outerWidth(true) * 2),
          maxShift = ($('li', scrollContent).outerWidth(true) * 5);

      for ( var i = 0; i < lis.length; i++){
        needWidth = needWidth + ( lis.eq(i).outerWidth(true) );
      }

      next.click(nextClick);

      function nextClick(){
        var currentMargin = parseInt(content.css('margin-left')),
            currentShift = ( currentMargin - shift);

        if (block) return false; block = true;
        
        if ( currentShift < - (needWidth - maxShift ) ){
          content.animate({'margin-left': - (needWidth - maxShift)}, function(){ block = false; next.removeClass('active'); });

          scrollbar.slider( "value", 100 );

        } else {

          content.animate({'margin-left': (( currentMargin - shift))}, function(){ block = false; next.removeClass('active'); });
          resetValue(( currentMargin - shift ));

        }

        return false;
      }

      prev.click(prevClick);

      function prevClick(){
        var currentMargin = parseInt(content.css('margin-left')),
            currentShift = ( currentMargin - shift);

        if (block) return false; block = true;

        if ( currentShift > - ( maxShift ) ){
          content.animate({'margin-left': 0}, function(){ block = false; prev.removeClass('active'); });

          scrollbar.slider( "value", 0 );

        } else {

          content.animate({'margin-left': (( currentMargin + shift))}, function(){ block = false; prev.removeClass('active'); });
          resetValue(( currentMargin + shift));

       }
        return false;
      }

      scrollContent.mousewheel(function(event, delta) {

        var scrollPaneWidth = scrollContent.closest('.scroll-pane').width(),
            scrollContentWidth = scrollContent.closest('.scroll-content').width();

        event.preventDefault();
        if ( delta == -1 ){

          if ( scrollContent.closest('.scroll-pane').hasClass('move_block') ){
            prevMove( scrollPaneWidth, scrollContentWidth );
          } else {
            prevClick();
            next.removeClass('active');
            prev.addClass('active');
          }
          
        } else {

          if ( scrollContent.closest('.scroll-pane').hasClass('move_block') ){
            nextMove( scrollPaneWidth, scrollContentWidth );
          } else {
            nextClick();
            next.addClass('active');
            prev.removeClass('active');
          }
          
        }
      });

      function nextMove(scrollPaneWidth, scrollContentWidth){
        var currentMargin = parseInt(content.css('margin-left')),
            shift = 100,
            currentShift = ( currentMargin - shift),
            maxShift = (scrollPaneWidth - scrollContentWidth) + shift;

        if (block) return false; block = true;

        if ( currentMargin < (maxShift) ){
          content.animate({'margin-left': (scrollPaneWidth - scrollContentWidth)}, function(){ block = false; });
          scrollbar.slider( "value", 100 );
        } else {
          content.animate({'margin-left': (currentMargin - shift) }, function(){ block = false; })
          resetValue( currentMargin - shift );
        }

        return false;
      }

      function prevMove(scrollPaneWidth, scrollContentWidth){
        var currentMargin = parseInt(content.css('margin-left')),
            shift = 100,
            currentShift = ( currentMargin - shift),
            maxShift = (scrollPaneWidth - scrollContentWidth) + shift;

        if (block) return false; block = true;

        if ( currentShift > ( maxShift ) ){
          content.animate({'margin-left': 0}, function(){ block = false; });
          scrollbar.slider( "value", 0 );
        } else {
          content.animate({'margin-left': (currentMargin + shift) }, function(){ block = false; })
          resetValue( currentMargin + shift );
        }

        return false;
      }

      //scrollpane parts


      if ( $this.hasClass('move_block') ){
        scrollContent.width(needWidth + 53);

        if ( $this.width() > (needWidth + 38) ){
          $('.scroll-bar-wrap', $this).hide();
          $('.fade_help', $this).hide();
        }

      } else if ( $this.hasClass('nav_slider') ){
        scrollContent.width(needWidth + 57);

      } else {
        scrollContent.width(needWidth + 78);
      }


      
      //build slider
      var scrollbar = $( ".scroll-bar", $this ).slider({
        slide: function( event, ui ) {
          if ( scrollContent.width() > scrollPane.width() ) {
            scrollContent.css( "margin-left", Math.round(
              ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
            ) + "px" );
          } else {
            scrollContent.css( "margin-left", 0 );
          }
        }
      })

   
      //append icon to handle
      var handleHelper = scrollbar.find( ".ui-slider-handle" )
      .mousedown(function() {
        scrollbar.width( handleHelper.width() );
      })
      .append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
      .wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
   
      //change overflow to hidden now that slider handles the scrolling
      scrollPane.css( "overflow", "hidden" );

      var bigBlock = false;

      $('.product_nav_box .product_nav td').mouseenter(function(){
        var root = $(this);
       
        if( !$(this).find('.scroll-pane').is('div') ) return false;

        // if($('.ui-slider-handle', $this).width()){
          if (bigBlock) return false;   
        // }

        var needWidth = scrollbar.width();
        if( $('.scroll-pane', root).width() == 0 ){
          needWidth = 977;
          $('.scroll-pane', root).width(977);
        }


        var remainder = scrollContent.width() - scrollPane.width();
        var proportion = remainder / scrollContent.width();
        var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
        scrollbar.find( ".ui-slider-handle" ).css({
          width: handleSize,
          "margin-left": -handleSize / 2
        });
        bigBlock = true;        

        handleHelper.width( "" ).width( needWidth - handleSize );

      })
   
      //size scrollbar and handle proportionally to scroll distance
      function sizeScrollbar() {
        var remainder = scrollContent.width() - scrollPane.width();
        var proportion = remainder / scrollContent.width();
        var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
        scrollbar.find( ".ui-slider-handle" ).css({
          width: handleSize,
          "margin-left": -handleSize / 2
        });
        handleHelper.width( "" ).width( scrollbar.width() - handleSize );
      }
   
      //reset slider value based on scroll content position
      function resetValue(needMargin) {
        var remainder = scrollPane.width() - scrollContent.width();

        var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
          parseInt( scrollContent.css( "margin-left" ) );

        var percentage = Math.round( needMargin / remainder * 100 );
        scrollbar.slider( "value", percentage );
      }
   
      //if the slider is 100% and window gets larger, reveal content
      function reflowContent() {
          var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
          var gap = scrollPane.width() - showing;
          if ( gap > 0 ) {
            scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
          }
      }
   
      //change handle position on window resize
      $( window ).resize(function() {
        // resetValue();
        // sizeScrollbar();
        // reflowContent();
      });
      //init scrollbar size
      setTimeout( sizeScrollbar, 10 );//safari wants a timeout


    })

    // Селектбокс
    $(function () {
      $("select").selectbox();
    });

    // Слайдер предпросмотра
    $('.previewSlider').each(function(){
      var $this = $(this),
          slide = $('.slides li', $this)
          pos_start = $('img', slide).width(),
          speed = 400,
          pos = 0;
      
      slide.first().siblings().css('left', pos_start);
      var startSlide = setInterval( sliding, 5000 );  

      function sliding(){

        slide.eq(pos).animate({
          left: -pos_start
        }, speed);
        pos++
        slide.eq(pos).animate({
          left: 0
        }, speed);

        if ( pos > slide.length - 1 ){
          slide.first().css('left', pos_start).animate({left: 0},
             function(){
              slide.first().siblings().css('left', pos_start);
             });
          pos = 0;
        }

      }

    })

    // -----------------------------------------------------Корзина---------------------------------------------------------

    $('.basket_box').each(function(){
      var $this = $(this),
          deletedBox = $('.deletedBox', $this),
          delBut = $('.del', $this),
          delNames = $('.del_name', deletedBox),
          delArr = [],
          delList = $('.deleted_list', $this),
          productName = $('.productName', $this),
          arrow = $('.arrow', $this),
          orderList = $('.order_list', $this),
          scrollBox = $('.orderScroll', $this),
          scrollBoxHeigth = parseInt( $('.orderScroll', $this).css('height') ),
          popup = $('.small_popup', $this);

        deleteItems(delBut);
        showArrow(arrow, delArr, delList);

        $this.mouseenter(function(){
          popup.addClass('open');

          if ( popup.hasClass('open') ){
            showScroll(orderList, scrollBox, scrollBoxHeigth);
          }

        })

        $this.mouseout(function(){
          popup.removeClass('open');
        })

        function deleteItems(target){
          target.off('click');
          target.on('click', function(event){
            event.preventDefault();
            event.stopPropagation();

            var currentHtml = $(this).closest('li').html(),
                currentName = $(this).closest('li').find('.productName').text(),
                maxCount = $(this).closest('li').find('.number'),
                maxCountNum = parseInt(maxCount.text()),
                item_id = $(this).closest('li').attr('itemId');

            var currentNumber = parseInt( maxCount.text() );
            currentNumber--;

            if ( currentNumber == '0' ){
              $(this).closest('li').remove();
            }

            $(this).closest('li').find('.number').text(currentNumber);

            var noPush = false;

            for ( var i = 0; i <= delArr.length -1; i++){

              if ( item_id == delArr[i].itemId ){
                delArr[i].currentCount++;
                noPush = true;
              }
              
            }

            if ( noPush == true ) return false;

            delArr.push(
                {name: currentName,
                maxCount: maxCountNum,
                html: currentHtml,
                itemId : parseInt(item_id),
                currentCount : 1}
              );

            lastDelCheck(delNames, delArr);
            checkLength(delNames, deletedBox);
            createDelList(delList, currentName, item_id);
            returnDeletes();
            showArrow(arrow, delArr, delList);
            showScroll(orderList, scrollBox, scrollBoxHeigth);
            hideLastDelete(delArr);

          })
        }
        
        function returnDeletes(){
          $('li', delList).add(delNames).off('click');
          $('li', delList).add(delNames).on('click', function(){
            var currentPos,
                $this = $(this),
                currentId = parseInt( $(this).attr('itemId') );


            for ( var i = 0; i < delArr.length; i++ ){
              if ( currentId == delArr[i].itemId){
                currentPos = i;
              }
            }
            var block = false;         

            var ordersArr = $('.order_list li');

            // если в списке товаров уже есть товар, который мы возвращаем - увеличиваем колличество этого товара на единицу

            for ( var j = 0; j < ordersArr.length; j++ ){

              if ( currentId == ordersArr.eq(j).attr('itemId')){
                block = true;
                delArr[currentPos].currentCount = parseInt($(ordersArr.eq(j)).find('.number').text()) + 1;
                ordersArr.eq(j).find('.number').text((delArr[currentPos].currentCount));


                if ( delArr[currentPos].maxCount == delArr[currentPos].currentCount ){
                  
                  if ($(this).is('li')) $this.remove();

                  for ( var t = 0; t < $('li', delList).length; t++ ){
                    if ( $('li', delList).eq(t).attr('itemId') == delArr[currentPos].itemId ){
                        $('li', delList).eq(t).remove();
                    }
                  }

                  delArr.splice(currentPos, 1);
                  lastDelCheck(delNames, delArr);
                  deleteItems($('.basket_box .order_list .del'));
                  checkLength(delNames, deletedBox);
                  showArrow(arrow, delArr, delList);
                  showScroll(orderList, scrollBox, scrollBoxHeigth);

                }
              }
            }
            if ( block ) return false;

            // если в списке товаров возвращаемого товара нету - создаем его

            delArr[currentPos].currentCount--;

            $('<li itemId="'+ delArr[currentPos].itemId +'">' + delArr[currentPos].html + '</li>').appendTo(orderList);

            $('.order_list li').each(function(){
              if ($(this).attr('itemId') == currentId){
                $(this).find('.number').text('1');
              }
            })

            showScroll(orderList, scrollBox, scrollBoxHeigth);

            if ( delArr[currentPos].currentCount == '0' ){
              if ($(this).is('li')) $this.remove();

              for ( var t = 0; t < $('li', delList).length; t++ ){
                if ( $('li', delList).eq(t).attr('itemId') == delArr[currentPos].itemId ){
                    $('li', delList).eq(t).remove();
                }
              }

              delArr.splice(currentPos, 1);
              deleteItems($('.basket_box .order_list .del'));
              lastDelCheck(delNames, delArr);
              checkLength(delNames, deletedBox);
              showArrow(arrow, delArr, delList);
            }


          })
        }

        arrow.click(function(event){
          event.preventDefault();
          event.stopPropagation();

          $(this).toggleClass('up');
          delList.toggle();
        })

        deletedBox.mouseleave(function(){
          delList.hide();
          arrow.addClass('up');
        })

    })

    function showArrow(target, array, list){
      if ( array.length - 1 < 1 ){
        target.add(list).hide();
      } else {
        target.show();
      }
    }

    function hideLastDelete(array){
        var delLi = $('.basket_box .deleted_list li');
        delLi.css('display', '');

        for( var i = 0; i < delLi.length; i++ ){
          if ( delLi.eq(i).attr('itemId') == array[array.length-1].itemId ){
            delLi.eq(i).hide();
          }
        }
    }


    function lastDelCheck(target, array){

      if (array.length == 0){
        target.text('');
      } else {

        hideLastDelete(array);

        target.text(array[array.length-1].name);
        target.attr('itemId', array[array.length-1].itemId);
      }
    }

    function createDelList(target, name, id){
      $('<li itemId="' + id + '"><span class="name">' + name + '</span><div class="fade_help"></div></li>').appendTo(target);
    }


    function checkLength(target, eventObj){
      if ( target.text() != '' ){
          eventObj.show();
        } else { 
          eventObj.hide();
          $('.basket_box .arrow').removeClass('up');
          $('.basket_box .deleted_list').hide();
        }
    }

    function showScroll(list, scroll, height){
      var needHeight = 0;
      for (var i = 0; i < $('li', list).length; i++){
        needHeight = needHeight + $('li', list).eq(i).outerHeight(true);
      }
      
      if ( needHeight < height ){
        scroll.css('height', 'auto');
      } else {
        scroll.css('height', height);
      }

    }


    // --------------------------------------------------Модуль выгрузки----------------------------------------------------
    var updateInterval,
        price_id,
        item_id,
        dataArr;


    $('.download_form').each(function(){
      var $this = $(this),
          progressLine = $('.progress_line', $this),
          statusUpload = $('.progress_title', $this),
          button = $('.download_file .button', $this),
          recieve_1 = $('.unload_box_1 .section_list', $this),
          recieve_2 = $('.nomenclature_box .section_list', $this),
          searchForm = $('.search_form', $(this)),
          searchButton = $('.search_button', searchForm),
          searchInp = $('input:text', searchForm),
          searchInpVal = searchInp.val(),
          cancel = $('.cancel_link', $this),
          unbind_but = $('.unbind_but', $this),
          notBindList = $('.not_bind .section_list', $this);

      // Загружаем файл на сервер
      $.ajax_upload(button, {
          action : '../php/priceUpload.php',
          name : 'myfile',
          onSubmit : function(file, ext) {

            this.disable();
            statusUpload.text('Закгрузка ' + file);
            dataArr = [];
            $('li', recieve_1).remove();
            $('li', recieve_2).remove();
            price_id = undefined;
            //updateInterval = setInterval(updateStatus, 500, progressLine);

          },
          onComplete : function(file, response) {
            this.enable();
            statusUpload.text('Закгрузка ' + file + ' завершена');
            outItems('../php/stat.php', $('.unload_box_1 .section_list', $this));
          }
        });

        createEvent(recieve_1);
        bindingItems(recieve_2);
        disBinding(recieve_1);

        // Поиск
        searchForm.on('click keyup', '.search_button, input[type="text"]', function(event){
          event.preventDefault();
          event.stopPropagation();

          var target = $(event.currentTarget);
          if( (event.type == 'keyup' && event.keyCode !== 13) || (event.type == 'click' && target.attr( 'type' ) == 'text' ) ) return false;

          if ( searchInp.val() == currentVal || searchInp.val() == '' ) return false;

          var currentVal = searchInp.val();

          $('.nomenclature_box .section_list li', $this).remove();

          $.get('../php/search.php', {text: currentVal}, function(data){

            for (var i = 0; i < data.items.length; i++){

              $('<li id="' + data.items[i].id + '">\
                      <span class="section_name">' +  data.items[i].name +'</span>\
                      <a class="change" href="#"></a>\
                    </li>').appendTo( recieve_2 );

            }

          }, 'json');

          searchInp.val(searchInpVal);
          
        })
        
        // Отмена перевязки
        cancel.click(function(){
           
          if (price_id == undefined) return false;

          var priceLi = $('.download_form .unload_box_1 .section_list li'),
              block = false;

           for ( var j = 0; j < priceLi.length; j++ ){
            if (priceLi.eq(j).attr('id') == price_id){
              block = true;
            }
           }

           if (block) return false;

          $.post('../php/delink.php', {price_id :price_id, item_id: item_id});

          var lastBind;

           for ( var i = 0; i < dataArr.items.length; i++ ){
            if ( dataArr.items[i].id == price_id ){
              lastBind = dataArr.items[i];
            }
           }

           $('<li id="' + lastBind.id + '">\
                      <span class="section_name">' +  lastBind.name +'</span>\
                      <a class="change" href="#"></a>\
                    </li>').appendTo( recieve_1 );

           if ( $('li', recieve_1).length == 1 ){
            updatePosition();
           }

          return false;
        })

        // Добавляем неперевязанные товары
        unbind_but.click(function(){

          var unbindArr = [],
              lis = $('li', notBindList);

          if (lis.length == 0) return false;

          for (var i = 0; i < lis.length; i++){
            unbindArr.push({
              id: parseInt(lis.eq(i).attr('id')),
              name: lis.eq(i).find('.section_name').text()
            })
          }

          $.post('../php/hold.php', {items: unbindArr});

          lis.remove();
          return false;

        })

        $this.on('submit',function(){
          return false;
        })

      })

    function createEvent(target){

        $('li', target).live('click', function(){

          if ( $(this).hasClass('active') ) return false;

          $(this).addClass('active').siblings().removeClass('active');

          $('.download_form .nomenclature_box .section_list li').remove();

          var currentId = $(this).attr('id');

          var currentObj = searchItem(dataArr, $('.active').attr('id'));
          createLine(currentObj);

        });

    }

    function searchItem(list, id){

      for (var i = 0; i < list.items.length; i++ ){
        if( list.items[i].id == id ) return list.items[i];
      }

    }

    function createLine(currentObj){

      for (var i = 0; i < currentObj.childs.length; i++ ){

        $('<li id="' + currentObj.childs[i].id + '">\
            <span class="section_name">' + currentObj.childs[i].name +'</span>\
            <a class="change" href="#"></a>\
          </li>').appendTo( $('.nomenclature_box .section_list') );

      }

    }

    function updateStatus(target){
       $.get('../php/stat.php', function(data){

          target.animate({width: data.percent + '%'});

          if( data.perсent == 100 ) {
            clearInterval(updateInterval);
          }

        }, 'json');

    }

    function outItems(list, target){

      $.get(list, function(data){

        dataArr = data;

        for (var i = 0; i < data.items.length; i++){

          $('<li id="' + data.items[i].id + '">\
                  <span class="section_name">' +  data.items[i].name +'</span>\
                  <a class="change" href="#"></a>\
                </li>').appendTo( target );

        }

      }, 'json');
    }

    function bindingItems(target){
      target.on('click dblclick', '.change, li', function(event){
          event.preventDefault();
          event.stopPropagation();

          var target = $(event.currentTarget);

          if ( target.is('li') ){
            $(this).addClass('active').siblings().removeClass('active');
          }

          if( (event.type == 'click' && target.attr('class') != 'change') || 
              // (event.type == 'dblclick' && event.currentTarget.localName != 'li') ||
              (event.type == 'dblclick' && event.target.parentNode.tagName != 'LI') ||
              (event.type == 'click' && target.parent().attr('class') != 'active')
          ) return false; 

          price_id = $('.download_form .unload_box_1 .active').attr('id'),
          item_id = $('.download_form .nomenclature_box .active').attr('id');

          $.post('../php/link.php', {price_id :price_id, item_id: item_id});

          updatePosition();

      })
    }

    function disBinding(target){
      $('.change', target).live('click', function(){

        var currentId = $(this).closest('li').attr('id'),
            currentName = $(this).closest('li').find('.section_name').text();

            $('<li id="' + currentId + '">\
                  <span class="section_name">' +  currentName +'</span>\
                </li>').appendTo( $('.download_form .not_bind .section_list') );

        updatePosition();
        return false;
      })

    }

    function updatePosition(){
      var price = $('.download_form .unload_box_1'),
          priceActive = $('.active', price);

        if( priceActive.index() ==  $('ul li', price).length - 1){
          priceActive.hide().prev().addClass('active');
        } else if ( $('ul li', price).length == 1 ){
          $('ul li', price).first().addClass('active')
        } else {
          priceActive.hide().next().addClass('active');
        }

        priceActive.filter(':hidden').remove();
        $('.download_form .nomenclature_box li').remove();

        if ( $('ul li', price).length == 0 ) return false;

        var currentObj = searchItem(dataArr, $('.active', price).attr('id'));
        createLine(currentObj);
    } 
})