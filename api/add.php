<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '请求方法不允许']);
    exit;
}

require_once __DIR__ . '/config.php';

$username = $_POST['username'] ?? '';
$psw = $_POST['psw'] ?? '';
$age = $_POST['age'] ?? '';
$sex = $_POST['sex'] ?? '';
$addr = $_POST['addr'] ?? '';
$married = $_POST['married'] ?? '';
$salary = $_POST['salary'] ?? '';
$remark = $_POST['remark'] ?? '';

if (empty($username) || empty($psw)) {
    echo json_encode(['success' => false, 'message' => '用户名和密码不能为空']);
    exit;
}

if (!is_numeric($age) && $age !== '') {
    echo json_encode(['success' => false, 'message' => '年龄必须是数字']);
    exit;
}

if (!is_numeric($salary) && $salary !== '') {
    echo json_encode(['success' => false, 'message' => '薪水必须是数字']);
    exit;
}

if (!in_array($married, ['已婚', '未婚', '1', '0'], true)) {
    echo json_encode(['success' => false, 'message' => '婚姻状况无效']);
    exit;
}

if ($married === '已婚') {
    $married = 1;
} elseif ($married === '未婚') {
    $married = 0;
}

$stmt = $conn->prepare("INSERT INTO user (username, passWord, age, sex, addr, married, salary, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('ssssisss', $username, $psw, $age, $sex, $addr, $married, $salary, $remark);
try {
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => '添加成功']);
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => '添加失败: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
