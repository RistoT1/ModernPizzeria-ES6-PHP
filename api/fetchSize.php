<?php
function fetchKoot($pdo)
{
    $stmt = $pdo->prepare("
            SELECT KokoID, Koko, HintaKerroin, Aktiivinen 
            FROM koot 
            WHERE Aktiivinen = :aktiivinen
            ORDER BY KokoID
        ");
    $stmt->execute([':aktiivinen' => 1]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($results as $row) {
        $data[] = [
            'KokoID' => $row['KokoID'] ?? null,
            'Nimi' => $row['Koko'] ?? '',
            'HintaKerroin' => $row['HintaKerroin'] ?? 1,
            'Aktiivinen' => $row['Aktiivinen'] ?? 0
        ];
    }

    return $data;
}

?>