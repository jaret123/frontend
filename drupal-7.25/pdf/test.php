
<h1>Test sending results to PDF</h1>
<div class="form">
    <h5>Fill in JSON data to send</h5>
    <p>Content</p>
    <form id="resultsForm" method="post" name="pdf" action="index.php">
        <textarea id="txtContent" class="roundedForm name" type="textfield" rows="10" name="content" placeholder="JSON Data" ></textarea>
        <div id="pdfSubmit" class="button savepdf">Download Results</div>
    </form>
</div>
<script src="./jquery-1.10.2.min.js"></script>
<script>

    var s = document.getElementById("pdfSubmit");
    s.addEventListener("click", function() {
        alert("click");
        $('#resultsForm').submit();
    });


</script>