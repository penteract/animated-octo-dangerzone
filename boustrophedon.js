var block2sentences = function(para,block) {
  var words = block;
  var font = para.css('font');
  var body = $('body');
  var container = $('<div></div>');
  container.css(font);
  container.hide();
  container.width(para.width());
  para.after(container);
  container.append("hello");
  var init_height = container.height();
  var sentence = words[0];

  var sentences = [];
  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    container.html(sentence + word);
    if (container.height() > init_height*1.2) {
      container.html('');
      sentences.push(sentence);
      sentence = word;

      if (sentences.length % 2 == 0) {
        container.addClass('backward');
      } else {
        container.removeClass('backward');
      }
    } else {
      sentence += word;
    }
  }

  container.remove();
  sentences.push(sentence);
  return sentences;
};

function transformbyblocks(blocks,p,origHTML,para){
  var sentencess = blocks.map(block=>block2sentences(para,block));
  para.html('');
  sentencess.forEach((sentences,idx)=>{
    for (var i = 0; i < sentences.length; i++) {
      var c;
      if (i % 2 == 0) c = 'forward';
      else c = 'backward';
      para.append('<div class="'+ c +'">'+ sentences[i] +'</div>');
  }})
    $(window).resize(function(e) {
      para.html(origHTML);
      $(window).unbind(e);
      transformbyblocks(blocks,p,origHTML,para);
    });
}


var transform_paragraph = function(para) {
  if(para.innerHTML){
    var blocks = para2blocks(para)
    transformbyblocks(blocks,para,para.innerHTML,$(para))
  }
}

function para2blocks(para){
    var cs = para.childNodes
    var blocks=[]
    var block=[]
    for(var i=0;i<cs.length;i++){
        if (cs[i].nodeName=="#text") block=block.concat(cs[i].textContent.split(" ").map((x,i)=>i==0?x:" "+x))
        else if (cs[i].tagName=="BR") {block.push("<br />"); blocks.push(block); block=[]}
        else block.push(cs[i].outerHTML)
    }
    blocks.push(block)
    //console.log(blocks)
    return blocks
}

$(document).ready(function() {
  $('p').each(function(i,e) { transform_paragraph(e); });
});
