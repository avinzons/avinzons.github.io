<?php
     $menu = array(
    "CREATIVE" => "creative.php",
    "TECHIE" => "techie.php",
    "STUDENT" => "student.php",
    "PERFORMER" => "performer.php",
    "CONTACT" => "contact.php",
    );
    //side nav on other pages
    function side_nav($menu){
      echo("<div class ='side_nav'><ul>");
      foreach($menu as $heading => $link){
          echo("<li><a href='$link'> $heading </a></li>");
      }
      echo("<ul></div>");
    };
    //function call
    side_nav($menu);
 ?>

<div class='side_nav'>
  <ul>
    <li> <a href='creative.html'>CREATIVE</a></li>
    <li> <a href='techie.html'>TECHIE</a></li>
    <li> <a href='performer.html'>PERFORMER</a></li>
    <li> <a href='student.html'>STUDENT</a></li>
  </ul>
</div>
