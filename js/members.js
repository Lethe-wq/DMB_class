var loading = document.getElementById('loading');
var errorMsg = document.getElementById('errorMsg');
var memberBody = document.getElementById('memberBody');
var editModal = document.getElementById('editModal');
var editForm = document.getElementById('editForm');
var editMsg = document.getElementById('editMsg');
var editCancel = document.getElementById('editCancel');
var addBtn = document.getElementById('addBtn');
var addModal = document.getElementById('addModal');
var addForm = document.getElementById('addForm');
var addMsg = document.getElementById('addMsg');
var addCancel = document.getElementById('addCancel');
var addReset = document.getElementById('addReset');
var lastFocusedElement = null;

function showMessage(element, type, message) {
    element.className = 'result-msg ' + type;
    element.textContent = message;
}

function clearMessage(element) {
    element.className = 'result-msg';
    element.textContent = '';
}

function renderEmptyState() {
    var row = document.createElement('tr');
    var td = document.createElement('td');

    row.className = 'empty-row';
    td.className = 'empty-cell';
    td.colSpan = 9;
    td.textContent = '暂无会员数据';
    row.appendChild(td);
    memberBody.appendChild(row);
}

function setModalVisibility(modal, isVisible, focusTarget) {
    if (isVisible) {
        lastFocusedElement = document.activeElement;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        window.setTimeout(function () {
            if (focusTarget) focusTarget.focus();
        }, 0);
        return;
    }

    modal.setAttribute('aria-hidden', 'true');

    if (
        editModal.getAttribute('aria-hidden') === 'true' &&
        addModal.getAttribute('aria-hidden') === 'true'
    ) {
        document.body.classList.remove('modal-open');
    }

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

function formatMarried(value) {
    return String(value) === '1' ? '已婚' : '未婚';
}

function loadMembers() {
    loading.style.display = 'flex';
    clearMessage(errorMsg);
    memberBody.innerHTML = '';

    fetch('api/members.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            loading.style.display = 'none';

            if (!data.success) {
                showMessage(errorMsg, 'error', data.message || '获取数据失败');
                return;
            }

            var list = data.data;
            if (list.length === 0) {
                renderEmptyState();
                return;
            }

            list.forEach(function (user) {
                var row = document.createElement('tr');
                row.setAttribute('data-id', user.id);
                row.innerHTML =
                    '<td data-label="ID">' + escapeHtml(user.id) + '</td>' +
                    '<td data-label="用户名">' + escapeHtml(user.username) + '</td>' +
                    '<td data-label="年龄">' + escapeHtml(user.age) + '</td>' +
                    '<td data-label="性别">' + escapeHtml(user.sex) + '</td>' +
                    '<td data-label="地址">' + escapeHtml(user.addr) + '</td>' +
                    '<td data-label="婚姻状况">' + formatMarried(user.married) + '</td>' +
                    '<td data-label="薪水">' + escapeHtml(user.salary) + '</td>' +
                    '<td data-label="备注">' + escapeHtml(user.remark) + '</td>' +
                    '<td data-label="操作">' +
                        '<button type="button" class="edit-link" data-id="' + escapeHtml(user.id) + '">编辑</button>' +
                        '<button type="button" class="delete-link" data-id="' + escapeHtml(user.id) + '">删除</button>' +
                    '</td>';
                memberBody.appendChild(row);
            });
        })
        .catch(function (err) {
            loading.style.display = 'none';
            showMessage(errorMsg, 'error', '请求失败: ' + err.message);
        });
}

memberBody.addEventListener('click', function (e) {
    var target = e.target;

    if (target.classList.contains('delete-link')) {
        var deleteId = target.getAttribute('data-id');
        if (!confirm('确定要删除该会员吗？')) return;

        fetch('api/delete.php?id=' + encodeURIComponent(deleteId))
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    var row = target.closest('tr');
                    row.parentNode.removeChild(row);
                    if (memberBody.children.length === 0) renderEmptyState();
                } else {
                    alert(data.message || '删除失败');
                }
            })
            .catch(function (err) {
                alert('请求失败: ' + err.message);
            });
    }

    if (target.classList.contains('edit-link')) {
        var editId = target.getAttribute('data-id');
        openEditModal(editId);
    }
});

function openEditModal(id) {
    clearMessage(editMsg);

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

            if (user.sex === '女') {
                document.getElementById('editSexFemale').checked = true;
            } else {
                document.getElementById('editSexMale').checked = true;
            }

            if (user.married === 1) {
                document.getElementById('editMarriedYes').checked = true;
            } else {
                document.getElementById('editMarriedNo').checked = true;
            }

            setModalVisibility(editModal, true, document.getElementById('editUsername'));
        })
        .catch(function (err) {
            alert('请求失败: ' + err.message);
        });
}

editCancel.addEventListener('click', function () {
    setModalVisibility(editModal, false);
});

editModal.addEventListener('click', function (e) {
    if (e.target === editModal) {
        setModalVisibility(editModal, false);
    }
});

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
            setModalVisibility(editModal, false);
            loadMembers();
        } else {
            showMessage(editMsg, 'error', data.message);
        }
    })
    .catch(function (err) {
        showMessage(editMsg, 'error', '请求失败: ' + err.message);
    });
});

addBtn.addEventListener('click', function () {
    addForm.reset();
    clearMessage(addMsg);
    setModalVisibility(addModal, true, document.getElementById('addUsername'));
});

addCancel.addEventListener('click', function () {
    setModalVisibility(addModal, false);
});

addModal.addEventListener('click', function (e) {
    if (e.target === addModal) {
        setModalVisibility(addModal, false);
    }
});

addForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(addForm);

    fetch('api/add.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            setModalVisibility(addModal, false);
            loadMembers();
        } else {
            showMessage(addMsg, 'error', data.message);
        }
    })
    .catch(function (err) {
        showMessage(addMsg, 'error', '请求失败: ' + err.message);
    });
});

addReset.addEventListener('click', function () {
    addForm.reset();
    clearMessage(addMsg);
    document.getElementById('addUsername').focus();
});

document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (editModal.getAttribute('aria-hidden') === 'false') {
        setModalVisibility(editModal, false);
    } else if (addModal.getAttribute('aria-hidden') === 'false') {
        setModalVisibility(addModal, false);
    }
});

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

loadMembers();
