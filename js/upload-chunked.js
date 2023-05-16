function ProgressTracker(element, opts)
{
   var progressbar_outer = $('<div class="progressbar-outer">');
  var progressbar_inner = $('<div class="progressbar-inner"><span class="percentage"></span></div>');
  var div = $('<div class="wrapper">');
  var filenames = $('<div class="progressbar-filenames d-none">');
  var completed = $('<div class="progressbar-completed">');
  var speed = $('<div class="progressbar-speed">');
  var abort = $('<a style="cursor: pointer;">Abort</a>');

  if(opts && opts.filenames)
  {
    $(filenames).html('<b>' + $.makeArray(opts.filenames).join(', ') + '</b>');
  }
 
  var urlfilename= '<div id="urlfilename"></div>';
      $(div).append(urlfilename);
  
 
       console.log(opts.filenames);
  $(speed).html('Upload speed: <b>0 Kb/s</b>');

  $(abort).click(opts.onabort ? opts.onabort : function() { document.location.reload(); });
  $(abort).css('text-decoration', 'none');

  $(progressbar_outer).append(progressbar_inner);
  $(div).append(filenames, completed, speed, abort);
  $(element).append(progressbar_outer, div);

  var old_date;
  var old_bytes = 0;
  var total_size = 0;
   var maxfsize=0;
   var startTime=new Date().getTime();
   
  this.update = function(info)
  {
 
  if (typeof info.file_name !== "undefined") {
       console.log("info.file_name",getFilenames(info.file_name));
   $('#urlfilename').html('<b>' + decodeURI(getFilenames(decodeURI(info.file_name))) + '</b>');
  }else{
         console.log("info.file_name not found",info.file_name);
  }
      var rate = info.loaded / info.total;
      var progressWidth = $('.progressbar-outer').width();
      var loadedPX = Math.round(rate * progressWidth);
      $(element).find('.progressbar-inner').css('width', loadedPX);
      // $('.percentage').css('left', loadedPX);
      $('.percentage').html( Math.round((loadedPX / progressWidth) * 100)+'%');
      
 $(completed).html('<b>' + convertSize(info.loaded) + '</b> of <b>' + convertSize(info.total) + '</b>');
total_size = info.total;


var duration = ( new Date().getTime() - startTime ) ;
if(duration > 1000)
      {
      var bps = info.loaded / (duration/ 1000);
      
      var time = (total_size - info.loaded) / bps;
var seconds = time % 60;
var minutes = time / 60;
        
seconds = Math.floor(seconds);
minutes = Math.floor(minutes);
if(minutes > 0){
var remaining = "<b>" + minutes + "</b> min <b>" + seconds + "</b> sec remaining";
}else{
var remaining = "<b>" + seconds + "</b> sec remaining";
}


      
      
      }
      
      
      if(!old_date) old_date = Date.now();
      var elapsed = Date.now() - old_date;
      if(elapsed > 1000)
      {
      
        $(speed).html('Upload speed: <b>' + convertSize(info.loaded - old_bytes) + '/s</b> <br>'+remaining);
old_bytes = info.loaded;
        old_date = Date.now();
        
}
 
      
      
      maxfsize= document.getElementById("maxfsize").getAttribute("data-value"); 

if (maxfsize != null && total_size != null && maxfsize != 0 && total_size != 0) {
var totalSizeMB = (total_size/1024/1024).toFixed(0);

             if (Number(maxfsize) < Number(totalSizeMB)) {


opts.reqq.xhr.abort();
      $.ajax({
        url: opts.uidkillurl,
        success: function() {
                     alert('Upload size is higher than:'+ maxfsize + ' Mb');
                     document.location.reload(); 
        }

      });
      
     console.log("Upload size is higher than:", info);
          console.log("opts", opts);
}
 }
      
      
  };
  this.finish = function(evt, opts)
  {
    if(evt.target.status != 200)
      return;

    this.update({ loaded: total_size, total: total_size });
    
    var ret, res;
    try
    {
      res = evt.target.responseText;
      ret = JSON.parse(res.substring(res.lastIndexOf("\n") + 1));
    }
    catch(e)
    {
      alert("Error while parsing JSON:\n\n" + res);
    }
    var redirect_params = $(ret).map(function(i, e)
    {
      return "st=" + e.file_status + "&fn=" + e.file_code;
    });

    if(this.link_rcpt)
    {
      redirect_params.push('link_rcpt=' + this.link_rcpt);
    }

    if(ret.length == 0)
    {
      alert("None files uploaded");
      return;
    }

    document.location = opts.return_url + redirect_params.toArray().join('&');
  };

  this.set_link_rcpt = function(link_rcpt) { this.link_rcpt = link_rcpt; };
}

