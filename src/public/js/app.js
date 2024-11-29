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
                            delItemTable();
                            addAlbumInTable();
                            renderAlbumTable();
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
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                let isExit = false;
                const selectedSongId = listSelect.value;
                const selectedNameSong =
                    listSelect.options[listSelect.selectedIndex].textContent;
                if (
                    selectedSongId === 'Chọn bài hát' ||
                    selectedSongId === '' ||
                    selectedNameSong === ''
                ) {
                    alert('Vui lòng chọn bài hát hợp lệ');
                } else {
                    const rows = document.querySelectorAll(
                        '.table tbody .table-row',
                    );
                    rows.forEach((row) => {
                        const nameSong = row
                            .querySelector('td:nth-child(4)')
                            .textContent.trim();
                        const nameSinger = row
                            .querySelector('td:nth-child(6)')
                            .textContent.trim();

                        if (nameSong === selectedNameSong.trim()) {
                            const singerOption =
                                listSelect.options[
                                    listSelect.selectedIndex
                                ].getAttribute('data-singer');
                            if (nameSinger === singerOption) {
                                isExit = true;
                            }
                        }
                    });
                    console.log(isExit);
                    if (isExit) {
                        alert('Bài hát này đã có trong playlist của bạn rồi!');
                    } else {
                        const songImg =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-img');
                        const songNational =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-national');
                        const songAlbum =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-album');
                        const singer =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-singer');

                        const tbody = document.querySelector('.body-songs');
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                            <td class="song-checkbox"><input type="checkbox" class="song-cb"></td>
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
                }
            });
        }
    }
    function addAlbumInTable() {
        const btnAdd = document.querySelector('.btnadd-album');
        const listSelect = document.querySelector('.list-album');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                let isExit = false;
                const selectedAlbumId = listSelect.value;
                const selectedNameAlbum =
                    listSelect.options[listSelect.selectedIndex].textContent;
                if (
                    selectedAlbumId === 'Chọn album' ||
                    selectedAlbumId === '' ||
                    selectedNameAlbum === ''
                ) {
                    alert('Vui lòng chọn album hợp lệ');
                } else {
                    const tbody = document.querySelector('.body-album');
                    console.log(tbody);
                    const rows = tbody.querySelectorAll('tr');
                    console.log(rows);
                    rows.forEach((row) => {
                        const nameAlbum = row
                            .querySelector('td:nth-child(4)')
                            .textContent.trim();
                        if (nameAlbum === selectedNameAlbum.trim()) {
                            isExit = true;
                        }
                    });
                    if (isExit) {
                        alert('Album này đã có trong bộ sưu tập của bạn rồi!');
                    } else {
                        const albumImg =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-img');
                        const albumDescription =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-description');
                        const topic =
                            listSelect.options[
                                listSelect.selectedIndex
                            ].getAttribute('data-topic');

                        const tbody = document.querySelector('.body-album');
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                            <td class="song-checkbox"><input type="checkbox" class="song-cb"></td>
                            <th scope="row">${rows.length + 1}</th>
                            <td><img src="${albumImg}" alt="" srcset=""></td>
                            <td>${selectedNameAlbum}</td>
                            <td>${albumDescription}</td>
                            <td>${topic}</td>
                            <input type="hidden" name="favoriteAlbums[]" value="${selectedAlbumId}">
                        `;
                        tbody.appendChild(newRow);
                    }
                }
            });
        }
    }
    function delItemTable() {
        let count = 0;
        const btnDel = document.querySelector('.btn-del-table');
        const checkBox = document.querySelectorAll('.song-cb');
        const checkAll = document.querySelector('.checkbox-all');
        const rows = document.querySelectorAll('.table-row');
        function toggleDeleteButton() {
            if (count > 0) {
                btnDel.disabled = false; // Bật nút delete
            } else {
                btnDel.disabled = true; // Tắt nút delete
            }
        }

        if (checkAll) {
            checkAll.addEventListener('change', function () {
                let isCheckAll = checkAll.checked;
                checkBox.forEach((cb) => {
                    cb.checked = isCheckAll;
                });
                if (isCheckAll) {
                    btnDel.disabled = false;
                } else {
                    btnDel.disabled = true;
                }
            });
        }
        checkBox.forEach((cb) => {
            cb.addEventListener('change', function () {
                if (cb.checked) {
                    count++;
                } else {
                    count--;
                }
                if (count === checkBox.length) {
                    checkAll.checked = true;
                } else {
                    checkAll.checked = false;
                }
                toggleDeleteButton();
            });
        });

        if (btnDel) {
            btnDel.addEventListener('click', function () {
                checkBox.forEach((cb, index) => {
                    if (cb.checked) {
                        const result = window.confirm(
                            'Are you sure you want to delete this item?',
                        );
                        if (result) {
                            rows[index].remove();
                        } else {
                            close();
                        }
                    }
                });
                count = 0;
                checkAll.checked = false;
                checkBox.forEach((cb) => (cb.checked = false));
                toggleDeleteButton();
            });
        }
    }
    function renderAlbumTable() {
        let count = 0;
        const btnDel = document.querySelector('.btn-del-album');
        const checkBox = document.querySelectorAll('.album-cb');
        const checkAll = document.querySelector('.checkbox-all-album');
        const rows = document.querySelectorAll('.table-row-album');
        function toggleDeleteButton() {
            if (count > 0) {
                btnDel.disabled = false; // Bật nút delete
            } else {
                btnDel.disabled = true; // Tắt nút delete
            }
        }

        if (checkAll) {
            checkAll.addEventListener('change', function () {
                let isCheckAll = checkAll.checked;
                checkBox.forEach((cb) => {
                    cb.checked = isCheckAll;
                });
                if (isCheckAll) {
                    btnDel.disabled = false;
                } else {
                    btnDel.disabled = true;
                }
            });
        }
        checkBox.forEach((cb) => {
            cb.addEventListener('change', function () {
                let allChecked = Array.from(checkBox).every((cb) => cb.checked);
                checkAll.checked = allChecked;
                if (allChecked) {
                    btnDel.disabled = false;
                } else {
                    btnDel.disabled = true;
                }
                toggleDeleteButton();
            });
        });

        if (btnDel) {
            btnDel.addEventListener('click', function () {
                checkBox.forEach((cb, index) => {
                    if (cb.checked) {
                        const result = window.confirm(
                            'Are you sure you want to delete this item?',
                        );
                        if (result) {
                            rows[index].remove();
                        } else {
                            close();
                        }
                    }
                });
                count = 0;
                checkAll.checked = false;
                checkBox.forEach((cb) => (cb.checked = false));
                toggleDeleteButton();
            });
        }
    }
    delItemTable();
    navClick();
    tabUi();
    addAlbumInTable();
    hanlerClickTab();
    addItemForInput();
    renderAlbumTable();
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
                delItemTable();
                addAlbumInTable();
                renderAlbumTable();
            })
            .catch((error) => console.log('Error fetching content: ', error));
    });
});
