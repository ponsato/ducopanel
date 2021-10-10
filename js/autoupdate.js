const gitP = require('simple-git-for-electron/promise');
const git = gitP(__dirname);
const version = '1.273.0';

window.addEventListener('load', function() {
    console.log(git.checkIsRepo());

    git.checkIsRepo()
        .then(isRepo => !isRepo && initialiseRepo(git))
        .then(() => {
                git.fetch().then(() => git.tags().then(tags => checkUpdate(tags.latest)));
            }
        );

    function initialiseRepo (git) {
        return git.init()
            .then(() => git.addRemote('origin', 'https://github.com/ponsato/ducopanel.git'))
    }

    function checkUpdate(latest) {
        console.log(latest);
        if (latest !== version) {
            let modal_update = document.querySelector('#modal_update');
            let modal_versions = document.querySelector('#modal_ducopanel_versions');
            modal_versions.innerHTML = `<li><span class="tag is-danger"><b>Your: </b>` + version + `</span></li>
                        <li><span class="tag is-success"><b>New: </b>` + latest + `</span></li>`;
            document.querySelector('html').classList.add('is-clipped');
            modal_update.classList.add('is-active');
            document.querySelector('#modal_update .delete').onclick = function() {
                document.querySelector('html').classList.remove('is-clipped');
                modal_update.classList.remove('is-active');
            }
        } else {
            console.log('Ducopanel is up to date to version ' + version);
        }
    }
});


