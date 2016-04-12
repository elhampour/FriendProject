(function () {
    var catList = [];
    var pageNumber = 1;
    var allItemnsCount = 0;
    var pageCount = 0;
    var allCurentItems;
    var changePage = function () {
        $("#content").find('.thumbnails li').remove();
        var itemCount = 0;

        for (var i = (pageNumber - 1) * 8; i < allCurentItems.length; i++) {
            var item = allCurentItems[i];
           if (itemCount == 8) {
                return;
           }
           var itemTagsArray = item.tags.split(',');
           var aTagStrings = "";

           $.each(itemTagsArray, function (index2, item2) {
               var atag = "<a href='#'>" + item2 + "</a>";
               aTagStrings = aTagStrings + " , " + atag;
           });

           var litag = "<li class='span3'><div class='thumbnail'><a href='#'>\
                    <img src='img/"+ item.picture + "' alt='thumbnail' /></a><div class='category'>\
                    <i class='icon-tag icon-white'></i> " + aTagStrings + "\
                    </div><div class='caption'><h2>"+ item.title + "</h2>\
                    <p class='post-date'>" + item.date + "</p><p>" + item.description + "</p>\
                    <hr /><p><a href='#' class='btn'>Read on &rarr;</a></p></div></div></li>";

           $("#content").find('.thumbnails').append(litag);
           itemCount++;
        }
    };
    $(function () {
        $.ajax({ url: 'data.json' })
            .done(function (response) {
                $.each(response, function (index, item) {
                    var catName = item.category;
                    var catExistense = false;
                    var catObvjectDefined;
                    $.each(catList, function (index2, item2) {
                        if (item2.name == catName) {
                            catExistense = true;
                            catObvjectDefined = item2;
                        }
                    });
                    var catObject = {};
                    if (catExistense) {
                        catObvjectDefined.items.push(item);
                    } else {
                        catObject.items = [];
                        catObject.items.push(item);
                        catObject.name = catName;
                        catObject.id = catList.length + 1;
                        catList.push(catObject);
                    }
                });

                $.each(catList, function (index, item) {
                    $('.nav').append("<li><a data-id='" + item.id + "' href='#'>" + item.name + "</a></li>");
                });
                $($('.nav').find('a')[0]).trigger('click');
            });

        $('.nav').on('click', 'a', function (event) {
            event.preventDefault();
            var $this = $(this);
            var id = $this.data('id');
            $('.nav').find('li').removeClass('active');
            $this.closest('li').addClass('active');

            var selectedCat;
            pageNumber = 1;
            allItemnsCount = 0;
            pageCount = 0;
   
            $.each(catList, function (index, item) {
                if (item.id === id) {
                    selectedCat = item;
                }
            });

            allItemnsCount = selectedCat.items.length;

            allCurentItems = selectedCat.items;

            changePage();

            $(".pagination ul li").remove();

            pageCount = parseInt(allItemnsCount / 8);
            var prevLink = "<li><a href='#'>Prev</a></li>";
            var nextLink = " <li><a href='#'>Next</a></li>";
            $(".pagination ul").append(prevLink);
            for (var i = 1; i < pageCount + 1; i++) {
                var pagehtml = "<li><a data-p='" + i + "' href='#'>" + i + "</a></li>";
                $(".pagination ul").append(pagehtml);
            }

            $(".pagination ul").append(nextLink);

            $($(".pagination ul li")[1]).find('a').trigger('click');
        });

        $(".pagination").on('click', 'a', function (event) {
            event.preventDefault();
            var $this = $(this);

            var pageHtml = $this.html();

            var parsedPageHtml = parseInt(pageHtml);

            if (pageHtml === "Prev") {
                if (pageNumber == 1) {
                    return;
                } else {
                    pageNumber--;
                    $(".pagination").find("li").removeClass("active");
                    $(".pagination").find("a[data-p='" + pageNumber + "']").trigger("click");
                }
            }
            else if (pageHtml === "Next") {
                if (pageNumber === pageCount) {
                    return;
                } else {
                    pageNumber++;
                    $(".pagination").find("li").removeClass("active");
                    $(".pagination").find("a[data-p='" + pageNumber + "']").trigger("click");
                }
            } else {
                pageNumber = parsedPageHtml;
                $(".pagination").find("li").removeClass("active");
                $this.closest('li').addClass("active");
                changePage();
            }
        });
    });
}());
