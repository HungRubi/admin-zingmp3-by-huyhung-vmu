document.addEventListener('DOMContentLoaded', function () {
    function hanlerClickTab() {
        document.querySelectorAll('a').forEach((tab) => {
            tab.addEventListener('click', function (e) {
                const url = this.getAttribute('href');

                if (url && !url.startsWith('http') && !url.startsWith('#')) {
                    e.preventDefault();

                    fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(data => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(data, 'text/html');
                            const newContent = doc.querySelector('.main-page');

                            // Kiểm tra xem newContent có tồn tại không
                            if (newContent) {
                                document.querySelector('.main-page').innerHTML = newContent.innerHTML;
                            } else {
                                console.error("Không tìm thấy phần tử '.main-page' trong phản hồi.");
                            }

                            history.pushState(null, '', url);
                            hanlerClickTab();
                            tabUi();
                            navClick();
                        })
                        .catch((error) => console.log('Error fetching content: ', error));
                }
            });
        });
    }
    function navClick() {
        const nav = document.querySelectorAll('.item-navbar');
        nav.forEach(element => {
            element.addEventListener('click', () => {
                document.querySelector('.item-navbar.active').classList.remove('active');
                element.classList.add('active');
            })
        })
    }
    function tabUi() {
        const btnToggle = document.querySelectorAll('.btn-tab-js');
        const tabToggle = document.querySelectorAll('.tab-js');
        btnToggle.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                tabToggle.forEach((tab, tabIndex) => {
                    if (index === tabIndex) {
                        tab.classList.toggle('hidden');
                    } else {
                        tab.classList.add('hidden');
                    }
                });
            });
        });
    }
    navClick();
    tabUi();
    hanlerClickTab();
    window.addEventListener('popstate', function () {
        fetch(location.href)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newContent = doc.querySelector('.main-page');

                // Kiểm tra xem newContent có tồn tại không
                if (newContent) {
                    document.querySelector('.main-page').innerHTML = newContent.innerHTML;
                } else {
                    console.error("Không tìm thấy phần tử '.main-page' trong phản hồi.");
                }

                hanlerClickTab();
                tabUi();
                navClick();
            })
            .catch((error) => console.log('Error fetching content: ', error));
    });
});
