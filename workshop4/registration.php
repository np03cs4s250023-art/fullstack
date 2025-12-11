<?php
// Initialize variables
$name = $email = $password = $confirm_password = "";
$errors = [];
$success = "";

// Handle form submit
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];

    if (empty($name)) $errors['name'] = "Name is required.";
    if (empty($email)) {
        $errors['email'] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Invalid email format.";
    }

    if ($password !== $confirm_password) {
        $errors['confirm_password'] = "Passwords do not match.";
    }

    if (empty($errors)) {
        $file = "users.json";

        if (!file_exists($file)) {
            file_put_contents($file, json_encode([]));
        }

        $users = json_decode(file_get_contents($file), true);
        if (!is_array($users)) $users = [];

        $users[] = [
            "name" => $name,
            "email" => $email,
            "password" => password_hash($password, PASSWORD_DEFAULT)
        ];

        if (file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT))) {
            $success = "Registration successful!";
            $name = $email = "";
        } else {
            $errors['file'] = "Error writing to JSON file.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f3f3f3;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background: white;
            padding: 20px;
            width: 300px;
            border-radius: 8px;
            box-shadow: 0 0 10px #ccc;
        }

        input {
            width: 100%;
            padding: 8px;
            margin: 6px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        button {
            width: 100%;
            padding: 10px;
            background: #4a67d1;
            border: none;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background: #3a55b0;
        }

        h2 {
            text-align: center;
            margin-bottom: 10px;
        }

        .error { 
            color: red; 
            font-size: 13px; 
            margin-bottom: 4px; 
        }

        .success { 
            color: green; 
            text-align: center; 
            margin-bottom: 10px; 
        }
    </style>
</head>
<body>

<div class="container">

    <h2>User Registration</h2>

    <?php if ($success): ?>
        <div class="success"><?= $success ?></div>
    <?php endif; ?>

    <form method="POST">

        <label>Name:</label>
        <input type="text" name="name" value="<?= htmlspecialchars($name) ?>">
        <div class="error"><?= $errors['name'] ?? "" ?></div>

        <label>Email:</label>
        <input type="text" name="email" value="<?= htmlspecialchars($email) ?>">
        <div class="error"><?= $errors['email'] ?? "" ?></div>

        <label>Password:</label>
        <input type="password" name="password">
        <div class="error"><?= $errors['password'] ?? "" ?></div>

        <label>Confirm Password:</label>
        <input type="password" name="confirm_password">
        <div class="error"><?= $errors['confirm_password'] ?? "" ?></div>

        <button type="submit">Register</button>

    </form>

</div>

</body>
</html>
