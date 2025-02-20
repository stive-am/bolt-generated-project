<?php
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $goalType = $_POST["goalType"];
    $targetHours = $_POST["targetHours"];

    // Assuming user_id is 1 for simplicity
    $user_id = 1;

    $sql = "INSERT INTO goals (user_id, goal_type, target_hours) VALUES (?, ?, ?)";
    $stmt = $db->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("isd", $user_id, $goalType, $targetHours);
        if ($stmt->execute()) {
            echo "Goal set successfully!";
        } else {
            echo "Error setting goal: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Error preparing statement: " . $db->error;
    }

    $db->close();
} else {
    echo "Invalid request method.";
}
?>
