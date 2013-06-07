<?php


$items = @json_decode(file_get_contents('items.txt'));
$percent = file_get_contents('stat.txt');


if ($items) {
    file_put_contents("items.txt", json_encode(array()));
} else {
    $items = array();
}


$data = array('percent' => $percent, 'items' => $items);

print json_encode($data);

