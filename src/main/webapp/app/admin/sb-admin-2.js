import $ from "jquery";
import _ from "underscore";
import "./sb-admin-2.css!";

$(function () {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    // add file change event
    (function () {
        var fileChooser = document.getElementById('fileChooser');

        function parseTextAsXml(text) {
            var xmlDoc = $.parseXML(text),
                $xml = $(xmlDoc);
            $xmlLists.push($xml);
            //now, extract items from xmlDom and assign to appropriate text input fields
        }

        function waitForTextReadComplete(reader) {
            reader.onloadend = function (event) {
                var text = event.target.result;

                parseTextAsXml(text);
            }
        }

        function handleFileSelection() {
            _.each(fileChooser.files, function (file) {
                var reader = new FileReader();
                waitForTextReadComplete(reader);
                reader.readAsText(file);
            });
        }

        fileChooser.addEventListener('change', handleFileSelection, false);
    })();

    var $xmlLists = [];
    $('#uploadButton').click(function () {
        var data = $xmlLists[0];
        window.data = data;

        var ths = _.map(data.children().find('*'), function (tag, index) {
            return '<th data-index="' + index + '"><input type="checkbox" checked/>&nbsp' + tag.tagName + '<br/><input type="text"></th>';
        }).join('');

        var dataTable = $('#dataTable');

        dataTable.find('thead').append('<tr>' + ths + '</tr>');

        _.each($xmlLists, function (xmlData) {
            var values = _.map(xmlData.children().find('*'), function (tag) {
                return '<td>' + $(tag).text() + '</td>';
            }).join('');

            dataTable.find('> tbody:last-child').append('<tr class="exclude">' + values + '</tr>');
        });

        return false;
    });

    $('#saveButton').click(function () {
        var dataTable = $('#dataTable');

        // delete unchecked column from table
        dataTable.find("input:checkbox:not(:checked)").each(function () {
            var index = $(this).parent()[0].cellIndex + 1;
            dataTable.find('th:nth-child(' + index + '), td:nth-child(' + index + ')').remove();
        });

        // filter 'tr' when unmatched input field data
        dataTable.find("input[type=text]").filter(function () {
            return !!this.value;
        }).each(function () {
            var index = $(this).index() - 1;
            var text = $(this).val();
            dataTable.find('tbody > tr > td:nth-child(' + index + ')').each(function () {
                if ($(this).text() == text) {
                    $(this).parent().removeClass("exclude");
                }
            });
        });

        dataTable.table2excel({
            exclude: ".exclude",
            name: "NoteList",
            filename: "note" //do not include extension
        });
    });
});
