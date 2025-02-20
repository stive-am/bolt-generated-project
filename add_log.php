<?php
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $date = $_POST["date"];
    $time = $_POST["time"];
    $language = $_POST["language"];
    $topic = $_POST["topic"];
    $notes = $_POST["notes"];

    // Assuming user_id is 1 for simplicity
    $user_id = 1;

    $sql = "INSERT INTO coding_logs (user_id, date, time, language, topic, notes) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("isssss", $user_id, $date, $time, $language, $topic, $notes);
        if ($stmt->execute()) {
            echo "Log added successfully!";
        } else {
            echo "Error adding log: " . $stmt->error;
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
