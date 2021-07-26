const gittags = require('git-tags');
const version = '1.257.0';
const repo = 'https://github.com/ponsato/ducopanel/';

window.addEventListener('load', function() {
    gittags.latest(function(err, latest) {
        if (err) throw err;
        if (latest !== version) {
            let modal_update = document.querySelector('#modal_update');
            let modal_versions = document.querySelector('#modal_ducopanel_versions');
            modal_versions.innerHTML = `<li><span class="tag is-danger is-light"><b>Your: </b>` + version + `</span></li>
                        <li><span class="tag is-success is-light"><b>New: </b>` + latest + `</span></li>`;
            document.querySelector('html').classList.add('is-clipped');
            modal_update.classList.add('is-active');
            document.querySelector('#modal_update .delete').onclick = function() {
                document.querySelector('html').classList.remove('is-clipped');
                modal_update.classList.remove('is-active');
            }
        }
    });
});


