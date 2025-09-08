<?php
// Generic function to fetch items and map them depending on table
function fetchitems($pdo, $table, $whereClause = "") {
    try {
        $sql = "SELECT * FROM $table" . ($whereClause ? " WHERE $whereClause" : "");
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];

        if ($table === 'v_pizzat_aineosat') {
            foreach ($results as $row) {
                $data[] = [
                    'PizzaID' => $row['PizzaID'] ?? null,
                    'PizzaNimi' => $row['PizzaNimi'] ?? '',
                    'Pohja' => $row['Pohja'] ?? '',
                    'Tiedot' => $row['Tiedot'] ?? '',
                    'Hinta' => $row['Hinta'] ?? 0,
                    'Kuva' => $row['Kuva'] ?? '',
                    'Aktiivinen' => $row['Aktiivinen'] ?? 0,
                    'Aineosat' => $row['Aineosat'] ?? '',
                    'AinesosaMaara' => $row['AinesosaMaara'] ?? 0
                ];
            }
        } elseif ($table === 'aineosat') {
            foreach ($results as $row) {
                $data[] = [
                    'AinesosaID' => $row['AinesosatID'] ?? null,
                    'Nimi' => $row['Nimi'] ?? '',
                    'Hinta' => $row['Hinta'] ?? 0,
                    'Yksikko' => $row['Yksikko'],
                    'Kuvaus' => $row['Kuvaus'],
                    'Kuva' =>  $row['Kuva'],
                    'Aktiivinen' => $row['Aktiivinen']
                ];
            }
        } else {
            $data = $results; // fallback: return raw
        }

        return $data;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
}

// Fetch pizzas
function fetchPizzat($pdo) {
    $data = fetchitems($pdo, 'v_pizzat_aineosat');
    echo json_encode(["pizzat" => $data]);
}

// Fetch extras
function fetchLisat($pdo) {
    $data = fetchitems($pdo, 'aineosat', "tyyppi = 'extra'");
    echo json_encode(["lisat" => $data]);
}

// Fetch both pizzas and extras
function fetchKaikki($pdo) {
    $pizzat = fetchitems($pdo, 'v_pizzat_aineosat');
    $lisat = fetchitems($pdo, 'aineosat', "tyyppi = 'extra'");
    echo json_encode([
        "pizzat" => $pizzat,
        "lisat" => $lisat
    ]);
}
?>
