<?php
// 数据库连接配置
$host = 'localhost';
$user = 'root';
$pass = 'root';
$dbname = 'test_11';

// 启用异常模式
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $dbname);
    mysqli_set_charset($conn, 'utf8');
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => '数据库连接失败: ' . $e->getMessage()]);
    exit;
}
