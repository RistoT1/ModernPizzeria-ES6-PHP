<?php
function apiSuccess($data = [], $extra = []) {
    return array_merge([
        "success" => true,
        "data"    => $data
    ], $extra);
}

function apiError($message, $code = 400, $extra = []) {
    // Ensure HTTP code is an integer
    $httpCode = 500; // default
    if (is_int($code) || ctype_digit((string)$code)) {
        $httpCode = (int)$code;
    } else {
        // Map common SQLSTATE or custom string codes to HTTP codes
        $map = [
            '42S22' => 400, // SQL syntax error → Bad Request
            '23000' => 409, // Integrity constraint violation → Conflict
            // Add more mappings here as needed
        ];
        if (isset($map[$code])) {
            $httpCode = $map[$code];
        }
    }

    http_response_code($httpCode);

    return array_merge([
        "success" => false,
        "error"   => $message,
        "code"    => $httpCode // optional, useful for frontend
    ], $extra);
}
?>
