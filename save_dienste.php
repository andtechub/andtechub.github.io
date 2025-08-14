<?php
// Datei wird nicht mehr benötigt, da alles serverseitig mit index.php gelöst ist.
?>
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if ($data && is_array($data)) {
        file_put_contents('dienste.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ungültige Daten']);
    }
    exit;
}
// Gibt die gespeicherten Daten zurück
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists('dienste.json')) {
        header('Content-Type: application/json; charset=utf-8');
        echo file_get_contents('dienste.json');
    } else {
        echo json_encode([]);
    }
    exit;
}
?>
