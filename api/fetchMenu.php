<?php
function fetchitems($pdo, $table, $whereParams = [], $whereClause = "")
{
    $allowedTables = ['aineosat'];
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

    return $data;
}

// Fetch pizzas without using view
function fetchPizzat($pdo)
{
    $sql = "
        SELECT 
            p.PizzaID,
            p.Nimi AS PizzaNimi,
            p.Pohja,
            p.Tiedot,
            p.Hinta,
            p.Kuva,
            p.Aktiivinen,
            a.Nimi AS AinesosaNimi,
            a.AinesosaID,
            a.Jarjestys
        FROM pizzat p
        LEFT JOIN pizza_aineosat pa ON p.PizzaID = pa.PizzaID
        LEFT JOIN aineosat a ON pa.AinesosaID = a.AinesosaID AND a.Aktiivinen = 1
        WHERE p.Aktiivinen = 1
        ORDER BY p.PizzaID, a.Jarjestys, a.Nimi
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];

    foreach ($results as $row) {
        $pizzaID = $row['PizzaID'];

        // Initialize pizza if not exists
        if (!isset($data[$pizzaID])) {
            $data[$pizzaID] = [
                'PizzaID' => $pizzaID,
                'PizzaNimi' => $row['PizzaNimi'],
                'Pohja' => $row['Pohja'],
                'Tiedot' => $row['Tiedot'],
                'Hinta' => $row['Hinta'],
                'Kuva' => $row['Kuva'],
                'Aktiivinen' => $row['Aktiivinen'],
                'Aineosat' => [],
                'AinesosaLista' => '' // String version like the view
            ];
        }

        // Add ingredient if exists
        if ($row['AinesosaNimi']) {
            $data[$pizzaID]['Aineosat'][] = [
                'AinesosaID' => $row['AinesosaID'],
                'Nimi' => $row['AinesosaNimi']
            ];
        }
    }

    // Create comma-separated ingredient list for each pizza
    foreach ($data as &$pizza) {
        $ingredientNames = array_map(function($ing) {
            return $ing['Nimi'];
        }, $pizza['Aineosat']);
        
        $pizza['AinesosaLista'] = implode(', ', $ingredientNames);
        $pizza['AinesosaMaara'] = count($pizza['Aineosat']);
    }

    return array_values($data);
}

// Fetch extras
function fetchLisat($pdo)
{
    $data = fetchitems(
        $pdo,
        'aineosat',
        [':tyyppi' => 'extra'],
        "tyyppi = :tyyppi AND Aktiivinen = 1"
    );
    return $data;
}

// Fetch everything
function fetchKaikki($pdo)
{
    return [
        "pizzat" => fetchPizzat($pdo),
        "lisat"  => fetchLisat($pdo)
    ];
}
?>