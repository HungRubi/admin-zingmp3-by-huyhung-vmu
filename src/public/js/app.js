



document.addEventListener('DOMContentLoaded', function () {
    function hanlerClickTab() {
        document.querySelectorAll('a').forEach((tab) => {
            tab.addEventListener('click', function (e) {
                const url = this.getAttribute('href');

                if(url && !url.startsWith('http') && !url.startsWith('#')){
                    e.preventDefault();

                    fetch(url)
                    .then((response) => response.json())
                    .then(data => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data,'text/html');
                        const newContent =doc.querySelector('.mainpage').innerHTML;
                        document.querySelector('.mainpage').innerHTML =newContent;
                        history.pushState(null, '', url);

                        hanlerClickTab();
                        tabUi();
                    })
                    .catch((error) => console.log('Error fetching content: ', error));
                }
            })
        })
    }

    function tabUi(){
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

    tabUi();
    hanlerClickTab();
    window.addEventListener('popstate', function () {
        fetch(location.href)
        .then(response => response.json())
        .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newContent = doc.querySelector('.mainpage').innerHTML;
                document.querySelector('.mainpage').innerHTML = newContent;

                hanlerClickTab();
                tabUi();
        })
    })
})
