<?php
header('Content-Type: application/json; charset=utf-8');

// 只接受 GET 请求（通过 ?id=xxx 传参）
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '请求方法不允许']);
    exit;
}

require_once __DIR__ . '/config.php';

$id = $_GET['id'] ?? '';

if (empty($id) || !is_numeric($id)) {
    echo json_encode(['success' => false, 'message' => '无效的用户ID']);
    exit;
}

// 使用 prepared statement 防止 SQL 注入
$stmt = $conn->prepare("DELETE FROM user WHERE id = ?");
$stmt->bind_param('i', $id);

try {
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => '删除成功']);
    } else {
        echo json_encode(['success' => false, 'message' => '用户不存在']);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => '删除失败: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
