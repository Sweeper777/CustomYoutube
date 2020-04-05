var currentPage = 1;

function refreshPagingControl() {
    currentPage = 1;
    let pagingUl = $(".pagination");
    pagingUl.empty();
    let pageCount = Math.floor(searchResults.length / searchResultsPerPage);
    pagingUl.append("<li class=\"page-item disabled\"><a class=\"page-link previous-page\" href=\"#window\">Previous</a></li>");
    $(".previous-page").click(() => {
        if (currentPage > 1) {
            currentPage -= 1;
        }
        updatePagingUI();
    });
    pagingUl.append("<li class=\"page-item active\"><a class=\"page-link page1\" href=\"#window\">1</a></li>");
    addGoToPageListener(1);
    for (var i = 2 ; i <= pageCount ; i++) {
        let s = "<li class=\"page-item\"><a class=\"page-link page" + i + "\" href=\"#window\">" + i + "</a></li>";
        pagingUl.append(s);
        addGoToPageListener(i);
    }
    if (pageCount === 1) {
        pagingUl.append("<li class=\"page-item disabled\"><a class=\"page-link next-page\" href=\"#window\">Next</a></li>");
    } else {
        pagingUl.append("<li class=\"page-item\"><a class=\"page-link next-page\" href=\"#window\">Next</a></li>");
    }
    $(".next-page").click(() => {
        if (currentPage < Math.floor(searchResults.length / searchResultsPerPage)) {
            currentPage += 1;
            updatePagingUI();
        }
    });
}

function updatePagingUI() {
    $(".active").removeClass("active");
    $(".page" + currentPage).parent().addClass("active");
    if (currentPage === 1) {
        $(".previous-page").parent().addClass("disabled");
    } else {
        $(".previous-page").parent().removeClass("disabled");
    }
    if (currentPage === Math.floor(searchResults.length / searchResultsPerPage)) {
        $(".next-page").parent().addClass("disabled");
    } else {
        $(".next-page").parent().removeClass("disabled");
    }
    updateSearchResultsDiv();
}

function addGoToPageListener(pageNum) {
    $(".page" + pageNum).click(() => {
        currentPage = pageNum;
        updatePagingUI();
    });
}