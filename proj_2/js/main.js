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
        });

        myMap.geoObjects.add(myPlacemark);

    }

});