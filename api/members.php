<?php
header('Content-Type: application/json; charset=utf-8');

// 只接受 GET 请求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '请求方法不允许']);
    exit;
}

require_once __DIR__ . '/config.php';

$sql = "SELECT id, username, age, sex, addr, married, salary, remark FROM user";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['success' => true, 'data' => $data]);

$result->close();
$conn->close();