/*
 * @f1: an HTML <form> or it's reference understandeable by jQuery.
 * It's expected to have files_list and upload_controls stubs
 * @element: HTML node to show the progress
 * @opts: a hash with additional options
 * @opts.return_url: URL where to return after upload completes
 */
function FileUploader(f1, opts)
{
  var chunk_size = 80 * 1024 * 1024;
  var total_size = 0;
  var pos = 0;

var checkcount=0;


  var tracker;
  var redirect_params = [];

  var base_url = $(f1).attr("action").match(/(.*)upload.cgi/)[1];

  var files_queue = new Queue();
  files_queue.handler = function(item) {
     item.continue();
  }
  files_queue.oncomplete = function() {
     console.log("All files uploaded:", redirect_params);
     document.location = opts.return_url + redirect_params.join('&');
  }
  files_queue.sess_id = $(f1).find('input[name=sess_id]').val();

  var send_chunk = function(item, queue)
  {
    

     console.log("Sending item:", item);
     var fd = new FormData();
          fd.append("sid", queue.sid);
    
     fd.append("file", item.chunk, "file_" + item.chunk_idx.toString());
  
     var xhr = new XMLHttpRequest();
     xhr.open("POST", base_url + "up.cgi");
     xhr.upload.onprogress = function(info) {
        tracker.update({ loaded: pos + info.loaded, total: total_size });
     }
     xhr.onload = function(evt)
     {
        if(evt.target.status == 200)
        {
           pos += item.chunk.size;
           queue.continue();
        }
        else
        {
           alert(evt.target.responseText);
        }
     }
     xhr.send(fd);
  }

  var file_uploaded = function(queue) {
  
var checkedValue = $('#pub_file_'+checkcount+':checked').val();

  var ep = document.getElementById("to_folder");
var tofolder= ep.options[e.selectedIndex].value;


var link_rcpt=document.getElementById("link_rcpt").value;

var link_pass=document.getElementById("link_pass").value;

      $.post(base_url + "api.cgi",
         { op: "compile", sid: queue.sid,file_public:checkedValue,link_rcpt:link_rcpt,link_pass:link_pass, to_folder:tofolder, fname: queue.file_name, session_id: files_queue.sess_id },
         function(data) {
            console.log(data);
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, "text/xml");

            var error = xmlDoc.getElementsByTagName('Error')[0];
            if(error) alert("Error while uploading " + queue.file_name + ": " + error.innerHTML);

            var file_code = xmlDoc.getElementsByTagName('Code')[0].innerHTML;
            console.log("file_code =", file_code);
            redirect_params.push("st=OK&fn=" + file_code);
            files_queue.continue();
         }
      );
      checkcount++;
  }

  this.start = function(files)
  {
     $(files).each(function(_, file)
     {
       var chunks_queue = new Queue();
       var chunk_idx = 0;

       for(var i = 0; i < file.size; i += chunk_size)
       {
         var chunk = file.slice(i, i + chunk_size);
         chunks_queue.push({ start: i, end: i + chunk.size, chunk_idx: chunk_idx, chunk: chunk });
         chunk_idx++;
       }

       chunks_queue.sid = genUID();
       chunks_queue.file_name = file.name;
       chunks_queue.handler = send_chunk;
       chunks_queue.oncomplete = file_uploaded;

       files_queue.push(chunks_queue);
       total_size += file.size;
     });

     /* TODO: display console message if not found */
     var filenames = $(files).map(function(i, e) { return e.name });
     
     console.log(filenames);
     tracker = new ProgressTracker($(f1).find('.js_progress'), { filenames: filenames });
     var link_rcpt = $(f1).get(0).link_rcpt;
     if(link_rcpt) tracker.set_link_rcpt(link_rcpt.value);

     $('#files_list').addClass('uploading');
     $('.progressSpace').css('display', 'block');
     $('.upload_controls').css('visibility', 'hidden');

     files_queue.continue();
  };
}

/*
 * @f1: an HTML <form> or it's reference understandeable by jQuery.
 * It's expected to have files_list and upload_controls stubs
 * @element: HTML node to show the progress
 * @opts: a hash with additional options
 * @opts.return_url: URL where to return after upload completes
 * @opts.tmp_url: a temp URL to fetch the progress
 */
