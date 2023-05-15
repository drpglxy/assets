function scaleImg(element, maxwidth)
{
  var w1 = $(element).get(0).naturalWidth;
  var h1 = $(element).get(0).naturalHeight;
  var w2 = maxwidth;
  var h2 = h1 * maxwidth / w1;

  function toggle()
  {
    if($(element).width() > w2)
    {
      $(element).width(w2);
      $(element).height(h2);
      $('.rightcol').show();
    }
    else
    {
      $(element).width(w1);
      $(element).height(h1);
      $('.rightcol').hide();
    }
  }

  if($(element).width() > w2)
  {
     toggle();
     $(element).click(toggle);
  }
  return;
}
