// 页面加载时获取会员列表
var loading = document.getElementById('loading');
var errorMsg = document.getElementById('errorMsg');
var memberBody = document.getElementById('memberBody');

function loadMembers() {
    loading.style.display = 'block';
    errorMsg.style.display = 'none';
    memberBody.innerHTML = '';

    fetch('api/members.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            loading.style.display = 'none';

            if (!data.success) {
                errorMsg.textContent = data.message || '获取数据失败';
                errorMsg.style.display = 'block';
                return;
            }

            var list = data.data;
            if (list.length === 0) {
                var row = document.createElement('tr');
                var td = document.createElement('td');
                td.colSpan = 9;
                td.textContent = '暂无会员数据';
                td.style.textAlign = 'center';
                row.appendChild(td);
                memberBody.appendChild(row);
                return;
            }

            list.forEach(function (user) {
                var row = document.createElement('tr');
                row.setAttribute('data-id', user.id);
                row.innerHTML =
                    '<td>' + escapeHtml(user.id) + '</td>' +
                    '<td>' + escapeHtml(user.username) + '</td>' +
                    '<td>' + escapeHtml(user.age) + '</td>' +
                    '<td>' + escapeHtml(user.sex) + '</td>' +
                    '<td>' + escapeHtml(user.addr) + '</td>' +
                    '<td>' + escapeHtml(user.married) + '</td>' +
                    '<td>' + escapeHtml(user.salary) + '</td>' +
                    '<td>' + escapeHtml(user.remark) + '</td>' +
                    '<td>' +
                        '<a href="javascript:void(0)" class="edit-link" data-id="' + escapeHtml(user.id) + '">编辑</a> | ' +
                        '<a href="javascript:void(0)" class="delete-link" data-id="' + escapeHtml(user.id) + '">删除</a>' +
                    '</td>';
                memberBody.appendChild(row);
            });
        })
        .catch(function (err) {
            loading.style.display = 'none';
            errorMsg.textContent = '请求失败: ' + err.message;
            errorMsg.style.display = 'block';
        });
}

// 初始加载
loadMembers();

// 删除 & 编辑（事件委托）
memberBody.addEventListener('click', function (e) {
    var target = e.target;

    // 删除
    if (target.classList.contains('delete-link')) {
        var id = target.getAttribute('data-id');
        if (!confirm('确定要删除该会员吗？')) return;

        fetch('api/delete.php?id=' + encodeURIComponent(id))
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    var row = target.closest('tr');
                    row.parentNode.removeChild(row);
                } else {
                    alert(data.message || '删除失败');
                }
            })
            .catch(function (err) {
                alert('请求失败: ' + err.message);
            });
    }

    // 编辑
    if (target.classList.contains('edit-link')) {
        var id = target.getAttribute('data-id');
        openEditModal(id);
    }
});

// ===== 编辑弹窗逻辑 =====
var editModal = document.getElementById('editModal');
var editForm = document.getElementById('editForm');
var editMsg = document.getElementById('editMsg');
var editCancel = document.getElementById('editCancel');

function openEditModal(id) {
    editMsg.style.display = 'none';

    // 先获取用户数据填充表单
    fetch('api/edit.php?id=' + encodeURIComponent(id))
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.success) {
                alert(data.message || '获取用户信息失败');
                return;
            }
            var user = data.data;
            document.getElementById('editId').value = user.id;
            document.getElementById('editUsername').value = user.username || '';
            document.getElementById('editAge').value = user.age || '';
            document.getElementById('editAddr').value = user.addr || '';
            document.getElementById('editSalary').value = user.salary || '';
            document.getElementById('editRemark').value = user.remark || '';

            // 性别单选
            if (user.sex === '女') {
                document.getElementById('editSexFemale').checked = true;
            } else {
                document.getElementById('editSexMale').checked = true;
            }

            // 婚姻状况单选
            if (user.married === '已婚') {
                document.getElementById('editMarriedYes').checked = true;
            } else {
                document.getElementById('editMarriedNo').checked = true;
            }

            editModal.style.display = 'flex';
        })
        .catch(function (err) {
            alert('请求失败: ' + err.message);
        });
}

// 取消关闭弹窗
editCancel.addEventListener('click', function () {
    editModal.style.display = 'none';
});

// 点击遮罩层关闭
editModal.addEventListener('click', function (e) {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// 提交编辑
editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(editForm);

    fetch('api/edit.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            editModal.style.display = 'none';
            loadMembers(); // 刷新列表
        } else {
            editMsg.className = 'result-msg error';
            editMsg.textContent = data.message;
        }
    })
    .catch(function (err) {
        editMsg.className = 'result-msg error';
        editMsg.textContent = '请求失败: ' + err.message;
    });
});

// 防止 XSS：转义 HTML 特殊字符
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}