function URLUploader(form, element, opts)
{
  this.start = function()
  {
  
  
console.log(opts);

    var urls = $(form).get(0).url_mass.value;
    if(!urls.match(/\S/))
    {
      alert("Enter one or more URLs to upload");
      return false;
    }
    
    
    var uid = genUID();
    var req = formToXHR(form, $(form).attr('action') + "&upload_id=" + uid);

    $('.reurlupload form').hide();
    $('.progressSpace').css('display', 'block');
    var filenames = $(urls.match(/[^\r\n]+/g)).map(function(i, e)
    {
      var url = document.createElement('a');
      url.href = e;
      return url.pathname.split('/').slice(-1)[0];
    });
console.log(getFilenames(urls));
    var kill_upload = function()
    {
      req.xhr.abort();
      $.ajax({
        url: $(form).attr('action') + '&kill=' + uid,
        success: function() { document.location.reload(); }
      });
    };
var uidkillurlto=$(form).attr('action') + '&kill=' + uid;
    var tracker = new ProgressTracker(element, { filenames: getFilenames(urls), onabort: kill_upload,uidkillurl:uidkillurlto,reqq:req });
    setInterval(function()
    {
      $.ajax({
        url: opts.tmp_url + "/" + uid + ".json",
        dataType: 'jsonp',
        jsonpCallback: 'update_stat',
        success: function(evt) { tracker.update(evt) },
      });
    }, 1000);

    req.xhr.addEventListener("load", function(evt) { tracker.finish(evt, opts) });

    req.start();
  };
}

function TorrentUploader(form)
{
  var req = formToXHR(form);
  req.xhr.addEventListener("load", function()
  {
    document.location = '?op=my_files';
  });

  this.start = req.start;
}

function genUID()
{
  var UID = '';
  for(var i=0;i<12;i++)UID+=''+Math.floor(Math.random() * 10);
  return UID;
}

function formToXHR(form, url)
{
  var xhr = new XMLHttpRequest();
  post_url = url || $(form).attr('action');

  xhr.onerror = function(evt) {
    if(document.location.protocol == "https:" && !post_url.match(/^https:/))
    {
      alert("Plain HTTP uploads are prohibited on HTTPS site by browser's security policies.\n\n"
         + "Please use your Admin Servers interface in order to switch file servers to HTTPS.");
    }
    else
    {
      var msg = evt.target.status ? evt.target.statusText : 'URL is not accessible';
      alert("Error while requesting " + post_url + ":\n\n" + msg);
    }
  };

  xhr.addEventListener("load", function(evt) {
    if(evt.target.status != 200)
    {
      alert(evt.target.responseText);
    }
  });

  xhr.open("POST", post_url);
  var fd = new FormData();

  var array = serializeForm(form);
console.log('serializeForm:', array);
  $(array).each(function(i, e) {
      fd.append(e.name, e.value);

  });

  fd.append('keepalive', '1');

  return { xhr: xhr, fd: fd, start: function()
  {
    xhr.send(fd);
  }};
}

function serializeForm(f1)
{
   /* intentionally avoid using jQuery.serializeArray due to unconvenient handling of checkbox inputs */

   var ret = [];
   $(f1).find('input, select, textarea').each(function(_, element)
   {
      if(element.type == 'checkbox')
      {
         ret.push({ 'name': element.name, 'value': element.checked ? element.value : '' });
      }
      else if(element.type == 'file')
      {
         // skip
      }
      else
      {
         ret.push({ 'name': element.name, 'value': element.value });
      }
   });
console.log(ret);
   return ret;
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

function getFilenames(urls)
{
if (typeof urls === "undefined") {
}else{
  var lines = urls.split(/\n\r?/);
  var ret = [];
  $(lines).each(function(i, e)
  {
    var url = document.createElement('a');
    url.href = e;
    var path = url.pathname.split('/');
    ret.push(path[path.length-1]);
  });

  return ret;
  }
}

function Queue()
{
   var that = this;

   this.push = function(item) {
      that._items.push(item);
   }

   this.continue = function() {
      if(that._items.length)
         that.handler(that._items.shift(), that);
      else
         that.oncomplete(that);
   }

   this.handler = function() { }
   this.oncomplete = function() { }
   this._items = [];
}
