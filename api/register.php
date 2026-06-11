<?php
header('Content-Type: application/json; charset=utf-8');

// 只接受 POST 请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '请求方法不允许']);
    exit;
}

require_once __DIR__ . '/config.php';

// 接收表单数据
$username = $_POST['username'] ?? '';
$psw = $_POST['psw'] ?? '';
$repsw = $_POST['repsw'] ?? '';
$gender = $_POST['gender'] ?? '';
$hobby = $_POST['hobby'] ?? [];
$year = $_POST['year'] ?? '';
$month = $_POST['month'] ?? '';
$day = $_POST['day'] ?? '';
$avatar = $_POST['avatar'] ?? '';
$message = $_POST['message'] ?? '';

// 输入验证
if (empty($username) || empty($psw)) {
    echo json_encode(['success' => false, 'message' => '用户名和密码不能为空']);
    exit;
}

if ($psw !== $repsw) {
    echo json_encode(['success' => false, 'message' => '两次密码不一致']);
    exit;
}

// 将 hobby 数组转为逗号分隔字符串
$hobbyStr = is_array($hobby) ? implode(',', $hobby) : $hobby;
// 将性别转为文字
$genderText = $gender === '1' ? '男' : '女';

// 使用 prepared statement 防止 SQL 注入
$stmt = $conn->prepare(
    "INSERT INTO user (username, passWord, sex, remark) VALUES (?, ?, ?, ?)"
);
$remark = "生日:{$year}-{$month}-{$day} 爱好:{$hobbyStr} 头像:{$avatar} 留言:{$message}";
$stmt->bind_param('ssss', $username, $psw, $genderText, $remark);

try {
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => '注册成功']);
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => '注册失败: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
