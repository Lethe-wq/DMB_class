// 头像选择
const avatarSelect = document.getElementById('avatarSelect');
const avatarImg = document.getElementById('avatarImg');

avatarSelect.addEventListener('change', function () {
    avatarImg.src = 'avatar' + this.value + '.png';
});

// 表单提交
const form = document.getElementById('registerForm');
const resultMsg = document.getElementById('resultMsg');

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
            avatarImg.src = '';
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
