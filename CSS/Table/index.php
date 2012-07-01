<?php 
	require 'Assets/Includes/GZIP.php';
	require 'Assets/Includes/Config.php';
?>
<!DOCTYPE html>
<html dir="ltr" lang="en">
   <head>
      <title></title>
      <meta charset="utf-8">
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <link rel="stylesheet" media="screen" href="<?php echo ROOT; ?>Assets/Includes/Concat.php?filetype=css&files=layout,datatable" />
   </head>
   <body>		
		<div id="container">
			<table class="data">
            	<caption>asd</caption>
                <thead>
                    <tr>
                        <th scope="col" class="descending">Title</th>
                        <th scope="col" class="descending">Day</th>
                        <th scope="col" class="descending">Month</th>
                        <th scope="col" class="ascending">Year</th>
                        <th scope="col" class="nolink"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="even">
                        <td scope="row">Test Title</td>
                        <td>31</td>
                        <td>August</td>
                        <td>Year</td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                    <tr>
                        <td scope="row">Test Title</td>
                        <td>31</td>
                        <td>August</td>
                        <td>Year</td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                    <tr class="even">
                        <td scope="row">Test Title</td>
                        <td>31</td>
                        <td>August</td>
                        <td>Year</td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                    <tr>
                        <td scope="row">Test Title</td>
                        <td>31</td>
                        <td>August</td>
                        <td>Year</td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="even">
                        <td colspan="5">&nbsp;</td>
                    </tr>
                </tfoot>
            </table>
		</div>
   </body>
</html>