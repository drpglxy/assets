/* Singleton */

function SettingsFinder()
{
    if(SettingsFinder._singleton)
        return SettingsFinder._singleton;
    else
        SettingsFinder._singleton = this;

    this.search_limit = 500;
    this.timeout = null;

    function translate_value(input)
    {
        switch(input.type)
        {
            case "checkbox":
                return input.checked ? 'On' : 'Off';
            default:
                return input.value;
        }
    };

    this.db = $(document.forms.F1).find('input[type=text], input[type=checkbox], select, textarea').map(function(idx, input) {
        var db_entry = {};
        var row = $(input).closest('tr')

        var nested_boxes = $(input).parents('.box');
        var path = $(nested_boxes).map(function(i, e)
        {
            var idx = $(e).index();
            var tab = $(e).parent().find("> ul.tabs li").eq(idx-1);
            return $(tab).text();
        });

        db_entry.name = input.name;
        db_entry.value = translate_value(input);
        db_entry.setting = row.find('td :first').text();
        db_entry.section = path.toArray().reverse().join('/');
        db_entry.input = input;

        return db_entry;
    });

    this.search = function(key)
    {
        var matcher = new RegExp(key, "i");
        var results = $(this.db).filter(function(i, e) 
        {
            return e.name.match(matcher) || e.section.match(matcher) || e.setting.match(matcher);
        });
        return results.slice(0, this.search_limit);
    }

    this.isearch = function()
    {
        $("#search-dialog").dialog({ 'width': 680, 'height': 270 });
        $("#search-input").focus();
        $("#search-input").select();
    }

    this.isearch_impl = function()
    {
        if(settings_finder.timeout)
            clearTimeout(settings_finder.timeout);
        // Wait as least 500 mseconds before performing an actual search
        setTimeout(function() {
            var key = $('#search-input').val();
            var settings_finder = new SettingsFinder();
            var results = settings_finder.search(key);
            $('#search-results').html("");
            if($(results).length == 0)
            {
                $('#search-results').html("<center>Nothing found</center>");
            }
            $(results).each(function(i, e)
            {
                settings_finder.add_results_row(e);
            });
        }, 500);
    }

    this.add_results_row = function(dict)
    {
        var columns = ['section', 'name', 'value'];
        var row = $('<tr>');
        $(columns).each(function(idx, column)
        {
            var cell = $('<td>');
            cell.text(truncate(dict[column] ? dict[column] : '-', 47));
            row.append(cell);
        });
        var go = ($("<td><a href='#'>&gt;&gt;</a></td>"));
        go.click(function() {
            var input = dict['input'];
            var offset = $(input).offset();

            $('#search-dialog').dialog('close');
            $('.search-results').removeClass('search-results');
            $(input).parents('tr').addClass('search-results');
            settings_finder.tabberWalker.open_tab(dict['section']);
            setTimeout(function() {
                console.log('scrollto', offset.top + window.innerHeight / 2);
                $('body').scrollTo(offset.top + window.innerHeight / 2);
                input.focus();
            }, 0);
        });
        row.append(go);
        $('#search-results').append(row);
    }

    this.tabberWalker = new TabberWalker($('#tabber0'));
}

/* A helper class for auto-navigating through the tabber.js DOM */

function TabberWalker(parent)
{
    this.parent = parent;
    this.open_tab = function(path)
    {
        $(path.split('/')).each(function(idx, tab_name)
        {
            var tabs = $(parent).find('.tabs li');
            var tab = $(tabs).filter(function(idx, node)
            {
                return $(node).text().trim() == tab_name;
            });
            if(!tab[0])
            {
                return false; // stop iteration
            } 
            else
            {
                $(tab[0]).click();
            }
        });
    }
}

function truncate(str, maxSize)
{
    return str.length > maxSize + 3 ? str.substring(0, maxSize) + "..." : str;
}

var settings_finder = new SettingsFinder();
