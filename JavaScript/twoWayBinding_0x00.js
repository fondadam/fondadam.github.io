var Hue = function(opt) {
  var el = document.querySelector(opt.el);
  var data = opt.data || {};

  return new Hue.prototype.init(el, data);
};

Hue.prototype = {
  constructor: Hue,

  // 要实现类数组,必须要有这两个属性
  length: 0,
  splice: [].splice,

  init: function(el, data) {
    this.el = el;
    this.data = data;

    // 返回所有含有``h-*``属性的元素
    this.elems = this.bindNodesArr(el);

    // 初始化，同时防止位空时出现undefined
    this.digest(true);

    return this;
  },

  bindNodesArr: function(el) {
    var arr = [],
        _this = this,
        childs = el.childNodes,
        len = childs.length,
        i, j,
        attr,
        lenAttr;
    
    if (childs.length) {
      for (i = 0; i < len; i++) {
        el = childs[i];

        if (el.nodeType === 1) {
          for (j = 0, lenAttr = el.attributes.length; j < lenAttr; j++) {

            attr = el.attributes[j];
            if (attr.nodeName.indexOf('h-') >= 0) {
              arr.push(el);
              switch (attr.nodeName.slice(2)) {

                // 监听model绑定的事件
                case 'model':
                  if (document.addEventListener) {
                    el.addEventListener('keydown', function() {
                      _this.digest();
                    }, false);
                  } else {
                    el.attachEvent('onkeydown', function() {
                      _this.digest();
                    }, false);
                  }
                  break;

                default:
                  break;
              }

              break;
            }
          }

          arr = arr.concat(this.bindNodesArr(el));
        }
      }
    }

    return arr;
  },

  digest: function(bool, ms) {
    var i, j,
        len, len2;

    var elems = this.elems,
        data = this.data;

    bool = bool === true ? true : false;
    ms = ms || 0;

    // 这里不能传参bool/ms, 否则bool和ms都会为undefined,因为setTimeout里的function作用域是指向window的
    setTimeout(function() {
      for (i = 0, len = elems.length; i < len; i++) {
        el = elems[i];
        attrs = el.attributes;
        for (j = 0, len2 = attrs.length; j < len2; j++) {
          var attr = attrs[j];
          if (attr.nodeName.indexOf('h-') >= 0) {

            switch (attr.nodeName.slice(2)) {
              case 'model':
                if (bool) {
                  el.value = data[attr.nodeValue] || '';

                  // dirty check
                } else if (el.value !== data[attr.nodeValue]) {
                  data[attr.nodeValue] = el.value || '';
                }
                break;

              case 'text':

                // dirty check
                if (el.innerHTML !== data[attr.nodeValue]) {
                  el.innerHTML = data[attr.nodeValue] || '';
                }
                break;

              default:
                console.error('Error: There is only h-model and h-text !');
                break;
            }
          }
        }
      }
    }, ms);
  }
}

// 参考jQuery ...
Hue.prototype.init.prototype = Hue.prototype;


// test...
Hue({
  el: '.app',
  data: {
    demo: '大轰'
  }
});