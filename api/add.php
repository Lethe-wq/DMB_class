<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '请求方法不允许']);
    exit;
}

require_once __DIR__ . '/config.php';

$username = $_POST['username'] ?? '';
$age      = $_POST['age'] ?? '';
$sex      = $_POST['sex'] ?? '';
$addr     = $_POST['addr'] ?? '';
$married  = $_POST['married'] ?? '';
$salary   = $_POST['salary'] ?? '';
$remark   = $_POST['remark'] ?? '';

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => '用户名不能为空']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO user (username, age, sex, addr, married, salary, remark) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('sisssds', $username, $age, $sex, $addr, $married, $salary, $remark);

try {
    $stmt->execute();
    echo json_encode(['success' => true, 'message' => '添加成功']);
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => '添加失败: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
