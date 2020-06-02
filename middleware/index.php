<?php 
// Allow Cross Origin Requests (other ips can request data)
header("Access-Control-Allow-Origin: *");

// Load the JWT library
require_once __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

// Random Key. Needs to be Changed Later
$key = "4F15D94B7A5CF347A36FC1D85A3B487D8B4F596FB62C51EFF9E518E433EA4C8C";

// Get all parameters for creating/validating user
$username = htmlspecialchars_decode($_GET["username"]);
$password = htmlspecialchars_decode($_GET["password"]);
$firstName = htmlspecialchars_decode($_GET["first"]);
$lastName = htmlspecialchars_decode($_GET["last"]);
$reason = htmlspecialchars_decode($_GET["reason"]);
//$jwt = htmlspecialchars_decode($_GET["jwt"]); May not be needed if this file only is going to be handing out JWT tokens / Validating users.
$role = htmlspecialchars_decode($_GET["role"]); // Role of the person: student, mentor, parent

// Determine reason

// Create. The user has not been created and will be.
if ($reason == "create") {
    if (!$username || !$password || !$firstName || !$lastName || !$role) {
        echo "Not all of the parameters were found. Please ensure that you pass: username, password, first, last, and role as well.";
        return;
    }
    createUser($username, $password, $firstName, $lastName, $role);

// Verify. The user claims to be already in the system. Making sure that they are who they claim to be. Checking their username and password
} else if ($reason == "verify") {
    if (!$username || !$password) {
        echo "Not all of the parameters were found. Please ensure that you pass: username and password as well.";
        return;
    }
    verifyUser($username, $password);

// Authenticate. Verify that the JWT is vaalid and allow them access to the page (if they have permission)
} else if ($reason == "authenticate") {
    if (!$jwt) {
        echo "Not all of the parameters were found. Please ensure that you pass: jwt as well.";
        return;
    }
// Something went wrong.
} else {
    echo "Invalid reason. Must be create, verify, authenticate.";
    return;
}



function createUser($username, $password, $firstName, $lastName, $role) {
    // MONGO DB LOGIN
    $client = new MongoDB\Client('mongodb+srv://userAdmin:uUmrCVqTypLPq1Hi@cluster0-rxbrl.mongodb.net/test?retryWrites=true&w=majority');
    // Select the user collection
    $collection = $client->ystem->users;

    if(isTaken($username, $collection)) {
        echo "This username has been taken. Please choose another.";
        return;
    };
    $hashPass = hash("sha384",$password);

    $collection->insertOne([
        'username' => $username,
        'password' => $hashPass,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'role' => $role,
        'accountCreatedAt' => time()
    ]);

    $payload = array(
        'username' => $username,
        'password' => $hashPass,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'role' => $role,
        'iat' => time(),
        'eat' => strtotime("+30 days")
    );

    $jwt = JWT::encode($payload, "4F15D94B7A5CF347A36FC1D85A3B487D8B4F596FB62C51EFF9E518E433EA4C8C", 'HS512');
    echo $jwt;
}

function verifyUser($username, $password) {
    // MONGO DB LOGIN
    $client = new MongoDB\Client('mongodb+srv://userAdmin:uUmrCVqTypLPq1Hi@cluster0-rxbrl.mongodb.net/test?retryWrites=true&w=majority');
    // Select the user collection

    $hashPass = hash("sha384",$password);

    $collection = $client->ystem->users;
    $document = $collection->findOne(['username' => $username]);
    if($document['password'] == $hashPass) {
        $payload = array(
            'username' => $username,
            'password' => $hashPass,
            'firstName' => $document['firstName'],
            'lastName' => $document['lastName'],
            'role' => $document['role'],
            'iat' => time(),
            'eat' => strtotime("+30 days")
        );
    
        $jwt = JWT::encode($payload, "4F15D94B7A5CF347A36FC1D85A3B487D8B4F596FB62C51EFF9E518E433EA4C8C", 'HS512');
        echo $jwt;
    } else {
        echo "The username or password is inccorect.";
    }
    
}
// Account
//uUmrCVqTypLPq1Hi DB Password
// Username: userAdmin

// venanop608@prowerl.com DB Email

function isTaken($username, $collection) {
    $document = $collection->findOne(['username' => $username]);
    if(is_null($document)) {
        return false;
    } else {
        return true;
    }
}

?>