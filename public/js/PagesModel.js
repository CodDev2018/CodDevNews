class PagesModel {
    getPages(success) {
        fetch("/api/news")
            .then(response => response.json())
            .then(json => success(json))
            .catch(err => console.error(err))
    }
}