<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

// GET 请求：获取单个用户信息
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? '';
    if (empty($id) || !is_numeric($id)) {
        echo json_encode(['success' => false, 'message' => '无效的用户ID']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, username, age, sex, addr, married, salary, remark FROM user WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        echo json_encode(['success' => true, 'data' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => '用户不存在']);
    }
    exit;
}

// POST 请求：更新用户信息
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id       = $_POST['id'] ?? '';
    $username = $_POST['username'] ?? '';
    $age      = $_POST['age'] ?? '';
    $sex      = $_POST['sex'] ?? '';
    $addr     = $_POST['addr'] ?? '';
    $married  = $_POST['married'] ?? '';
    $salary   = $_POST['salary'] ?? '';
    $remark   = $_POST['remark'] ?? '';

    if (empty($id) || !is_numeric($id)) {
        echo json_encode(['success' => false, 'message' => '无效的用户ID']);
        exit;
    }
    if (empty($username)) {
        echo json_encode(['success' => false, 'message' => '用户名不能为空']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE user SET username=?, age=?, sex=?, addr=?, married=?, salary=?, remark=? WHERE id=?");
    $stmt->bind_param('sisssdsi', $username, $age, $sex, $addr, $married, $salary, $remark, $id);

    try {
        $stmt->execute();
        if ($stmt->affected_rows >= 0) {
            echo json_encode(['success' => true, 'message' => '修改成功']);
        } else {
            echo json_encode(['success' => false, 'message' => '修改失败']);
        }
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['success' => false, 'message' => '修改失败: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => '请求方法不允许']);
