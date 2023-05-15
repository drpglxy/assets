function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
      if (typeof url !== "undefined") {
      }else{
      url=window.location.href;
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0]+'?'+pars.join('&');
        return url;
    } else {
        return url;
    }
    }
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function updateQueryStringParameter(uri, key, value) {
if (typeof url !== "undefined") {
      }else{
      uri=window.location.href;
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
  }
}

function setPagination(element, opts)
{


   $(element).paging(opts.total,
   {
      format: '< ncnn (- p) >',
      perpage: opts.perpage,
      page: opts.page||1,

      onSelect: function (page)
      {
               if(document.readyState !== 'complete') return;
      if(typeof opts.load_files_list !== "undefined" && opts.load_files_list == "true") {
 var sort_field= getParameterByName('sort_field');   
  var sort_order= getParameterByName('sort_order');       
    
var pageid=page.toString();
var urlpost=updateQueryStringParameter(opts.url, 'page',page.toString());
$.ajax({

            url: urlpost,
            type: 'POST',
            data:
            {
               op: opts.op,
               load_files_list: opts.load_files_list,
               load_folders_list: opts.load_folders_list,
               page: pageid,
               sort_field:sort_field,
               sort_order:sort_order,
               fld_id: opts.fld_id,
               usr_login: opts.usr_login,
               token: opts.token
            },
            success: function(result)
            {
               $(opts.target).html(result);
            }
         });
}else{
var urlpost=opts.url;
var pageid=page.toString();
$.ajax({

            url: urlpost,
            type: 'POST',
            data:
            {
               op: opts.op,
               load_files_list: opts.load_files_list,
               load_folders_list: opts.load_folders_list,
               page: pageid,
               fld_id: opts.fld_id,
               usr_login: opts.usr_login,
               token: opts.token
            },
            success: function(result)
            {
               $(opts.target).html(result);
            }
         });
}


         
      },
      onFormat: function (type)
      {
         var show_right = this.pages > 4;
         var show_block = !show_right || this.value != this.pages;
         if(this.pages <= 1) {
             $(element).remove();
         } else {
             $(element).addClass('cool');
         }
         /* TODO: looks ugly, needs refactoring */
         switch (type)
         {
            case 'right':
               if(!show_right) return '';
               return show_right
                  ? '<a>' + this.value + '</a>'
                  : '';
            case 'block':
               if(!show_block) return '';
               return this.value == this.page
                  ? '<span>' + this.value + '</span>'
                  : '<a>' + this.value + '</a>';
            case 'next': // >
               return '<a href="#" class="next">Next</a>';
            case 'prev': // <
               return '<a href="#" class="prev">Prev</a>'
            case 'fill':
               return show_right ? ".." : '';
         }
      }
   });
}
