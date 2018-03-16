import $ from "jquery"
function createtable(arr) {
    for (var j = 0; j < arr.length; j++) {
            $("#tab").append("<tr><td>" + arr[j] + " </td></tr>");
    }
}

$( document ).ready(function() {
    console.log( "ready!" );
    var arr = [1,2,3]
    createtable(arr);
});
