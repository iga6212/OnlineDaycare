
<p><textarea id="blog_text" rows="4" cols="40">
<?php echo( $ModifyBlogData['BlogTable']['text'] ); ?>
</textarea></p>

<p>
<?php echo( '<input type="button" value="修正" onclick="PostModifyBlog(' .
$ModifyBlogData['BlogTable']['id'] . ');">' );
?>
</p>

