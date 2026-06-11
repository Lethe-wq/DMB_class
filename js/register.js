const avatarSelect = document.getElementById('avatarSelect');
const avatarImg = document.getElementById('avatarImg');
const form = document.getElementById('registerForm');
const resultMsg = document.getElementById('resultMsg');

const avatarOptions = {
    '1': {
        className: 'avatar-1',
        label: '晨',
        ariaLabel: '晨雾蓝头像'
    },
    '2': {
        className: 'avatar-2',
        label: '暖',
        ariaLabel: '暖阳橙头像'
    },
    '3': {
        className: 'avatar-3',
        label: '松',
        ariaLabel: '松石绿头像'
    },
    '4': {
        className: 'avatar-4',
        label: 'qwq',
        ariaLabel: 'qwq头像'
    }
};
// 头像预览更新函数
function updateAvatarPreview() {
    const option = avatarOptions[avatarSelect.value] || avatarOptions['1'];

    avatarImg.classList.add('is-changing');
    avatarImg.classList.remove('avatar-1', 'avatar-2', 'avatar-3', 'avatar-4');
    avatarImg.classList.add(option.className);
    avatarImg.querySelector('span').textContent = option.label;
    avatarImg.setAttribute('aria-label', option.ariaLabel);

    window.setTimeout(function () {
        avatarImg.classList.remove('is-changing');
    }, 180);
}

avatarSelect.addEventListener('change', updateAvatarPreview);

// 表单重置时更新头像预览
form.addEventListener('reset', function () {
    window.setTimeout(updateAvatarPreview, 0);
});


form.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(form);

    fetch('api/register.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            resultMsg.className = 'result-msg success';
            resultMsg.textContent = data.message;
            form.reset();
        } else {
            resultMsg.className = 'result-msg error';
            resultMsg.textContent = data.message;
        }
    })
    .catch(function (err) {
        resultMsg.className = 'result-msg error';
        resultMsg.textContent = '请求失败: ' + err.message;
    });
});

updateAvatarPreview();
