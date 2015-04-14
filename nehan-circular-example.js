Nehan.setStyles({
  "circular":{
    display:"block",
    background:"wheat",
    measure:"280px",
    extent:"280px",
    "box-sizing":"cotent-box",
    "border-radius":"280px",
    margin:{after:"2em"},
    content:function(ctx){
      // set default content if markup is empty.
      return ctx.getMarkup().isEmpty()? Nehan.List.fold(Nehan.List.create(12), "", function(ret, index){
	return ret + "<div>" + (index + 1) + "時ですよ！</div>";
      }) : "";
    },
    // set page-break if enough space is not left.
    onload:function(ctx){
      var items = [];
      var rest_extent = ctx.getRestExtent();
      var extent = parseInt(ctx.getMarkup().getAttr("extent", "280px"), 10);
      if(rest_extent < extent){
	ctx.setCssAttr("break-before", "always");
      }
    }
  },
  "circular div":{
    "line-height":"1em",
    "padding":{start:"0.5em"},
    color:function(ctx){
      var child_index = ctx.getChildIndex();
      var child_hour = (child_index + 1) % 12;
      var cur_hour = new Date().getHours() % 12;
      return (child_hour === cur_hour)? "red" : "black";
    },
    onblock:function(ctx){
      var is_vert = ctx.isTextVertical();
      var child_index = ctx.getChildIndex();
      var child_count = ctx.getParentStyleContext().getChildCount();
      var line_height = ctx.getStyleContext().getFontSize(); // line-height:"1em"
      var parent_extent = ctx.getParentBox().getContentExtent();
      var trans_extent = Math.floor((parent_extent - line_height) / 2);
      var unit_degree = Math.floor(360 / child_count);
      var rotate_degree = child_index * unit_degree + (is_vert? 30 : 120);
      var $dom = $(ctx.dom);
      var translate = is_vert? {translateX:trans_extent + "px"} : {translateY:trans_extent + "px"};
      var rotate = {
	opacity:1,
	rotateZ:rotate_degree + "deg"
      };

      $dom
	.css("position", "absolute")
	.css("opacity", 0)
	.velocity(translate)
	.velocity(rotate);
    }
  }
});


$(function(){
  $("button.demo").click(function(){
    var $button = $(this);
    var flow = $button.data("flow");
    var target = $button.data("target");
    var $target = $("#" + target);
    var $pe = Nehan.createPagedElement({
      config:{root:"body"} // <!doctype> and <html> are not included in content-text.
    }).setStyle("body", {
      "flow":flow,
      "width":500,
      "height":((flow === "tb-rl")? 320 : 500)
    }).setContent($target.html());
    $("#result-" + target).remove(); // remove previous result if exists
    var $element = $pe.getElement();
    $element.id = "result-" + target;
    $target.after($element);
  });
});

