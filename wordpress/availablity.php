<?php 
	$catalogyachtspecial = $wpdbpro->get_results("select yachtcatalog.* from catalogyachtspecial 
	left join yachtcatalog on catalogyachtspecial.catalog_oid_fk = yachtcatalog.oid where catalogyachtspecial.yacht_oid_fk = ".$yacht_Id." group by catalogyachtspecial.catalog_oid_fk ");

	foreach($catalogyachtspecial as $catalogyacht){
		//echo "<div class='availablityCata'>".$catalogyacht->name."</div>";
	}
	
	$catalogseason = $wpdbpro->get_results("select * from catalogseason where yachtcatalog_oid_fk = 139832242");
	?>
<div class="catelog-btns">
	<div class="detailBtn"><a href="#">Catelog 2016/2018</a></div>
	<div class="detailBtn with-border"><a href="#">Catelog 2017/2019</a></div>
	<div class="detailBtn with-border"><a href="#">Catelog 2017/2019</a></div>
</div>
<table class="table availabilty-table">
	<thead> 
		<tr>
			
			<td>Season</td>
			<td>Season Time</td>
			<td>Discount</td>
			<td>Charter Price</td>
		</tr>
		<thead>
		<tbody>
			<?php $iloop = 1;
		foreach($catalogseason as $season){
			?>
			<tr>
				<td>Season <?php echo $iloop++;?></td>
				<td><?php echo $season->start_date.' - '.$season->end_date; ?></td>
				<td style="color:#E93539">0%</td>
				<td style="color:#E93539">00,00</td>
			</tr>
			<?php 
		}								
		?>
		</tbody>
</table>

<div id="calendar"></div>