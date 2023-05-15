function MultiSelector(target, file_input, opts)
{
var arr = [];
    var inner_files = [];
    var accept = opts.ext_allowed ? '.' + opts.ext_allowed.split(/\|/).join(',.') : null;
    if(accept) $(file_input).attr('accept', accept);

    var addFileCallback = function(event)
    {
        var files_added = 0;

        $(this.files).each(function(i, file)
        {
  if (arr.indexOf(file.name) === -1) {
            var list = $('<li>');
            var icon = $('<div class="icon"><i class="far fa-file"></i></div>');
            var name = $('<div class="name">');
            var xfname = $('<span class="xfname">');
            var xfsize = $('<span class="xfsize">');
            var check = $('<div class="checkbox">');
            var is_public = $('<input type="checkbox" value="1" name="file_public">');
            var is_public_label = $('<label class="xdescr">Public</label>');
            var del = $('<a class="delete" title="Delete" style="cursor: pointer;"><i class="far fa-times"></i></a>');
            $(xfname).html(file.name);
            $(xfsize).html('(' + convertSize(file.size) + ')');
            var idx = inner_files.length;
            var id = 'pub_file_' + idx.toString();
            $(is_public).attr('id', id);
            $(is_public_label).attr('for', id)

            if(opts.file_public_default == 1) $(is_public).attr('checked', 'true');
 } else {
    alert(file.name + " already selected!")
  }
  
            $(del).click(function()
            {
                $(list).remove();
                inner_files[idx] = undefined;
                arr[idx] = undefined;

                if($.grep(inner_files, function(e) { return e != undefined }).length == 0)
                {
                    $('.browse').css('display', '');
                    $('.file_list').css('display', 'none');
                    $('#file_0').get(0).value = ""; // Prevent from being passed to FileUploader
                    $('#upload_controls').remove();
                    $('#show_advanced').remove();
                  $('.uploadbtn').css('display', 'block');
                }
            });

            if(opts.max_upload_files > 0 && $(target).find('.xfname').length >= opts.max_upload_files)
            {
           alert("No remaining slots");
           return false;
       }

            if(checkExt(file) && checkSize(file))
            {
	            $(name).append(xfname, xfsize);
	            $(check).append(is_public, is_public_label);
	            $(list).append(icon, name, check, del);
	            $(target).append(list);
	            inner_files.push(file);
                    arr.push(file.name);

                files_added++;
            }

            if(files_added > 0)
            {
                $('.browse').css('display', 'none');
                $('.uploadbtn').css('display', 'none');
                $(target).css('display', '');
                $('.file_list').css('display', 'block');
            }
            else
            {
                event.stopImmediatePropagation();
            }

        });
    };

    var installUploadControls = function()
    {
     if($.grep(inner_files, function(e) { return e != undefined }).length != 0)
                {
                if (!$('div').hasClass('upload_controls d-flex justify-content-between flex-wrap align-items-center mt-3 mb-3')) {
        var bottom = $('<div class="upload_controls d-flex justify-content-between flex-wrap align-items-center mt-3 mb-3">');
        var flexBottom = $('<div class="d-flex">');
        var optionsButton = $('<a class="btn btn-default options" data-toggle="collapse" href="#options" role="button" aria-expanded="false" aria-controls="options">\n' +
            '                       <span>Options</span> <i class="far fa-cog"></i>\n' +
            '                  </a>');
        var start_upload = $('<button class="btn btn-white" type="button" name="upload">Start uploading <i class="far fa-chevron-right"></i></button>');
        var add_more = $('<label for="addFiles" id="add_more" class="btn btn-white-outline">\n' +
            '                  Add more files <i class="far fa-file-plus"></i>\n' +
            '             </label>');
        var add_more_finput = $('<input id="addFiles" class="d-none" type="file">');

        flexBottom.append(add_more_finput, add_more, optionsButton);
        bottom.append(flexBottom, start_upload);
        }
        }else{
                          $('.uploadbtn').css('display', 'block');

        }

        setTimeout(function()
        {
	        $(add_more_finput).css('left', $(add_more).position().left);
	        $(add_more_finput).css('position', 'absolute');
	        $(add_more_finput).css('opacity', 0);
        }, 0);

        $(start_upload).click(function(e)
        {
        if($.grep(inner_files, function(e) { return e != undefined }).length == 0)
                {
                alert("No files selected");
                return;
                }else{
           var files = $.grep(inner_files, function(e) { return e != undefined });
           if(opts.oncomplete) opts.oncomplete(files);
           }
           e.preventDefault();
        });

        $(add_more_finput).change(addFileCallback);
        if(accept) $(add_more_finput).attr('accept', accept);
        $('#uploadfile').append(bottom);
    };

	var checkExt = function(file)
	{
	    if(file.name=="")return true;
	    var re1 = new RegExp("^.+\.("+opts.ext_allowed+")$","i");
	    var re2 = new RegExp("^.+\.("+opts.ext_not_allowed+")$","i");
	    if( (opts.ext_allowed && !re1.test(file.name)) || (opts.ext_not_allowed && re2.test(file.name)) )
	    {
	        str='';
	        if(opts.ext_allowed)str+="\nOnly these extensions are allowed: "+opts.ext_allowed.replace(/\|/g,',');
	        if(opts.ext_not_allowed)str+="\nThese extensions are not allowed:"+opts.ext_not_allowed.replace(/\|/g,',');
	        alert("Extension not allowed for file: \"" + file.name + '"'+str);
	        return false;
	    }

	    return true;
	}

    var checkSize = function(obj)
    {
        if(obj.name=='')return true;
        if(!opts.max_upload_filesize || opts.max_upload_filesize==0) return true;
        if(obj.size>0 && obj.size>opts.max_upload_filesize*1024*1024)
        {
            alert("File size limit is "+opts.max_upload_filesize+" Mbytes");
            return false;
        }
        return true;
    }

    $(file_input).change(addFileCallback);
    $(file_input).change(installUploadControls);
}

function convertSize(size)
{
    if (size > 1024*1024*1024) {
            size = Math.round(size/(1024*1024*1024)*10)/10 + " Gb";
    } else if (size > 1024*1024) {
            size = Math.round(size/(1024*1024)*10)/10+'';
            if(!size.match(/\./))size+='.0';
            size+=' Mb';
    } else if(size > 1024) {
            size = Math.round(size/1024*10)/10 + " Kb";
    } else {
            size = size + " Bytes";
    }
    return size;
}
