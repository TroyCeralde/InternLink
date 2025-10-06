<?php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = $_POST['first_name'] ?? '';
    $last_name = $_POST['last_name'] ?? '';
    $birth_date = $_POST['birth_date'] ?? '';
    $address = $_POST['address'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $student_id = $_POST['student_id'] ?? '';
    $password = $_POST['password'] ?? '';

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare and execute insert
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, birth_date, address, email, phone, student_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $first_name, $last_name, $birth_date, $address, $email, $phone, $student_id, $hashed_password);

    if ($stmt->execute()) {
        echo "<script>alert('Registration successful!');window.location.href='../loginform.html';</script>";
    } else {
        echo "<script>alert('Registration failed: " . $conn->error . "');window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../registerform.html");
    exit();
}
?>