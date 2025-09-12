<?php
function fetchitems($pdo, $table, $whereParams = [], $whereClause = "")
{
    $allowedTables = ['v_pizzat_aineosat', 'aineosat'];
    if (!in_array($table, $allowedTables)) {
        throw new Exception("Invalid table: $table");
    }

    $sql = "SELECT * FROM $table";
    if ($whereClause) {
        $sql .= " WHERE $whereClause";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($whereParams);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];

    if ($table === 'v_pizzat_aineosat') {
        foreach ($results as $row) {
            $pizzaID = $row['PizzaID'] ?? null;
            if ($pizzaID === null) continue;

            if (!isset($data[$pizzaID])) {
                $data[$pizzaID] = [
                    'PizzaID' => $pizzaID,
                    'PizzaNimi' => $row['PizzaNimi'] ?? '',
                    'Pohja' => $row['Pohja'] ?? '',
                    'Tiedot' => $row['Tiedot'] ?? '',
                    'Hinta' => $row['Hinta'] ?? 0,
                    'Kuva' => $row['Kuva'] ?? '',
                    'Aktiivinen' => $row['Aktiivinen'] ?? 0,
                    'Aineosat' => []
                ];
            }

            if (!empty($row['Aineosat'])) {
                $data[$pizzaID]['Aineosat'][] = [
                    'Aineosat' => $row['Aineosat'] ?? '',
                    'AinesosaMaara' => $row['AinesosaMaara'] ?? 0
                ];
            }
        }
        $data = array_values($data);
    } elseif ($table === 'aineosat') {
        foreach ($results as $row) {
            $data[] = [
                'AinesosaID' => $row['AinesosaID'] ?? null,
                'Nimi' => $row['Nimi'] ?? '',
                'Hinta' => $row['Hinta'] ?? 0,
                'Yksikko' => $row['Yksikko'] ?? '',
                'Kuvaus' => $row['Kuvaus'] ?? '',
                'Kuva' => $row['Kuva'] ?? '',
                'Aktiivinen' => $row['Aktiivinen'] ?? 0
            ];
        }
    } else {
        $data = $results;
    }

    return $data;
}

// Fetch pizzas
function fetchPizzat($pdo)
{
    $data = fetchitems($pdo, 'v_pizzat_aineosat');
    return $data;
}

// Fetch extras
function fetchLisat($pdo)
{
    $data = fetchitems(
        $pdo,
        'aineosat',
        [':tyyppi' => 'extra'],
        "tyyppi = :tyyppi"
    );
    return $data;
}

// Fetch everything
function fetchKaikki($pdo)
{
    return [
        "pizzat" => fetchitems($pdo, 'v_pizzat_aineosat'),
        "lisat"  => fetchitems($pdo, 'aineosat', [':tyyppi' => 'extra'], "tyyppi = :tyyppi")
    ];
}
?>
