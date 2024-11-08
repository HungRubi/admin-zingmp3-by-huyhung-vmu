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
                        .then((data) => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(
                                data,
                                'text/html',
                            );
                            const newContent = doc.querySelector('.main-page');

                            // Kiểm tra xem newContent có tồn tại không
                            if (newContent) {
                                document.querySelector('.main-page').innerHTML =
                                    newContent.innerHTML;
                            } else {
                                console.error(
                                    "Không tìm thấy phần tử '.main-page' trong phản hồi.",
                                );
                            }

                            history.pushState(null, '', url);
                            hanlerClickTab();
                            tabUi();
                            navClick();
                            addItemForInput();
                        })
                        .catch((error) =>
                            console.log('Error fetching content: ', error),
                        );
                }
            });
        });
    }
    function navClick() {
        const nav = document.querySelectorAll('.item-navbar');
        nav.forEach((element) => {
            element.addEventListener('click', () => {
                document
                    .querySelector('.item-navbar.active')
                    .classList.remove('active');
                element.classList.add('active');
            });
        });
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
    function addItemForInput() {
        const btnAdd = document.querySelector('.btn-add-list-selection');
        const listSelect = document.querySelector('.list-selection');
        btnAdd.addEventListener('click', () => {
            const selectedSongId = listSelect.value;
            const selectedNameSong = listSelect.options[listSelect.selectedIndex].textContent;
            if (selectedSongId === 'Chọn bài hát' || selectedSongId === '' || selectedNameSong === '') {
                alert('Vui lòng chọn bài hát hợp lệ');
            }
            let isExit = false;
            const rows = document.querySelectorAll('.table tbody tr');
            
            rows.forEach(row => {
                const nameSong = row.querySelector('td:nth-child(3)').textContent;
                const nameSinger = row.querySelector('td:nth-child(5)').textContent;
    
                if (nameSong === selectedNameSong) {
                    const singerOption = listSelect.options[listSelect.selectedIndex].getAttribute('data-singer');
                    if (nameSinger === singerOption) {
                        isExit = true;
                    }
                }
            });
            if (isExit) {
                alert('Bài hát này đã có trong playlist của bạn rồi!');
            } else {
                const songImg = listSelect.options[listSelect.selectedIndex].getAttribute("data-img");
                const songNational = listSelect.options[listSelect.selectedIndex].getAttribute("data-national");
                const songAlbum = listSelect.options[listSelect.selectedIndex].getAttribute("data-album");
                const singer = listSelect.options[listSelect.selectedIndex].getAttribute("data-singer");
    
                const tbody = document.querySelector('.table tbody');
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <th scope="row">${rows.length + 1}</th>
                    <td><img src="${songImg}" alt="" srcset=""></td>
                    <td>${selectedNameSong}</td>
                    <td>${songNational}</td>
                    <td>${singer}</td>
                    <td>${songAlbum}</td>
                    <input type="hidden" name="playlistid[]" value="${selectedSongId}">
                `;
                tbody.appendChild(newRow);
            }
        });
    }
    
    navClick();
    tabUi();
    hanlerClickTab();
    addItemForInput();
    window.addEventListener('popstate', function () {
        fetch(location.href)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newContent = doc.querySelector('.main-page');

                // Kiểm tra xem newContent có tồn tại không
                if (newContent) {
                    document.querySelector('.main-page').innerHTML =
                        newContent.innerHTML;
                } else {
                    console.error(
                        "Không tìm thấy phần tử '.main-page' trong phản hồi.",
                    );
                }

                hanlerClickTab();
                tabUi();
                navClick();
                addItemForInput();
            })
            .catch((error) => console.log('Error fetching content: ', error));
    });
});
