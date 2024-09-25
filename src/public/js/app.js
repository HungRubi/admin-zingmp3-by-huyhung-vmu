const btnToggle = document.querySelectorAll('.btn-tab-js');
const tabToggle = document.querySelectorAll('.tab-js');
if (btnToggle) {
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
