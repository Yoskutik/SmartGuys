$(window).ready(() => {
    $('.child').on('click', function () {
        open(`/child/?id=${this.dataset.childId}`)
    });

    $('.comment').on('click', function () {
        if (!this.classList.contains('unwrapped')) {
            this.classList.add('unwrapped');
        } else if (!getSelectedText() || !this.innerText.includes(getSelectedText())) {
            this.classList.remove('unwrapped');
        }
    })
});

function getSelectedText() {
    let text = '';
    if (typeof window.getSelection != 'undefined') {
        text = window.getSelection().toString();
    } else if (typeof document.selection != 'undefined' && document.selection.type == 'Text') {
        text = document.selection.createRange().text;
    }
    return text;
}