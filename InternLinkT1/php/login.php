<?php

require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) {
        $stmt->bind_result($id, $db_email, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            session_start();
            $_SESSION['user_id'] = $id;

            // Check for admin credentials based only on email, as password_verify already confirmed the password
            if ($db_email === 'admin@admin.com') {
                header("Location: ../Admin.html");
                exit();
            } else {
                header("Location: ../Intern_page.html");
                exit();
            }
        } else {
            header("Location: ../loginform.html?error=wrongpass");
            exit();
        }
    } else {
        header("Location: ../loginform.html?error=notfound");
        exit();
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../loginform.html");
    exit();
}
?>