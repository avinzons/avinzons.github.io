<?php
    if(!empty($_POST['firstname']) && !empty($_POST['lastname']) && !empty($_POST['email']) && !empty($_POST['subject']) && !empty($_POST['message'])){
      $firstname = $_POST['firstname'];
      $lastname = $_POST['lastname'];
      $email = $_POST['email'];
      $subject = $_POST['subject'];
      $message = $_POST['message'];
      //message from form on website is sent as an email to myself
      $my_email = "atv26@cornell.edu";
      $my_message = "From:$email ($firstname $lastname)\r\n";
      $my_message .= "Content-type: text/html\r\n";
      $my_message .= $message;

      $confirm = mail($my_email, $subject, $my_message);
      //confirm (thank you) message sent to sender
      if($confirm){
        $thankyou_subject = "Thanks for visiting, $firstname!";
        $thankyou_message = "Hi $firstname! Thank you for your inquiry on my website. I'm sending this email to confirm that I've received your message,
        and will respond as soon as I get the chance. In the mean time, feel free to take a look at my past work on <a href=alexisvinzons.github.io>my website</a>.
        </br>Have a lovely day,
        Alexis";
        mail($email,$thankyou_subject,$thankyou_message);
        echo("Thank you! I've received your message, and will get back to you shortly.");
      }
      else{
        echo("Looks like something went wrong! <a href='contact.php'>Try again?</a>");
      };
 ?>
