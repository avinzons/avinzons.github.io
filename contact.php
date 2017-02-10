<!DOCTYPE html>
<html lang = "en">
<head>
  <meta charset="utf-8">
  <title>Contact</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto|Playfair+Display" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="css/main.css">
  <link rel="stylesheet" type="text/css" href="css/media.css">
</head>
<body>
  <div class="header">
    <h1><a href="index.php">A.V.</a></h1>
  </div> <!-- end of header div-->
  <div class = "container">
    <div class = "form-box">
      <form action="thankyou.php" method="post">
        <h3>First name:</h3>
        <input type="text" name="firstname">
        <h3>Last name:</h3>
        <input type="text" name="lastname">
        <h3>Email:</h3>
        <input type="email" name="email">
        <h3>Subject:</h3>
        <input type="text" name="subject">
        <h3>Message:</h3>
        <textarea rows="4" cols = "50" name="message" placeholder="Write message here"></textarea>
        <input type="submit" name="send" value="Send">
      </form>
    </div>
    <?php include "php/contact-mail.php" ?>
  </div> <!--end of container div-->
  <?php include "php/contact-div.php" ?>
  <?php include "php/side-nav.php" ?>
</body>
</html>
