<?php
function apiSuccess($data = [], $extra = []) {
    return array_merge([
        "success" => true,
        "data"    => $data
    ], $extra);
}

function apiError($message, $code = 400, $extra = []) {
    http_response_code($code);
    return array_merge([
        "success" => false,
        "error"   => $message
    ], $extra);
}
?>
