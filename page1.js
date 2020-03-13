// This query finds all text nodes with at least 12 non-whitespace characters
// who are not direct children of an anchor tag
// Letting XPath apply basic filters dramatically reduces the number of elements
// you need to process (there are tons of short and/or pure whitespace text nodes
// in most DOMs)

setTimeout(function() {
  runClickToDial();
}, 1000);

function runClickToDial() {
  console.clear();
  var xpr = document.evaluate(
    "descendant-or-self::text()[not(parent::A) and string-length(normalize-space(self::text())) >= 12]",
    document.body,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (var i = 0, len = xpr.snapshotLength; i < len; ++i) {
    var txt = xpr.snapshotItem(i);
    // Splits with grouping to preserve the text split on
    // var numbers = txt.data.split(
    //   /([(]?\d{3}[)]?[(\s)?.-]\d{3}[\s.-]\d{4})/
    // );
    console.log(txt);
    console.log("txt.data", txt.data);
    var numbers = txt.data.split(
      /([(+\d-]{0,2}\d{2,4}[)]?[(\s).-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4})/
    );
    console.log("numbers", numbers);

    // split will return at least three items on a hit, prefix, split match, and suffix
    if (numbers.length >= 3) {
      var parent = txt.parentNode; // Save parent before replacing child
      // Replace contents of parent with text before first number
      parent.textContent = numbers[0];

      // Now explicitly create pairs of anchors and following text nodes
      for (var j = 1; j < numbers.length; j += 2) {
        // Operate in pairs; odd index is phone number, even is
        // text following that phone number
        var anc = document.createElement("a");
        anc.href = "tel:" + numbers[j].replace(/\D+/g, "");
        anc.onclick = phoneNumberClicked;
        anc.textContent = numbers[j];
        parent.appendChild(anc);
        parent.appendChild(document.createTextNode(numbers[j + 1]));
      }
      parent.normalize(); // Normalize whitespace after rebuilding
    }
  }
}
